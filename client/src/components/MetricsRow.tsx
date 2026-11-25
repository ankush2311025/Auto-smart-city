import React from 'react';
import { Activity, AlertOctagon, Clock, Gauge, ShieldCheck, Siren } from 'lucide-react';
import { CityMetrics } from '../types/simulation';

interface MetricsRowProps {
  metrics: CityMetrics;
}

export const MetricsRow: React.FC<MetricsRowProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'Avg Waiting Time',
      value: `${metrics.avgWaitingTimeSec.toFixed(1)}s`,
      sub: 'Simulated Signal Delay',
      icon: Clock,
      accent: 'text-cyan-400 border-cyan-500/25',
    },
    {
      label: 'Traffic Congestion',
      value: `${metrics.congestionPercent}%`,
      sub: 'Simulated Network Density',
      icon: Gauge,
      accent:
        metrics.congestionPercent > 65
          ? 'text-rose-400 border-rose-500/35'
          : 'text-amber-300 border-amber-500/25',
    },
    {
      label: 'Ambulance ETA',
      value: `${metrics.ambulanceEtaSec}s`,
      sub: 'AMB-01 → Trauma Center',
      icon: Siren,
      accent:
        metrics.ambulanceEtaSec > 60
          ? 'text-rose-400 border-rose-500/35'
          : 'text-emerald-400 border-emerald-500/25',
    },
    {
      label: 'Vehicle Throughput',
      value: `${metrics.vehicleThroughputPerMin}/m`,
      sub: 'Simulated Flow Rate',
      icon: Activity,
      accent: 'text-blue-400 border-blue-500/25',
    },
    {
      label: 'Active Incidents',
      value: `${metrics.activeIncidents}`,
      sub: metrics.activeIncidents > 0 ? 'Road A Obstructed' : '0 Blocked Corridors',
      icon: AlertOctagon,
      accent:
        metrics.activeIncidents > 0
          ? 'text-rose-400 border-rose-500/40'
          : 'text-slate-300 border-slate-700/60',
    },
    {
      label: 'Self-Healing Status',
      value: metrics.recoveryStatus.split('—')[0].trim(),
      sub: 'Simulated Prototype Telemetry',
      icon: ShieldCheck,
      accent: 'text-emerald-300 border-emerald-500/25',
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border bg-[#080F22]/85 p-3 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${card.accent}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400">{card.label}</span>
              <Icon className="h-3.5 w-3.5 opacity-85" />
            </div>
            <div className="mt-1 font-mono text-lg font-bold tracking-tight text-white tabular-nums">
              {card.value}
            </div>
            <div className="mt-0.5 truncate text-[10px] text-slate-500">{card.sub}</div>
          </div>
        );
      })}
    </section>
  );
};
