import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initDatabase } from './database/sqlite.js';
import { SimulationEngine } from './simulation/simulationEngine.js';
import { createApiRouter } from './routes/apiRoutes.js';

dotenv.config({ path: '../.env' });

const PORT = Number(process.env.PORT) || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

initDatabase();

const app = express();
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: FRONTEND_URL, methods: ['GET', 'POST'] },
});

const engine = new SimulationEngine(io);
app.use('/api', createApiRouter(engine));

io.on('connection', (socket) => {
  socket.emit('simulation:state', engine.getState());
});

server.listen(PORT, () => {
  console.log(`[AETHER-CITY] Backend & Socket.IO server listening on http://localhost:${PORT}`);
});
