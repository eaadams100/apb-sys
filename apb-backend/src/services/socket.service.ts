import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.model';

export const setupSocketIO = (io: SocketIOServer) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await UserModel.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`🔗 User ${user.name} connected`);

    // Join agency room for real-time updates
    socket.join(`agency:${user.agencyId}`);

    socket.on('disconnect', () => {
      console.log(`🔌 User ${user.name} disconnected`);
    });

    socket.on('bulletin:view', (bulletinId) => {
      // Track bulletin views if needed
      console.log(`User ${user.name} viewed bulletin ${bulletinId}`);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};