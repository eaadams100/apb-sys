import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '../services/socket';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = socketService.connect();
    setSocket(newSocket);

    return () => {
      socketService.disconnect();
    };
  }, []);

  return socket;
};