import React from 'react';
import { Building, Mail, Phone, Calendar, Brain, ArrowRight, Zap, Plus } from 'lucide-react';
import { Client } from '../../types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface ClientCardProps {
  client: Client;
  onSelect: (clientId: string) => void;
  onPrepare: (clientId: string) => void;
  onNewMeeting: (clientId: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onSelect,
  onPrepare,
  onNewMeeting
}) => {
  return (
    <div
      onClick={() => onSelect(client.id)}
      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar src={client.avatar} name={client.name} size="lg" status="online" />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors truncate">
                {client.name}
              </h3>
              <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{client.company}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-normal truncate">
                {client.role}
              </div>
            </div>
          </div>

          <Badge variant="indigo" size="sm" dot>
            {client.memories_count ?? 8} memories
          </Badge>
        </div>

        {/* Contact snippet */}
        <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
          {client.phone && (
            <div className="flex items-center gap-2 text-slate-500">
              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNewMeeting(client.id);
          }}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
          <span>Meeting</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrepare(client.id);
          }}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Zap className="w-3 h-3 text-indigo-600" />
          <span>Prepare Me</span>
        </button>
      </div>
    </div>
  );
};
