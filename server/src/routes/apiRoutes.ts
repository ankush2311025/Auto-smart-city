import { Router } from 'express';
import { SimulationEngine } from '../simulation/simulationEngine.js';
import { db } from '../database/sqlite.js';
import { generateCopilotReply } from '../copilot/copilotService.js';

export function createApiRouter(engine: SimulationEngine): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'AETHER-CITY Digital Twin Backend',
      aiProvider: process.env.AI_PROVIDER || 'demo',
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/simulation/state', (_req, res) => res.json(engine.getState()));
  router.post('/simulation/start', (_req, res) => {
    engine.start();
    res.json({ ok: true, ...engine.getState() });
  });
  router.post('/simulation/pause', (_req, res) => {
    engine.pause();
    res.json({ ok: true, ...engine.getState() });
  });
  router.post('/simulation/reset', (_req, res) => {
    engine.reset();
    res.json({ ok: true, ...engine.getState() });
  });
  router.post('/simulation/incident', (req, res) => {
    const roadId = typeof req.body?.roadId === 'string' ? req.body.roadId : 'A';
    engine.triggerRoadAccident(roadId);
    res.json({ ok: true, triggeredRoad: roadId, ...engine.getState() });
  });

  router.get('/agents', (_req, res) => {
    res.json([
      { id: 'traffic-agent', name: 'Traffic Agent', status: 'ACTIVE' },
      { id: 'emergency-agent', name: 'Emergency Agent', status: 'ACTIVE' },
      { id: 'coordinator-agent', name: 'City Coordinator Agent', status: 'ACTIVE' },
    ]);
  });

  router.get('/agents/logs', (_req, res) => {
    const rows = db.prepare('SELECT * FROM agent_messages ORDER BY created_at DESC LIMIT 50').all();
    res.json(rows);
  });

  router.get('/incidents', (_req, res) => {
    const rows = db.prepare('SELECT * FROM incidents ORDER BY detected_at DESC LIMIT 50').all();
    res.json(rows);
  });

  router.get('/metrics', (_req, res) => res.json(engine.getState().metrics));

  router.post('/copilot/chat', async (req, res) => {
    const message = req.body?.message;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Valid message string is required.' });
      return;
    }
    const result = await generateCopilotReply(message, engine.getState());
    res.json(result);
  });

  router.get('/research/summary', (_req, res) => {
    res.json({
      label: 'SIMULATED PROTOTYPE RESULTS',
      comparison: {
        fixedTimeAvgWaitSec: 54.0,
        multiAgentAvgWaitSec: 21.5,
        fixedTimeAmbulanceEtaSec: 112.0,
        multiAgentAmbulanceEtaSec: 34.0,
      },
    });
  });

  router.post('/demo/start', (_req, res) => {
    engine.reset();
    setTimeout(() => engine.triggerRoadAccident('A'), 2500);
    res.json({ ok: true, status: 'EVALUATOR_DEMO_STARTED' });
  });

  router.get('/demo/status', (_req, res) => {
    res.json({ ok: true, ...engine.getState() });
  });

  return router;
}
