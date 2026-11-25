import React from 'react';
import { ArrowDown, ArrowRight, Bot, Cpu, Database, Layers, Server } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const pipeline = [
    { title: 'Frontend Digital Twin Dashboard', sub: 'React + TypeScript + SVG Vector Twin + Socket.IO Client', icon: Layers },
    { title: 'Express.js & Socket.IO Backend', sub: 'REST Control Plane + Real-Time Bi-Directional Telemetry Bus', icon: Server },
    { title: '7-State Simulation Engine & Digital Twin State', sub: 'NORMAL → DETECTED → PREDICTING → COORDINATING → OPTIMIZING → RECOVERING → STABILIZED', icon: Cpu },
    { title: 'Multi-Agent Decision Layer', sub: 'Traffic Agent + Emergency Agent + City Coordinator Agent (Conflict Resolution)', icon: Bot },
    { title: 'Self-Healing Actuation & SQLite Feedback Loop', sub: 'Signal Preemption, Corridor Rerouting & Persistent Incident Memory', icon: Database },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5 py-2">
      <div className="rounded-2xl border border-cyan-500/25 bg-[#070D1E]/90 p-5">
        <h2 className="text-base font-bold text-white">Cyber-Physical System Architecture</h2>
        <p className="mt-1 text-xs text-slate-400">
          Closed-loop autonomous control architecture coupling real-time simulation telemetry, multi-agent arbitration, SQLite persistence, and a context-grounded GenAI Copilot.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Core Closed-Loop Stack */}
          <div className="space-y-2 lg:col-span-2">
            {pipeline.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.title}>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/90 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{step.title}</div>
                      <div className="text-[11px] text-slate-400">{step.sub}</div>
                    </div>
                  </div>
                  {idx < pipeline.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowDown className="h-4 w-4 text-cyan-500/70" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Side-Coupled GenAI & Persistence Layer */}
          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-xl border border-indigo-500/35 bg-indigo-950/25 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <ArrowRight className="h-4 w-4" /> GenAI City Copilot Service
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                Reads live Digital Twin state, active junction loads, and recent Multi-Agent logs via backend context injection. Supports local <strong>Ollama</strong> models, external LLM APIs, and deterministic <strong>Demo AI Mode</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Database className="h-4 w-4" /> SQLite Persistence Store
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                Stores <code>incidents</code>, <code>agent_messages</code>, <code>agent_decisions</code>, <code>simulation_runs</code>, <code>simulation_metrics</code>, and <code>copilot_conversations</code> across server restarts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
