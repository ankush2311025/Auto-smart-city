export type SimulationState =
  | 'NORMAL'
  | 'DETECTED'
  | 'PREDICTING'
  | 'COORDINATING'
  | 'OPTIMIZING'
  | 'RECOVERING'
  | 'STABILIZED';

export interface CityMetrics {
  avgWaitingTimeSec: number;
  congestionPercent: number;
  ambulanceEtaSec: number;
  vehicleThroughputPerMin: number;
  activeIncidents: number;
  recoveryStatus: string;
}

export interface AgentMessage {
  id: string;
  agent: 'Traffic Agent' | 'Emergency Agent' | 'City Coordinator Agent';
  type: 'OBSERVATION' | 'PREDICTION' | 'PROPOSAL' | 'DECISION' | 'ACTION' | 'LEARNING';
  message: string;
  stage: number;
  timestamp: string;
}
