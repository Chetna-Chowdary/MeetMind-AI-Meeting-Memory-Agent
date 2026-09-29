import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building,
  Brain,
  Mail,
  Zap,
  ArrowLeft,
  CheckCircle2,
  Tag,
  ShieldCheck,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { getMeetingDetails } from '../api';
import { Meeting, Memory, ActionItem } from '../types';

interface MeetingDetailsViewProps {
  meetingId: string;
  onBack: () => void;
  onGenerateFollowUp: (clientId: string, meetingId: string) => void;
  onPrepareClient: (clientId: string) => void;
}

export const MeetingDetailsView: React.FC<MeetingDetailsViewProps> = ({
  meetingId,
  onBack,
  onGenerateFollowUp,
  onPrepareClient
}) => {
  const [meeting, setMeeting] = useState<(Meeting & { memories: Memory[]; actionItems: ActionItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);

  useEffect(() => {
    loadDetails();
  }, [meetingId]);

  const loadDetails = async () => {
    try {
      const data = await getMeetingDetails(meetingId);
      setMeeting(data);
    } catch (err) {
      console.error('Error loading meeting details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateReanalysis = () => {
    setIsReanalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1400);
    setTimeout(() => setAnalysisStep(4), 2100);
    setTimeout(() => setAnalysisStep(5), 2800);
    setTimeout(() => {
      setIsReanalyzing(false);
      setAnalysisStep(0);
    }, 3800);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500 max-w-5xl mx-auto space-y-2">
        <Brain className="w-6 h-6 text-indigo-600 animate-pulse mx-auto" />
        <div>Loading meeting workspace...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-600">Meeting not found.</p>
        <button onClick={onBack} className="mt-2 text-xs text-indigo-600">← Back</button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Meetings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPrepareClient(meeting.client_id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Prepare Meeting</span>
          </button>
          <button
            onClick={() => onGenerateFollowUp(meeting.client_id, meeting.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Draft Follow-up</span>
          </button>
        </div>
      </div>

      {/* Re-analysis Banner / Animation Modal */}
      {isReanalyzing && (
        <div className="p-5 rounded-2xl bg-indigo-950 text-white shadow-xl border border-indigo-400/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Brain className="w-4 h-4 text-indigo-400 animate-spin" />
              MeetMind is learning from this meeting...
            </span>
            <span>Hindsight Agent Memory</span>
          </div>

          <div className="space-y-1.5 text-xs font-medium">
            <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> 1. Reading conversation notes & entity context
            </div>
            <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> 2. Identifying technical preferences (React frontend)
            </div>
            <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Identifying budget ceiling & deadline risk (₹15L, December)
            </div>
            <div className={`flex items-center gap-2 ${analysisStep >= 4 ? 'text-emerald-400' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> 4. Ingesting memories into Hindsight bank `meetmind-demo`
            </div>
            {analysisStep >= 5 && (
              <div className="text-emerald-300 font-bold pt-1">
                ✓ 5 persistent memories successfully synchronized into Hindsight bank!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3-Column AI Meeting Workspace Layout */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Meeting Information (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Meeting Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Client</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{meeting.client_name}</span>
                <span className="text-slate-500 text-[11px]">{meeting.client_company}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Date & Time</span>
                <span className="font-mono text-slate-800 mt-0.5 block">{meeting.date} · {meeting.time}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Participants</span>
                <span className="text-slate-700 mt-0.5 block leading-snug">{meeting.participants}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Status</span>
                <span className="font-mono font-semibold uppercase text-slate-700 mt-0.5 block">{meeting.status}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={handleSimulateReanalysis}
                disabled={isReanalyzing}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Analyze & Retain</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Notes & Transcript (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
            <div>
              <div className="text-xs font-mono text-indigo-600 font-semibold uppercase">Meeting Title</div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 mt-0.5">{meeting.title}</h2>
            </div>

            {/* AI Summary Banner */}
            {meeting.summary && (
              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" /> Executive Takeaways
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{meeting.summary}</p>
              </div>
            )}

            {/* Raw Meeting Notes */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900">Conversation Notes & Details</span>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                {meeting.notes}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MeetMind Memory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  MeetMind Memory
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Synced
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Facts permanently indexed in Hindsight from this conversation:
            </p>

            <div className="space-y-2.5">
              {meeting.memories && meeting.memories.length > 0 ? (
                meeting.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold uppercase tracking-wider text-indigo-700">
                        {mem.category}
                      </span>
                      <span className="text-slate-400">Type: {mem.type}</span>
                    </div>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      ✓ {mem.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No memories tagged to this meeting.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
