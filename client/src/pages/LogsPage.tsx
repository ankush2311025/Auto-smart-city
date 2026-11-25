import React from 'react';
import { Database } from 'lucide-react';
import { IncidentRecord } from '../types/simulation';

interface LogsPageProps {
  incidents: IncidentRecord[];
}

export const LogsPage: React.FC<LogsPageProps> = ({ incidents }) => {
  return (
    <div className="mx-auto max-w-6xl py-2">
      <div className="rounded-2xl border border-slate-800 bg-[#070D1E]/90 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Persistent Incident & Self-Healing Audit Table (SQLite Schema)
            </h2>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Table: incidents</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400">
                <th className="py-2 pr-3">Incident ID</th>
                <th className="py-2 pr-3">Corridor</th>
                <th className="py-2 pr-3">Detected</th>
                <th className="py-2 pr-3">Selected Self-Healing Action</th>
                <th className="py-2 pr-3">Peak Congestion</th>
                <th className="py-2 pr-3">AMB Time Saved</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {incidents.map((inc) => (
                <tr key={inc.id} className="text-slate-200">
                  <td className="py-2.5 pr-3 font-mono text-cyan-300">{inc.id}</td>
                  <td className="py-2.5 pr-3">{inc.location}</td>
                  <td className="py-2.5 pr-3 font-mono">{inc.detectedAt}</td>
                  <td className="py-2.5 pr-3 text-slate-300">{inc.selectedAction}</td>
                  <td className="py-2.5 pr-3 font-mono">{inc.peakCongestion}%</td>
                  <td className="py-2.5 pr-3 font-mono text-emerald-400">+{inc.ambulanceSavedSec}s</td>
                  <td className="py-2.5">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
