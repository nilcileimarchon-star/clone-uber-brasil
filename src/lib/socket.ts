import { io, Socket } from 'socket.io-client';
import { Location } from './maps';

// Tipos para eventos do Socket.io
export interface DriverLocation {
  driverId: string;
  location: Location;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface RideRequest {
  rideId: string;
  passengerId: string;
  pickup: Location;
  destination: Location;
  timestamp: number;
}

export interface RideUpdate {
  rideId: string;
  status: 'requested' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
  driverId?: string;
  driverLocation?: Location;
  eta?: number;
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, userType: 'driver' | 'passenger') {
    if (this.socket?.connected) {
      return this.socket;
    }

    // URL do servidor Socket.io (ajuste conforme necessário)
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    this.socket = io(socketUrl, {
      auth: {
        userId,
        userType
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts
    });

    this.setupEventHandlers();
    return this.socket;
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Máximo de tentativas de reconexão atingido');
      }
    });
  }

  // Motorista: Enviar localização em tempo real
  emitDriverLocation(location: DriverLocation) {
    if (this.socket?.connected) {
      this.socket.emit('driver:location', location);
    }
  }

  // Motorista: Escutar novas solicitações de corrida
  onRideRequest(callback: (request: RideRequest) => void) {
    if (this.socket) {
      this.socket.on('ride:request', callback);
    }
  }

  // Motorista: Aceitar corrida
  acceptRide(rideId: string, driverId: string) {
    if (this.socket?.connected) {
      this.socket.emit('ride:accept', { rideId, driverId });
    }
  }

  // Passageiro: Solicitar corrida
  requestRide(request: Omit<RideRequest, 'timestamp'>) {
    if (this.socket?.connected) {
      this.socket.emit('ride:request', {
        ...request,
        timestamp: Date.now()
      });
    }
  }

  // Passageiro: Escutar atualizações da corrida
  onRideUpdate(callback: (update: RideUpdate) => void) {
    if (this.socket) {
      this.socket.on('ride:update', callback);
    }
  }

  // Passageiro: Escutar localização do motorista
  onDriverLocationUpdate(callback: (location: DriverLocation) => void) {
    if (this.socket) {
      this.socket.on('driver:location:update', callback);
    }
  }

  // Atualizar status da corrida
  updateRideStatus(rideId: string, status: RideUpdate['status']) {
    if (this.socket?.connected) {
      this.socket.emit('ride:status', { rideId, status });
    }
  }

  // Cancelar corrida
  cancelRide(rideId: string, reason?: string) {
    if (this.socket?.connected) {
      this.socket.emit('ride:cancel', { rideId, reason });
    }
  }

  // Remover listener específico
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Verificar se está conectado
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Exportar instância singleton
export const socketService = new SocketService();
