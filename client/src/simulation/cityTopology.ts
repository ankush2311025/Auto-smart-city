import { JunctionNode, RoadSegment } from '../types/simulation';

export const INITIAL_JUNCTIONS: JunctionNode[] = [
  { id: 'J1', name: 'Westgate Hub', x: 145, y: 125, signal: 'GREEN', queueLength: 6, loadPercent: 32, isPreempted: false },
  { id: 'J2', name: 'Central Plaza', x: 400, y: 125, signal: 'RED', queueLength: 8, loadPercent: 38, isPreempted: false },
  { id: 'J3', name: 'North Tech Park', x: 655, y: 125, signal: 'GREEN', queueLength: 5, loadPercent: 28, isPreempted: false },
  { id: 'J4', name: 'Harbor Interchange', x: 145, y: 315, signal: 'RED', queueLength: 7, loadPercent: 35, isPreempted: false },
  { id: 'J5', name: 'Midtown Cross', x: 400, y: 315, signal: 'GREEN', queueLength: 9, loadPercent: 41, isPreempted: false },
  { id: 'J6', name: 'Trauma District', x: 655, y: 315, signal: 'GREEN', queueLength: 4, loadPercent: 24, isPreempted: false },
];

export const INITIAL_ROADS: RoadSegment[] = [
  { id: 'A', label: 'Road A (Arterial West)', from: 'J1', to: 'J4', density: 34, blocked: false, isEmergencyCorridor: false },
  { id: 'B', label: 'Road B (Northern Express)', from: 'J1', to: 'J2', density: 30, blocked: false, isEmergencyCorridor: false },
  { id: 'C', label: 'Road C (Central Spine)', from: 'J2', to: 'J5', density: 36, blocked: false, isEmergencyCorridor: false },
  { id: 'D', label: 'Road D (Medical Corridor)', from: 'J5', to: 'J6', density: 28, blocked: false, isEmergencyCorridor: false },
  { id: 'E', label: 'East Connector', from: 'J2', to: 'J3', density: 26, blocked: false, isEmergencyCorridor: false },
  { id: 'F', label: 'Southern Bypass', from: 'J4', to: 'J5', density: 32, blocked: false, isEmergencyCorridor: false },
  { id: 'G', label: 'East Medical Link', from: 'J3', to: 'J6', density: 25, blocked: false, isEmergencyCorridor: false },
];

export const SUGGESTED_COPILOT_PROMPTS = [
  'What is happening in the city right now?',
  'Why was Road A blocked?',
  'Why did the ambulance change its route?',
  'Explain the self-healing process.',
  'What would happen if Road B was closed?',
  'Which junction has the highest congestion?',
  'Why did the Coordinator prioritize the ambulance?',
  'Compare the normal and recovery states.',
  'Explain our project architecture in simple language.',
];
