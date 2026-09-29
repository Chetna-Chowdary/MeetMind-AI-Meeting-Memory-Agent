import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export interface TimelineItem {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  badge?: string;
  status?: 'completed' | 'current' | 'upcoming';
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative pl-6 space-y-6 ${className}`}>
      {/* Vertical line connecting timeline nodes */}
      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200" />

      {items.map((item, idx) => {
        const isCurrent = item.status === 'current';
        const isCompleted = item.status === 'completed' || !item.status;

        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Node Icon */}
            <div
              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition-colors ${
                isCurrent
                  ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50'
                  : isCompleted
                  ? 'border-emerald-500 text-emerald-500'
                  : 'border-slate-300 text-slate-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : isCurrent ? (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {item.timestamp}
                </span>
              </div>

              {item.subtitle && (
                <p className="text-xs text-slate-500 leading-snug">
                  {item.subtitle}
                </p>
              )}

              {item.content && (
                <div className="pt-2">{item.content}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
