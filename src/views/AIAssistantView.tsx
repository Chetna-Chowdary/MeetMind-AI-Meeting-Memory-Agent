import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Brain,
  Send,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight,
  Zap,
  Tag,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';
import { askAIAssistant, getClients } from '../api';
import { Client, Memory } from '../types';
import { MemoryDetailModal } from '../components/ui/MemoryDetailModal';

interface AIAssistantViewProps {
  initialClientId?: string;
  initialPrompt?: string;
  onPrepareClient: (clientId: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memoriesUsed?: string[];
  source?: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  initialClientId,
  initialPrompt,
  onPrepareClient
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || 'client_sarah');
  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [activeMemoryInspection, setActiveMemoryInspection] = useState<Memory | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hello Alex! I am your MeetMind intelligence agent. Every answer is grounded in persistent facts recalled from your Hindsight memory bank. Ask me anything about previous client discussions, commitments, technology preferences, or budgets.',
      source: 'Hindsight Memory Bank',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      if (!selectedClientId && data.length > 0) {
        setSelectedClientId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const queryPresets = [
    { title: 'What do we know about Sarah?', prompt: 'What do we know about Sarah Mitchell from our previous meetings?' },
    { title: "What are Sarah's main concerns?", prompt: "What are Sarah Mitchell's primary concerns and anxieties?" },
    { title: 'What tech stack does Sarah prefer?', prompt: 'What front-end technology does Sarah prefer and why?' },
    { title: 'What was discussed in our last meeting?', prompt: 'What was discussed in our last meeting with Sarah Mitchell?' },
    { title: 'What did we promise to follow up on?', prompt: 'What commitments or action items did we promise Sarah Mitchell?' },
    { title: 'Daniel Carter requirements', prompt: 'What are Daniel Carter and GreenGrid Systems key latency and compliance requirements?' }
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await askAIAssistant(query, selectedClientId || undefined, history);

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        memoriesUsed: res.memoriesUsed,
        source: res.source,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast_err_${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error consulting the Hindsight memory bank. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const activeMemories = lastAssistantMessage?.memoriesUsed || [];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            AI Intelligence Workspace
            <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1 font-semibold ml-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Hindsight Grounded
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Query across client histories with zero loss of context.
          </p>
        </div>

        {/* Client Focus Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Focus:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="">Global Bank (All Clients)</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Column Workspace */}
      <div className="flex-1 grid lg:grid-cols-12 gap-5 min-h-0 overflow-hidden">
        {/* LEFT COLUMN: Query Presets & History (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 overflow-y-auto space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Suggested Inquiries
          </div>

          <div className="space-y-1.5">
            {queryPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(preset.prompt)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 text-slate-700 text-xs transition-all group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-indigo-950 flex items-center justify-between">
                  <span>{preset.title}</span>
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">How Grounding Works</span>
            <p className="leading-snug">
              Every query triggers a multi-strategy TEMPR search in Hindsight before generating the answer.
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Interactive Chat Stream (6 cols) */}
        <div className="lg:col-span-6 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden min-h-0">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 space-y-2'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700 border-b border-slate-200/60 pb-1.5 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-indigo-600" />
                        🧠 Based on MeetMind Memory
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {m.source || 'Hindsight Bank'}
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {m.content}
                  </div>

                  {m.memoriesUsed && m.memoriesUsed.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Memory Sources ({m.memoriesUsed.length}):
                      </div>
                      {m.memoriesUsed.slice(0, 3).map((f, i) => (
                        <div key={i} className="text-[11px] text-slate-600 flex items-start gap-1">
                          <span className="text-indigo-600 font-bold shrink-0">✓</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>Recalling from Hindsight bank & synthesizing response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/50"
          >
            <input
              type="text"
              placeholder="Ask anything about meetings, client preferences, promises, or budgets..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Active Memory Sources Panel (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
              Active Memory Sources
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold">Grounded</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Facts currently active in the assistant's retrieval context:
          </p>

          <div className="space-y-2">
            {activeMemories.length > 0 ? (
              activeMemories.map((memText, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setActiveMemoryInspection({
                      id: `temp_${idx}`,
                      text: memText,
                      category: 'Requirement',
                      type: 'observation',
                      clientName: 'Sarah Mitchell'
                    })
                  }
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-800 space-y-1 hover:border-indigo-300 hover:bg-white cursor-pointer transition-all"
                >
                  <div className="text-[10px] font-mono text-indigo-700 font-semibold flex items-center justify-between">
                    <span>Source #{idx + 1}</span>
                    <span className="text-slate-400">Inspect →</span>
                  </div>
                  <p className="text-[11px] font-medium leading-snug">
                    "{memText}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                Ask a question to see real-time Hindsight memory citations.
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100">
            <button
              onClick={() => onPrepareClient(selectedClientId || 'client_sarah')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 hover:bg-indigo-100 text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Generate Full Briefing →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Memory Detail Modal for clicking a citation */}
      <MemoryDetailModal
        memory={activeMemoryInspection}
        isOpen={Boolean(activeMemoryInspection)}
        onClose={() => setActiveMemoryInspection(null)}
        onPrepareClient={onPrepareClient}
      />
    </div>
  );
};
