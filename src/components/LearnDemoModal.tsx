import React, { useState } from 'react';
import { Brain, Check, Sparkles, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LearnDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchPrepare: () => void;
}

export const LearnDemoModal: React.FC<LearnDemoModalProps> = ({ isOpen, onClose, onLaunchPrepare }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Meeting 1 · Initial Discovery',
      clientSays: 'We need a responsive mobile application alongside the desktop portal for our field operations.',
      meetmindAction: 'Extracted Requirement & Retained into Hindsight bank',
      memory: 'Mobile application required alongside desktop web dashboard.',
      category: 'Requirement',
      icon: '🎯'
    },
    {
      step: 2,
      title: 'Meeting 2 · Tech Evaluation',
      clientSays: 'React is our preferred technology. Our internal engineers already know React, so maintenance overhead stays low.',
      meetmindAction: 'Extracted Technical Preference & Indexed into Hindsight',
      memory: 'Client prefers React over Angular or Vue to align with internal developer skillsets.',
      category: 'Preference',
      icon: '⚙️'
    },
    {
      step: 3,
      title: 'Meeting 3 · Budget & Timeline',
      clientSays: 'Our budget ceiling is ₹15 lakh, and our biggest concern is the delivery timeline. We cannot slip past December.',
      meetmindAction: 'Extracted Budget Constraint + Primary Risk Concern into Hindsight',
      memory: 'Budget discussed: ₹15 lakh ceiling. Delivery timeline is Sarah primary concern due to board commitments.',
      category: 'Concern & Budget',
      icon: '⚠️'
    },
    {
      step: 4,
      title: 'Meeting 4 · Next Conversation',
      clientSays: 'Alex clicks "Prepare Me" before entering the meeting with Sarah Mitchell.',
      meetmindAction: 'Hindsight multi-strategy recall activates -> Gemini synthesizes briefing',
      memory: 'Hyper-personalized briefing created instantly from persistent memory graph.',
      category: 'Intelligence in Action',
      icon: '🧠'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                See MeetMind Learn
                <span className="text-xs font-normal text-indigo-300">· Hindsight Persistent Memory Engine</span>
              </h2>
              <p className="text-xs text-slate-300">
                Watch how individual client conversations compound into persistent intelligence over time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step Selector */}
          <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-4">
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-3 rounded-xl transition-all ${
                  activeStep === idx
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-medium shadow-xs'
                    : 'bg-slate-50 border border-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs text-slate-400 mb-0.5">Step {s.step}</div>
                <div className="text-sm font-semibold truncate">{s.title.split('·')[1] || s.title}</div>
              </button>
            ))}
          </div>

          {/* Active Step Showcase */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-slate-700">
                {steps[activeStep].title}
              </span>
              <span>Hindsight Operation: Retain & Recall</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Left: What the Client Said */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  What Sarah Mitchell Stated
                </div>
                <p className="text-slate-800 text-sm italic font-serif leading-relaxed">
                  "{steps[activeStep].clientSays}"
                </p>
              </div>

              {/* Right: What MeetMind Remembered */}
              <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-2">
                  <span>Hindsight Memory Retained</span>
                  <span>{steps[activeStep].category}</span>
                </div>
                <p className="text-indigo-50 text-sm font-medium leading-relaxed flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{steps[activeStep].memory}</span>
                </p>
                <div className="mt-3 pt-2 border-t border-indigo-800/80 text-xs text-indigo-300 flex items-center justify-between">
                  <span>{steps[activeStep].meetmindAction}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> Synced
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison: Without Memory vs With MeetMind Memory */}
          <div>
            <div className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              The Contrast: Ordinary AI vs. MeetMind Hindsight Memory
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {/* Ordinary Chatbot / Without Memory */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 text-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Without Persistent Memory (Generic AI)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  "Good luck in your meeting with Sarah. Make sure to bring a notepad, ask how her week is going, clarify what their goals are, and ask what tech stack they might like."
                </p>
                <div className="text-xs text-rose-700 font-medium pt-1">
                  ✕ Forgets past agreements · ✕ Asks redundant questions · ✕ Ignores timeline constraints
                </div>
              </div>

              {/* With MeetMind Memory */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 text-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  With MeetMind (Powered by Hindsight)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "Sarah confirmed a <strong>React frontend</strong> with a <strong>₹15 lakh budget ceiling</strong>. Her primary fear is missing the <strong>December launch</strong> and disrupting Q1 investor milestones. <em>Focus today's sync on API integration milestone gates and timeline certainty.</em>"
                </p>
                <div className="text-xs text-indigo-700 font-medium pt-1">
                  ✓ Recalls budget limits · ✓ Honors technical choices · ✓ Proactively addresses risks
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 disabled:opacity-40 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Previous Step
            </button>
            <button
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-3 py-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-200 shadow-2xs hover:bg-slate-100 rounded-lg transition-colors"
            >
              Next Step
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onLaunchPrepare();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Try "Prepare Me" for Sarah
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
