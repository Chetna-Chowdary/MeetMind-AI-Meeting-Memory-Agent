import { Client, Meeting, Memory, PrepareMeBrief, DashboardStats, User } from './types';

const API_BASE = '/api';

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to sign in');
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`);
  if (!res.ok) throw new Error('User not authenticated');
  return res.json();
}

export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  upcomingMeeting: Meeting | null;
  recentActivity: any[];
  memoryChart: any[];
}> {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export async function getClients(): Promise<Client[]> {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
}

export async function getClientDetails(id: string): Promise<Client & {
  meetings: Meeting[];
  memories: Memory[];
  actionItems: any[];
}> {
  const res = await fetch(`${API_BASE}/clients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch client details');
  return res.json();
}

export async function createClient(data: Partial<Client>): Promise<Client> {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json();
}

export async function getMeetings(status: string = 'all', clientId?: string): Promise<Meeting[]> {
  const params = new URLSearchParams();
  if (status !== 'all') params.append('status', status);
  if (clientId) params.append('clientId', clientId);

  const res = await fetch(`${API_BASE}/meetings?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

export async function getMeetingDetails(id: string): Promise<Meeting & {
  memories: Memory[];
  actionItems: any[];
}> {
  const res = await fetch(`${API_BASE}/meetings/${id}`);
  if (!res.ok) throw new Error('Failed to load meeting details');
  return res.json();
}

export async function createMeetingAndLearn(data: {
  clientId: string;
  title: string;
  date: string;
  time: string;
  participants: string;
  notes: string;
}): Promise<{
  success: boolean;
  message: string;
  meetingId: string;
  summary: string;
  keyTakeaways: string[];
  newMemories: Memory[];
  actionItems: any[];
}> {
  const res = await fetch(`${API_BASE}/meetings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save meeting and extract memories');
  }
  return res.json();
}

export async function getAllMemories(category?: string, type?: string, search?: string): Promise<{
  memories: Memory[];
  stats: any;
}> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (type && type !== 'All') params.append('type', type);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/memories?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch memories');
  return res.json();
}

export async function prepareMe(clientId: string, meetingTitle?: string): Promise<{
  success: boolean;
  brief: PrepareMeBrief;
  recalledMemories: Memory[];
}> {
  const res = await fetch(`${API_BASE}/ai/prepare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, meetingTitle })
  });
  if (!res.ok) throw new Error('Failed to prepare meeting brief');
  return res.json();
}

export async function generateFollowUpEmail(clientId: string, meetingId?: string, customNotes?: string): Promise<{
  subject: string;
  body: string;
  recipient: { name: string; email: string; company: string };
}> {
  const res = await fetch(`${API_BASE}/ai/followup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, meetingId, customNotes })
  });
  if (!res.ok) throw new Error('Failed to generate follow-up email');
  return res.json();
}

export async function askAIAssistant(
  message: string,
  clientId?: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{
  answer: string;
  memoriesUsed: string[];
  client: any;
  source: string;
}> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, clientId, conversationHistory })
  });
  if (!res.ok) throw new Error('Failed to get answer from assistant');
  return res.json();
}

export async function getHindsightSettings(): Promise<any> {
  const res = await fetch(`${API_BASE}/settings/hindsight`);
  if (!res.ok) throw new Error('Failed to load Hindsight settings');
  return res.json();
}

export async function updateHindsightSettings(settings: { baseUrl?: string; apiKey?: string; bankId?: string }): Promise<any> {
  const res = await fetch(`${API_BASE}/settings/hindsight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update Hindsight settings');
  return res.json();
}

export async function resetDemoData(): Promise<any> {
  const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}
