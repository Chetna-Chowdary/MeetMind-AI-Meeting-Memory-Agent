import React from 'react';
import { Search, Bell, Plus, Zap, Menu } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewMeeting: () => void;
  onPrepareMe: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onToggleMobileMenu?: () => void;
  currentUser: User | null;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onNewMeeting,
  onPrepareMe,
  onOpenSearch,
  onOpenNotifications,
  onToggleMobileMenu,
  currentUser
}) => {
  return (
    <header className="h-14 px-4 sm:px-6 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Title & Context */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-[11px] text-slate-500 font-normal truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Quick Search (⌘K), Notifications & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search ⌘K trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 text-slate-500 hover:bg-slate-100 hover:text-slate-900 text-xs font-normal transition-colors"
          title="Global Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-500 bg-white rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
        </button>

        <div className="hidden sm:block h-4 w-px bg-slate-200" />

        {/* Quick Actions */}
        <button
          onClick={onPrepareMe}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 hover:bg-indigo-100/80 text-xs font-semibold transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Prepare Me</span>
        </button>

        <button
          onClick={onNewMeeting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Meeting</span>
        </button>

        {/* Avatar */}
        <div className="hidden sm:flex items-center pl-1">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt="User avatar"
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
        </div>
      </div>
    </header>
  );
};
