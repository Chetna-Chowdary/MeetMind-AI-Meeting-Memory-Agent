import React from 'react';
import { Calendar, Clock, User, Building, Brain, ArrowRight, Zap, FileText } from 'lucide-react';
import { Meeting } from '../../types';
import { Badge } from './Badge';

interface MeetingCardProps {
  meeting: Meeting;
  onSelect: (meetingId: string) => void;
  onPrepare: (clientId: string) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  onSelect,
  onPrepare
}) => {
  const isUpcoming = meeting.status === 'upcoming';

  return (
    <div
      onClick={() => onSelect(meeting.id)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 group cursor-pointer"
    >
      <div className="space-y-2.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            {meeting.client_name || 'Client'}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Building className="w-3 h-3 text-slate-400" />
            {meeting.client_company || 'Company'}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <Badge variant={isUpcoming ? 'emerald' : 'slate'} size="sm" dot>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </Badge>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {meeting.title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {meeting.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {meeting.time || '11:00 AM'}
          </span>
          {meeting.memory_count !== undefined && meeting.memory_count > 0 && (
            <span className="text-indigo-600 font-semibold flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {meeting.memory_count} memories indexed
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrepare(meeting.client_id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold border border-indigo-200/80 transition-colors shadow-2xs"
        >
          <Zap className="w-3 h-3 text-indigo-600" />
          <span>Prepare Brief</span>
        </button>

        <button
          onClick={() => onSelect(meeting.id)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
