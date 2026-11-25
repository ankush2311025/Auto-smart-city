import React, { useState } from 'react';
import { Crosshair, HeartPulse, ShieldAlert } from 'lucide-react';
import { AmbulanceState, JunctionNode, RoadSegment, Vehicle } from '../types/simulation';

interface CityDigitalTwinMapProps {
  junctions: JunctionNode[];
  roads: RoadSegment[];
  vehicles: Vehicle[];
  ambulance: AmbulanceState;
  expanded?: boolean;
}

export const CityDigitalTwinMap: React.FC<CityDigitalTwinMapProps> = ({
  junctions,
  roads,
  vehicles,
  ambulance,
  expanded = false,
}) => {
  const [selectedJunction, setSelectedJunction] = useState<JunctionNode | null>(null);

  const getJunction = (id: JunctionNode['id']) => junctions.find((j) => j.id === id)!;

  const getRoadStroke = (road: RoadSegment) => {
    if (road.blocked) return '#f43f5e';
    if (road.isEmergencyCorridor) return '#22d3ee';
    if (road.density > 65) return '#f97316';
    if (road.density > 45) return '#eab308';
    return '#10b981';
  };

  // Compute Ambulance Coordinates along current segment
  const fromId = ambulance.route[ambulance.segmentIndex] || 'J1';
  const toId = ambulance.route[ambulance.segmentIndex + 1] || 'J6';
  const ambFrom = getJunction(fromId);
  const ambTo = getJunction(toId);
  const ambX = ambFrom.x + (ambTo.x - ambFrom.x) * ambulance.progress;
  const ambY = ambFrom.y + (ambTo.y - ambFrom.y) * ambulance.progress;

  return (
    <div className="relative flex flex-col rounded-2xl border border-cyan-500/20 bg-[#070D1E]/90 p-3.5 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.06)]">
      {/* Map Header */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
            Live Cyber-Physical City Digital Twin (J1–J6)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Nominal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Incident / Blocked
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400" /> Green-Wave Corridor
          </span>
        </div>
      </div>

      {/* SVG City Visualization */}
      <div className={`relative w-full overflow-hidden rounded-xl border border-slate-800/90 bg-[#040814] ${expanded ? 'h-[430px]' : 'h-[330px]'}`}>
        <svg viewBox="0 0 800 410" className="h-full w-full">
          <defs>
            <pattern id="cyberGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="1" />
            </pattern>
            <filter id="glowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Tactical Background Grid & River Contour */}
          <rect width="800" height="410" fill="url(#cyberGrid)" />
          <path
            d="M 0 375 Q 250 355 460 385 T 800 365 L 800 410 L 0 410 Z"
            fill="rgba(14, 116, 144, 0.14)"
          />

          {/* Road Corridors */}
          {roads.map((road) => {
            const p1 = getJunction(road.from);
            const p2 = getJunction(road.to);
            const strokeColor = getRoadStroke(road);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={road.id}>
                {/* Road Casing */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#0f172a"
                  strokeWidth={18}
                  strokeLinecap="round"
                />
                {/* Dynamic Density / Corridor Line */}
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={road.isEmergencyCorridor ? 7 : 5}
                  strokeDasharray={road.blocked ? '8 6' : undefined}
                  strokeLinecap="round"
                  filter={road.isEmergencyCorridor ? 'url(#glowCyan)' : undefined}
                />
                {/* Road Label Pill */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-28"
                    y="-10"
                    width="56"
                    height="20"
                    rx="5"
                    fill="#060B19"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dy="3.5"
                    fill="#e2e8f0"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {['A', 'B', 'C', 'D'].includes(road.id) ? `ROAD ${road.id}` : road.id}
                  </text>
                </g>

                {/* Accident Hazard Marker on Blocked Road */}
                {road.blocked && (
                  <g transform={`translate(${midX}, ${midY - 26})`}>
                    <circle r="14" fill="rgba(244,63,94,0.22)" />
                    <circle r="8" fill="#f43f5e" />
                    <text textAnchor="middle" dy="3.5" fill="#fff" fontSize="10" fontWeight="bold">
                      !
                    </text>
                    <text
                      textAnchor="middle"
                      y="-14"
                      fill="#fda4af"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      ACCIDENT BLOCKAGE
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Metropolitan Trauma Center (Near J6) */}
          <g transform="translate(655, 368)">
            <rect
              x="-78"
              y="-14"
              width="156"
              height="26"
              rx="6"
              fill="#061428"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <text textAnchor="middle" dy="3" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              + METROPOLITAN TRAUMA CENTER
            </text>
          </g>

          {/* Moving Civilian Vehicles */}
          {vehicles.map((v) => {
            const road = roads.find((r) => r.id === v.roadId);
            if (!road) return null;
            const p1 = getJunction(road.from);
            const p2 = getJunction(road.to);
            const vx = p1.x + (p2.x - p1.x) * v.progress;
            const vy = p1.y + (p2.y - p1.y) * v.progress;
            return (
              <circle
                key={v.id}
                cx={vx}
                cy={vy}
                r="3.2"
                fill="#94a3b8"
                stroke="#0f172a"
                strokeWidth="1"
              />
            );
          })}

          {/* Junction Nodes & Traffic Signals */}
          {junctions.map((j) => {
            const sigFill =
              j.signal === 'GREEN' ? '#10b981' : j.signal === 'YELLOW' ? '#f59e0b' : '#ef4444';
            return (
              <g
                key={j.id}
                transform={`translate(${j.x}, ${j.y})`}
                onClick={() => setSelectedJunction(j)}
                className="cursor-pointer"
              >
                {j.isPreempted && (
                  <circle
                    r="26"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                )}
                <circle
                  r="18"
                  fill="#091326"
                  stroke={j.isPreempted ? '#22d3ee' : '#334155'}
                  strokeWidth="2"
                />
                {/* Signal Lamp */}
                <circle cx="13" cy="-13" r="5.5" fill={sigFill} stroke="#040814" strokeWidth="1.5" />
                <text textAnchor="middle" dy="4" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  {j.id}
                </text>
                <text textAnchor="middle" y="30" fill="#94a3b8" fontSize="9.5">
                  {j.name}
                </text>
              </g>
            );
          })}

          {/* Emergency Ambulance Unit */}
          {ambulance.active && (
            <g transform={`translate(${ambX}, ${ambY})`}>
              <circle r="15" fill="rgba(56,189,248,0.22)" />
              <rect
                x="-11"
                y="-7"
                width="22"
                height="14"
                rx="4"
                fill="#f8fafc"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text textAnchor="middle" dy="3" fill="#dc2626" fontSize="8.5" fontWeight="bold">
                +
              </text>
              <text
                textAnchor="middle"
                y="-12"
                fill="#38bdf8"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                AMB-01
              </text>
            </g>
          )}
        </svg>

        {/* Interactive Junction Inspector HUD */}
        {selectedJunction && (
          <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-[#060B19]/95 px-3 py-2 text-xs backdrop-blur-md">
            <div>
              <div className="font-mono font-bold text-cyan-300">
                {selectedJunction.id} — {selectedJunction.name}
              </div>
              <div className="text-[11px] text-slate-300">
                Signal: <span className="font-semibold">{selectedJunction.signal}</span> | Load:{' '}
                <span className="font-mono">{selectedJunction.loadPercent}%</span> | Queue:{' '}
                <span className="font-mono">{selectedJunction.queueLength} veh</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedJunction(null)}
              className="rounded border border-slate-700 px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Bottom Ambulance Telemetry Strip */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800/90 bg-slate-950/75 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-4 w-4 text-rose-400" />
          <span className="font-mono font-semibold text-white">AMB-01:</span>
          <span className="text-slate-300">{ambulance.status}</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-cyan-300">Path: {ambulance.route.join(' → ')}</span>
          <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-300">
            ETA: {ambulance.etaSeconds}s
          </span>
        </div>
      </div>
    </div>
  );
};
