import { Server } from 'socket.io';

export default function initializeSocket(io) {
  console.log('🔌 Initializing Socket.IO...');
  
  io.on('connection', (socket) => {
    console.log(`🔗 New client connected: ${socket.id} at ${new Date().toISOString()}`);

    // Store joined rooms for this socket
    const joinedRooms = new Set();

    // Helper function to join a room safely
    const joinRoom = (room) => {
      try {
        if (!joinedRooms.has(room)) {
          socket.join(room);
          joinedRooms.add(room);
          console.log(`📡 Client ${socket.id} joined room: ${room}`);
          
          // Send confirmation to client
          socket.emit('roomJoined', { room, timestamp: new Date().toISOString() });
          
          // Send room status
          io.to(room).emit('roomStatus', {
            room,
            totalClients: io.sockets.adapter.rooms.get(room)?.size || 0,
            timestamp: new Date().toISOString()
          });
        } else {
          console.log(`⚠️ Client ${socket.id} already in room: ${room}`);
        }
      } catch (error) {
        console.error(`❌ Error joining ${room} for client ${socket.id}:`, error.message);
        socket.emit('roomError', { room, error: error.message });
      }
    };

    // Helper function to leave a room safely
    const leaveRoom = (room) => {
      try {
        if (joinedRooms.has(room)) {
          socket.leave(room);
          joinedRooms.delete(room);
          console.log(`📤 Client ${socket.id} left room: ${room}`);
          
          // Send updated room status
          io.to(room).emit('roomStatus', {
            room,
            totalClients: io.sockets.adapter.rooms.get(room)?.size || 0,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`❌ Error leaving ${room} for client ${socket.id}:`, error.message);
      }
    };

    // Room management handlers
    socket.on('joinVolunteerRoom', () => {
      console.log(`🏠 Client ${socket.id} requesting to join volunteerRoom`);
      joinRoom('volunteerRoom');
    });

    socket.on('joinCallRoom', () => {
      console.log(`📞 Client ${socket.id} requesting to join callRoom`);
      joinRoom('callRoom');
    });

    socket.on('joinAnnouncementRoom', () => {
      console.log(`📢 Client ${socket.id} requesting to join announcementRoom`);
      joinRoom('announcementRoom');
    });

    socket.on('joinUpdateRequestRoom', () => {
      console.log(`🔄 Client ${socket.id} requesting to join updateRequestRoom`);
      joinRoom('updateRequestRoom');
    });

    socket.on('joinSubscriptionRoom', () => {
      console.log(`📰 Client ${socket.id} requesting to join subscriptionRoom`);
      joinRoom('subscriptionRoom');
    });

    socket.on('joinUserRoom', () => {
      console.log(`👥 Client ${socket.id} requesting to join userRoom`);
      joinRoom('userRoom');
    });

    socket.on('joinShiftAssignmentRoom', () => {
      console.log(`⏰ Client ${socket.id} requesting to join shiftAssignmentRoom`);
      joinRoom('shiftAssignmentRoom');
    });

    socket.on('joinActivityRoom', () => {
      console.log(`🎯 Client ${socket.id} requesting to join activityRoom`);
      joinRoom('activityRoom');
    });

    // Leave room handler
    socket.on('leaveRoom', ({ room }) => {
      if (room) {
        console.log(`🚪 Client ${socket.id} requesting to leave room: ${room}`);
        leaveRoom(room);
      }
    });

    // Get room status
    socket.on('getRoomStatus', ({ room }) => {
      try {
        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        socket.emit('roomStatus', {
          room,
          totalClients: roomSize,
          userInRoom: joinedRooms.has(room),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        socket.emit('roomError', { room, error: error.message });
      }
    });

    // Heartbeat/ping handler
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Handle client requesting room list
    socket.on('getJoinedRooms', () => {
      socket.emit('joinedRooms', {
        rooms: Array.from(joinedRooms),
        timestamp: new Date().toISOString()
      });
    });

    // Connection health check
    socket.on('healthCheck', () => {
      socket.emit('healthCheckResponse', {
        status: 'healthy',
        socketId: socket.id,
        joinedRooms: Array.from(joinedRooms),
        timestamp: new Date().toISOString()
      });
    });

    // Handle reconnection
    socket.on('reconnect', () => {
      console.log(`🔄 Client ${socket.id} reconnected`);
      
      // Re-emit joined rooms to help client rejoin
      socket.emit('reconnected', {
        socketId: socket.id,
        joinedRooms: Array.from(joinedRooms),
        timestamp: new Date().toISOString()
      });
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`❌ Socket error for client ${socket.id}:`, error);
    });

    socket.on('connect_error', (error) => {
      console.error(`❌ Connection error for client ${socket.id}:`, error.message);
    });

    // Graceful disconnection handling
    socket.on('disconnect', (reason) => {
      console.log(`👋 Client disconnected: ${socket.id}, Reason: ${reason}, Time: ${new Date().toISOString()}`);
      
      // Log which rooms the client was in
      if (joinedRooms.size > 0) {
        console.log(`📊 Client ${socket.id} was in rooms:`, Array.from(joinedRooms));
        
        // Update room statuses for remaining clients
        joinedRooms.forEach(room => {
          try {
            io.to(room).emit('roomStatus', {
              room,
              totalClients: io.sockets.adapter.rooms.get(room)?.size || 0,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error(`Error updating room status for ${room}:`, error.message);
          }
        });
      }
      
      // Clean up
      joinedRooms.clear();
    });

    // Send welcome message
    socket.emit('connected', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
      message: 'Successfully connected to server'
    });
  });

  // Global error handler for io
  io.on('error', (error) => {
    console.error('❌ Socket.IO server error:', error);
  });

  // Log total connections periodically
  setInterval(() => {
    const totalConnections = io.sockets.sockets.size;
    if (totalConnections > 0) {
      console.log(`📊 Total active connections: ${totalConnections}`);
      
      // Log room statistics
      const rooms = ['volunteerRoom', 'callRoom', 'announcementRoom', 'updateRequestRoom', 'subscriptionRoom', 'userRoom', 'shiftAssignmentRoom', 'activityRoom'];
      const roomStats = {};
      
      rooms.forEach(room => {
        const size = io.sockets.adapter.rooms.get(room)?.size || 0;
        if (size > 0) {
          roomStats[room] = size;
        }
      });
      
      if (Object.keys(roomStats).length > 0) {
        console.log('📊 Room statistics:', roomStats);
      }
    }
  }, 10000); // Every 30 seconds

  console.log('Socket.IO initialized successfully');
  
  return io;
}