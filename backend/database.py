import sqlite3
import os
import json
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "meetmind.sqlite")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
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
        status TEXT NOT NULL,
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
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        confidence REAL DEFAULT 0.95,
        hindsight_id TEXT,
        hindsight_status TEXT DEFAULT 'synced',
        tags TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id),
        FOREIGN KEY (meeting_id) REFERENCES meetings(id)
    );

    CREATE TABLE IF NOT EXISTS action_items (
        id TEXT PRIMARY KEY,
        meeting_id TEXT NOT NULL,
        client_id TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
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
        status TEXT DEFAULT 'draft',
        sent_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id)
    );
    """)
    conn.commit()

    # Seed if empty
    cursor.execute("SELECT COUNT(*) FROM clients")
    if cursor.fetchone()[0] == 0:
        seed_demo_data(conn)
    conn.close()

def seed_demo_data(conn):
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO users (id, email, password_hash, name, role, avatar)
    VALUES ('user_demo_1', 'demo@meetmind.ai', 'MeetMindDemo123!', 'Alex Vance', 'Senior Partner & Solutions Director', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
    """)

    cursor.executemany("""
    INSERT OR REPLACE INTO clients (id, name, company, role, email, phone, avatar, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        ('client_sarah', 'Sarah Mitchell', 'NovaTech Solutions', 'Product Director', 'sarah.mitchell@novatech.io', '+1 (415) 890-2341', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Leading enterprise portal overhaul.', '2026-08-15 09:00:00', '2026-09-29 08:00:00'),
        ('client_daniel', 'Daniel Carter', 'GreenGrid Systems', 'Chief Technology Officer', 'd.carter@greengrid.tech', '+1 (206) 441-9872', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Renewable grid IoT telemetry architect.', '2026-08-20 11:30:00', '2026-09-27 15:45:00'),
        ('client_priya', 'Priya Sharma', 'FinEdge Labs', 'Head of Engineering', 'priya.s@finedgelabs.com', '+1 (650) 332-7619', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Fintech payment gateway compliance lead.', '2026-08-25 14:00:00', '2026-09-28 10:15:00'),
    ])

    cursor.executemany("""
    INSERT OR REPLACE INTO meetings (id, client_id, title, date, time, status, participants, notes, summary, key_takeaways, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, [
        ('meet_sarah_1', 'client_sarah', 'Project Discovery & Scope Alignment', '2026-09-10', '10:00 AM', 'completed', 'Alex Vance, Sarah Mitchell', 'Need mobile-first portal alongside web.', 'Discussed mobile-first customer portal.', 'Mobile app required · Legacy UI revamp', '2026-09-10 11:00:00'),
        ('meet_sarah_2', 'client_sarah', 'Frontend Tech Evaluation', '2026-09-18', '2:00 PM', 'completed', 'Alex Vance, Sarah Mitchell', 'Sarah: "React is our preferred technology." Prefers weekly email.', 'Selected React as primary technology.', 'Client prefers React · Email updates preferred', '2026-09-18 15:00:00'),
        ('meet_sarah_3', 'client_sarah', 'Budget, Timeline & Risk Review', '2026-09-25', '11:30 AM', 'completed', 'Alex Vance, Sarah Mitchell', 'Budget: ₹15 lakh ceiling. Launch target: December. Biggest concern: Delivery timeline.', 'Finalized budget and December target. Delivery timeline is major concern.', 'Budget discussed: ₹15 lakh · Target launch: December · Delivery timeline is main concern', '2026-09-25 12:45:00'),
        ('meet_sarah_4', 'client_sarah', 'Pre-Launch Architecture & API Sync', '2026-09-29', '3:00 PM', 'upcoming', 'Alex Vance, Sarah Mitchell', 'Align on milestone gates and technical proposal.', 'Upcoming sync for API integration.', 'Review technical proposal · Reassure December timeline', '2026-09-29 07:00:00')
    ])

    cursor.executemany("""
    INSERT OR REPLACE INTO memories (id, client_id, meeting_id, text, type, category, confidence, hindsight_status, tags, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 0.98, 'synced', ?, ?)
    """, [
        ('mem_s_1', 'client_sarah', 'meet_sarah_1', 'Mobile application required alongside desktop web dashboard.', 'world', 'Requirement', '["mobile", "frontend"]', '2026-09-10 10:45:00'),
        ('mem_s_2', 'client_sarah', 'meet_sarah_2', 'Client prefers React over Angular or Vue to match internal team skillsets.', 'observation', 'Preference', '["preference", "react"]', '2026-09-18 14:30:00'),
        ('mem_s_3', 'client_sarah', 'meet_sarah_3', 'Budget discussed: ₹15 lakh ceiling for Phase 1 delivery.', 'world', 'Budget', '["budget", "phase1"]', '2026-09-25 11:45:00'),
        ('mem_s_4', 'client_sarah', 'meet_sarah_3', 'Target launch deadline is firmly set for December before holiday freeze.', 'world', 'Requirement', '["timeline", "december"]', '2026-09-25 12:00:00'),
        ('mem_s_5', 'client_sarah', 'meet_sarah_3', 'Delivery timeline is Sarah primary concern due to executive board commitments.', 'experience', 'Concern', '["concern", "timeline"]', '2026-09-25 12:15:00'),
        ('mem_s_6', 'client_sarah', 'meet_sarah_3', 'Technical proposal with milestone gates requested by Sarah before next sync.', 'experience', 'Commitment', '["commitment", "proposal"]', '2026-09-25 12:30:00'),
        ('mem_s_7', 'client_sarah', 'meet_sarah_2', 'Prefers communication via weekly executive summary emails rather than ad-hoc chat.', 'observation', 'Preference', '["preference", "email"]', '2026-09-18 14:50:00'),
        ('mem_s_8', 'client_sarah', 'meet_sarah_2', 'Current priority: Core API integration with internal CRM and billing.', 'observation', 'Decision', '["api", "crm"]', '2026-09-18 14:40:00')
    ])

    conn.commit()
