import React from 'react';
import { Brain, ShieldCheck, X, Calendar, User, Tag, Zap, Bot, ArrowRight } from 'lucide-react';
import { Memory } from '../../types';

interface MemoryDetailModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onPrepareClient?: (clientId: string) => void;
  onAskAI?: (clientId: string, prompt: string) => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  memory,
  isOpen,
  onClose,
  onPrepareClient,
  onAskAI
}) => {
  if (!isOpen || !memory) return null;

  const dateStr = memory.createdAt?.split(' ')[0] || memory.created_at?.split(' ')[0] || 'September 2026';
  const clientId = memory.clientId || memory.client_id || 'client_sarah';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Memory Context
              </div>
              <div className="text-[11px] text-indigo-300">
                Hindsight Bank: meetmind-demo
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 overflow-y-auto max-h-[75vh]">
          {/* Main Memory Quote */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-slate-900 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
              Retained Fact:
            </span>
            <p className="text-sm font-semibold leading-relaxed">
              "{memory.text}"
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[11px]">Category</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{memory.category}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[11px]">Memory Type</span>
              <span className="font-mono font-semibold text-slate-900 mt-0.5 block capitalize">{memory.type}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[11px]">Date Retained</span>
              <span className="font-mono text-slate-800 mt-0.5 block">{dateStr}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 block text-[11px]">Sync Status</span>
              <span className="font-mono text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Retained
              </span>
            </div>
          </div>

          {/* Why it Matters Context */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>Why This Memory Matters</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              MeetMind automatically loads this constraint whenever preparing for meetings with {memory.clientName || 'this client'}.
              It ensures you don't violate stated budget caps or schedule anxieties during negotiation.
            </p>
          </div>

          {/* Tags */}
          {memory.tags && memory.tags.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Tags:</span>
              <span className="font-mono text-slate-700">{memory.tags.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {onAskAI && (
              <button
                onClick={() => {
                  onAskAI(clientId, `Tell me more about: "${memory.text}"`);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ask AI</span>
              </button>
            )}

            {onPrepareClient && (
              <button
                onClick={() => {
                  onPrepareClient(clientId);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Prepare Meeting</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
