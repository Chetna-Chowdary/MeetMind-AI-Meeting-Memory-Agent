import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, Brain, ArrowRight, Zap, Plus, Settings, X, Sparkles } from 'lucide-react';
import { Client, Meeting, Memory } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  meetings: Meeting[];
  memories: Memory[];
  onNavigate: (view: string, clientId?: string, meetingId?: string) => void;
  onPrepareClient: (clientId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  clients,
  meetings,
  memories,
  onNavigate,
  onPrepareClient
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredClients = clients.filter(
    (c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
  ).slice(0, 3);

  const filteredMeetings = meetings.filter(
    (m) => m.title.toLowerCase().includes(q) || (m.client_name && m.client_name.toLowerCase().includes(q))
  ).slice(0, 3);

  const filteredMemories = memories.filter(
    (m) => m.text.toLowerCase().includes(q) || m.category.toLowerCase().includes(q)
  ).slice(0, 3);

  const actions = [
    {
      id: 'act_prepare_sarah',
      title: 'Prepare Meeting for Sarah Mitchell',
      category: 'Intelligence',
      icon: Zap,
      handler: () => {
        onPrepareClient('client_sarah');
        onClose();
      }
    },
    {
      id: 'act_new_meeting',
      title: 'Add New Meeting & Retain Memories',
      category: 'Actions',
      icon: Plus,
      handler: () => {
        onNavigate('add_meeting');
        onClose();
      }
    },
    {
      id: 'act_view_memory',
      title: 'Open Memory Center',
      category: 'Navigation',
      icon: Brain,
      handler: () => {
        onNavigate('memory');
        onClose();
      }
    },
    {
      id: 'act_assistant',
      title: 'Ask AI Assistant',
      category: 'Intelligence',
      icon: Sparkles,
      handler: () => {
        onNavigate('assistant');
        onClose();
      }
    }
  ];

  const filteredActions = actions.filter((a) => a.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search clients, meetings, memories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Actions
              </div>
              <div className="space-y-0.5">
                {filteredActions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      onClick={act.handler}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-medium text-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{act.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Clients
              </div>
              <div className="space-y-0.5">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      onNavigate('client_profile', client.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-semibold text-[11px]">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{client.name}</div>
                        <div className="text-[11px] text-slate-500">{client.role} · {client.company}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-indigo-600 font-medium">View Profile →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meetings */}
          {filteredMeetings.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Meetings
              </div>
              <div className="space-y-0.5">
                {filteredMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    onClick={() => {
                      onNavigate('meeting_details', undefined, meeting.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs text-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-slate-900 truncate">{meeting.title}</div>
                        <div className="text-[11px] text-slate-500">{meeting.date} · {meeting.client_name}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 ml-2">Open Details →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Memories */}
          {filteredMemories.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Hindsight Memories
              </div>
              <div className="space-y-0.5">
                {filteredMemories.map((mem) => (
                  <button
                    key={mem.id}
                    onClick={() => {
                      onNavigate('memory');
                      onClose();
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs text-slate-800 transition-colors"
                  >
                    <Brain className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase font-mono font-semibold text-indigo-700">
                        {mem.category}
                      </div>
                      <div className="text-slate-700 font-normal truncate mt-0.5">"{mem.text}"</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredActions.length === 0 &&
            filteredClients.length === 0 &&
            filteredMeetings.length === 0 &&
            filteredMemories.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching results for "{query}".
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Navigate with ⌘K · Click to jump</span>
          <span>MeetMind Intelligence</span>
        </div>
      </div>
    </div>
  );
};
