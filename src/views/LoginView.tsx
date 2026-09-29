import React, { useState } from 'react';
import { Brain, ArrowRight, ShieldCheck, Key, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { login } from '../api';
import { User } from '../types';
import { useToast } from '../components/ui/Toast';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onOpenLearnDemo: () => void;
  onViewLanding: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenLearnDemo, onViewLanding }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('demo@meetmind.ai');
  const [password, setPassword] = useState('MeetMindDemo123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(email, password);
      showToast('Welcome Back', `Signed in as ${data.user.name}.`, 'success');
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials');
      showToast('Login Failed', err?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@meetmind.ai');
    setPassword('MeetMindDemo123!');
    setLoading(true);
    setError(null);

    try {
      const data = await login('demo@meetmind.ai', 'MeetMindDemo123!');
      showToast('Welcome to MeetMind', 'Signed in as Alex Vance (Demo Director).', 'success');
      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
      showToast('Demo Login Failed', err?.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div
          onClick={onViewLanding}
          className="inline-flex items-center gap-3 cursor-pointer group mb-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">MeetMind</h1>
        <p className="text-xs text-slate-400 mt-1 font-mono">Your meetings are remembered.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-7 relative z-10">
        <div className="mb-6">
          <h2 className="text-base font-bold text-white">Sign in to your account</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-normal">
            Access your client meetings and Hindsight memory bank.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 disabled:opacity-50 text-xs font-bold shadow-xs transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 1-Click Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-semibold transition-all group"
            >
              <Key className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>One-Click Demo Login</span>
            </button>
          </div>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Hackathon Demo Credentials
          </div>
          <div className="space-y-0.5 text-slate-400">
            <div>Email: <span className="text-slate-200">demo@meetmind.ai</span></div>
            <div>Password: <span className="text-slate-200">MeetMindDemo123!</span></div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onViewLanding}
            className="hover:text-white transition-colors"
          >
            ← Public Landing
          </button>
          <button
            onClick={onOpenLearnDemo}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            See Memory Demo
          </button>
        </div>
      </div>
    </div>
  );
};
