import React, { useState } from 'react';
import { Presentation } from 'lucide-react';
import { useSimulationEngine } from './hooks/useSimulationEngine';
import { HeaderBar } from './components/HeaderBar';
import { MetricsRow } from './components/MetricsRow';
import { CityDigitalTwinMap } from './components/CityDigitalTwinMap';
import { WorkflowAndAgentsPanel } from './components/WorkflowAndAgentsPanel';
import { CopilotPanel } from './components/CopilotPanel';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ResearchPage } from './pages/ResearchPage';
import { LogsPage } from './pages/LogsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture' | 'research' | 'logs'>('dashboard');
  const sim = useSimulationEngine();

  return (
    <div className="min-h-screen bg-[#03060E] text-slate-100 flex flex-col">
      <HeaderBar
        formattedClock={sim.formattedClock}
        simState={sim.simState}
        isRunning={sim.isRunning}
        backendConnected={sim.backendConnected}
        demoMode={sim.demoMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleRun={() => sim.setIsRunning((r) => !r)}
        onReset={sim.resetSimulation}
        onTriggerAccident={sim.triggerAccidentSimulation}
        onStartDemo={sim.startEvaluatorDemo}
        onExitDemo={() => {
          sim.setDemoMode(false);
          sim.resetSimulation();
        }}
      />

      {/* Evaluator Presentation Banner */}
      {sim.demoMode && (
        <div className="border-b border-cyan-500/30 bg-cyan-950/40 px-4 py-2 text-xs text-cyan-200">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <Presentation className="h-4 w-4 text-cyan-400" />
              <span>EVALUATOR PRESENTATION MODE:</span>
              <span className="text-white">{sim.demoBannerText}</span>
            </div>
            <span className="font-mono text-[11px] text-cyan-300">Auto-Sequence Active</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-3 space-y-3">
        {(activeTab === 'dashboard' || sim.demoMode) && (
          <>
            <MetricsRow metrics={sim.metrics} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-8">
                <CityDigitalTwinMap
                  junctions={sim.junctions}
                  roads={sim.roads}
                  vehicles={sim.vehicles}
                  ambulance={sim.ambulance}
                  expanded={sim.demoMode}
                />
                <WorkflowAndAgentsPanel activeStage={sim.activeStage} logs={sim.logs} />
              </div>
              <div className="lg:col-span-4">
                <CopilotPanel messages={sim.messages} onSendMessage={sim.sendCopilotMessage} />
              </div>
            </div>
          </>
        )}

        {!sim.demoMode && activeTab === 'architecture' && <ArchitecturePage />}
        {!sim.demoMode && activeTab === 'research' && <ResearchPage />}
        {!sim.demoMode && activeTab === 'logs' && <LogsPage incidents={sim.incidents} />}
      </main>
    </div>
  );
}

export default App;
