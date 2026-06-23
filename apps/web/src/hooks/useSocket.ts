import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (namespace: string, tenantId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

    const socketUrl = import.meta.env.VITE_API_URL || window.location.origin;
    
    socketRef.current = io(`${socketUrl}/${namespace}`, {
      query: { tenantId },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log(`Connected to CO WebSocket: ${socketRef.current?.id}`);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [namespace, tenantId]);

  const on = (event: string, callback: (data: any) => void) => {
    useEffect(() => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    }, [event, callback]);
  };

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  return { isConnected, on, emit, socket: socketRef.current };
};
