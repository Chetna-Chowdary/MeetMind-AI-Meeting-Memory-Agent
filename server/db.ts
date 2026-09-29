import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_FILE_PATH = path.resolve(process.cwd(), 'meetmind.sqlite');

export async function getDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE_PATH);
      dbInstance = new SQL.Database(fileBuffer);
      initSchema(dbInstance);
      return dbInstance;
    } catch (err) {
      console.error('Failed to load existing SQLite database, creating fresh one:', err);
    }
  }

  dbInstance = new SQL.Database();
  initSchema(dbInstance);
  seedDemoData(dbInstance);
  saveDatabase();
  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE_PATH, buffer);
  } catch (err) {
    console.error('Error saving SQLite database to disk:', err);
  }
}

function initSchema(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      avatar TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL, -- upcoming, completed, cancelled
      participants TEXT NOT NULL,
      notes TEXT NOT NULL,
      summary TEXT,
      key_takeaways TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      meeting_id TEXT,
      text TEXT NOT NULL,
      type TEXT NOT NULL, -- world, experience, observation
      category TEXT NOT NULL, -- Preference, Requirement, Concern, Budget, Decision, Commitment
      confidence REAL DEFAULT 0.95,
      hindsight_id TEXT,
      hindsight_status TEXT DEFAULT 'synced', -- synced, pending, error
      tags TEXT, -- JSON array of strings
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (meeting_id) REFERENCES meetings(id)
    );

    CREATE TABLE IF NOT EXISTS action_items (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, completed
      due_date TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (meeting_id) REFERENCES meetings(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id TEXT PRIMARY KEY,
      meeting_id TEXT,
      client_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      status TEXT DEFAULT 'draft', -- draft, sent
      sent_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );

    CREATE TABLE IF NOT EXISTS hindsight_logs (
      id TEXT PRIMARY KEY,
      operation TEXT NOT NULL, -- retain, recall, reflect
      bank_id TEXT NOT NULL,
      client_id TEXT,
      payload TEXT,
      result_count INTEGER DEFAULT 0,
      status TEXT NOT NULL, -- success, fallback, error
      created_at TEXT NOT NULL
    );
  `);
}

export function query<T = any>(sql: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error('Database not initialized');
  const stmt = dbInstance.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function run(sql: string, params: any[] = []): void {
  if (!dbInstance) throw new Error('Database not initialized');
  dbInstance.run(sql, params);
  saveDatabase();
}

export function seedDemoData(db: Database): void {
  // Clear any partial demo data
  db.run(`
    DELETE FROM hindsight_logs;
    DELETE FROM follow_ups;
    DELETE FROM action_items;
    DELETE FROM memories;
    DELETE FROM meetings;
    DELETE FROM clients;
    DELETE FROM users;
  `);

  // 1. Demo User
  db.run(`
    INSERT INTO users (id, email, password_hash, name, role, avatar)
    VALUES (
      'user_demo_1',
      'demo@meetmind.ai',
      'MeetMindDemo123!',
      'Alex Vance',
      'Senior Partner & Solutions Director',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    );
  `);

  // 2. Demo Clients
  // Client 1: Sarah Mitchell (Flagship Demo)
  db.run(`
    INSERT INTO clients (id, name, company, role, email, phone, avatar, notes, created_at, updated_at)
    VALUES (
      'client_sarah',
      'Sarah Mitchell',
      'NovaTech Solutions',
      'Product Director',
      'sarah.mitchell@novatech.io',
      '+1 (415) 890-2341',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      'Leading the digital overhaul of NovaTech enterprise customer portal. High attention to delivery deadlines and UX consistency.',
      '2026-08-15 09:00:00',
      '2026-09-29 08:00:00'
    );
  `);

  // Client 2: Daniel Carter
  db.run(`
    INSERT INTO clients (id, name, company, role, email, phone, avatar, notes, created_at, updated_at)
    VALUES (
      'client_daniel',
      'Daniel Carter',
      'GreenGrid Systems',
      'Chief Technology Officer',
      'd.carter@greengrid.tech',
      '+1 (206) 441-9872',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'Overseeing renewable energy distribution telemetry. Focused heavily on ultra-low latency architecture, SOC2 compliance, and zero vendor lock-in.',
      '2026-08-20 11:30:00',
      '2026-09-27 15:45:00'
    );
  `);

  // Client 3: Priya Sharma
  db.run(`
    INSERT INTO clients (id, name, company, role, email, phone, avatar, notes, created_at, updated_at)
    VALUES (
      'client_priya',
      'Priya Sharma',
      'FinEdge Labs',
      'Head of Engineering',
      'priya.s@finedgelabs.com',
      '+1 (650) 332-7619',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      'Architecting next-generation PCI-DSS compliant checkout and merchant reconciliation gateways. Strict on security benchmarks and audit trails.',
      '2026-08-25 14:00:00',
      '2026-09-28 10:15:00'
    );
  `);

  // 3. Demo Meetings (Chronological and realistic)
  // Sarah's meetings (Meetings 1 to 4)
  db.run(`
    INSERT INTO meetings (id, client_id, title, date, time, status, participants, notes, summary, key_takeaways, created_at)
    VALUES 
    (
      'meet_sarah_1',
      'client_sarah',
      'Project Discovery & Scope Alignment',
      '2026-09-10',
      '10:00 AM',
      'completed',
      'Alex Vance, Sarah Mitchell, Jason Wu (Lead Designer)',
      'Initial discovery meeting to outline NovaTech customer portal revamp. Sarah highlighted that their enterprise customers are struggling with clunky legacy desktop apps. Key requirement: Must build a responsive mobile-first application alongside the web dashboard. Sarah mentioned their executive team has high visibility on this project.',
      'Discussed core objectives for NovaTech customer portal. Confirmed need for responsive mobile application and executive visibility.',
      'Mobile application required · High executive visibility · Legacy UI replacement',
      '2026-09-10 11:00:00'
    ),
    (
      'meet_sarah_2',
      'client_sarah',
      'Frontend Tech Evaluation & Framework Choices',
      '2026-09-18',
      '2:00 PM',
      'completed',
      'Alex Vance, Sarah Mitchell, Eric Ross (Architect)',
      'Deep dive into tech stack options. We evaluated Angular vs Vue vs React. Sarah stated unequivocally: "React is our preferred technology. Our internal front-end developers are already proficient in React and Next.js, and maintenance overhead must be minimized." Also discussed communication protocols: Sarah prefers weekly executive summary emails rather than ad-hoc chat pings.',
      'Evaluated front-end frameworks. Sarah confirmed preference for React to match internal team competencies. Established weekly email cadence.',
      'Client prefers React · Internal team familiarity · Email communication preferred',
      '2026-09-18 15:00:00'
    ),
    (
      'meet_sarah_3',
      'client_sarah',
      'Budget, Timeline & Risk Review',
      '2026-09-25',
      '11:30 AM',
      'completed',
      'Alex Vance, Sarah Mitchell, Nina Patel (Finance Lead)',
      'Budget and timeline review session. Sarah confirmed their approved budget: "Budget discussed: ₹15 lakh ceiling for Phase 1 delivery." Target launch is strictly December before annual holiday freeze. Sarah shared a crucial concern: "Our biggest concern is delivery timeline. If Phase 1 slips into January, our Q1 investor roadmap will be compromised." Sarah requested a formal technical proposal with milestone gates before our next alignment.',
      'Finalized budget at ₹15 lakh ceiling and December launch deadline. Identified delivery timeline as Sarah primary concern.',
      'Budget discussed: ₹15 lakh · Launch target: December · Delivery timeline is major concern · Technical proposal requested',
      '2026-09-25 12:45:00'
    ),
    (
      'meet_sarah_4',
      'client_sarah',
      'Pre-Launch Architecture & API Milestone Sync',
      '2026-09-29',
      '3:00 PM',
      'upcoming',
      'Alex Vance, Sarah Mitchell, Dev Leads',
      'Upcoming alignment session scheduled for today at 3:00 PM to review core API integration plan, delivery milestone schedule, and present the technical proposal addressing the December timeline.',
      'Upcoming sync to align on API integration roadmap and timeline assurance.',
      'Prepare technical proposal · Address December timeline assurance · Review API milestones',
      '2026-09-29 07:00:00'
    );
  `);

  // Daniel Carter's meetings
  db.run(`
    INSERT INTO meetings (id, client_id, title, date, time, status, participants, notes, summary, key_takeaways, created_at)
    VALUES 
    (
      'meet_dan_1',
      'client_daniel',
      'Telemetry Architecture & Cloud Infrastructure',
      '2026-09-08',
      '11:00 AM',
      'completed',
      'Alex Vance, Daniel Carter, Marcus Brody (DevOps)',
      'Daniel walked us through GreenGrid cloud topology. Infrastructure runs on AWS EKS with Kubernetes clusters across 3 regions. Stated latency constraint: Real-time power telemetry requires sub-50ms ingestion SLA. Open-source or open-standard protocols (MQTT/gRPC) required to avoid vendor lock-in.',
      'Reviewed AWS EKS topology and stringent sub-50ms telemetry ingestion SLA.',
      'AWS EKS infrastructure · Sub-50ms latency SLA · Avoid vendor lock-in',
      '2026-09-08 12:00:00'
    ),
    (
      'meet_dan_2',
      'client_daniel',
      'Security Compliance & POC Approval',
      '2026-09-22',
      '3:30 PM',
      'completed',
      'Alex Vance, Daniel Carter, Laura Chen (CISO)',
      'Compliance and budget review. Daniel stated GreenGrid SOC2 Type II audit is scheduled for Q4, so all data pipelines must enforce end-to-end encryption at rest and transit. Approved preliminary POC budget of $45,000 for a 4-week validation sprint. Daniel agreed to provide sample grid telemetry JSON payloads by Friday.',
      'Approved $45,000 POC budget for validation sprint. Outlined Q4 SOC2 Type II compliance mandate.',
      'Approved POC budget $45,000 · Q4 SOC2 Type II audit · Sample telemetry payloads promised',
      '2026-09-22 16:30:00'
    ),
    (
      'meet_dan_3',
      'client_daniel',
      'POC Telemetry Ingestion Review',
      '2026-10-03',
      '1:00 PM',
      'upcoming',
      'Alex Vance, Daniel Carter, Data Engineering Team',
      'Upcoming review of the live streaming telemetry POC on test EKS cluster.',
      'Upcoming sprint review of ingestion pipeline latency metrics.',
      'Verify sub-50ms latency · Review sample payloads · Verify encryption',
      '2026-09-27 10:00:00'
    );
  `);

  // Priya Sharma's meetings
  db.run(`
    INSERT INTO meetings (id, client_id, title, date, time, status, participants, notes, summary, key_takeaways, created_at)
    VALUES 
    (
      'meet_priya_1',
      'client_priya',
      'FinEdge Core Platform Architecture Scoping',
      '2026-09-12',
      '9:30 AM',
      'completed',
      'Alex Vance, Priya Sharma, Tariq Malik (Lead Architect)',
      'Scoping session on payment gateway compliance and merchant ledgering. Priya emphasized: FinEdge requires ISO 27001 and PCI-DSS Level 1 compliance. Technology choice: TypeScript microservices with PostgreSQL read replicas. Expressed anxiety around automated failover handling during high-volume trading hours.',
      'Scoped compliance frameworks and chosen stack: TypeScript microservices with PostgreSQL replicas.',
      'ISO 27001 & PCI-DSS Level 1 · TypeScript microservices · Failover during peak hours concern',
      '2026-09-12 10:45:00'
    ),
    (
      'meet_priya_2',
      'client_priya',
      'Ledger Reconciliation & Milestone Gates',
      '2026-09-26',
      '4:00 PM',
      'completed',
      'Alex Vance, Priya Sharma, QA Leads',
      'Reviewed ledger reconciliation algorithms. Priya stated target deployment window is early Q1 rollout to test merchant accounts. Prefers structured bi-weekly sprint reviews over ad-hoc status calls. Action item: Provide audited database schema diagrams.',
      'Agreed on Q1 pilot rollout for test merchants and bi-weekly sprint cadence.',
      'Early Q1 rollout window · Bi-weekly sprint reviews · Audited database schema requested',
      '2026-09-26 17:00:00'
    ),
    (
      'meet_priya_3',
      'client_priya',
      'Failover Simulation & Load Testing Review',
      '2026-10-05',
      '11:00 AM',
      'upcoming',
      'Alex Vance, Priya Sharma, SRE Team',
      'Upcoming review of chaos engineering and automated failover benchmarks under 50,000 req/sec load.',
      'Upcoming session to evaluate automated database failover resilience.',
      'Load test 50k req/s · Failover recovery validation · Audit log verification',
      '2026-09-28 11:00:00'
    );
  `);

  // 4. Demo Memories (Persisted into SQLite & synced with Hindsight structure)
  // Sarah Mitchell's memories
  const sarahMemories = [
    {
      id: 'mem_sarah_1',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_1',
      text: 'Mobile application is required alongside the desktop web dashboard to support enterprise field users.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-10 10:45:00',
      tags: JSON.stringify(['requirement', 'mobile', 'frontend', 'novatech'])
    },
    {
      id: 'mem_sarah_2',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_2',
      text: 'Client prefers React over Angular or Vue to align with internal team skillsets and reduce long-term maintenance.',
      type: 'observation',
      category: 'Preference',
      date: '2026-09-18 14:30:00',
      tags: JSON.stringify(['preference', 'technology', 'react', 'frontend'])
    },
    {
      id: 'mem_sarah_3',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_2',
      text: 'Prefers communication via weekly executive summary emails rather than ad-hoc chat pings.',
      type: 'observation',
      category: 'Preference',
      date: '2026-09-18 14:50:00',
      tags: JSON.stringify(['preference', 'communication', 'email'])
    },
    {
      id: 'mem_sarah_4',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_3',
      text: 'Budget discussed: ₹15 lakh ceiling for Phase 1 delivery.',
      type: 'world',
      category: 'Budget',
      date: '2026-09-25 11:45:00',
      tags: JSON.stringify(['budget', 'finance', 'phase-1'])
    },
    {
      id: 'mem_sarah_5',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_3',
      text: 'Target launch deadline is firmly set for December before annual holiday code freeze.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-25 12:00:00',
      tags: JSON.stringify(['requirement', 'timeline', 'december', 'milestone'])
    },
    {
      id: 'mem_sarah_6',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_3',
      text: 'Delivery timeline is Sarah primary concern due to board commitments; slips past December will compromise Q1 roadmap.',
      type: 'experience',
      category: 'Concern',
      date: '2026-09-25 12:15:00',
      tags: JSON.stringify(['concern', 'timeline', 'risk', 'board-visibility'])
    },
    {
      id: 'mem_sarah_7',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_3',
      text: 'Technical proposal with detailed milestone breakdown requested by Sarah prior to next sync.',
      type: 'experience',
      category: 'Commitment',
      date: '2026-09-25 12:30:00',
      tags: JSON.stringify(['commitment', 'deliverable', 'proposal'])
    },
    {
      id: 'mem_sarah_8',
      clientId: 'client_sarah',
      meetingId: 'meet_sarah_2',
      text: 'Current priority: Core API integration with internal CRM and billing systems.',
      type: 'observation',
      category: 'Decision',
      date: '2026-09-18 14:40:00',
      tags: JSON.stringify(['decision', 'api', 'integration', 'crm'])
    }
  ];

  // Daniel Carter's memories
  const danielMemories = [
    {
      id: 'mem_dan_1',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_1',
      text: 'GreenGrid infrastructure is hosted on AWS with Kubernetes EKS cluster across 3 availability zones.',
      type: 'world',
      category: 'Preference',
      date: '2026-09-08 11:20:00',
      tags: JSON.stringify(['infrastructure', 'aws', 'kubernetes', 'greengrid'])
    },
    {
      id: 'mem_dan_2',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_1',
      text: 'Stringent telemetry SLA: Real-time power streaming requires sub-50ms latency ingestion.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-08 11:35:00',
      tags: JSON.stringify(['requirement', 'latency', 'telemetry', 'sla'])
    },
    {
      id: 'mem_dan_3',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_1',
      text: 'Daniel concerned about vendor lock-in; mandates open-source streaming protocols (gRPC/MQTT).',
      type: 'observation',
      category: 'Concern',
      date: '2026-09-08 11:50:00',
      tags: JSON.stringify(['concern', 'vendor-lock-in', 'architecture'])
    },
    {
      id: 'mem_dan_4',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_2',
      text: 'SOC2 Type II compliance audit scheduled for Q4; requires end-to-end payload encryption at rest and in transit.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-22 15:50:00',
      tags: JSON.stringify(['compliance', 'soc2', 'security', 'encryption'])
    },
    {
      id: 'mem_dan_5',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_2',
      text: 'Approved preliminary POC budget of $45,000 for a 4-week integration sprint.',
      type: 'world',
      category: 'Budget',
      date: '2026-09-22 16:10:00',
      tags: JSON.stringify(['budget', 'poc', 'sprint'])
    },
    {
      id: 'mem_dan_6',
      clientId: 'client_daniel',
      meetingId: 'meet_dan_2',
      text: 'Daniel committed to providing sanitized sample grid telemetry JSON payloads by Friday.',
      type: 'experience',
      category: 'Commitment',
      date: '2026-09-22 16:20:00',
      tags: JSON.stringify(['commitment', 'payloads', 'telemetry'])
    }
  ];

  // Priya Sharma's memories
  const priyaMemories = [
    {
      id: 'mem_priya_1',
      clientId: 'client_priya',
      meetingId: 'meet_priya_1',
      text: 'FinEdge requires strict ISO 27001 and PCI-DSS Level 1 compliance for all payment handling components.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-12 09:50:00',
      tags: JSON.stringify(['compliance', 'pci-dss', 'iso-27001', 'security'])
    },
    {
      id: 'mem_priya_2',
      clientId: 'client_priya',
      meetingId: 'meet_priya_1',
      text: 'Technical architecture preference: TypeScript microservices paired with PostgreSQL read replicas.',
      type: 'observation',
      category: 'Preference',
      date: '2026-09-12 10:10:00',
      tags: JSON.stringify(['preference', 'typescript', 'postgresql', 'architecture'])
    },
    {
      id: 'mem_priya_3',
      clientId: 'client_priya',
      meetingId: 'meet_priya_1',
      text: 'Expressed strong anxiety over automated database failover resilience during peak volume trading windows.',
      type: 'experience',
      category: 'Concern',
      date: '2026-09-12 10:30:00',
      tags: JSON.stringify(['concern', 'failover', 'high-availability', 'trading'])
    },
    {
      id: 'mem_priya_4',
      clientId: 'client_priya',
      meetingId: 'meet_priya_2',
      text: 'Target deployment window is set for early Q1 rollout to pilot merchant accounts.',
      type: 'world',
      category: 'Requirement',
      date: '2026-09-26 16:15:00',
      tags: JSON.stringify(['requirement', 'milestone', 'q1-rollout'])
    },
    {
      id: 'mem_priya_5',
      clientId: 'client_priya',
      meetingId: 'meet_priya_2',
      text: 'Prefers structured bi-weekly sprint reviews over ad-hoc status calls.',
      type: 'observation',
      category: 'Preference',
      date: '2026-09-26 16:30:00',
      tags: JSON.stringify(['preference', 'communication', 'sprint-cadence'])
    },
    {
      id: 'mem_priya_6',
      clientId: 'client_priya',
      meetingId: 'meet_priya_2',
      text: 'Alex Vance committed to delivering audited database schema diagrams before the failover review.',
      type: 'experience',
      category: 'Commitment',
      date: '2026-09-26 16:45:00',
      tags: JSON.stringify(['commitment', 'schema', 'deliverable'])
    }
  ];

  for (const m of [...sarahMemories, ...danielMemories, ...priyaMemories]) {
    db.run(
      `INSERT INTO memories (id, client_id, meeting_id, text, type, category, confidence, hindsight_status, tags, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 0.98, 'synced', ?, ?);`,
      [m.id, m.clientId, m.meetingId, m.text, m.type, m.category, m.tags, m.date]
    );
  }

  // 5. Action Items
  const actionItems = [
    {
      id: 'act_1',
      meetingId: 'meet_sarah_3',
      clientId: 'client_sarah',
      description: 'Prepare technical proposal with milestone gates ensuring December delivery',
      status: 'pending',
      dueDate: '2026-09-29'
    },
    {
      id: 'act_2',
      meetingId: 'meet_sarah_3',
      clientId: 'client_sarah',
      description: 'Send updated budget breakdown respecting ₹15 lakh ceiling',
      status: 'completed',
      dueDate: '2026-09-26'
    },
    {
      id: 'act_3',
      meetingId: 'meet_dan_2',
      clientId: 'client_daniel',
      description: 'Review sample grid telemetry JSON payloads for sub-50ms ingestion parser',
      status: 'pending',
      dueDate: '2026-10-01'
    },
    {
      id: 'act_4',
      meetingId: 'meet_dan_2',
      clientId: 'client_daniel',
      description: 'Draft SOC2 encryption architecture document for GreenGrid CISO review',
      status: 'pending',
      dueDate: '2026-10-02'
    },
    {
      id: 'act_5',
      meetingId: 'meet_priya_2',
      clientId: 'client_priya',
      description: 'Deliver audited database schema diagrams for PostgreSQL read replicas',
      status: 'pending',
      dueDate: '2026-10-04'
    }
  ];

  for (const a of actionItems) {
    db.run(
      `INSERT INTO action_items (id, meeting_id, client_id, description, status, due_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, '2026-09-26 12:00:00');`,
      [a.id, a.meetingId, a.clientId, a.description, a.status, a.dueDate]
    );
  }

  // 6. Follow-ups
  db.run(`
    INSERT INTO follow_ups (id, meeting_id, client_id, subject, body, status, sent_at, created_at)
    VALUES 
    (
      'fol_1',
      'meet_sarah_3',
      'client_sarah',
      'NovaTech Portal Phase 1: Technical Proposal & Milestone Schedule',
      'Hi Sarah,\n\nFollowing up on our discussion yesterday regarding the Phase 1 portal revamp. We have structured our proposed roadmap specifically around the ₹15 lakh budget ceiling and the non-negotiable December launch target to safeguard your Q1 executive roadmap.\n\nOur team has locked in the React architecture as discussed, and we look forward to reviewing the API milestone gates in our 3:00 PM sync today.\n\nBest regards,\nAlex Vance',
      'sent',
      '2026-09-26 14:00:00',
      '2026-09-26 13:30:00'
    ),
    (
      'fol_2',
      'meet_dan_2',
      'client_daniel',
      'GreenGrid POC Kickoff & Encryption Protocols',
      'Hi Daniel,\n\nGreat connecting on the $45,000 POC authorization. We are staging the EKS environment to benchmark the sub-50ms telemetry requirement with open-standard MQTT brokers.\n\nLooking forward to receiving the sanitized sample JSON payloads.\n\nBest regards,\nAlex Vance',
      'sent',
      '2026-09-23 10:00:00',
      '2026-09-23 09:30:00'
    );
  `);

  console.log('✅ SQLite database seeded with rich MeetMind demo data.');
}
