import { useState, useEffect, useRef, useCallback } from 'react';
import {
  AgentLog,
  AgentName,
  AmbulanceState,
  CityMetrics,
  CopilotMessage,
  IncidentRecord,
  JunctionNode,
  RoadSegment,
  SimulationState,
  Vehicle,
} from '../types/simulation';
import { INITIAL_JUNCTIONS, INITIAL_ROADS } from '../simulation/cityTopology';
import { generateGroundedDemoResponse } from '../simulation/copilotLocalEngine';
import { APP_CONFIG } from '../config/appConfig';
import { socketService } from '../services/socketService';
import { apiClient } from '../services/apiClient';

export function useSimulationEngine() {
  const [isRunning, setIsRunning] = useState(true);
  const [simSeconds, setSimSeconds] = useState(0);
  const [simState, setSimState] = useState<SimulationState>('NORMAL');
  const [activeStage, setActiveStage] = useState<number>(0);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const [junctions, setJunctions] = useState<JunctionNode[]>(INITIAL_JUNCTIONS);
  const [roads, setRoads] = useState<RoadSegment[]>(INITIAL_ROADS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: `VEH-${101 + i}`,
      roadId: (['A', 'B', 'C', 'D', 'E', 'F', 'G'][i % 7] as RoadSegment['id']),
      progress: (i * 0.17) % 1,
      speed: 0.018 + (i % 4) * 0.004,
    }))
  );

  const [ambulance, setAmbulance] = useState<AmbulanceState>({
    id: 'AMB-01',
    active: true,
    route: ['J1', 'J4', 'J5', 'J6'],
    segmentIndex: 0,
    progress: 0.15,
    etaSeconds: 42,
    rerouted: false,
    status: 'En route via Primary Arterial (Road A)',
  });

  const [metrics, setMetrics] = useState<CityMetrics>({
    avgWaitingTimeSec: 18.4,
    congestionPercent: 31,
    ambulanceEtaSec: 42,
    vehicleThroughputPerMin: 148,
    activeIncidents: 0,
    recoveryStatus: 'NOMINAL — Autonomous Monitoring Active',
  });

  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'init-1',
      timestamp: '00:00:01',
      agent: 'City Coordinator Agent',
      type: 'OBSERVATION',
      message: 'Cyber-physical mesh online. Monitoring 6 junctions (J1–J6) and 7 corridors.',
      stage: 0,
    },
  ]);

  const [incidents, setIncidents] = useState<IncidentRecord[]>([
    {
      id: 'INC-2026-084',
      roadId: 'Road C',
      location: 'Central Spine (J2 → J5)',
      detectedAt: '09:14:22',
      resolvedAt: '09:15:08',
      selectedAction: 'Adaptive Phase Split + East Connector Diversion',
      peakCongestion: 68,
      ambulanceSavedSec: 29,
      status: 'RESOLVED',
    },
  ]);

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      timestamp: '00:00:01',
      modeLabel: 'DEMO AI MODE',
      content:
        'AETHER-CITY Copilot initialized. I am connected to live city telemetry, junction signal states, and multi-agent logs. Trigger a road accident or ask any question below.',
    },
  ]);

  const [demoMode, setDemoMode] = useState(false);
  const [demoBannerText, setDemoBannerText] = useState('');
  const workflowTimers = useRef<number[]>([]);

  const formatClock = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const simSecondsRef = useRef(0);
  simSecondsRef.current = simSeconds;

  const pushLog = useCallback((agent: AgentName, type: AgentLog['type'], message: string, stage: number) => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: formatClock(simSecondsRef.current),
        agent,
        type,
        message,
        stage,
      },
      ...prev.slice(0, 39),
    ]);
  }, []);

  const clearWorkflowTimers = () => {
    workflowTimers.current.forEach((id) => window.clearTimeout(id));
    workflowTimers.current = [];
  };

  // Optional Socket.IO connection when backend mode is enabled
  useEffect(() => {
    if (!APP_CONFIG.USE_BACKEND_SOCKET) return;
    const socket = socketService.connect();
    socket.on('connect', () => setBackendConnected(true));
    socket.on('disconnect', () => setBackendConnected(false));
    socket.on('simulation:state', (payload) => {
      if (payload?.simState) setSimState(payload.simState);
      if (payload?.metrics) setMetrics(payload.metrics);
    });
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Main Simulation Tick Loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSimSeconds((s) => s + 1);

      // Cycle traffic signals every 6 seconds unless preempted
      setJunctions((prev) =>
        prev.map((j, idx) => {
          if (j.isPreempted) return { ...j, signal: 'GREEN' };
          const phase = Math.floor((simSecondsRef.current + idx * 2) / 5) % 3;
          const signal = phase === 0 ? 'GREEN' : phase === 1 ? 'YELLOW' : 'RED';
          return { ...j, signal };
        })
      );

      // Advance civilian vehicles
      setVehicles((prev) =>
        prev.map((v) => {
          const roadBlocked = v.roadId === 'A' && simState !== 'NORMAL' && simState !== 'STABILIZED';
          const effectiveSpeed = roadBlocked ? 0 : v.speed;
          let nextProgress = v.progress + effectiveSpeed;
          let nextRoad = v.roadId;
          if (nextProgress >= 1) {
            nextProgress = 0;
            const choices: RoadSegment['id'][] =
              simState === 'OPTIMIZING' || simState === 'RECOVERING'
                ? ['B', 'C', 'D', 'E', 'F', 'G']
                : ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
            nextRoad = choices[Math.floor(Math.random() * choices.length)];
          }
          return { ...v, roadId: nextRoad, progress: nextProgress };
        })
      );

      // Advance ambulance
      setAmbulance((prev) => {
        if (!prev.active) return prev;
        const step = prev.rerouted ? 0.045 : simState === 'DETECTED' || simState === 'PREDICTING' ? 0.004 : 0.032;
        let nextProg = prev.progress + step;
        let nextSeg = prev.segmentIndex;
        if (nextProg >= 1) {
          nextProg = 0;
          nextSeg = (prev.segmentIndex + 1) % (prev.route.length - 1);
        }
        return {
          ...prev,
          segmentIndex: nextSeg,
          progress: nextProg,
          etaSeconds: Math.max(12, prev.etaSeconds - (prev.rerouted ? 1 : 0)),
        };
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [isRunning, simState]);

  const triggerAccidentSimulation = useCallback(() => {
    if (APP_CONFIG.USE_BACKEND_SOCKET && backendConnected) {
      apiClient.post('/simulation/incident').catch(console.error);
      return;
    }

    clearWorkflowTimers();
    setIsRunning(true);

    // STAGE 1: DETECTION (t = 0s)
    setSimState('DETECTED');
    setActiveStage(1);
    setRoads((prev) =>
      prev.map((r) => (r.id === 'A' ? { ...r, blocked: true, density: 94 } : r))
    );
    setJunctions((prev) =>
      prev.map((j) =>
        j.id === 'J1' || j.id === 'J4' ? { ...j, loadPercent: 86, queueLength: 24 } : j
      )
    );
    setMetrics({
      avgWaitingTimeSec: 47.2,
      congestionPercent: 76,
      ambulanceEtaSec: 98,
      vehicleThroughputPerMin: 89,
      activeIncidents: 1,
      recoveryStatus: 'STAGE 1: INCIDENT DETECTED ON ROAD A',
    });
    setAmbulance((prev) => ({
      ...prev,
      etaSeconds: 98,
      status: 'DELAYED — Blocked behind Road A collision',
    }));
    setIncidents((prev) => [
      {
        id: `INC-2026-${Math.floor(100 + Math.random() * 899)}`,
        roadId: 'Road A',
        location: 'Arterial West (J1 → J4)',
        detectedAt: formatClock(simSecondsRef.current),
        selectedAction: 'Pending Multi-Agent Arbitration...',
        peakCongestion: 76,
        ambulanceSavedSec: 0,
        status: 'ACTIVE',
      },
      ...prev,
    ]);
    pushLog(
      'Traffic Agent',
      'OBSERVATION',
      'CRITICAL: Zero flow & collision signature detected on Road A (J1 → J4). Corridor blocked.',
      1
    );

    // STAGE 2: PREDICTION (t = 3.5s)
    workflowTimers.current.push(
      window.setTimeout(() => {
        setSimState('PREDICTING');
        setActiveStage(2);
        setJunctions((prev) =>
          prev.map((j) =>
            j.id === 'J2' ? { ...j, loadPercent: 64, queueLength: 16 } : j
          )
        );
        setMetrics((prev) => ({
          ...prev,
          congestionPercent: 79,
          recoveryStatus: 'STAGE 2: CONGESTION SPILLOVER FORECASTED',
        }));
        pushLog(
          'Traffic Agent',
          'PREDICTION',
          'Spillover forecast: J1 queue will saturate within 40s and propagate into J2 & J4.',
          2
        );
      }, 3500)
    );

    // STAGE 3: COORDINATION (t = 7s)
    workflowTimers.current.push(
      window.setTimeout(() => {
        setSimState('COORDINATING');
        setActiveStage(3);
        setMetrics((prev) => ({
          ...prev,
          recoveryStatus: 'STAGE 3: MULTI-AGENT CONFLICT ARBITRATION',
        }));
        pushLog(
          'Emergency Agent',
          'PROPOSAL',
          'Route conflict for AMB-01 on Road A. Proposing Northern-Central bypass: J1 → J2 → J5 → J6.',
          3
        );
        pushLog(
          'City Coordinator Agent',
          'DECISION',
          'Approved Emergency Priority Override. Preempting civilian split at J2/J5 for AMB-01.',
          3
        );
      }, 7000)
    );

    // STAGE 4: OPTIMIZATION (t = 11s)
    workflowTimers.current.push(
      window.setTimeout(() => {
        setSimState('OPTIMIZING');
        setActiveStage(4);
        setRoads((prev) =>
          prev.map((r) =>
            ['B', 'C', 'D'].includes(r.id)
              ? { ...r, isEmergencyCorridor: true, density: 42 }
              : r
          )
        );
        setJunctions((prev) =>
          prev.map((j) =>
            ['J1', 'J2', 'J5', 'J6'].includes(j.id)
              ? { ...j, isPreempted: true, signal: 'GREEN' }
              : j
          )
        );
        setAmbulance({
          id: 'AMB-01',
          active: true,
          route: ['J1', 'J2', 'J5', 'J6'],
          segmentIndex: 0,
          progress: 0.1,
          etaSeconds: 34,
          rerouted: true,
          status: 'REROUTED — Green-Wave Active (J1 → J2 → J5 → J6)',
        });
        setMetrics({
          avgWaitingTimeSec: 33.8,
          congestionPercent: 58,
          ambulanceEtaSec: 34,
          vehicleThroughputPerMin: 124,
          activeIncidents: 1,
          recoveryStatus: 'STAGE 4: GREEN-WAVE & DETOUR ACTUATED',
        });
        pushLog(
          'City Coordinator Agent',
          'ACTION',
          'Green wave locked across J1→J2→J5→J6; civilian inflow metered onto East/Southern links.',
          4
        );
      }, 11000)
    );

    // STAGE 5: RECOVERY (t = 16s)
    workflowTimers.current.push(
      window.setTimeout(() => {
        setSimState('RECOVERING');
        setActiveStage(5);
        setJunctions((prev) =>
          prev.map((j) => ({
            ...j,
            loadPercent: Math.max(28, j.loadPercent - 26),
            queueLength: Math.max(5, j.queueLength - 10),
          }))
        );
        setMetrics({
          avgWaitingTimeSec: 22.1,
          congestionPercent: 39,
          ambulanceEtaSec: 19,
          vehicleThroughputPerMin: 141,
          activeIncidents: 1,
          recoveryStatus: 'STAGE 5: NETWORK QUEUES DISSIPATING',
        });
        pushLog(
          'Traffic Agent',
          'OBSERVATION',
          'Queue dissipation confirmed at J1 & J2. Network congestion reduced from 79% to 39%.',
          5
        );
      }, 16000)
    );

    // STAGE 6: LEARNING & STABILIZED (t = 21s)
    workflowTimers.current.push(
      window.setTimeout(() => {
        setSimState('STABILIZED');
        setActiveStage(6);
        setRoads((prev) =>
          prev.map((r) =>
            r.id === 'A'
              ? { ...r, blocked: false, density: 35 }
              : { ...r, isEmergencyCorridor: false, density: 31 }
          )
        );
        setJunctions((prev) =>
          prev.map((j) => ({
            ...j,
            isPreempted: false,
            loadPercent: 32,
            queueLength: 6,
          }))
        );
        setAmbulance({
          id: 'AMB-01',
          active: true,
          route: ['J1', 'J4', 'J5', 'J6'],
          segmentIndex: 2,
          progress: 0.7,
          etaSeconds: 14,
          rerouted: false,
          status: 'ARRIVING — Trauma Center Corridor Clear',
        });
        setMetrics({
          avgWaitingTimeSec: 19.2,
          congestionPercent: 32,
          ambulanceEtaSec: 14,
          vehicleThroughputPerMin: 152,
          activeIncidents: 0,
          recoveryStatus: 'STAGE 6: STABILIZED & COMMITTED TO MEMORY',
        });
        setIncidents((prev) =>
          prev.map((inc, i) =>
            i === 0
              ? {
                  ...inc,
                  resolvedAt: formatClock(simSecondsRef.current),
                  selectedAction: 'Green-Wave Preemption (J1→J2→J5→J6) + Arterial Metering',
                  ambulanceSavedSec: 64,
                  status: 'RESOLVED',
                }
              : inc
          )
        );
        pushLog(
          'City Coordinator Agent',
          'LEARNING',
          'Self-healing cycle complete. Saved incident telemetry & saved 64s ambulance transit time.',
          6
        );
      }, 21000)
    );
  }, [backendConnected, pushLog]);

  const resetSimulation = useCallback(() => {
    clearWorkflowTimers();
    setSimState('NORMAL');
    setActiveStage(0);
    setJunctions(INITIAL_JUNCTIONS);
    setRoads(INITIAL_ROADS);
    setAmbulance({
      id: 'AMB-01',
      active: true,
      route: ['J1', 'J4', 'J5', 'J6'],
      segmentIndex: 0,
      progress: 0.15,
      etaSeconds: 42,
      rerouted: false,
      status: 'En route via Primary Arterial (Road A)',
    });
    setMetrics({
      avgWaitingTimeSec: 18.4,
      congestionPercent: 31,
      ambulanceEtaSec: 42,
      vehicleThroughputPerMin: 148,
      activeIncidents: 0,
      recoveryStatus: 'NOMINAL — Autonomous Monitoring Active',
    });
    pushLog('City Coordinator Agent', 'OBSERVATION', 'Digital twin reset to baseline NORMAL state.', 0);
  }, [pushLog]);

  const startEvaluatorDemo = useCallback(() => {
    resetSimulation();
    setDemoMode(true);
    setIsRunning(true);
    setDemoBannerText('Step 1/4: Baseline traffic & signal cycles nominal. Injecting Road A accident in 3s...');

    workflowTimers.current.push(
      window.setTimeout(() => {
        setDemoBannerText('Step 2/4: Road A blocked! Agents detecting collision & forecasting spillover...');
        triggerAccidentSimulation();
      }, 3000)
    );
    workflowTimers.current.push(
      window.setTimeout(() => {
        setDemoBannerText('Step 3/4: Coordinator overriding signals — Ambulance rerouted onto J1→J2→J5→J6!');
      }, 14000)
    );
    workflowTimers.current.push(
      window.setTimeout(() => {
        setDemoBannerText('Step 4/4: Network stabilized & outcome logged. Try asking the GenAI Copilot!');
      }, 24500)
    );
  }, [resetSimulation, triggerAccidentSimulation]);

  const sendCopilotMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: CopilotMessage = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: formatClock(simSecondsRef.current),
      };
      setMessages((prev) => [...prev, userMsg]);

      if (APP_CONFIG.USE_BACKEND_SOCKET && backendConnected) {
        try {
          const res = await apiClient.post<{ reply: string; providerLabel: string }>('/copilot/chat', {
            message: trimmed,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: res.reply,
              timestamp: formatClock(simSecondsRef.current),
              modeLabel: res.providerLabel || 'BACKEND LLM',
            },
          ]);
          return;
        } catch {
          // Graceful fallback to local grounded engine
        }
      }

      const reply = generateGroundedDemoResponse(trimmed, {
        simState,
        metrics,
        junctions,
        roads,
        ambulance,
        logs,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: formatClock(simSecondsRef.current),
          modeLabel: 'DEMO AI MODE',
        },
      ]);
    },
    [ambulance, backendConnected, junctions, logs, metrics, roads, simState]
  );

  return {
    isRunning,
    setIsRunning,
    simSeconds,
    formattedClock: formatClock(simSeconds),
    simState,
    activeStage,
    backendConnected,
    junctions,
    roads,
    vehicles,
    ambulance,
    metrics,
    logs,
    incidents,
    messages,
    demoMode,
    setDemoMode,
    demoBannerText,
    triggerAccidentSimulation,
    resetSimulation,
    startEvaluatorDemo,
    sendCopilotMessage,
  };
}
