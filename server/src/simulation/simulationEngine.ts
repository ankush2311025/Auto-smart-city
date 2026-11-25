import { Server as SocketIOServer } from 'socket.io';
import { CityMetrics, SimulationState } from '../types/domain.js';
import { CityCoordinatorAgent, EmergencyAgent, TrafficAgent } from '../agents/multiAgentSystem.js';
import { db } from '../database/sqlite.js';

export class SimulationEngine {
  private state: SimulationState = 'NORMAL';
  private running = true;
  private metrics: CityMetrics = {
    avgWaitingTimeSec: 18.4,
    congestionPercent: 31,
    ambulanceEtaSec: 42,
    vehicleThroughputPerMin: 148,
    activeIncidents: 0,
    recoveryStatus: 'NOMINAL',
  };

  private trafficAgent = new TrafficAgent();
  private emergencyAgent = new EmergencyAgent();
  private coordinatorAgent = new CityCoordinatorAgent();

  constructor(private io: SocketIOServer) {}

  getState() {
    return {
      simState: this.state,
      running: this.running,
      metrics: this.metrics,
    };
  }

  start() {
    this.running = true;
    this.broadcastState();
  }

  pause() {
    this.running = false;
    this.broadcastState();
  }

  reset() {
    this.state = 'NORMAL';
    this.metrics = {
      avgWaitingTimeSec: 18.4,
      congestionPercent: 31,
      ambulanceEtaSec: 42,
      vehicleThroughputPerMin: 148,
      activeIncidents: 0,
      recoveryStatus: 'NOMINAL',
    };
    this.broadcastState();
  }

  triggerRoadAccident(roadId = 'A') {
    const incidentId = `INC-${Date.now()}`;
    const now = new Date().toISOString();

    // Stage 1: Detection
    this.state = 'DETECTED';
    this.metrics = {
      avgWaitingTimeSec: 47.2,
      congestionPercent: 76,
      ambulanceEtaSec: 98,
      vehicleThroughputPerMin: 89,
      activeIncidents: 1,
      recoveryStatus: 'STAGE 1: INCIDENT DETECTED',
    };
    const msg1 = this.trafficAgent.detectAccident(roadId);
    this.persistMessage(msg1);
    this.io.emit('incident:detected', { incidentId, roadId });
    this.io.emit('agent:message', msg1);
    this.broadcastState();

    // Stage 2: Prediction
    setTimeout(() => {
      this.state = 'PREDICTING';
      const msg2 = this.trafficAgent.predictSpillover();
      this.persistMessage(msg2);
      this.io.emit('agent:message', msg2);
      this.broadcastState();
    }, 3000);

    // Stage 3 & 4: Coordination & Optimization
    setTimeout(() => {
      this.state = 'COORDINATING';
      const msg3 = this.emergencyAgent.evaluateAmbulanceRoute(roadId);
      const msg4 = this.coordinatorAgent.arbitrateAndApprove();
      this.persistMessage(msg3);
      this.persistMessage(msg4);
      this.io.emit('agent:message', msg3);
      this.io.emit('agent:decision', msg4);

      this.state = 'OPTIMIZING';
      this.metrics = {
        avgWaitingTimeSec: 33.8,
        congestionPercent: 58,
        ambulanceEtaSec: 34,
        vehicleThroughputPerMin: 124,
        activeIncidents: 1,
        recoveryStatus: 'STAGE 4: GREEN-WAVE ACTUATED',
      };
      this.broadcastState();
    }, 7000);

    // Stage 5 & 6: Recovery & Learning
    setTimeout(() => {
      this.state = 'RECOVERING';
      this.io.emit('simulation:recovery', { incidentId });
      this.broadcastState();
    }, 13000);

    setTimeout(() => {
      this.state = 'STABILIZED';
      this.metrics = {
        avgWaitingTimeSec: 19.2,
        congestionPercent: 32,
        ambulanceEtaSec: 14,
        vehicleThroughputPerMin: 152,
        activeIncidents: 0,
        recoveryStatus: 'STAGE 6: STABILIZED',
      };
      db.prepare(
        `INSERT INTO incidents (id, road_id, location, detected_at, resolved_at, selected_action, peak_congestion, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        incidentId,
        roadId,
        'Arterial West (J1 → J4)',
        now,
        new Date().toISOString(),
        'Green-Wave Preemption (J1→J2→J5→J6)',
        76,
        'RESOLVED'
      );
      this.io.emit('simulation:stabilized', { incidentId });
      this.broadcastState();
    }, 19000);
  }

  private persistMessage(msg: { id: string; agent: string; type: string; message: string; stage: number; timestamp: string }) {
    db.prepare(
      `INSERT INTO agent_messages (id, agent, type, message, stage, created_at) VALUES (?, ?, ?, ?, ?, ?)`
    ).run(msg.id, msg.agent, msg.type, msg.message, msg.stage, msg.timestamp);
  }

  private broadcastState() {
    this.io.emit('simulation:state', this.getState());
    this.io.emit('simulation:metrics', this.metrics);
  }
}
