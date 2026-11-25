import { AgentLog, AmbulanceState, CityMetrics, JunctionNode, RoadSegment, SimulationState } from '../types/simulation';

interface CopilotContext {
  simState: SimulationState;
  metrics: CityMetrics;
  junctions: JunctionNode[];
  roads: RoadSegment[];
  ambulance: AmbulanceState;
  logs: AgentLog[];
}

export function generateGroundedDemoResponse(question: string, ctx: CopilotContext): string {
  const q = question.toLowerCase();
  const highestJunction = [...ctx.junctions].sort((a, b) => b.loadPercent - a.loadPercent)[0];
  const roadA = ctx.roads.find((r) => r.id === 'A');
  const latestLog = ctx.logs[0];

  if (q.includes('happening') || q.includes('right now') || q.includes('status')) {
    return `[DEMO AI MODE — Live Telemetry Context]
• State Machine: **${ctx.simState}** (${ctx.metrics.recoveryStatus})
• Network Load: **${ctx.metrics.congestionPercent}%** avg congestion | **${ctx.metrics.avgWaitingTimeSec}s** avg signal wait | **${ctx.metrics.vehicleThroughputPerMin} veh/min** throughput.
• Road A Status: ${roadA?.blocked ? '**BLOCKED** due to simulated multi-vehicle collision near J1-J4.' : '**OPEN** with normal arterial flow.'}
• Ambulance AMB-01: ${ctx.ambulance.status} via **${ctx.ambulance.route.join(' → ')}** (ETA **${ctx.ambulance.etaSeconds}s**).
• Latest Agent Action: ${latestLog ? `"${latestLog.message}" (${latestLog.agent})` : 'Routine telemetry polling.'}`;
  }

  if (q.includes('road a') || q.includes('blocked')) {
    return `[DEMO AI MODE — Incident Root-Cause Analysis]
Road A (Arterial West connecting **J1 → J4**) ${
      roadA?.blocked
        ? 'is currently **BLOCKED** by a simulated traffic collision detected by inductive loop & vision telemetry.'
        : 'was blocked during the incident simulation when vehicle speed dropped to 0 km/h and queue density spiked above 88%.'
    }
• Immediate Impact: Upstream queue at **J1** surged, blocking the primary southward ambulance corridor toward **Metropolitan Trauma Center (J6)**.`;
  }

  if (q.includes('ambulance') || q.includes('route')) {
    return `[DEMO AI MODE — Emergency Agent Routing Trace]
• Primary Path Conflict: AMB-01 originally planned to traverse **J1 → J4 → J5 → J6**, which became impassable when Road A was obstructed.
• Dynamic Re-Planning: The **Emergency Agent** computed an alternate bypass via **${ctx.ambulance.route.join(' → ')}** (Roads B → C → D).
• Green-Wave Preemption: Approved by the **City Coordinator Agent**, holding green phases at **J1, J2, J5, and J6** to cut simulated ETA to **${ctx.ambulance.etaSeconds}s**.`;
  }

  if (q.includes('self-healing') || q.includes('six') || q.includes('6')) {
    return `[DEMO AI MODE — 6-Stage Autonomous Self-Healing Loop]
1. **Detection**: Traffic Agent flags Road A blockage & zero-flow anomaly.
2. **Prediction**: Propagation model estimates spillover onto J1 & J4 within 45s.
3. **Coordination**: Emergency Agent reports route conflict; Traffic Agent proposes East/North diversion; City Coordinator arbitrates.
4. **Optimization**: Coordinator locks green-wave signal preemption on J1→J2→J5→J6 and diverts civilian vehicles.
5. **Recovery**: Queue density dissipates across Road A feeders and ambulance ETA stabilizes.
6. **Learning**: Incident outcome and action efficacy are committed to persistent SQLite analytics.`;
  }

  if (q.includes('road b')) {
    return `[DEMO AI MODE — Counterfactual What-If Analysis]
If **Road B (J1 → J2)** were closed simultaneously with Road A:
• **J1** would lose both its eastern (Road B) and southern (Road A) exits, isolating Westgate Hub.
• The **Emergency Agent** would trigger a northern/southern perimeter reroute or dispatch a secondary trauma unit from **J3 (North Tech Park)** via **Road G (J3 → J6)** to preserve golden-hour response times.`;
  }

  if (q.includes('highest congestion') || q.includes('junction')) {
    return `[DEMO AI MODE — Spatial Junction Telemetry]
• Highest Load Junction: **${highestJunction.id} (${highestJunction.name})** currently operating at **${highestJunction.loadPercent}% capacity** with **${highestJunction.queueLength} queued vehicles** (Signal: **${highestJunction.signal}**).
• Network Comparison: Average city congestion is **${ctx.metrics.congestionPercent}%**.`;
  }

  if (q.includes('coordinator') || q.includes('prioritize')) {
    return `[DEMO AI MODE — Multi-Agent Conflict Resolution]
• Conflict: The **Traffic Agent** initially favored balanced cycle splits at **J2** and **J5** to minimize civilian wait times, whereas the **Emergency Agent** requested immediate phase preemption for **AMB-01**.
• Arbitration Rule: The **City Coordinator Agent** enforces a safety-first utility hierarchy ($U_{emergency} \gg U_{civilian}$), granting emergency preemption while metering civilian inflow at J1/J3 to prevent gridlock.`;
  }

  if (q.includes('compare') || q.includes('normal') || q.includes('recovery')) {
    return `[DEMO AI MODE — State Transition Comparison]
• **NORMAL Baseline**: Congestion ~31%, Avg Wait ~18s, Road A open, fixed-adaptive cyclic signals.
• **PEAK INCIDENT (DETECTED/COORDINATING)**: Congestion surges to ~74%, Avg Wait ~46s, Road A blocked.
• **CURRENT (${ctx.simState})**: Congestion **${ctx.metrics.congestionPercent}%**, Avg Wait **${ctx.metrics.avgWaitingTimeSec}s**, Ambulance ETA **${ctx.metrics.ambulanceEtaSec}s** via preempted green corridor.`;
  }

  if (q.includes('architecture') || q.includes('simple')) {
    return `[DEMO AI MODE — System Architecture Overview]
Think of AETHER-CITY as a three-layer cyber-physical brain:
1. **Digital Twin Layer (Frontend SVG + State Engine)**: Mirrors intersections J1–J6, roads A–D, vehicles, and signals in real time.
2. **Multi-Agent Layer (Backend Logic)**: Three specialized agents (**Traffic**, **Emergency**, **Coordinator**) debate and execute self-healing actions over Socket.IO.
3. **Persistence & GenAI Layer (SQLite + Copilot)**: Logs every incident for historical evaluation and lets operators query live city state in natural language.`;
  }

  return `[DEMO AI MODE — Context-Grounded Summary]
Currently in **${ctx.simState}** state: City congestion is **${ctx.metrics.congestionPercent}%**, average wait time is **${ctx.metrics.avgWaitingTimeSec}s**, and **${highestJunction.id}** has the highest load (**${highestJunction.loadPercent}%**). Ask about Road A, ambulance rerouting, or the 6-stage self-healing workflow for deeper telemetry.`;
}
