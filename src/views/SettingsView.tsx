import React, { useEffect, useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Brain,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import { getHindsightSettings, updateHindsightSettings, resetDemoData } from '../api';
import { useToast } from '../components/ui/Toast';

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [apiUrl, setApiUrl] = useState('');
  const [bankId, setBankId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getHindsightSettings();
      setConfig(data.config);
      setHealth(data.health);
      setApiUrl(data.config.baseUrl);
      setBankId(data.config.bankId);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await updateHindsightSettings({
        baseUrl: apiUrl,
        bankId,
        apiKey: apiKey || undefined
      });
      setConfig(res.config);
      setHealth(res.health);
      setApiKey('');
      showToast('Settings Updated', 'Hindsight configuration verified & active.', 'success');
    } catch (err: any) {
      showToast('Error Updating Settings', err?.message || 'Failed to update', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all demo meetings and memories to original seed state?')) return;
    try {
      await resetDemoData();
      showToast('Demo Data Restored', 'Seeded with 3 clients, 10 meetings, 24 memories.', 'info');
      setTimeout(() => window.location.reload(), 600);
    } catch (err: any) {
      showToast('Reset Failed', err?.message, 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Settings & Hindsight Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
          Manage the official Hindsight SDK (@vectorize-io/hindsight-client) connection and memory banks.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Hindsight Memory Engine Health</h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {health?.mode || 'Active'}
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">Engine Status</span>
            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
              {health?.healthy ? 'Operational' : 'Synced / Local Cache'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">Memory Bank ID</span>
            <span className="font-mono font-semibold text-indigo-600 text-sm mt-0.5 block">
              {config?.bankId || 'meetmind-demo'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-400 block text-[11px] font-medium">API Key Status</span>
            <span className="font-semibold text-slate-900 text-sm mt-0.5 block">
              {config?.hasApiKey ? `Configured (${config?.maskedApiKey})` : 'Demo / Local Mode'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          {health?.message || 'Hindsight client is active and retaining meeting context.'}
        </p>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-600" />
          Connection Credentials
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Hindsight API URL
          </label>
          <input
            type="text"
            required
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.hindsight.vectorize.io"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Default Cloud: <code className="text-slate-600">https://api.hindsight.vectorize.io</code> | Local Docker: <code className="text-slate-600">http://localhost:8888</code>
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Memory Bank ID
          </label>
          <input
            type="text"
            required
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            placeholder="meetmind-demo"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Isolated tenant memory bank for MeetMind meetings.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Hindsight API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={config?.hasApiKey ? '•••••••••••••••• (leave blank to keep current key)' : 'Enter Hindsight Cloud API Key'}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Obtain an API key from Vectorize.io Hindsight Cloud dashboard.
          </span>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {updating ? 'Testing Connection...' : 'Save & Test Connection'}
          </button>
        </div>
      </form>

      {/* Explainer: How Hindsight Operates in MeetMind */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-3 text-xs text-slate-600">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Hindsight Operations Architecture
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-indigo-700 block font-mono">retain()</span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Extracts facts, constraints, and observations from meeting notes, tagging them by client ID.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-indigo-700 block font-mono">recall()</span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Uses TEMPR multi-strategy search (vector, keyword, graph, temporal) to retrieve relevant context.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-indigo-700 block font-mono">reflect()</span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Performs agentic reasoning across stored memories to synthesize disposition-aware briefings.
            </span>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Reset Demo Data</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Restores the database with Sarah Mitchell, Daniel Carter, Priya Sharma, and 24+ initial memories.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
