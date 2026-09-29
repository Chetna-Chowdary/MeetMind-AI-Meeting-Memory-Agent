import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowRight,
  Brain,
  Calendar,
  Building,
  Mail,
  Phone,
  Zap,
  Filter,
  Grid,
  List,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getClients, createClient } from '../api';
import { Client } from '../types';

interface ClientsViewProps {
  onSelectClient: (clientId: string) => void;
  onPrepareClient: (clientId: string) => void;
  onNewMeetingForClient: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  onSelectClient,
  onPrepareClient,
  onNewMeetingForClient
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.name || !newClientData.company || !newClientData.email) return;

    try {
      await createClient(newClientData);
      setShowAddModal(false);
      setNewClientData({ name: '', company: '', role: '', email: '', phone: '', notes: '' });
      await loadClients();
    } catch (err) {
      console.error('Failed to create client:', err);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Clients</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Understand every relationship through remembered context.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Grid / List toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, company, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none bg-transparent"
          />
        </div>
        <span className="text-[11px] text-slate-400 font-mono pr-2">
          {filteredClients.length} clients
        </span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      client.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={client.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                      {client.name}
                    </h3>
                    <div className="text-xs text-slate-600 truncate font-medium">
                      {client.role}
                    </div>
                    <div className="text-xs text-indigo-700 font-semibold truncate flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-indigo-500" />
                      <span>{client.company}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Meetings</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {client.meetings_count ?? 3} conversations
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Hindsight Memory</span>
                    <span className="font-semibold text-indigo-600 flex items-center gap-1 mt-0.5 font-mono">
                      <Brain className="w-3.5 h-3.5 text-indigo-500" />
                      {client.memories_count ?? 8} facts
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="truncate flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="truncate flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectClient(client.id)}
                  className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors text-center"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onPrepareClient(client.id)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Prepare</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={client.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{client.name}</div>
                  <div className="text-xs text-slate-500">{client.role} · {client.company}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
                <div className="hidden md:block">
                  <span className="text-[11px] text-slate-400 block">Meetings</span>
                  <span className="font-medium text-slate-900">{client.meetings_count ?? 3}</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-[11px] text-slate-400 block">Hindsight Memory</span>
                  <span className="font-semibold text-indigo-600 font-mono">{client.memories_count ?? 8} facts</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectClient(client.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onPrepareClient(client.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Prepare</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add New Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Mitchell"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NovaTech Solutions"
                  value={newClientData.company}
                  onChange={(e) => setNewClientData({ ...newClientData, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Product Director"
                  value={newClientData.role}
                  onChange={(e) => setNewClientData({ ...newClientData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
