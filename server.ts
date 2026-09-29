import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { getDatabase, query, run, seedDemoData } from './server/db.js';
import { hindsightService } from './server/hindsight.js';
import { aiService } from './server/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Ensure database initialized
  await getDatabase();

  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(cors());
  app.use(express.json());

  // -------------------------------------------------------------
  // API Routes
  // -------------------------------------------------------------
  const api = express.Router();

  // 1. Health check & Diagnostics
  api.get('/health', async (req: Request, res: Response) => {
    try {
      const hindsightHealth = await hindsightService.checkHealth();
      const stats = hindsightService.getMemoryStats();
      res.json({
        status: 'healthy',
        app: 'MeetMind',
        version: '1.0.0',
        hindsight: hindsightHealth,
        stats
      });
    } catch (err: any) {
      res.status(500).json({ status: 'error', error: err?.message });
    }
  });

  // 2. Authentication
  api.post('/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check demo credentials or general match
    const users = query<any>('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    const user = users[0];

    if (!user || user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token: 'demo-token-' + user.id
    });
  });

  api.get('/auth/me', (req: Request, res: Response) => {
    const users = query<any>('SELECT * FROM users LIMIT 1');
    if (users.length > 0) {
      const u = users[0];
      return res.json({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        avatar: u.avatar
      });
    }
    return res.status(404).json({ error: 'User not found' });
  });

  // 3. Dashboard Statistics
  api.get('/dashboard/stats', (req: Request, res: Response) => {
    try {
      const clientsCount = query<{ count: number }>('SELECT COUNT(*) as count FROM clients')[0]?.count || 0;
      const meetingsCount = query<{ count: number }>('SELECT COUNT(*) as count FROM meetings')[0]?.count || 0;
      const memoriesCount = query<{ count: number }>('SELECT COUNT(*) as count FROM memories')[0]?.count || 0;
      const pendingFollowUps = query<{ count: number }>('SELECT COUNT(*) as count FROM follow_ups WHERE status = "draft"')[0]?.count || 0;

      // Upcoming Flagship Meeting (Sarah Mitchell today)
      const upcomingMeetings = query<any>(`
        SELECT m.*, c.name as client_name, c.company as client_company, c.role as client_role, c.avatar as client_avatar
        FROM meetings m
        JOIN clients c ON m.client_id = c.id
        WHERE m.status = 'upcoming'
        ORDER BY m.date ASC, m.time ASC
        LIMIT 1
      `);

      // Recent Activity Log
      const recentMemories = query<any>(`
        SELECT m.id, m.text, m.category, m.created_at, c.name as client_name
        FROM memories m
        JOIN clients c ON m.client_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 4
      `);

      const activities = [
        {
          id: 'act_1',
          type: 'memory_learned',
          title: 'Memory retained in Hindsight',
          description: recentMemories[0] ? `"${recentMemories[0].text.substring(0, 60)}..." for ${recentMemories[0].client_name}` : 'Client preference learned',
          time: '15 mins ago',
          icon: 'brain'
        },
        {
          id: 'act_2',
          type: 'meeting_completed',
          title: 'Meeting completed & analyzed',
          description: 'Budget, Timeline & Risk Review with Sarah Mitchell',
          time: 'Yesterday',
          icon: 'check-circle'
        },
        {
          id: 'act_3',
          type: 'followup_generated',
          title: 'Follow-up email generated',
          description: 'Phase 1 Milestone Proposal for NovaTech Solutions',
          time: '2 days ago',
          icon: 'mail'
        },
        {
          id: 'act_4',
          type: 'client_updated',
          title: 'Client profile synchronized',
          description: 'GreenGrid Systems architecture requirements updated',
          time: '3 days ago',
          icon: 'user'
        }
      ];

      // Memory learning timeline trend
      const memoryChart = [
        { date: 'Sep 08', memoriesLearned: 3, cumulative: 3 },
        { date: 'Sep 10', memoriesLearned: 4, cumulative: 7 },
        { date: 'Sep 12', memoriesLearned: 3, cumulative: 10 },
        { date: 'Sep 18', memoriesLearned: 5, cumulative: 15 },
        { date: 'Sep 22', memoriesLearned: 3, cumulative: 18 },
        { date: 'Sep 25', memoriesLearned: 4, cumulative: 22 },
        { date: 'Sep 29', memoriesLearned: 2, cumulative: 24 }
      ];

      res.json({
        stats: {
          totalClients: clientsCount,
          totalMeetings: meetingsCount,
          totalMemories: memoriesCount,
          pendingFollowUps: pendingFollowUps || 7,
          weeklyNewMemories: 8
        },
        upcomingMeeting: upcomingMeetings[0] || null,
        recentActivity: activities,
        memoryChart
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 4. Clients
  api.get('/clients', (req: Request, res: Response) => {
    try {
      const clients = query<any>(`
        SELECT c.*,
          (SELECT COUNT(*) FROM meetings WHERE client_id = c.id) as meetings_count,
          (SELECT COUNT(*) FROM memories WHERE client_id = c.id) as memories_count,
          (SELECT date FROM meetings WHERE client_id = c.id AND status = 'completed' ORDER BY date DESC LIMIT 1) as last_meeting_date
        FROM clients c
        ORDER BY c.created_at ASC
      `);

      res.json(clients);
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  api.get('/clients/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const clientRows = query<any>('SELECT * FROM clients WHERE id = ?', [id]);
      if (clientRows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      const client = clientRows[0];

      // Fetch meetings
      const meetings = query<any>(
        'SELECT * FROM meetings WHERE client_id = ? ORDER BY date DESC, time DESC',
        [id]
      );

      // Fetch memories
      const memories = hindsightService.getLocalMemoriesForClient(id, undefined, 50);

      // Fetch action items
      const actionItems = query<any>(
        'SELECT * FROM action_items WHERE client_id = ? ORDER BY created_at DESC',
        [id]
      );

      res.json({
        ...client,
        meetings,
        memories,
        actionItems
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  api.post('/clients', (req: Request, res: Response) => {
    const { name, company, role, email, phone, notes } = req.body;
    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Name, company, and email are required' });
    }

    const id = `client_${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    try {
      run(
        `INSERT INTO clients (id, name, company, role, email, phone, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [id, name, company, role || 'Stakeholder', email, phone || '', notes || '', now, now]
      );

      res.status(201).json({ id, name, company, role, email });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 5. Client Memories Endpoint (direct Hindsight recall + database)
  api.get('/clients/:id/memories', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { q, category } = req.query;

    try {
      let memories = await hindsightService.recallClientMemories(id, (q as string) || 'important context and decisions', {
        budget: 'mid'
      });

      if (category && category !== 'All') {
        memories = memories.filter((m) => m.category.toLowerCase() === (category as string).toLowerCase());
      }

      res.json({
        clientId: id,
        count: memories.length,
        memories
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 6. Meetings
  api.get('/meetings', (req: Request, res: Response) => {
    const { status, clientId } = req.query;
    try {
      let sql = `
        SELECT m.*, c.name as client_name, c.company as client_company, c.role as client_role, c.avatar as client_avatar
        FROM meetings m
        JOIN clients c ON m.client_id = c.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (status && status !== 'all') {
        sql += ` AND m.status = ?`;
        params.push(status);
      }

      if (clientId) {
        sql += ` AND m.client_id = ?`;
        params.push(clientId);
      }

      sql += ` ORDER BY m.date DESC, m.time DESC`;

      const meetings = query<any>(sql, params);
      res.json(meetings);
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  api.get('/meetings/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const meetings = query<any>(`
        SELECT m.*, c.name as client_name, c.company as client_company, c.role as client_role, c.email as client_email
        FROM meetings m
        JOIN clients c ON m.client_id = c.id
        WHERE m.id = ?
      `, [id]);

      if (meetings.length === 0) {
        return res.status(404).json({ error: 'Meeting not found' });
      }

      const meeting = meetings[0];
      const memories = query<any>('SELECT * FROM memories WHERE meeting_id = ?', [id]);
      const actionItems = query<any>('SELECT * FROM action_items WHERE meeting_id = ?', [id]);

      res.json({
        ...meeting,
        memories: memories.map((m) => ({
          ...m,
          tags: m.tags ? JSON.parse(m.tags) : []
        })),
        actionItems
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  /**
   * 7. ADD MEETING (CORE WORKFLOW)
   * Meeting -> AI analyzes meeting -> Important info extracted -> Hindsight retains info -> UI displays "MeetMind learned N new memories"
   */
  api.post('/meetings', async (req: Request, res: Response) => {
    const { clientId, title, date, time, participants, notes } = req.body;

    if (!clientId || !title || !notes) {
      return res.status(400).json({ error: 'Client ID, meeting title, and notes are required' });
    }

    try {
      // 1. Fetch Client Context
      const clientRows = query<any>('SELECT * FROM clients WHERE id = ?', [clientId]);
      if (clientRows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      const client = clientRows[0];

      // 2. Save meeting to database
      const meetingId = `meet_${Date.now()}`;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // 3. AI analyzes the notes and extracts memories & action items
      const extraction = await aiService.extractMemoriesFromNotes(notes, {
        name: client.name,
        company: client.company,
        role: client.role
      });

      const takeawaysStr = extraction.keyTakeaways.join(' · ');

      run(
        `INSERT INTO meetings (id, client_id, title, date, time, status, participants, notes, summary, key_takeaways, created_at)
         VALUES (?, ?, ?, ?, ?, 'completed', ?, ?, ?, ?, ?);`,
        [
          meetingId,
          clientId,
          title,
          date || new Date().toISOString().split('T')[0],
          time || '10:00 AM',
          participants || `${client.name}, Alex Vance`,
          notes,
          extraction.summary,
          takeawaysStr,
          now
        ]
      );

      // 4. Retain each extracted memory into Hindsight
      const newlyLearnedMemories: any[] = [];

      for (const mem of extraction.memories) {
        const retainResult = await hindsightService.retainMeetingMemory(clientId, mem.text, {
          meetingId,
          category: mem.category,
          type: mem.type,
          tags: mem.tags,
          timestamp: new Date()
        });

        newlyLearnedMemories.push({
          id: retainResult.hindsightId,
          text: mem.text,
          category: mem.category,
          type: mem.type,
          tags: mem.tags,
          hindsightStatus: retainResult.mode === 'hindsight_cloud' ? 'cloud' : 'synced'
        });
      }

      // 5. Store action items
      for (const act of extraction.actionItems) {
        const actId = `act_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        run(
          `INSERT INTO action_items (id, meeting_id, client_id, description, status, due_date, created_at)
           VALUES (?, ?, ?, ?, 'pending', ?, ?);`,
          [actId, meetingId, clientId, act.description, act.dueDate || null, now]
        );
      }

      res.status(201).json({
        success: true,
        message: `MeetMind learned ${newlyLearnedMemories.length} new memories.`,
        meetingId,
        summary: extraction.summary,
        keyTakeaways: extraction.keyTakeaways,
        newMemories: newlyLearnedMemories,
        actionItems: extraction.actionItems
      });
    } catch (err: any) {
      console.error('Error saving meeting and retaining memory:', err);
      res.status(500).json({ error: err?.message || 'Failed to process meeting' });
    }
  });

  // 8. Re-analyze Meeting
  api.post('/meetings/:id/analyze', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const meetings = query<any>('SELECT * FROM meetings WHERE id = ?', [id]);
      if (meetings.length === 0) return res.status(404).json({ error: 'Meeting not found' });
      const meeting = meetings[0];

      const client = query<any>('SELECT * FROM clients WHERE id = ?', [meeting.client_id])[0];

      const extraction = await aiService.extractMemoriesFromNotes(meeting.notes, {
        name: client.name,
        company: client.company,
        role: client.role
      });

      // Retain new memories
      const learned: any[] = [];
      for (const m of extraction.memories) {
        const res = await hindsightService.retainMeetingMemory(client.id, m.text, {
          meetingId: id,
          category: m.category,
          type: m.type,
          tags: m.tags
        });
        learned.push({ text: m.text, category: m.category, status: res.mode });
      }

      // Update meeting summary
      run(
        `UPDATE meetings SET summary = ?, key_takeaways = ? WHERE id = ?;`,
        [extraction.summary, extraction.keyTakeaways.join(' · '), id]
      );

      res.json({
        success: true,
        summary: extraction.summary,
        keyTakeaways: extraction.keyTakeaways,
        learnedMemories: learned
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 9. All Memories (Memory Center Page)
  api.get('/memories', (req: Request, res: Response) => {
    const { category, type, search } = req.query;
    try {
      const memories = hindsightService.getAllMemories(
        category as string,
        type as string,
        search as string
      );
      const stats = hindsightService.getMemoryStats();

      res.json({
        memories,
        stats
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  /**
   * 10. PREPARE ME (FLAGSHIP WORKFLOW)
   * 1. Retrieve relevant memories from Hindsight
   * 2. AI generates personalized meeting briefing
   */
  api.post('/ai/prepare', async (req: Request, res: Response) => {
    const { clientId, meetingTitle } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required' });
    }

    try {
      const clientRows = query<any>('SELECT * FROM clients WHERE id = ?', [clientId]);
      if (clientRows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }
      const client = clientRows[0];

      // 1. Recall memories from Hindsight for this client
      const recalledMemories = await hindsightService.recallClientMemories(
        clientId,
        meetingTitle || 'upcoming meeting roadmap decisions requirements concerns budget',
        { budget: 'high' }
      );

      // 2. Generate structured personalized briefing
      const brief = await aiService.generateMeetingBrief(
        { name: client.name, company: client.company, role: client.role },
        recalledMemories,
        meetingTitle || 'Strategy & Milestone Alignment'
      );

      res.json({
        success: true,
        brief,
        recalledMemories
      });
    } catch (err: any) {
      console.error('Error generating prepare brief:', err);
      res.status(500).json({ error: err?.message });
    }
  });

  /**
   * 11. FOLLOW-UP EMAIL GENERATOR
   */
  api.post('/ai/followup', async (req: Request, res: Response) => {
    const { clientId, meetingId, customNotes } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required' });
    }

    try {
      const client = query<any>('SELECT * FROM clients WHERE id = ?', [clientId])[0];
      if (!client) return res.status(404).json({ error: 'Client not found' });

      let meeting = null;
      if (meetingId) {
        meeting = query<any>('SELECT * FROM meetings WHERE id = ?', [meetingId])[0];
      }

      const meetingObj = meeting || {
        title: 'Strategic Alignment Sync',
        notes: customNotes || 'Reviewed project milestones, budget envelope, and target launch schedule.',
        summary: 'Aligned on next steps.'
      };

      // Recall memories from Hindsight
      const recalled = await hindsightService.recallClientMemories(clientId, 'preferences commitments timeline budget', {
        budget: 'mid'
      });

      const emailData = await aiService.generateFollowUpEmail(
        { name: client.name, company: client.company, role: client.role },
        meetingObj,
        recalled
      );

      res.json({
        success: true,
        ...emailData,
        recipient: {
          name: client.name,
          email: client.email,
          company: client.company
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  /**
   * 12. AI ASSISTANT CHAT (MEMORY-GROUNDED)
   */
  api.post('/ai/chat', async (req: Request, res: Response) => {
    const { message, clientId, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      let clientContext = null;
      let targetClientId = clientId;

      // Auto-detect client mentioned in query if not explicitly passed
      if (!targetClientId) {
        const lower = message.toLowerCase();
        if (lower.includes('sarah') || lower.includes('novatech')) {
          targetClientId = 'client_sarah';
        } else if (lower.includes('daniel') || lower.includes('greengrid') || lower.includes('carter')) {
          targetClientId = 'client_daniel';
        } else if (lower.includes('priya') || lower.includes('finedge') || lower.includes('sharma')) {
          targetClientId = 'client_priya';
        }
      }

      if (targetClientId) {
        const c = query<any>('SELECT * FROM clients WHERE id = ?', [targetClientId])[0];
        if (c) {
          clientContext = { id: c.id, name: c.name, company: c.company, role: c.role };
        }
      }

      // Recall memories from Hindsight
      let recalled: any[] = [];
      if (clientContext) {
        recalled = await hindsightService.recallClientMemories(clientContext.id, message, { budget: 'mid' });
      } else {
        // Broad search across recent memories
        recalled = hindsightService.getAllMemories(undefined, undefined, message).slice(0, 10);
      }

      const response = await aiService.chatWithMemory(
        message,
        clientContext,
        recalled,
        conversationHistory || []
      );

      res.json({
        answer: response.answer,
        memoriesUsed: response.memoriesUsed,
        client: clientContext,
        source: response.source
      });
    } catch (err: any) {
      console.error('AI chat error:', err);
      res.status(500).json({ error: err?.message });
    }
  });

  // 13. Settings & Hindsight Diagnostics
  api.get('/settings/hindsight', async (req: Request, res: Response) => {
    const config = hindsightService.getConfig();
    const health = await hindsightService.checkHealth();
    res.json({
      config,
      health
    });
  });

  api.post('/settings/hindsight', async (req: Request, res: Response) => {
    const { baseUrl, apiKey, bankId } = req.body;
    try {
      hindsightService.updateConfig({
        ...(baseUrl ? { baseUrl } : {}),
        ...(apiKey !== undefined ? { apiKey } : {}),
        ...(bankId ? { bankId } : {})
      });

      const health = await hindsightService.checkHealth();
      res.json({
        success: true,
        message: 'Hindsight configuration updated',
        health,
        config: hindsightService.getConfig()
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // 14. Demo Reset
  api.post('/demo/reset', async (req: Request, res: Response) => {
    try {
      const db = await getDatabase();
      seedDemoData(db);
      res.json({ success: true, message: 'MeetMind demo data reset successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err?.message });
    }
  });

  // Mount API router
  app.use('/api', api);

  // -------------------------------------------------------------
  // Vite Integration (Dev Middleware Mode or Production Static)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({ error: 'Internal server error occurred.' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🧠 MeetMind AI Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🔗 Hindsight Persistent Memory: Active`);
    console.log(`✨ AI Engine: Gemini 3.8 Flash`);
    console.log(`========================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error in MeetMind server:', err);
  process.exit(1);
});
