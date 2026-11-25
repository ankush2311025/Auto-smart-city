import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'aether_city.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      road_id TEXT NOT NULL,
      location TEXT NOT NULL,
      detected_at TEXT NOT NULL,
      resolved_at TEXT,
      selected_action TEXT,
      peak_congestion INTEGER,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_messages (
      id TEXT PRIMARY KEY,
      agent TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      stage INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_decisions (
      id TEXT PRIMARY KEY,
      incident_id TEXT,
      approved_by TEXT NOT NULL,
      decision_summary TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS simulation_runs (
      id TEXT PRIMARY KEY,
      started_at TEXT NOT NULL,
      mode TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS simulation_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sim_state TEXT NOT NULL,
      avg_wait_sec REAL NOT NULL,
      congestion_percent INTEGER NOT NULL,
      ambulance_eta_sec INTEGER NOT NULL,
      throughput_per_min INTEGER NOT NULL,
      recorded_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS copilot_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_prompt TEXT NOT NULL,
      assistant_reply TEXT NOT NULL,
      provider_used TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
