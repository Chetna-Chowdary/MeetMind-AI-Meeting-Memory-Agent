export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  notes?: string;
  meetings_count?: number;
  memories_count?: number;
  last_meeting_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Meeting {
  id: string;
  client_id: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  participants: string;
  notes: string;
  summary?: string;
  key_takeaways?: string;
  client_name?: string;
  client_company?: string;
  client_role?: string;
  client_avatar?: string;
  memories_count?: number;
  memory_count?: number;
  created_at: string;
}

export interface Memory {
  id: string;
  clientId?: string;
  client_id?: string;
  meetingId?: string;
  meeting_id?: string;
  text: string;
  type: 'world' | 'experience' | 'observation';
  category: 'Preference' | 'Requirement' | 'Concern' | 'Budget' | 'Decision' | 'Commitment';
  confidence?: number;
  hindsightStatus?: 'cloud' | 'synced' | 'pending';
  hindsight_status?: 'cloud' | 'synced' | 'pending';
  tags?: string[];
  createdAt?: string;
  created_at?: string;
  clientName?: string;
  client_name?: string;
  clientCompany?: string;
  client_company?: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  client_id: string;
  description: string;
  status: 'pending' | 'completed';
  due_date?: string;
  created_at: string;
}

export interface FollowUp {
  id: string;
  meeting_id?: string;
  client_id: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent';
  sent_at?: string;
  created_at: string;
}

export interface PrepareMeBrief {
  clientName: string;
  clientCompany: string;
  clientRole: string;
  meetingObjective: string;
  whatYouShouldRemember: string[];
  importantConcerns: string[];
  openFollowUps: string[];
  suggestedTalkingPoints: string[];
  suggestedQuestions: string[];
  recommendedFocus: string;
  recalledMemoryCount: number;
  memorySource: string;
}

export interface DashboardStats {
  totalClients: number;
  totalMeetings: number;
  totalMemories: number;
  pendingFollowUps: number;
  weeklyNewMemories: number;
}
