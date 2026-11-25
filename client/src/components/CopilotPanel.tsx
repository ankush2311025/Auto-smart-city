import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { CopilotMessage } from '../types/simulation';
import { SUGGESTED_COPILOT_PROMPTS } from '../simulation/cityTopology';

interface CopilotPanelProps {
  messages: CopilotMessage[];
  onSendMessage: (text: string) => void;
}

export const CopilotPanel: React.FC<CopilotPanelProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-indigo-500/25 bg-[#070D1E]/95 p-3.5 backdrop-blur-xl shadow-[0_0_30px_rgba(99,102,241,0.08)]">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-400/40 bg-indigo-500/15">
            <Bot className="h-4 w-4 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-wide text-white">GenAI City Copilot</h2>
            <p className="text-[10px] text-slate-400">Context-Grounded Operations Assistant</p>
          </div>
        </div>
        <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-amber-300">
          DEMO AI MODE
        </span>
      </div>

      {/* Chat Stream */}
      <div className="my-2.5 flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar max-h-[340px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl p-2.5 text-xs leading-relaxed ${
              m.role === 'user'
                ? 'ml-6 border border-cyan-500/30 bg-cyan-500/15 text-cyan-50'
                : 'mr-2 border border-slate-800 bg-slate-950/85 text-slate-200'
            }`}
          >
            {m.role === 'assistant' && m.modeLabel && (
              <div className="mb-1 flex items-center justify-between font-mono text-[9.5px] text-indigo-300">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> {m.modeLabel}
                </span>
                <span className="text-slate-500">{m.timestamp}</span>
              </div>
            )}
            <div className="whitespace-pre-line text-[11.5px]">{m.content}</div>
          </div>
        ))}
      </div>

      {/* Suggested Evaluator Prompts */}
      <div className="mb-2.5">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Evaluator Quick Prompts
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[84px] overflow-y-auto custom-scrollbar">
          {SUGGESTED_COPILOT_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSendMessage(prompt)}
              className="rounded-lg border border-slate-800 bg-slate-900/90 px-2 py-1 text-left text-[10.5px] text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Road A, ambulance, or agents..."
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/30"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </aside>
  );
};
