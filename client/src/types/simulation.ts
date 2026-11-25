export type SimulationState =
  | 'NORMAL'
  | 'DETECTED'
  | 'PREDICTING'
  | 'COORDINATING'
  | 'OPTIMIZING'
  | 'RECOVERING'
  | 'STABILIZED';

export type AgentName = 'Traffic Agent' | 'Emergency Agent' | 'City Coordinator Agent';

export type SignalColor = 'GREEN' | 'YELLOW' | 'RED';

export interface JunctionNode {
  id: 'J1' | 'J2' | 'J3' | 'J4' | 'J5' | 'J6';
  name: string;
  x: number;
  y: number;
  signal: SignalColor;
  queueLength: number;
  loadPercent: number;
  isPreempted: boolean;
}

export interface RoadSegment {
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  label: string;
  from: JunctionNode['id'];
  to: JunctionNode['id'];
  density: number; // 0 to 100
  blocked: boolean;
  isEmergencyCorridor: boolean;
}

export interface Vehicle {
  id: string;
  roadId: RoadSegment['id'];
  progress: number; // 0 to 1
  speed: number;
  rerouted?: boolean;
}

export interface AmbulanceState {
  id: string;
  active: boolean;
  route: JunctionNode['id'][];
  segmentIndex: number;
  progress: number;
  etaSeconds: number;
  rerouted: boolean;
  status: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: AgentName;
  type: 'OBSERVATION' | 'PREDICTION' | 'PROPOSAL' | 'DECISION' | 'ACTION' | 'LEARNING';
  message: string;
  stage: number;
}

export interface IncidentRecord {
  id: string;
  roadId: string;
  location: string;
  detectedAt: string;
  resolvedAt?: string;
  selectedAction: string;
  peakCongestion: number;
  ambulanceSavedSec: number;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface CityMetrics {
  avgWaitingTimeSec: number;
  congestionPercent: number;
  ambulanceEtaSec: number;
  vehicleThroughputPerMin: number;
  activeIncidents: number;
  recoveryStatus: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modeLabel?: string;
}
