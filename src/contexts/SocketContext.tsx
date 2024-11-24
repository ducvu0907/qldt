import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from '../contexts/AuthContext';

const SOCKET_URL = 'http://157.66.24.126:8080/ws';
const RECONNECT_DELAY = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

interface SocketContextType {
  stompClient: Client | null;
  isConnected: boolean;
  sendMessage: (receiverId: string, content: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<any> = ({ children }) => {
  const { token, userId, email } = useContext(AuthContext);
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  const setupStompClient = () => {
    if (!token) return;

    const socket = new SockJS(SOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        token,
        'heart-beat': '10000,10000',
      },
      reconnectDelay: RECONNECT_DELAY,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        reconnectAttempts.current = 0;

        const subscription = client.subscribe(`/user/${userId}/inbox`, (message) => {
          if (message.body) {
            const msg = JSON.parse(message.body);
            console.log(msg);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts.current += 1;
          const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current), 30000);
          setTimeout(() => {
            if (stompClientRef.current) {
              stompClientRef.current.activate();
            }
          }, delay);
        }
      },
      onStompError: (error) => {
        console.error('STOMP Error:', error);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket Error:', event);
      },
    });

    stompClientRef.current = client;
    return client;
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!receiverId || !content) {
      console.log('Invalid message data');
      return;
    }

    const message = {
      receiver: { id: receiverId },
      content,
      sender: email,
      token,
    };

    console.log('Sending message:', message);

    if (stompClientRef.current && isConnected) {
      stompClientRef.current.publish({ destination: '/chat/message', body: JSON.stringify(message) });
      console.log(`Sent message: ${JSON.stringify(message)}`);
    } else {
      console.log('Cannot send message. Not connected to WebSocket.');
    }
  };

  useEffect(() => {
    let client = null;

    if (token) {
      client = setupStompClient();
      client?.activate();
    }

    return () => {
      if (client) {
        client.deactivate();
        setIsConnected(false);
      }
    };
  }, [token, userId, email]);

  return (
    <SocketContext.Provider value={{ stompClient: stompClientRef.current, isConnected, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
