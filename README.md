# AETHER-CITY: Autonomous Multi-Agent Self-Healing Digital Twin for Smart Cities

An interactive, full-stack Cyber-Physical Digital Twin research platform built with **React, TypeScript, Tailwind CSS, Express.js, Socket.IO, SQLite**, and a context-grounded **GenAI City Copilot**.

## Industry-Ready Monorepo Architecture

```text
aether-city-digital-twin/
├── .env.example                 # Environment template (Backend, SQLite, Ollama/External LLM)
├── package.json                 # Root orchestration scripts (concurrently dev/build)
├── client/                      # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/          # Modular UI components (Header, DigitalTwinMap, CopilotPanel, etc.)
│   │   ├── pages/               # CommandCenter, ArchitecturePage, ResearchPage
│   │   ├── simulation/          # Local demo engine fallback & simulation constants
│   │   ├── hooks/               # useSimulationEngine (supports Demo Mode & Socket.IO Backend)
│   │   ├── services/            # REST API client & Socket.IO connector
│   │   ├── types/               # Strict TypeScript domain contracts
│   │   ├── App.tsx              # Application shell & view router
│   │   └── main.tsx             # Entry point
├── server/                      # Node.js + Express + TypeScript + Socket.IO Backend
│   ├── src/
│   │   ├── agents/              # TrafficAgent, EmergencyAgent, CityCoordinatorAgent
│   │   ├── simulation/          # 7-State FSM SimulationEngine & self-healing workflow
│   │   ├── copilot/             # GenAI service (Ollama, External LLM API, or Grounded Demo AI)
│   │   ├── database/            # SQLite schema initialization & persistence repository
│   │   ├── routes/              # REST API endpoints (/api/simulation, /api/agents, /api/copilot)
│   │   ├── socket/              # Real-time Socket.IO event broadcaster
│   │   ├── types/               # Shared server domain types
│   │   └── index.ts             # Express + Socket.IO server entry point
```

## Quick Start

1. **Copy environment configuration:**
   ```bash
   cp .env.example .env
   ```
2. **Install all dependencies (Root, Client, Server):**
   ```bash
   npm run install:all
   ```
3. **Run both Frontend and Backend concurrently:**
   ```bash
   npm run dev
   ```
   - **Frontend Operations Center:** `http://localhost:5173`
   - **Backend REST & Socket.IO Server:** `http://localhost:4000`

## Connecting Frontend to Backend Later
By default, `client/src/config/appConfig.ts` has `USE_BACKEND_SOCKET = false` so the frontend runs cleanly in standalone Demo-First mode without needing a running server. When you are ready to connect the Node/Express/SQLite backend:
1. Start the backend (`npm run dev:server`).
2. Set `VITE_USE_BACKEND=true` in `client/.env` (or toggle `USE_BACKEND_SOCKET = true` in `client/src/config/appConfig.ts`).
