import React from 'react';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';

interface MeetMindInsightProps {
  headline?: string;
  insight: string;
  recommendation?: string;
  onAction?: () => void;
  actionLabel?: string;
  variant?: 'card' | 'banner' | 'compact';
  badgeText?: string;
}

export const MeetMindInsight: React.FC<MeetMindInsightProps> = ({
  headline = 'MeetMind Insight',
  insight,
  recommendation,
  onAction,
  actionLabel = 'Prepare Briefing →',
  variant = 'card',
  badgeText = 'Hindsight Grounded'
}) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/90 text-xs">
        <div className="w-5 h-5 rounded-md bg-indigo-600/10 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
          <Sparkles className="w-3 h-3 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
            <span>{headline}</span>
            <span className="text-[10px] text-indigo-500 font-mono font-normal">· {badgeText}</span>
          </div>
          <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed">{insight}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-5 shadow-sm border border-indigo-500/20 ai-glow">
      {/* Background ambient mesh */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase font-mono text-indigo-300">
              {headline}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              · {badgeText}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-100 leading-snug">
            "{insight}"
          </p>

          {recommendation && (
            <p className="text-xs text-indigo-200/90 font-normal leading-relaxed">
              💡 {recommendation}
            </p>
          )}
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-semibold shadow-xs shrink-0 transition-all hover:gap-2"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
