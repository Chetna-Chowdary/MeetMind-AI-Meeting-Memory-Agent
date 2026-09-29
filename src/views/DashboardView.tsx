import React, { useEffect, useState } from 'react';
import {
  Brain,
  Calendar,
  Clock,
  Users,
  Mail,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getDashboardData } from '../api';
import { DashboardStats, Meeting } from '../types';
import { MeetMindInsight } from '../components/ui/MeetMindInsight';

interface DashboardViewProps {
  onNavigate: (view: string, clientId?: string, meetingId?: string) => void;
  onPrepareClient: (clientId: string) => void;
  onOpenLearnDemo: () => void;
  userName?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onPrepareClient,
  onOpenLearnDemo,
  userName = 'Alex'
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 12,
    totalMeetings: 36,
    totalMemories: 128,
    pendingFollowUps: 7,
    weeklyNewMemories: 8
  });
  const [upcomingMeeting, setUpcomingMeeting] = useState<Meeting | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();
      setStats(data.stats);
      setUpcomingMeeting(data.upcomingMeeting);
      setRecentActivities(data.recentActivity);
    } catch (err) {
      console.warn('Dashboard fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const clientName = upcomingMeeting?.client_name || 'Sarah Mitchell';
  const clientCompany = upcomingMeeting?.client_company || 'NovaTech Solutions';
  const clientId = upcomingMeeting?.client_id || 'client_sarah';

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Good morning, {userName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Here is what needs your attention today. Every conversation has been indexed into persistent memory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLearnDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>How Memory Works</span>
          </button>

          <button
            onClick={() => onPrepareClient(clientId)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Prepare Meeting →</span>
          </button>
        </div>
      </div>

      {/* TODAY'S PRIORITY: Large Premium Meeting Intelligence Card */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Card Header Tag */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Today's Priority Meeting
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Today • 3:00 PM
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Client & Objective Bar */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={
                  upcomingMeeting?.client_avatar ||
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                }
                alt={clientName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  {clientName}
                  <span className="text-xs font-normal text-slate-500 font-sans">
                    ({upcomingMeeting?.client_role || 'Product Director'})
                  </span>
                </h3>
                <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                  <Building className="w-3 h-3 text-indigo-500" />
                  <span>{clientCompany}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  Meeting Objective: Align on API milestone gates while reassuring {clientName} on the December delivery schedule.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('meeting_details', undefined, upcomingMeeting?.id || 'meet_sarah_4')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                View Meeting
              </button>
              <button
                onClick={() => onPrepareClient(clientId)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Prepare Meeting →</span>
              </button>
            </div>
          </div>

          {/* 🧠 Signature AI Component: MeetMind Insight */}
          <MeetMindInsight
            headline="MeetMind Insight"
            badgeText="Hindsight Multi-Strategy Recall"
            insight="Sarah has mentioned delivery timelines in 3 recent conversations. Her primary anxiety is missing the December holiday code freeze."
            recommendation="Address the milestone risk mitigation gates early in today's 3:00 PM sync before discussing API interfaces."
            actionLabel="Review Briefing"
            onAction={() => onPrepareClient(clientId)}
          />

          {/* 3 Concise Memory Highlights from Hindsight */}
          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1 font-mono">
                <span>⚙️</span> Technical Preference
              </div>
              <p className="text-xs text-slate-800 font-medium">
                Mandates React frontend to align with internal developer skills.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1 font-mono">
                <span>💰</span> Budget Envelope
              </div>
              <p className="text-xs text-slate-800 font-medium">
                Strict ₹15 lakh ceiling agreed for Phase 1 portal revamp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1 font-mono">
                <span>⚠️</span> Delivery Timeline Risk
              </div>
              <p className="text-xs text-slate-800 font-medium">
                Target launch is December. Slipping past will disrupt Q1 board roadmap.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATS: Compact, Intelligent Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clients */}
        <div
          onClick={() => onNavigate('clients')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Clients</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900">{stats.totalClients}</div>
          <div className="text-[11px] text-slate-500 mt-1">3 active priority accounts</div>
        </div>

        {/* Meetings */}
        <div
          onClick={() => onNavigate('meetings')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Meetings Logged</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900">{stats.totalMeetings}</div>
          <div className="text-[11px] text-slate-500 mt-1">1 scheduled for today</div>
        </div>

        {/* Memories */}
        <div
          onClick={() => onNavigate('memory')}
          className="p-4 rounded-xl bg-white border border-indigo-200/90 shadow-2xs hover:border-indigo-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-indigo-900 mb-1.5">
            <span className="font-medium">Hindsight Memories</span>
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900">{stats.totalMemories}</div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-600" />
            <span>+8 learned this week</span>
          </div>
        </div>

        {/* Follow-ups */}
        <div
          onClick={() => onNavigate('followups')}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Follow-ups</span>
            <Mail className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xl font-bold tracking-tight text-slate-900">{stats.pendingFollowUps}</div>
          <div className="text-[11px] text-slate-500 mt-1">2 drafts ready to review</div>
        </div>
      </div>

      {/* Grid: MEMORY INTELLIGENCE & TODAY'S ACTIVITY */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* MEMORY INTELLIGENCE VISUALIZATION */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                Memory Intelligence Flow
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How MeetMind transforms conversations into compounded relationship context.
              </p>
            </div>
            <button
              onClick={() => onNavigate('memory')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Memory Bank</span>
              <span>→</span>
            </button>
          </div>

          {/* Visual Step-by-Step Memory Compounding */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Sep 10</span>
                <div className="text-xs font-bold text-slate-900 mt-1">Meeting 1</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Mobile application required alongside desktop web portal.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-indigo-600 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Retained
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Sep 18</span>
                <div className="text-xs font-bold text-slate-900 mt-1">Meeting 2</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Client prefers React. Mandates weekly email updates.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-indigo-600 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Retained
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Sep 25</span>
                <div className="text-xs font-bold text-slate-900 mt-1">Meeting 3</div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  ₹15 lakh ceiling. Delivery timeline cannot slip past December.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-indigo-600 font-mono font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Retained
              </div>
            </div>

            {/* Step 4: Today */}
            <div className="p-3.5 rounded-xl bg-indigo-950 text-white flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase text-indigo-300">Today</span>
                <div className="text-xs font-bold text-white mt-1">Meeting 4</div>
                <p className="text-[11px] text-indigo-100 mt-1 leading-snug">
                  Recalls all 4 facts to generate personalized briefing.
                </p>
              </div>
              <button
                onClick={() => onPrepareClient(clientId)}
                className="mt-3 pt-2 border-t border-indigo-800 text-[10px] text-indigo-300 font-semibold hover:text-white flex items-center justify-between"
              >
                <span>Prepare Me</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* TODAY'S ACTIVITY */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Today's Activity</h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Stream</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {(recentActivities.length > 0 ? recentActivities : [
              {
                id: 'a1',
                title: 'Memory retained in Hindsight',
                description: '"Budget ceiling: ₹15 lakh" for Sarah Mitchell',
                time: '15 mins ago'
              },
              {
                id: 'a2',
                title: 'Meeting completed & analyzed',
                description: 'Budget & Timeline Review with NovaTech',
                time: 'Yesterday'
              },
              {
                id: 'a3',
                title: 'Follow-up email generated',
                description: 'Phase 1 Proposal for Sarah Mitchell',
                time: '2 days ago'
              },
              {
                id: 'a4',
                title: 'Client updated',
                description: 'GreenGrid Systems architecture requirements',
                time: '3 days ago'
              }
            ]).map((act, index) => (
              <div key={index} className="py-2.5 flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{act.title}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{act.description}</div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPCOMING MEETINGS LIST */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            Upcoming Scheduled Conversations
          </h3>
          <button
            onClick={() => onNavigate('meetings')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            All Meetings ({stats.totalMeetings}) →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Meeting 1: Sarah */}
          <div className="p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono text-indigo-700 font-semibold">Today · 3:00 PM</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">Upcoming</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Pre-Launch Architecture & API Milestone Sync</h4>
              <div className="text-[11px] text-slate-600 mt-1">Sarah Mitchell · NovaTech Solutions</div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-600 flex items-center gap-1 font-semibold">
                <Brain className="w-3 h-3" /> 8 memories
              </span>
              <button
                onClick={() => onPrepareClient('client_sarah')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                Prepare →
              </button>
            </div>
          </div>

          {/* Meeting 2: Daniel Carter */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono text-slate-600">Oct 03 · 1:00 PM</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Upcoming</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">POC Telemetry Ingestion Review</h4>
              <div className="text-[11px] text-slate-600 mt-1">Daniel Carter · GreenGrid Systems</div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-600 flex items-center gap-1 font-semibold">
                <Brain className="w-3 h-3" /> 6 memories
              </span>
              <button
                onClick={() => onPrepareClient('client_daniel')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                Prepare →
              </button>
            </div>
          </div>

          {/* Meeting 3: Priya Sharma */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-mono text-slate-600">Oct 05 · 11:00 AM</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Upcoming</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Failover Simulation & Load Testing Review</h4>
              <div className="text-[11px] text-slate-600 mt-1">Priya Sharma · FinEdge Labs</div>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-indigo-600 flex items-center gap-1 font-semibold">
                <Brain className="w-3 h-3" /> 6 memories
              </span>
              <button
                onClick={() => onPrepareClient('client_priya')}
                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                Prepare →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
