import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Zap,
  ArrowRight,
  FileText,
  Building,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { getMeetings } from '../api';
import { Meeting } from '../types';

interface MeetingsViewProps {
  onSelectMeeting: (meetingId: string) => void;
  onPrepareClient: (clientId: string) => void;
  onNewMeeting: () => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  onSelectMeeting,
  onPrepareClient,
  onNewMeeting
}) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeetings();
  }, [activeTab]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings(activeTab);
      setMeetings(data);
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Meetings</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Past and upcoming conversations with Hindsight memory correlation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['all', 'upcoming', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={onNewMeeting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Meeting</span>
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
          >
            <div className="space-y-2.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  {m.client_name || 'Client'}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {m.client_company || 'Company'}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {m.date} · {m.time}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                    m.status === 'upcoming' ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <h3
                onClick={() => onSelectMeeting(m.id)}
                className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
              >
                {m.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {m.summary || m.notes}
              </p>

              {/* Subtle AI Indicator: 🧠 8 relevant memories */}
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                  <Brain className="w-3 h-3 text-indigo-600" />
                  <span>8 relevant memories</span>
                </span>

                {m.key_takeaways && (
                  <span className="text-[11px] text-slate-500 truncate">
                    Takeaways: {m.key_takeaways}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectMeeting(m.id)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
              >
                View
              </button>

              <button
                onClick={() => onPrepareClient(m.client_id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Prepare</span>
              </button>
            </div>
          </div>
        ))}

        {meetings.length === 0 && !loading && (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No meetings found in this tab.
          </div>
        )}
      </div>
    </div>
  );
};
