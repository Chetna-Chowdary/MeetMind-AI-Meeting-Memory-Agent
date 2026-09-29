import React from 'react';
import {
  Brain,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Database,
  Calendar,
  Layers,
  MessageSquare,
  Lock,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLearnDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLearnDemo }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="border-b border-slate-900 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/90 border border-indigo-400/30 flex items-center justify-center text-white shadow-xs">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">MeetMind</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#memory-in-action" className="hover:text-white transition-colors">Memory In Action</a>
          <a href="#architecture" className="hover:text-white transition-colors">Hindsight Architecture</a>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLearnDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Demo</span>
          </button>

          <button
            onClick={onEnterApp}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold shadow-xs transition-colors"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-indigo-500/25 text-indigo-300 text-xs font-medium mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Persistent Agent Memory Powered by Hindsight Cloud</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1]">
          Your meetings are remembered.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          MeetMind uses persistent AI memory to turn every conversation into context for the next one.
          Never lose a client requirement, budget ceiling, or timeline fear again.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
          >
            <span>Try MeetMind Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenLearnDemo}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>See How Memory Works</span>
          </button>
        </div>

        {/* Visual Memory Loop */}
        <div className="mt-16 w-full p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-left shadow-2xl relative overflow-hidden">
          <div className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold mb-4">
            The Persistent Memory Loop
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">01. Conversation</div>
                <div className="text-sm font-bold text-white mt-0.5">Meet</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Enter raw notes from your client call.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">02. Extraction</div>
                <div className="text-sm font-bold text-white mt-0.5">Analyze</div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Gemini extracts constraints, budgets, preferences, and risks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 text-indigo-300 flex items-center justify-center mb-3">
                  <Database className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-indigo-300 font-mono">03. Persistence</div>
                <div className="text-sm font-bold text-white mt-0.5">Retain</div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Indexed with multi-strategy TEMPR search in Hindsight bank.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white text-slate-950 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-indigo-600 font-mono font-bold">04. Next Meeting</div>
                <div className="text-sm font-bold text-slate-950 mt-0.5">Prepare Me</div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  One-click executive briefing grounded in memory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto w-full border-t border-slate-900">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold">Workflow</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How MeetMind Works</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-normal">
            A seamless bridge between conversation notes and persistent executive intelligence.
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-sm font-bold text-indigo-400 font-mono">01. Meet</div>
            <h3 className="text-sm font-semibold text-white">Capture Natural Notes</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
              Take notes naturally during client calls. No rigid taxonomy or manual tagging required.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-indigo-400 font-mono">02. Remember</div>
            <h3 className="text-sm font-semibold text-white">Retain in Hindsight</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
              MeetMind extracts preferences, budgets, deadlines, and fears, storing them into your Hindsight memory bank.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-indigo-400 font-mono">03. Recall</div>
            <h3 className="text-sm font-semibold text-white">Multi-Strategy Recall</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
              When meeting again, Hindsight surfaces the exact relevant facts, even if discussed weeks ago.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-bold text-indigo-400 font-mono">04. Prepare</div>
            <h3 className="text-sm font-semibold text-white">Personalized Briefing</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-normal">
              Receive suggested talking points, risk warnings, and draft follow-up emails grounded in memory.
            </p>
          </div>
        </div>
      </section>

      {/* Memory in Action Timeline */}
      <section id="memory-in-action" className="py-20 px-6 max-w-5xl mx-auto w-full border-t border-slate-900">
        <div className="text-center mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 font-semibold">Flagship Journey</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Memory In Action: Sarah Mitchell</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto font-normal">
            "Every meeting makes the next meeting smarter."
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs">
              M1
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono">Meeting 1 · September 10</div>
              <div className="text-sm font-semibold text-white mt-0.5">Mobile application required</div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Learned: Enterprise field team requires responsive mobile-first portal alongside web.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs">
              M2
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono">Meeting 2 · September 18</div>
              <div className="text-sm font-semibold text-white mt-0.5">Technical preference learned</div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Learned: Sarah explicitly prefers React to reduce long-term maintenance overhead.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-mono text-xs">
              M3
            </div>
            <div>
              <div className="text-xs text-slate-500 font-mono">Meeting 3 · September 25</div>
              <div className="text-sm font-semibold text-white mt-0.5">Budget & Primary Concern learned</div>
              <p className="text-xs text-slate-400 mt-1 font-normal">
                Learned: ₹15 lakh budget ceiling. December launch target is critical—slipping past December jeopardizes Q1 board roadmap.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-400/40 flex items-start gap-4 shadow-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-mono text-xs">
              M4
            </div>
            <div>
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider font-mono">
                Meeting 4 · Today (3:00 PM)
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                One-Click "Prepare Me" Briefing
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                MeetMind retrieves all 4 memories from Hindsight. It prepares Alex: "Sarah prefers React, has a ₹15 lakh budget, targets December, and is anxious about the delivery schedule. Focus today's meeting on the milestone gates and API roadmap."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">MeetMind</span>
            <span>· Your meetings are remembered.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Vectorize Hindsight & Google Gemini</span>
            <button
              onClick={onEnterApp}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Sign In →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
