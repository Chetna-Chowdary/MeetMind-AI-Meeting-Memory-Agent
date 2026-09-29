import React, { useEffect, useState } from 'react';
import {
  Building,
  Mail,
  Phone,
  Calendar,
  Brain,
  Zap,
  Plus,
  Bot,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
  AlertTriangle,
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getClientDetails } from '../api';
import { Client, Meeting, Memory } from '../types';
import { MeetMindInsight } from '../components/ui/MeetMindInsight';
import { MemoryDetailModal } from '../components/ui/MemoryDetailModal';

interface ClientProfileViewProps {
  clientId: string;
  onBack: () => void;
  onPrepareMe: (clientId: string) => void;
  onNewMeeting: (clientId: string) => void;
  onAskAI: (clientId: string, initialPrompt?: string) => void;
  onViewMeeting: (meetingId: string) => void;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  clientId,
  onBack,
  onPrepareMe,
  onNewMeeting,
  onAskAI,
  onViewMeeting
}) => {
  const [client, setClient] = useState<(Client & { meetings: Meeting[]; memories: Memory[]; actionItems: any[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    loadDetails();
  }, [clientId]);

  const loadDetails = async () => {
    try {
      const data = await getClientDetails(clientId);
      setClient(data);
    } catch (err) {
      console.error('Failed to load client details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 max-w-5xl mx-auto space-y-2">
        <Brain className="w-6 h-6 text-indigo-600 animate-pulse mx-auto" />
        <div>Recalling Hindsight memories for client profile...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 text-center max-w-5xl mx-auto">
        <p className="text-sm text-slate-600">Client not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-indigo-600 font-medium">← Back to Clients</button>
      </div>
    );
  }

  const categoryIcons: Record<string, string> = {
    budget: '💰',
    preference: '⚙️',
    requirement: '🎯',
    concern: '⚠️',
    decision: '⚖️',
    commitment: '📌'
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Clients</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={
              client.avatar ||
              'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            }
            alt={client.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">{client.name}</h2>
            <div className="text-xs font-semibold text-indigo-600 mt-0.5">{client.company}</div>
            <div className="text-xs text-slate-500 font-medium">{client.role}</div>

            {/* Unboxed Metadata row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {client.email}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {client.phone}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-mono text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Hindsight Synced
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onAskAI(client.id, `What should I remember about ${client.name}?`)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-600" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={() => onNewMeeting(client.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>New Meeting</span>
          </button>

          <button
            onClick={() => onPrepareMe(client.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Prepare Meeting</span>
          </button>
        </div>
      </div>

      {/* RELATIONSHIP OVERVIEW KPI BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-400 block font-medium">Last Interaction</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {client.last_meeting_date || 'Sep 25, 2026'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-400 block font-medium">Meetings Logged</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {client.meetings?.length || 4} conversations
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-indigo-200/80 shadow-2xs">
          <span className="text-[11px] text-indigo-900 block font-medium">Hindsight Memories</span>
          <span className="text-sm font-bold text-indigo-600 font-mono mt-1 block">
            {client.memories?.length || 8} persistent facts
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-400 block font-medium">Open Commitments</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">
            {client.actionItems?.length || 2} action items
          </span>
        </div>
      </div>

      {/* Signature AI Insight for this Client */}
      <MeetMindInsight
        headline={`MeetMind Relationship Insight · ${client.name}`}
        badgeText="Hindsight Memory Bank"
        insight={`${client.name} has emphasized delivery timeline certainty across past conversations. Maintaining trust requires addressing schedule risks before feature scopes.`}
        recommendation="When drafting proposals, highlight milestone check-ins to alleviate timeline anxiety."
        actionLabel="Prepare Meeting →"
        onAction={() => onPrepareMe(client.id)}
      />

      {/* Main Grid: WHAT MEETMIND KNOWS (AI Memory) & CONVERSATION TIMELINE */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: WHAT MEETMIND KNOWS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  What MeetMind Knows
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any memory card to inspect source meeting, context, and Hindsight metadata.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Hindsight Bank
              </span>
            </div>

            {/* Memory Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {client.memories && client.memories.length > 0 ? (
                client.memories.map((mem) => {
                  const icon = categoryIcons[mem.category.toLowerCase()] || '💡';
                  const dateStr = mem.createdAt?.split(' ')[0] || mem.created_at?.split(' ')[0] || 'Sep 2026';

                  return (
                    <div
                      key={mem.id}
                      onClick={() => setSelectedMemory(mem)}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all text-xs cursor-pointer flex flex-col justify-between group space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                          <span className="font-semibold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                            <span>{icon}</span>
                            <span>{mem.category}</span>
                          </span>
                          <span className="text-slate-400">{dateStr}</span>
                        </div>

                        <p className="text-slate-800 font-medium leading-relaxed group-hover:text-indigo-950">
                          "{mem.text}"
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">Type: {mem.type}</span>
                        <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                          Context →
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 p-6 text-center text-xs text-slate-400">
                  No memories recorded yet. Log a meeting to retain client context.
                </div>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Open Action Items & Commitments
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              {client.actionItems && client.actionItems.length > 0 ? (
                client.actionItems.map((act) => (
                  <div key={act.id} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">{act.description}</span>
                    <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-3">
                      Due: {act.due_date || 'Upcoming'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-slate-400">No open action items.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: CONVERSATION TIMELINE */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Conversation Timeline
              </h3>
              <span className="text-xs text-slate-400 font-mono">{client.meetings?.length || 0} meetings</span>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {client.meetings && client.meetings.length > 0 ? (
                client.meetings.map((meet) => (
                  <div key={meet.id} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                        meet.status === 'upcoming'
                          ? 'bg-emerald-500 border-emerald-200'
                          : 'bg-indigo-600 border-white ring-2 ring-indigo-200'
                      }`}
                    />

                    <div className="text-xs text-slate-400 font-mono mb-0.5 flex items-center justify-between">
                      <span>{meet.date}</span>
                      <span className="uppercase text-[10px] font-semibold text-slate-500">
                        {meet.status}
                      </span>
                    </div>

                    <h4
                      onClick={() => onViewMeeting(meet.id)}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {meet.title}
                    </h4>

                    {meet.key_takeaways && (
                      <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                        {meet.key_takeaways}
                      </p>
                    )}

                    <button
                      onClick={() => onViewMeeting(meet.id)}
                      className="mt-2 text-[11px] text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View Meeting Details →
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">No meeting history yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        memory={selectedMemory}
        isOpen={Boolean(selectedMemory)}
        onClose={() => setSelectedMemory(null)}
        onPrepareClient={onPrepareMe}
        onAskAI={(cId, prompt) => onAskAI(cId, prompt)}
      />
    </div>
  );
};
