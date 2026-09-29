import React, { useEffect, useState } from 'react';
import {
  Mail,
  Brain,
  Copy,
  Check,
  RotateCcw,
  Edit3,
  Building,
  ShieldCheck,
  Sparkles,
  User,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { generateFollowUpEmail, getClients } from '../api';
import { Client } from '../types';
import { useToast } from '../components/ui/Toast';

interface FollowUpEmailViewProps {
  initialClientId?: string;
  initialMeetingId?: string;
}

export const FollowUpEmailView: React.FC<FollowUpEmailViewProps> = ({
  initialClientId,
  initialMeetingId
}) => {
  const { showToast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || 'client_sarah');
  const [meetingId, setMeetingId] = useState<string>(initialMeetingId || '');
  const [customNotes, setCustomNotes] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      handleGenerate();
    }
  }, [selectedClientId]);

  const handleGenerate = async () => {
    if (!selectedClientId) return;
    setLoading(true);
    try {
      const res = await generateFollowUpEmail(selectedClientId, meetingId || undefined, customNotes || undefined);
      setSubject(res.subject);
      setBody(res.body);
      setRecipient(res.recipient);
      setIsEditing(false);
      showToast('Follow-up Email Generated', 'Weaving past commitments and preferences.', 'memory');
    } catch (err) {
      console.error('Error generating email:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    showToast('Copied to Clipboard', 'Email text and subject line copied.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            Follow-up Intelligence Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
            Personalized post-meeting correspondence grounded in historical commitments and preferences.
          </p>
        </div>

        {/* Client Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Client:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <Brain className="w-8 h-8 text-indigo-600 animate-pulse mx-auto" />
          <div className="text-sm font-semibold text-slate-900">
            Synthesizing follow-up from Hindsight memory...
          </div>
          <div className="text-xs text-slate-500 max-w-sm mx-auto">
            Weaving past commitments, tech choices, and meeting notes together into an executive email.
          </div>
        </div>
      )}

      {/* 3-Column AI Writing Workspace */}
      {!loading && subject && (
        <div className="grid lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* LEFT COLUMN: Meeting Context (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Meeting Context
              </h3>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Recipient</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{recipient?.name}</span>
                  <span className="text-slate-500 text-[11px]">{recipient?.company}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
                  <span className="font-mono text-slate-800 text-[11px] mt-0.5 block">{recipient?.email}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Source Meeting</span>
                  <span className="font-medium text-slate-900 mt-0.5 block leading-snug">
                    Strategic Scope & Milestone Sync
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Generated Email Workspace (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-5">
              {/* Meta bar */}
              <div className="border-b border-slate-100 pb-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="w-16 font-semibold text-slate-700 font-mono">To:</span>
                  <span className="text-slate-900 font-medium">
                    {recipient?.name} &lt;{recipient?.email}&gt;
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-16 font-semibold text-slate-700 font-mono">Subject:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <span className="font-bold text-slate-900">{subject}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Personalized using 6 memories from Hindsight bank</span>
                </div>
              </div>

              {/* Email Body */}
              <div>
                {isEditing ? (
                  <textarea
                    rows={12}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-300 text-xs text-slate-800 font-sans focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed font-normal">
                    {body}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Preview Email' : 'Edit Email'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Email'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Remembered Client Context (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                Contextual Memories Injected
              </h3>

              <p className="text-[11px] text-slate-500 leading-snug">
                The follow-up was tailored using these remembered client facts:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-mono text-indigo-700 font-semibold uppercase">Preference</div>
                  <div className="text-slate-800 text-[11px] font-medium mt-0.5">
                    React frontend architecture
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-mono text-indigo-700 font-semibold uppercase">Budget Cap</div>
                  <div className="text-slate-800 text-[11px] font-medium mt-0.5">
                    ₹15 lakh ceiling for Phase 1
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] font-mono text-indigo-700 font-semibold uppercase">Communication</div>
                  <div className="text-slate-800 text-[11px] font-medium mt-0.5">
                    Prefers weekly email executive briefs
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100">
                  <div className="text-[10px] font-mono text-rose-700 font-semibold uppercase">Primary Anxiety</div>
                  <div className="text-slate-800 text-[11px] font-medium mt-0.5">
                    Delivery must not slip past December
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
