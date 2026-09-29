import React, { useEffect, useState } from 'react';
import {
  Brain,
  Calendar,
  Clock,
  User,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { createMeetingAndLearn, getClients } from '../api';
import { Client, Memory } from '../types';
import { useToast } from '../components/ui/Toast';

interface AddMeetingViewProps {
  initialClientId?: string;
  onMeetingCreated: (meetingId: string) => void;
  onPrepareClient: (clientId: string) => void;
}

export const AddMeetingView: React.FC<AddMeetingViewProps> = ({
  initialClientId,
  onMeetingCreated,
  onPrepareClient
}) => {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(initialClientId || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00 AM');
  const [participants, setParticipants] = useState('Alex Vance, Sarah Mitchell');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    meetingId: string;
    summary: string;
    keyTakeaways: string[];
    newMemories: Memory[];
  } | null>(null);

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      if (!clientId && data.length > 0) {
        setClientId(data[0].id);
      }
    });
  }, []);

  const handlePreFillSarah = () => {
    setClientId('client_sarah');
    setTitle('Phase 1 Execution & Architecture Alignment');
    setDate('2026-09-29');
    setTime('3:00 PM');
    setParticipants('Alex Vance, Sarah Mitchell, Lead Frontend Architect');
    setNotes(
      `Reviewed final scope checklist with Sarah Mitchell.
Sarah reiterated: "React is our non-negotiable frontend preference. Our internal front-end team is already trained in React."
The approved Phase 1 budget envelope is strictly capped at ₹15 lakh ceiling.
Crucial schedule constraint: Sarah emphasized that target launch must be December before the holiday freeze.
Her primary concern: "Our biggest worry is the delivery timeline. Slipping into January will jeopardize our board presentation."
Alex agreed to deliver a formal technical proposal with milestone gates before next week.`
    );
    showToast('Demo Script Loaded', 'Sarah Mitchell Phase 1 Scope loaded.', 'info');
  };

  const handlePreFillDaniel = () => {
    setClientId('client_daniel');
    setTitle('GreenGrid Real-Time Telemetry Benchmark');
    setDate('2026-09-29');
    setTime('1:30 PM');
    setParticipants('Alex Vance, Daniel Carter, Systems Architect');
    setNotes(
      `Technical deep dive on the AWS EKS ingestion engine.
Daniel reiterated their SLA requirement: Ingestion latency must strictly stay sub-50ms for live power grid readings.
Approved POC budget: $45,000 authorized for 4-week validation sprint.
Security requirement: All data pipelines must comply with upcoming Q4 SOC2 Type II audit.
Daniel committed to sending over sanitized JSON payload dumps by this Friday.`
    );
    showToast('Demo Script Loaded', 'Daniel Carter Telemetry Benchmark loaded.', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !title || !notes) return;

    setLoading(true);
    try {
      const res = await createMeetingAndLearn({
        clientId,
        title,
        date,
        time,
        participants,
        notes
      });

      setResult({
        message: res.message,
        meetingId: res.meetingId,
        summary: res.summary,
        keyTakeaways: res.keyTakeaways,
        newMemories: res.newMemories
      });

      showToast('Meeting Saved & Retained', `${res.newMemories.length} new facts retained in Hindsight.`, 'memory');
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to save meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Add Meeting & Retain Persistent Memory
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
          Save your notes, analyze with Gemini AI, and retain structured facts into Hindsight Cloud.
        </p>
      </div>

      {/* Quick Demo Pre-fill Shortcuts */}
      <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          Hackathon Quick-Test Scripts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePreFillSarah}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-indigo-400 hover:text-indigo-900 font-semibold transition-colors shadow-2xs"
          >
            Load Sarah Mitchell (Flagship Demo)
          </button>
          <button
            type="button"
            onClick={handlePreFillDaniel}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-indigo-400 hover:text-indigo-900 font-semibold transition-colors shadow-2xs"
          >
            Load Daniel Carter
          </button>
        </div>
      </div>

      {/* Result Card: "MeetMind learned N new memories" */}
      {result && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-400/40 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-tight">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{result.message}</span>
            </div>
            <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Retained in Hindsight Bank: meetmind-demo
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-300 font-mono">
              Newly Retained Memories
            </div>
            <div className="space-y-2">
              {result.newMemories.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-indigo-500/20 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block mb-0.5 font-mono">
                      {m.category}
                    </span>
                    <span className="text-slate-100 font-medium">✓ {m.text}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                    Retained
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-800/80 flex items-center justify-between">
            <button
              onClick={() => setResult(null)}
              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Add Another Meeting
            </button>

            <button
              onClick={() => onPrepareClient(clientId)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Prepare Me for Next Meeting →</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Input Form */}
      {!result && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Client</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.company} ({c.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meeting Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Budget & Architecture Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Time</label>
              <input
                type="text"
                placeholder="e.g. 3:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Participants</label>
              <input
                type="text"
                placeholder="e.g. Alex Vance, Sarah Mitchell"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">Raw Meeting Notes</label>
              <span className="text-[11px] text-slate-400 font-mono">Gemini extracts facts; Hindsight retains them</span>
            </div>
            <textarea
              required
              rows={8}
              placeholder="Paste raw conversation notes, client preferences, budget mentions, deadlines, or concerns..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all"
            >
              {loading ? (
                <>
                  <Brain className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Analyzing & Retaining in Hindsight...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Save Meeting & Learn</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
