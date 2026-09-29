import React, { useEffect, useState } from 'react';
import {
  Brain,
  Search,
  Filter,
  ShieldCheck,
  Tag,
  Building,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { getAllMemories } from '../api';
import { Memory } from '../types';
import { MemoryDetailModal } from '../components/ui/MemoryDetailModal';

interface MemoryCenterViewProps {
  onPrepareClient: (clientId: string) => void;
  onSelectClient: (clientId: string) => void;
  onAskAI?: (clientId: string, prompt?: string) => void;
}

export const MemoryCenterView: React.FC<MemoryCenterViewProps> = ({
  onPrepareClient,
  onSelectClient,
  onAskAI
}) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeMemoryDetail, setActiveMemoryDetail] = useState<Memory | null>(null);

  const categories = ['All', 'Preference', 'Requirement', 'Concern', 'Budget', 'Decision', 'Commitment'];
  const types = ['All', 'world', 'experience', 'observation'];

  useEffect(() => {
    loadMemories();
  }, [selectedCategory, selectedType]);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await getAllMemories(selectedCategory, selectedType, searchTerm);
      setMemories(data.memories);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMemories();
  };

  const categoryIcons: Record<string, string> = {
    requirement: '🎯',
    preference: '⚙️',
    budget: '💰',
    concern: '⚠️',
    commitment: '📌',
    decision: '⚖️'
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/90 flex items-center justify-center text-indigo-600">
              <Brain className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Memory Center
            </h2>
            <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold ml-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Hindsight Bank: meetmind-demo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            "Everything MeetMind has learned from your conversations." Persistent facts, mental models, and observations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadMemories}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Bank</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Row: Memory Count, Recent Memories, Clients Remembered, Memory Growth */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-indigo-200/90 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Total Stored Facts</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats?.totalMemories ?? memories.length}
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Synced in Hindsight
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Memory Growth</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">+8</span>
          <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-600" /> Retained this week
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Clients Remembered</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {stats?.clientsCount ?? 3}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">Multi-tenant isolated tags</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] text-slate-500 block font-medium">Retrieval Strategies</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">4 (TEMPR)</span>
          <span className="text-[11px] text-slate-500 mt-1 font-mono">Vector · BM25 · Graph · Temporal</span>
        </div>
      </div>

      {/* MEMORY VISUALIZATION (Section 19: Meeting 1 -> Memory -> Meeting 2 -> Memory -> Today -> Personalized AI) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>The Hindsight Persistent Memory Graph</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Concept Visualization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Sep 10</div>
            <div className="font-bold text-white mt-0.5">Meeting 1</div>
            <div className="text-[11px] text-indigo-200 mt-1">Requirement: Mobile App</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Sep 18</div>
            <div className="font-bold text-white mt-0.5">Meeting 2</div>
            <div className="text-[11px] text-indigo-200 mt-1">Preference: React Framework</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">Sep 25</div>
            <div className="font-bold text-white mt-0.5">Meeting 3</div>
            <div className="text-[11px] text-indigo-200 mt-1">Budget: ₹15L · Risk: Dec Freeze</div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-900/60 border border-indigo-500/40">
            <div className="text-[10px] text-indigo-300 font-mono">Today</div>
            <div className="font-bold text-white mt-0.5">Hindsight Recall</div>
            <div className="text-[11px] text-indigo-100 mt-1">Multi-Strategy TEMPR Search</div>
          </div>

          <div className="p-3 rounded-xl bg-white text-slate-950 shadow-md">
            <div className="text-[10px] text-indigo-600 font-mono font-bold">Output</div>
            <div className="font-bold text-slate-950 mt-0.5">Prepare Me</div>
            <div className="text-[11px] text-slate-600 mt-1">Personalized Executive Briefing</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {categories.map((cat) => {
          const count = cat === 'All' ? stats?.totalMemories ?? memories.length : stats?.categories?.[cat] ?? 0;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-xl text-left border transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-medium opacity-80 truncate">{cat}</div>
              <div className="text-base font-bold tracking-tight mt-0.5">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Search & Type Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recalled memories, clients, or technologies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
        </form>

        {/* Type Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase font-mono">Type:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                selectedType === t
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Timeline Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Memory Stream ({memories.length} entries)
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Click any entry to view full context & origin
          </div>
        </div>

        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
          {memories.map((mem) => {
            const dateStr = mem.createdAt?.split(' ')[0] || mem.created_at?.split(' ')[0] || 'Sep 2026';
            const icon = categoryIcons[mem.category.toLowerCase()] || '💡';

            return (
              <div key={mem.id} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-200" />

                <div
                  onClick={() => setActiveMemoryDetail(mem)}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 cursor-pointer"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 font-medium">{dateStr}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-semibold text-indigo-700 flex items-center gap-1 font-mono">
                        <span>{icon}</span>
                        <span>{mem.category}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-400 font-mono text-[10px]">Type: {mem.type}</span>
                    </div>

                    <span className="font-medium text-slate-700 hover:text-indigo-600">
                      {mem.clientName || 'Sarah Mitchell'} ({mem.clientCompany || 'NovaTech Solutions'})
                    </span>
                  </div>

                  <p className="text-slate-900 font-medium text-xs leading-relaxed">
                    "{mem.text}"
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{mem.tags && mem.tags.length > 0 ? mem.tags.join(', ') : 'client, requirement'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Synced
                      </span>
                      <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                        Inspect Context <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {memories.length === 0 && !loading && (
            <div className="p-10 text-center text-xs text-slate-400">
              No memories match the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        memory={activeMemoryDetail}
        isOpen={Boolean(activeMemoryDetail)}
        onClose={() => setActiveMemoryDetail(null)}
        onPrepareClient={onPrepareClient}
        onAskAI={onAskAI}
      />
    </div>
  );
};
