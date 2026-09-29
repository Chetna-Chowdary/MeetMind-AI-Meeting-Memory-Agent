import React from 'react';
import { Bell, Calendar, Brain, Mail, CheckCircle2, X, Zap } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'meeting' | 'memory' | 'followup' | 'system';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  actionText?: string;
  actionHandler?: () => void;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onPrepareClient: (clientId: string) => void;
  onNavigate: (view: string, clientId?: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onPrepareClient,
  onNavigate
}) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      type: 'meeting',
      title: 'Upcoming Meeting Today: Sarah Mitchell',
      description: 'Pre-Launch Architecture & API Milestone Sync at 3:00 PM. 8 relevant memories available.',
      time: 'In 3 hours',
      unread: true,
      actionText: 'Prepare Me',
      actionHandler: () => {
        onPrepareClient('client_sarah');
        onClose();
      }
    },
    {
      id: 'notif_2',
      type: 'memory',
      title: 'Hindsight Synced 8 Facts',
      description: 'Persistent bank "meetmind-demo" updated with NovaTech timeline and budget constraints.',
      time: '15 mins ago',
      unread: true,
      actionText: 'View Memory Center',
      actionHandler: () => {
        onNavigate('memory');
        onClose();
      }
    },
    {
      id: 'notif_3',
      type: 'followup',
      title: 'Pending Follow-up Draft',
      description: 'Proposal follow-up ready for Daniel Carter at GreenGrid Systems.',
      time: '2 hours ago',
      unread: false,
      actionText: 'Open Follow-up',
      actionHandler: () => {
        onNavigate('followups', 'client_daniel');
        onClose();
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-200/90 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-sm text-slate-900">Notifications</span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-indigo-700 bg-indigo-50 rounded-full font-bold">
              2 unread
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3 space-y-2">
          {notifications.map((n) => {
            let icon = <Calendar className="w-3.5 h-3.5 text-indigo-600" />;
            if (n.type === 'memory') icon = <Brain className="w-3.5 h-3.5 text-indigo-600" />;
            if (n.type === 'followup') icon = <Mail className="w-3.5 h-3.5 text-indigo-600" />;

            return (
              <div
                key={n.id}
                className={`p-3 rounded-xl border transition-all ${
                  n.unread
                    ? 'bg-indigo-50/40 border-indigo-100/90 text-slate-900'
                    : 'bg-white border-slate-100 text-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                    {icon}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{n.description}</p>
                {n.actionText && n.actionHandler && (
                  <button
                    onClick={n.actionHandler}
                    className="mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>{n.actionText}</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-900 font-medium"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
