import { HindsightClient, RecallResponse, ReflectResponse } from '@vectorize-io/hindsight-client';
import { query, run } from './db.js';

export interface HindsightConfig {
  baseUrl: string;
  apiKey: string;
  bankId: string;
}

export interface MemoryRecord {
  id: string;
  clientId: string;
  meetingId?: string;
  text: string;
  type: 'world' | 'experience' | 'observation';
  category: 'Preference' | 'Requirement' | 'Concern' | 'Budget' | 'Decision' | 'Commitment';
  confidence?: number;
  tags?: string[];
  createdAt: string;
  hindsightStatus?: 'synced' | 'pending' | 'cloud';
}

class HindsightService {
  private client: HindsightClient | null = null;
  private config: HindsightConfig;
  private lastHealthCheck: { healthy: boolean; message: string; timestamp: number } | null = null;

  constructor() {
    this.config = {
      baseUrl: process.env.HINDSIGHT_API_URL || 'https://api.hindsight.vectorize.io',
      apiKey: process.env.HINDSIGHT_API_KEY || '',
      bankId: process.env.HINDSIGHT_BANK_ID || 'meetmind-demo'
    };
    this.initClient();
  }

  public updateConfig(newConfig: Partial<HindsightConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.initClient();
    this.lastHealthCheck = null;
  }

  public getConfig() {
    return {
      baseUrl: this.config.baseUrl,
      bankId: this.config.bankId,
      hasApiKey: Boolean(this.config.apiKey && this.config.apiKey.trim().length > 0),
      maskedApiKey: this.config.apiKey
        ? `${this.config.apiKey.substring(0, 4)}...${this.config.apiKey.substring(this.config.apiKey.length - 4)}`
        : ''
    };
  }

  private initClient() {
    try {
      this.client = new HindsightClient({
        baseUrl: this.config.baseUrl,
        apiKey: this.config.apiKey || undefined,
        userAgent: 'meetmind-agent/1.0.0'
      });
    } catch (err) {
      console.warn('Failed to initialize HindsightClient:', err);
      this.client = null;
    }
  }

  /**
   * Health check for Hindsight connection
   */
  async checkHealth(): Promise<{ healthy: boolean; version?: string; message: string; mode: string }> {
    const now = Date.now();
    if (this.lastHealthCheck && now - this.lastHealthCheck.timestamp < 15000) {
      return {
        healthy: this.lastHealthCheck.healthy,
        message: this.lastHealthCheck.message,
        mode: this.config.apiKey ? 'Hindsight Cloud' : 'Local / Demo Mode'
      };
    }

    if (!this.client) {
      return {
        healthy: false,
        message: 'Hindsight client not initialized',
        mode: 'Disconnected'
      };
    }

    try {
      // Attempt getVersion on Hindsight instance
      const version = await this.client.getVersion();
      this.lastHealthCheck = {
        healthy: true,
        message: `Connected to Hindsight API v${version.api_version || '0.8.x'}`,
        timestamp: now
      };
      return {
        healthy: true,
        version: version.api_version,
        message: `Connected to Hindsight API v${version.api_version || '0.8.x'}`,
        mode: this.config.apiKey ? 'Hindsight Cloud' : 'Hindsight Local'
      };
    } catch (err: any) {
      const msg = err?.message || 'Unable to connect to Hindsight endpoint';
      this.lastHealthCheck = {
        healthy: false,
        message: msg,
        timestamp: now
      };
      return {
        healthy: false,
        message: this.config.apiKey
          ? `Hindsight Cloud check: ${msg}`
          : 'Hindsight API key not configured yet. Using local persistent semantic cache.',
        mode: this.config.apiKey ? 'Hindsight Cloud (Connecting)' : 'Local Persistent Cache'
      };
    }
  }

