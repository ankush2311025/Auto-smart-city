import { AgentMessage } from '../types/domain.js';

export class TrafficAgent {
  detectAccident(roadId: string): AgentMessage {
    return {
      id: `msg-${Date.now()}-1`,
      agent: 'Traffic Agent',
      type: 'OBSERVATION',
      message: `Zero-velocity anomaly & collision detected on Road ${roadId}. Corridor blocked.`,
      stage: 1,
      timestamp: new Date().toISOString(),
    };
  }

  predictSpillover(): AgentMessage {
    return {
      id: `msg-${Date.now()}-2`,
      agent: 'Traffic Agent',
      type: 'PREDICTION',
      message: 'Congestion spillover predicted at J1 and J4 within 45s. Proposing J1→J2 arterial diversion.',
      stage: 2,
      timestamp: new Date().toISOString(),
    };
  }
}

export class EmergencyAgent {
  evaluateAmbulanceRoute(blockedRoad: string): AgentMessage {
    return {
      id: `msg-${Date.now()}-3`,
      agent: 'Emergency Agent',
      type: 'PROPOSAL',
      message: `AMB-01 route blocked by Road ${blockedRoad}. Requesting green-wave corridor J1 → J2 → J5 → J6.`,
      stage: 3,
      timestamp: new Date().toISOString(),
    };
  }
}

export class CityCoordinatorAgent {
  arbitrateAndApprove(): AgentMessage {
    return {
      id: `msg-${Date.now()}-4`,
      agent: 'City Coordinator Agent',
      type: 'DECISION',
      message: 'Safety priority enforced: Approved AMB-01 green-wave preemption across J1, J2, J5, J6.',
      stage: 4,
      timestamp: new Date().toISOString(),
    };
  }
}
