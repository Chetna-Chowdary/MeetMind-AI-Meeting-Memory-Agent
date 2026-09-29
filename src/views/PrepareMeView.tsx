import React, { useEffect, useState } from 'react';
import {
  Zap,
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Mail,
  Copy,
  Check,
  RefreshCw,
  Building,
  Target,
  ArrowRight,
  Layers,
  Clock
} from 'lucide-react';
import { prepareMe, getClients } from '../api';
import { Client, Memory, PrepareMeBrief } from '../types';
import { useToast } from '../components/ui/Toast';

interface PrepareMeViewProps {
  initialClientId?: string;
  onGenerateFollowUp: (clientId: string) => void;
}

export const PrepareMeView: React.FC<PrepareMeViewProps> = ({
  initialClientId,
  onGenerateFollowUp
}) => {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || 'client_sarah');
  const [meetingTitle, setMeetingTitle] = useState('Pre-Launch Architecture & API Milestone Sync');
  const [brief, setBrief] = useState<PrepareMeBrief | null>(null);
  const [recalledMemories, setRecalledMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      if (!selectedClientId && data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      handlePrepare();
    }
  }, [selectedClientId]);

  const handlePrepare = async () => {
    if (!selectedClientId) return;
    setLoading(true);
    try {
      const res = await prepareMe(selectedClientId, meetingTitle);
      setBrief(res.brief);
      setRecalledMemories(res.recalledMemories);
      showToast('Executive Briefing Generated', `Recalled ${res.recalledMemories.length} facts from Hindsight.`, 'memory');
    } catch (err) {
      console.error('Failed to prepare briefing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!brief) return;
    const text = `
EXECUTIVE MEETING BRIEF
Client: ${brief.clientName} (${brief.clientCompany} - ${brief.clientRole})
Objective: ${brief.meetingObjective}

WHAT YOU SHOULD REMEMBER:
${brief.whatYouShouldRemember.map((f) => `• ${f}`).join('\n')}

RISKS & IMPORTANT CONCERNS:
${brief.importantConcerns.map((c) => `• ${c}`).join('\n')}

OPEN FOLLOW-UPS:
${brief.openFollowUps.map((o) => `• ${o}`).join('\n')}

SUGGESTED TALKING POINTS:
${brief.suggestedTalkingPoints.map((t) => `• ${t}`).join('\n')}

SUGGESTED QUESTIONS:
${brief.suggestedQuestions.map((q) => `• ${q}`).join('\n')}

RECOMMENDED NEXT ACTION:
${brief.recommendedFocus}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to Clipboard', 'Executive briefing copied.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/90 flex items-center justify-center text-indigo-600">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Prepare Me
            </h2>
            <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold ml-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Hindsight Recall
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
            Executive pre-meeting briefing synthesized from persistent relationship memory.
          </p>
        </div>

        {/* Client Selector & Regenerate */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.company}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrepare}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Brief</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <Brain className="w-8 h-8 text-indigo-600 animate-pulse mx-auto" />
          <div className="text-sm font-semibold text-slate-900">
            Recalling memories from Hindsight memory bank...
          </div>
          <div className="text-xs text-slate-500 max-w-sm mx-auto">
            Retrieving past constraints, tech choices, budgets, and commitments for {selectedClient?.name || 'client'}.
          </div>
        </div>
      )}

      {!loading && brief && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Brief Document Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 md:p-8 space-y-6">
            {/* Brief Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="text-[11px] font-mono tracking-wider text-indigo-600 uppercase font-semibold">
                  Executive Meeting Brief
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
                  Prepare for {brief.clientName}
                </h3>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {brief.clientRole} · <span className="text-indigo-600">{brief.clientCompany}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-mono flex items-center gap-2">
                  <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                    <Brain className="w-3 h-3" /> {recalledMemories.length || 8} relevant memories recalled
                  </span>
                  <span>·</span>
                  <span>Bank: meetmind-demo</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                </button>

                <button
                  onClick={() => onGenerateFollowUp(selectedClientId)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Draft Follow-Up</span>
                </button>
              </div>
            </div>

            {/* MEETING OBJECTIVE */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-600" />
                Strategic Meeting Objective
              </div>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed font-sans">
                {brief.meetingObjective}
              </p>
            </div>

            {/* TWO COLUMNS: WHAT YOU SHOULD REMEMBER & RISKS & CONCERNS */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* What You Should Remember */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" />
                  🧠 What You Should Remember
                </div>
                <div className="space-y-2 text-xs text-slate-800">
                  {brief.whatYouShouldRemember.map((fact, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-indigo-600 font-bold">✓</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Concerns */}
              <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-2.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  ⚠️ Risks & Important Concerns
                </div>
                <div className="space-y-2 text-xs text-slate-800">
                  {brief.importantConcerns.map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* OPEN FOLLOW-UPS */}
            {brief.openFollowUps.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  📌 Open Commitments & Follow-ups
                </div>
                <div className="space-y-2 text-xs text-slate-800">
                  {brief.openFollowUps.map((o, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TWO COLUMNS: SUGGESTED TALKING POINTS & QUESTIONS */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Suggested Talking Points */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  💡 Suggested Talking Points
                </div>
                <div className="space-y-2.5 text-xs text-slate-800">
                  {brief.suggestedTalkingPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="font-mono text-indigo-600 text-[11px] font-bold shrink-0">0{idx + 1}.</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  ❓ Suggested Strategic Questions
                </div>
                <div className="space-y-2.5 text-xs text-slate-800">
                  {brief.suggestedQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 leading-relaxed italic font-serif">
                      <span className="text-indigo-600 font-sans font-bold not-italic shrink-0">Q:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RECOMMENDED NEXT ACTION */}
            <div className="p-5 rounded-xl bg-slate-950 text-white space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                🎯 Recommended Executive Focus
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {brief.recommendedFocus}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
