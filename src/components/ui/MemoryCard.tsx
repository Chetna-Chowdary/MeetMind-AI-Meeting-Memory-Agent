import React from 'react';
import { Brain, Calendar, Clock, Tag, ExternalLink, ShieldCheck } from 'lucide-react';
import { Memory } from '../../types';
import { Badge } from './Badge';

interface MemoryCardProps {
  memory: Memory;
  onClick?: () => void;
  showClient?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onClick,
  showClient = true
}) => {
  const categoryIcons: Record<string, string> = {
    budget: '💰',
    preference: '⚙️',
    requirement: '🎯',
    concern: '⚠️',
    decision: '⚖️',
    commitment: '📌'
  };

  const getCategoryVariant = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'requirement':
        return 'emerald';
      case 'concern':
        return 'rose';
      case 'budget':
        return 'amber';
      case 'preference':
      default:
        return 'indigo';
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm">
              {categoryIcons[memory.category.toLowerCase()] || '💡'}
            </span>
            <Badge variant={getCategoryVariant(memory.category) as any} size="sm">
              {memory.category}
            </Badge>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {memory.type}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Hindsight</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed group-hover:text-indigo-950 transition-colors">
          "{memory.text}"
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {memory.created_at || 'Sep 29, 2026'}
          </span>
          {showClient && memory.client_name && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-indigo-600 font-sans font-semibold truncate max-w-[140px]">
                {memory.client_name}
              </span>
            </>
          )}
        </div>

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-500">
              {memory.tags.slice(0, 2).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
