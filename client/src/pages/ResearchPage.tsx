import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FlaskConical, Milestone } from 'lucide-react';

const BENCHMARK_DATA = [
  { metric: 'Avg Wait Time (s)', FixedTime: 54.0, MultiAgent: 21.5 },
  { metric: 'Peak Congestion (%)', FixedTime: 86.0, MultiAgent: 38.0 },
  { metric: 'Ambulance ETA (s)', FixedTime: 112.0, MultiAgent: 34.0 },
  { metric: 'Recovery Time (s)', FixedTime: 185.0, MultiAgent: 21.0 },
];

export const ResearchPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-5 py-2">
      <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-200 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-amber-400" />
          SIMULATED PROTOTYPE RESULTS — Generated from internal Digital Twin benchmark runs (not real-world or SUMO deployment data).
        </span>
        <span className="font-mono text-[10px]">PROTOTYPE v2.6</span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Comparative Chart */}
        <div className="rounded-2xl border border-slate-800 bg-[#070D1E]/90 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Fixed-Time Control vs. Adaptive Multi-Agent Simulation
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">
            Simulated prototype comparison under Road A arterial blockage scenario.
          </p>
          <div className="mt-4 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BENCHMARK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#060B19', borderColor: '#334155', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="FixedTime" name="Fixed-Time Signal Control" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="MultiAgent" name="Adaptive Multi-Agent Twin" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Future Research Roadmap */}
        <div className="rounded-2xl border border-slate-800 bg-[#070D1E]/90 p-4">
          <div className="flex items-center gap-2">
            <Milestone className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Future Research & Engineering Roadmap
            </h3>
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            {[
              { phase: 'Phase 1: SUMO Microscopic Traffic Integration', detail: 'Replace abstract corridor kinetics with Eclipse SUMO car-following and lane-changing physics.' },
              { phase: 'Phase 2: TraCI Real-Time Coupling', detail: 'Stream live inductive-loop and vehicle state vectors via Traffic Control Interface (TraCI) sockets.' },
              { phase: 'Phase 3: Multi-Agent Reinforcement Learning (MARL)', detail: 'Train QMIX / MAPPO policies for cooperative intersection phase optimization under stochastic demand.' },
              { phase: 'Phase 4: Municipal Sensor & GTFS Ingestion', detail: 'Ingest real-world city loop detectors, transit feeds, and emergency CAD dispatch streams.' },
              { phase: 'Phase 5: Hardware-in-the-Loop (HIL) Validation', detail: 'Validate NEMA TS2 signal controller actuation latency under cyber-physical fault injection.' },
            ].map((item) => (
              <div key={item.phase} className="rounded-xl border border-slate-800/90 bg-slate-950/75 p-2.5">
                <div className="font-semibold text-cyan-300">{item.phase}</div>
                <div className="mt-0.5 text-[11px] text-slate-400">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
