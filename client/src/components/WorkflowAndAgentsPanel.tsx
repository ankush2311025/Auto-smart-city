import React from 'react';
import { Bot, CheckCircle2, Radio, ShieldAlert, Siren } from 'lucide-react';
import { AgentLog, AgentName } from '../types/simulation';

interface WorkflowAndAgentsPanelProps {
  activeStage: number;
  logs: AgentLog[];
}

const STAGES = [
  { num: 1, title: 'Detection', desc: 'Blockage sensed' },
  { num: 2, title: 'Prediction', desc: 'Spillover model' },
  { num: 3, title: 'Coordination', desc: 'Agent arbitration' },
  { num: 4, title: 'Optimization', desc: 'Green-wave detour' },
  { num: 5, title: 'Recovery', desc: 'Queues clearing' },
  { num: 6, title: 'Learning', desc: 'SQLite analytics' },
];

const AGENT_META: Record<AgentName, { color: string; icon: React.ElementType }> = {
  'Traffic Agent': { color: 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10', icon: Radio },
  'Emergency Agent': { color: 'text-rose-300 border-rose-500/30 bg-rose-500/10', icon: Siren },
  'City Coordinator Agent': {
    color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10',
    icon: ShieldAlert,
  },
};

export const WorkflowAndAgentsPanel: React.FC<WorkflowAndAgentsPanelProps> = ({
  activeStage,
  logs,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* 6-Stage Self-Healing Pipeline */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#070D1E]/90 p-3.5 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Autonomous 6-Stage Self-Healing Workflow
          </span>
          <span className="font-mono text-[11px] text-cyan-400">
            {activeStage === 0 ? 'STANDBY' : `ACTIVE STAGE ${activeStage}/6`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
          {STAGES.map((s) => {
            const isCompleted = activeStage > s.num;
            const isCurrent = activeStage === s.num;
            return (
              <div
                key={s.num}
                className={`rounded-xl border p-2 transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_16px_rgba(34,211,238,0.18)]'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60 opacity-65'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className={isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                    0{s.num}
                  </span>
                  {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                </div>
                <div className="mt-0.5 text-xs font-semibold text-white">{s.title}</div>
                <div className="text-[10px] text-slate-400">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Agent Decision Bus */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#070D1E]/90 p-3.5 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Multi-Agent Coordination & Decision Stream
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Traffic • Emergency • Coordinator</span>
        </div>

        <div className="max-h-[155px] space-y-2 overflow-y-auto pr-1 custom-scrollbar">
          {logs.map((log) => {
            const meta = AGENT_META[log.agent];
            const Icon = meta.icon;
            return (
              <div
                key={log.id}
                className="flex items-start justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 rounded-md border p-1 ${meta.color}`}>
                    <Icon className="h-3 w-3" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100">{log.agent}</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[9.5px] text-cyan-300">
                        {log.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">{log.message}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