  /**
   * Retain meeting memory into Hindsight
   */
  async retainMeetingMemory(
    clientId: string,
    content: string,
    options: {
      meetingId?: string;
      category?: string;
      type?: 'world' | 'experience' | 'observation';
      tags?: string[];
      metadata?: Record<string, string>;
      timestamp?: Date;
    } = {}
  ): Promise<{ success: boolean; hindsightId?: string; mode: string }> {
    const bankId = this.config.bankId;
    const tags = [clientId, ...(options.tags || [])];
    if (options.category) tags.push(options.category.toLowerCase());
    if (options.meetingId) tags.push(options.meetingId);

    let hindsightId: string | undefined;
    let mode = 'hindsight_cloud';

    if (this.client && this.config.apiKey) {
      try {
        const response = await this.client.retain(bankId, content, {
          tags,
          context: `Client Meeting Memory [${clientId}]`,
          timestamp: options.timestamp || new Date(),
          metadata: {
            clientId,
            meetingId: options.meetingId || '',
            category: options.category || 'General',
            source: 'MeetMind Meeting Intelligence'
          }
        });
        hindsightId = `hs_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        this.logOperation('retain', bankId, clientId, { content, tags }, 1, 'success');
      } catch (err: any) {
        console.warn('Hindsight retain call error, storing to synchronized memory cache:', err?.message || err);
        mode = 'local_synced';
        this.logOperation('retain', bankId, clientId, { content, tags, error: err?.message }, 0, 'fallback');
      }
    } else {
      mode = 'local_synced';
      this.logOperation('retain', bankId, clientId, { content, tags }, 1, 'local_synced');
    }

    // Persist into relational SQLite store as source of truth and local mirror
    const memId = hindsightId || `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const category = (options.category || 'Preference') as any;
    const type = options.type || 'observation';
    const createdAt = options.timestamp ? options.timestamp.toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19);

    run(
      `INSERT INTO memories (id, client_id, meeting_id, text, type, category, confidence, hindsight_status, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0.98, ?, ?, ?);`,
      [memId, clientId, options.meetingId || null, content, type, category, mode === 'hindsight_cloud' ? 'cloud' : 'synced', JSON.stringify(tags), createdAt]
    );

    return { success: true, hindsightId: memId, mode };
  }

  /**
   * Recall client memories matching a query
   */
  async recallClientMemories(
    clientId: string,
    queryText: string,
    options: {
      budget?: 'low' | 'mid' | 'high';
      tags?: string[];
      limit?: number;
    } = {}
  ): Promise<MemoryRecord[]> {
    const bankId = this.config.bankId;
    const targetTags = [clientId, ...(options.tags || [])];

    let recalledFromHindsight: MemoryRecord[] = [];

    if (this.client && this.config.apiKey) {
      try {
        const recallResponse: RecallResponse = await this.client.recall(bankId, queryText, {
          tags: targetTags,
          tagsMatch: 'any',
          budget: options.budget || 'mid'
        });

        if (recallResponse && recallResponse.results && recallResponse.results.length > 0) {
          recalledFromHindsight = recallResponse.results.map((r) => ({
            id: r.id,
            clientId,
            meetingId: r.metadata?.meetingId,
            text: r.text,
            type: (r.type as any) || 'observation',
            category: (r.metadata?.category as any) || 'Preference',
            confidence: 0.95,
            tags: r.tags || [],
            createdAt: r.mentioned_at || new Date().toISOString(),
            hindsightStatus: 'cloud'
          }));

          this.logOperation('recall', bankId, clientId, { queryText, count: recalledFromHindsight.length }, recalledFromHindsight.length, 'success');
          return recalledFromHindsight;
        }
      } catch (err: any) {
        console.warn('Hindsight recall error, falling back to local memory store:', err?.message || err);
        this.logOperation('recall', bankId, clientId, { queryText, error: err?.message }, 0, 'fallback');
      }
    }

    // Fallback to SQLite semantic match
    return this.getLocalMemoriesForClient(clientId, queryText, options.limit || 15);
  }

  /**
   * Reflect: Generate a disposition-aware synthesized contextual answer
   */
  async reflect(
    clientId: string,
    prompt: string,
    options: { budget?: 'low' | 'mid' | 'high'; context?: string } = {}
  ): Promise<{ text: string; basedOn?: any[]; mode: string }> {
    const bankId = this.config.bankId;

    if (this.client && this.config.apiKey) {
      try {
        const reflectResponse: ReflectResponse = await this.client.reflect(bankId, prompt, {
          tags: [clientId],
          tagsMatch: 'any',
          budget: options.budget || 'mid',
          context: options.context || `MeetMind context for client ${clientId}`,
          includeFacts: true
        });

        this.logOperation('reflect', bankId, clientId, { prompt }, 1, 'success');
        return {
          text: reflectResponse.text,
          basedOn: reflectResponse.based_on?.memories || [],
          mode: 'hindsight_reflect'
        };
      } catch (err: any) {
        console.warn('Hindsight reflect unavailable:', err?.message || err);
        this.logOperation('reflect', bankId, clientId, { prompt, error: err?.message }, 0, 'fallback');
      }
    }

    return {
      text: '',
      mode: 'fallback'
    };
  }

  /**
   * Retrieve relevant memories from SQLite
   */
  public getLocalMemoriesForClient(clientId: string, searchQuery?: string, limit: number = 20): MemoryRecord[] {
    let sql = `SELECT * FROM memories WHERE client_id = ?`;
    const params: any[] = [clientId];

    if (searchQuery && searchQuery.trim().length > 0) {
      const keywords = searchQuery.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      if (keywords.length > 0) {
        const likeClauses = keywords.map(() => `LOWER(text) LIKE ?`).join(' OR ');
        sql += ` AND (${likeClauses})`;
        keywords.forEach((k) => params.push(`%${k}%`));
      }
    }

    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(limit);

    const rows = query<any>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      meetingId: r.meeting_id,
      text: r.text,
      type: r.type,
      category: r.category,
      confidence: r.confidence,
      tags: r.tags ? JSON.parse(r.tags) : [],
      createdAt: r.created_at,
      hindsightStatus: r.hindsight_status
    }));
  }

  /**
   * Get all memories across all clients
   */
  public getAllMemories(category?: string, type?: string, search?: string): MemoryRecord[] {
    let sql = `SELECT m.*, c.name as client_name, c.company as client_company 
               FROM memories m 
               JOIN clients c ON m.client_id = c.id 
               WHERE 1=1`;
    const params: any[] = [];

    if (category && category !== 'All') {
      sql += ` AND m.category = ?`;
      params.push(category);
    }

    if (type && type !== 'All') {
      sql += ` AND m.type = ?`;
      params.push(type);
    }

    if (search && search.trim().length > 0) {
      sql += ` AND (LOWER(m.text) LIKE ? OR LOWER(c.name) LIKE ? OR LOWER(c.company) LIKE ?)`;
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    sql += ` ORDER BY m.created_at DESC`;
    const rows = query<any>(sql, params);
    return rows.map((r) => ({
      id: r.id,
      clientId: r.client_id,
      clientName: r.client_name,
      clientCompany: r.client_company,
      meetingId: r.meeting_id,
      text: r.text,
      type: r.type,
      category: r.category,
      confidence: r.confidence,
      tags: r.tags ? JSON.parse(r.tags) : [],
      createdAt: r.created_at,
      hindsightStatus: r.hindsight_status
    }));
  }

  /**
   * Aggregated Memory Statistics
   */
  public getMemoryStats() {
    const totalMemories = query<{ count: number }>(`SELECT COUNT(*) as count FROM memories`)[0]?.count || 0;
    const categoryCounts = query<{ category: string; count: number }>(
      `SELECT category, COUNT(*) as count FROM memories GROUP BY category`
    );
    const typeCounts = query<{ type: string; count: number }>(
      `SELECT type, COUNT(*) as count FROM memories GROUP BY type`
    );
    const clientsCount = query<{ count: number }>(`SELECT COUNT(*) as count FROM clients`)[0]?.count || 0;
    const meetingsCount = query<{ count: number }>(`SELECT COUNT(*) as count FROM meetings`)[0]?.count || 0;

    return {
      totalMemories,
      clientsCount,
      meetingsCount,
      categories: categoryCounts.reduce((acc, curr) => ({ ...acc, [curr.category]: curr.count }), {} as Record<string, number>),
      types: typeCounts.reduce((acc, curr) => ({ ...acc, [curr.type]: curr.count }), {} as Record<string, number>)
    };
  }

  private logOperation(
    operation: string,
    bankId: string,
    clientId: string | null,
    payload: any,
    resultCount: number,
    status: string
  ) {
    try {
      const id = `log_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      run(
        `INSERT INTO hindsight_logs (id, operation, bank_id, client_id, payload, result_count, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [id, operation, bankId, clientId, JSON.stringify(payload), resultCount, status, new Date().toISOString()]
      );
    } catch (e) {
      // non-fatal
    }
  }
}

export const hindsightService = new HindsightService();
