import { io, Socket } from 'socket.io-client';
import { APP_CONFIG } from '../config/appConfig';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(APP_CONFIG.SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
