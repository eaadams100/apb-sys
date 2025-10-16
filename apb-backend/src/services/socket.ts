import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, (...args: any[]) => void> = new Map();

  connect(token: string) {
    this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server via WebSocket');
      this.reconnectListeners();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });

    return this.socket;
  }

  private reconnectListeners() {
    this.listeners.forEach((callback, event) => {
      this.socket?.on(event, callback);
    });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.listeners.set(event, callback);
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.listeners.delete(event);
    this.socket?.off(event);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.listeners.clear();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();