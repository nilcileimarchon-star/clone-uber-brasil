/**
 * Servidor Socket.io para rastreamento em tempo real
 * 
 * Este é um servidor básico de exemplo. Para produção, você deve:
 * 1. Implementar autenticação adequada
 * 2. Adicionar validação de dados
 * 3. Implementar lógica de matching de motoristas
 * 4. Adicionar persistência de dados (banco de dados)
 * 5. Implementar rate limiting
 * 
 * Para executar:
 * 1. Instale as dependências: npm install socket.io express cors
 * 2. Execute: node server/socket-server.js
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Armazenar motoristas online e suas localizações
const onlineDrivers = new Map();
const activeRides = new Map();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  const { userId, userType } = socket.handshake.auth;
  
  if (userType === 'driver') {
    onlineDrivers.set(userId, {
      socketId: socket.id,
      location: null,
      available: true
    });
    console.log(`Motorista ${userId} online`);
  }

  // Motorista: Atualizar localização
  socket.on('driver:location', (data) => {
    const driver = onlineDrivers.get(data.driverId);
    if (driver) {
      driver.location = data.location;
      driver.heading = data.heading;
      driver.speed = data.speed;
      
      // Enviar localização para passageiros em corridas ativas
      activeRides.forEach((ride, rideId) => {
        if (ride.driverId === data.driverId && ride.passengerId) {
          io.to(ride.passengerSocketId).emit('driver:location:update', data);
        }
      });
    }
  });

  // Passageiro: Solicitar corrida
  socket.on('ride:request', (request) => {
    console.log('Nova solicitação de corrida:', request);
    
    // Encontrar motoristas próximos (simplificado - em produção, use geolocalização adequada)
    const nearbyDrivers = Array.from(onlineDrivers.entries())
      .filter(([_, driver]) => driver.available && driver.location)
      .slice(0, 5); // Pegar os 5 primeiros motoristas disponíveis
    
    // Enviar solicitação para motoristas próximos
    nearbyDrivers.forEach(([driverId, driver]) => {
      io.to(driver.socketId).emit('ride:request', {
        ...request,
        timestamp: Date.now()
      });
    });

    // Armazenar informações da corrida
    activeRides.set(request.rideId, {
      ...request,
      passengerSocketId: socket.id,
      status: 'requested'
    });
  });

  // Motorista: Aceitar corrida
  socket.on('ride:accept', ({ rideId, driverId }) => {
    const ride = activeRides.get(rideId);
    if (ride) {
      ride.driverId = driverId;
      ride.status = 'accepted';
      
      const driver = onlineDrivers.get(driverId);
      if (driver) {
        driver.available = false;
        ride.driverSocketId = socket.id;
      }

      // Notificar passageiro
      io.to(ride.passengerSocketId).emit('ride:update', {
        rideId,
        status: 'accepted',
        driverId,
        driverLocation: driver?.location
      });

      console.log(`Corrida ${rideId} aceita pelo motorista ${driverId}`);
    }
  });

  // Atualizar status da corrida
  socket.on('ride:status', ({ rideId, status }) => {
    const ride = activeRides.get(rideId);
    if (ride) {
      ride.status = status;
      
      // Notificar ambas as partes
      if (ride.passengerSocketId) {
        io.to(ride.passengerSocketId).emit('ride:update', { rideId, status });
      }
      if (ride.driverSocketId) {
        io.to(ride.driverSocketId).emit('ride:update', { rideId, status });
      }

      // Se corrida completada ou cancelada, limpar
      if (status === 'completed' || status === 'cancelled') {
        if (ride.driverId) {
          const driver = onlineDrivers.get(ride.driverId);
          if (driver) {
            driver.available = true;
          }
        }
        activeRides.delete(rideId);
      }
    }
  });

  // Cancelar corrida
  socket.on('ride:cancel', ({ rideId, reason }) => {
    const ride = activeRides.get(rideId);
    if (ride) {
      // Notificar ambas as partes
      if (ride.passengerSocketId) {
        io.to(ride.passengerSocketId).emit('ride:update', {
          rideId,
          status: 'cancelled',
          reason
        });
      }
      if (ride.driverSocketId) {
        io.to(ride.driverSocketId).emit('ride:update', {
          rideId,
          status: 'cancelled',
          reason
        });
      }

      // Liberar motorista
      if (ride.driverId) {
        const driver = onlineDrivers.get(ride.driverId);
        if (driver) {
          driver.available = true;
        }
      }

      activeRides.delete(rideId);
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    
    // Remover motorista da lista de online
    if (userType === 'driver') {
      onlineDrivers.delete(userId);
      console.log(`Motorista ${userId} offline`);
    }

    // Cancelar corridas ativas do usuário
    activeRides.forEach((ride, rideId) => {
      if (ride.passengerSocketId === socket.id || ride.driverSocketId === socket.id) {
        socket.broadcast.emit('ride:update', {
          rideId,
          status: 'cancelled',
          reason: 'Usuário desconectado'
        });
        activeRides.delete(rideId);
      }
    });
  });
});

// Endpoint de status
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    onlineDrivers: onlineDrivers.size,
    activeRides: activeRides.size,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.io rodando na porta ${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});
