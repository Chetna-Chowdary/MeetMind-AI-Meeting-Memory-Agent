import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Brain,
  Bot,
  Zap,
  Mail,
  Settings,
  Sparkles,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLearnDemo: () => void;
  hindsightConnected?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  onOpenLearnDemo,
  hindsightConnected = true
}) => {
  const sections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'meetings', label: 'Meetings', icon: Calendar },
        { id: 'memory', label: 'Memory Center', icon: Brain, badge: 'Hindsight' }
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'assistant', label: 'AI Assistant', icon: Bot },
        { id: 'prepare', label: 'Prepare Me', icon: Zap, highlight: true },
        { id: 'followups', label: 'Follow-ups', icon: Mail }
      ]
    },
    {
      title: 'System',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-60 bg-slate-950 text-slate-300 flex flex-col h-screen border-r border-slate-800/80 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              MeetMind
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Agent Memory
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Showcase Banner */}
      <div className="px-3 pt-3">
        <button
          onClick={onOpenLearnDemo}
          className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 border border-indigo-500/25 hover:border-indigo-400/50 transition-all group flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="truncate">See Memory Learn</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2.5 py-1">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Subtle active left border indicator instead of huge solid purple block */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        <div className="pt-2 border-t border-slate-900">
          <button
            onClick={() => onNavigate('landing')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Public Landing</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Web</span>
          </button>
        </div>
      </div>

      {/* Hindsight Status Indicator */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/60">
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium text-slate-300">
              Hindsight Engine
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Active
          </span>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-900 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt="User avatar"
            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {currentUser?.name || 'Alex Vance'}
            </div>
            <div className="text-[10px] text-slate-400 truncate font-mono">
              {currentUser?.email || 'demo@meetmind.ai'}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Sign out"
          className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-900 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
