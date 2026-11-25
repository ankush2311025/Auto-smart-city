import React from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Cpu,
  Pause,
  Play,
  Presentation,
  RotateCcw,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface HeaderBarProps {
  formattedClock: string;
  simState: SimulationState;
  isRunning: boolean;
  backendConnected: boolean;
  demoMode: boolean;
  activeTab: 'dashboard' | 'architecture' | 'research' | 'logs';
  setActiveTab: (tab: 'dashboard' | 'architecture' | 'research' | 'logs') => void;
  onToggleRun: () => void;
  onReset: () => void;
  onTriggerAccident: () => void;
  onStartDemo: () => void;
  onExitDemo: () => void;
}

const STATE_BADGE_COLORS: Record<SimulationState, string> = {
  NORMAL: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  DETECTED: 'border-rose-500/50 bg-rose-500/15 text-rose-300 animate-pulse',
  PREDICTING: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  COORDINATING: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
  OPTIMIZING: 'border-blue-500/40 bg-blue-500/15 text-blue-300',
  RECOVERING: 'border-teal-500/40 bg-teal-500/10 text-teal-300',
  STABILIZED: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  formattedClock,
  simState,
  isRunning,
  backendConnected,
  demoMode,
  activeTab,
  setActiveTab,
  onToggleRun,
  onReset,
  onTriggerAccident,
  onStartDemo,
  onExitDemo,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-cyan-500/15 bg-[#060B19]/90 backdrop-blur-xl px-4 py-2.5">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.18)]">
            <Cpu className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider text-white">AETHER-CITY</h1>
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                DIGITAL TWIN v2.6
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous Multi-Agent Self-Healing Smart City Command Center
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Hidden in Evaluator Presentation Mode) */}
        {!demoMode && (
          <nav className="flex items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-950/80 p-1">
            {(
              [
                { id: 'dashboard', label: 'Command Center' },
                { id: 'architecture', label: 'System Architecture' },
                { id: 'research', label: 'Research Evaluation' },
                { id: 'logs', label: 'SQLite Audit Logs' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] border border-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}

        {/* Telemetry Status Pills & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* FSM Status */}
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold ${STATE_BADGE_COLORS[simState]}`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>{simState}</span>
          </div>

          {/* Clock */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 font-mono text-xs text-cyan-300 tabular-nums">
            {formattedClock}
          </div>

          {/* Connection & AI Status */}
          <div
            title={backendConnected ? 'Connected to Express + Socket.IO' : 'Running Local Demo Engine'}
            className="hidden xl:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300"
          >
            {backendConnected ? (
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span>{backendConnected ? 'Socket Live' : 'Demo Engine'}</span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] text-indigo-300">
            <Bot className="h-3.5 w-3.5" />
            <span>{backendConnected ? 'Backend AI' : 'Demo AI'}</span>
          </div>

          {/* Play / Pause */}
          <button
            onClick={onToggleRun}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-white"
          >
            {isRunning ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          {/* Simulate Accident */}
          <button
            onClick={onTriggerAccident}
            className="flex items-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-600/20 px-3 py-1.5 text-xs font-semibold text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.2)] hover:bg-rose-600/30"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            <span>Simulate Road Accident</span>
          </button>

          {/* Evaluator Demo Toggle */}
          {!demoMode ? (
            <button
              onClick={onStartDemo}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.2)] hover:bg-cyan-500/30"
            >
              <Presentation className="h-3.5 w-3.5 text-cyan-300" />
              <span>Start Evaluator Demo</span>
            </button>
          ) : (
            <button
              onClick={onExitDemo}
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/50 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
            >
              <span>Reset & Exit Demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
