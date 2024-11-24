import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';
import { AuthContext } from "./AuthContext";
import { AUTH_SERVER_URL } from "../types";

interface SocketContextType {
  stompClient: any;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (receiverId: string, content: string) => void;
  receiveMessage: (callback: (message: any) => void) => void;
}

const SocketContext = createContext<SocketContextType>({
  stompClient: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  sendMessage: () => {},
  receiveMessage: () => {},
});

interface SocketContextProviderProps {
  children: ReactNode;
}

const SocketProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const { token, userId } = useContext(AuthContext);
  const [stompClient, setStompClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (token && userId) {
      connect();
    }

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [token, userId]);

  const connect = () => {
    const socket = new SockJS(`http://157.66.24.126:8080/ws`);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setIsConnected(true);
      client.subscribe(`/user/${userId}/inbox`, (message) => {
        console.log('Received message:', JSON.parse(message.body));
      });
    });

    setStompClient(client);
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect(() => {
        setIsConnected(false);
        console.log("Disconnected from WebSocket");
      });
    }
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!stompClient || !userId) return;
    const message = {
      receiver: { id: receiverId },
      content,
      sender: userId,
      token,
    };

    stompClient.send("/chat/message", {}, JSON.stringify(message));
  };

  const receiveMessage = (callback: (message: any) => void) => {
    if (!stompClient || !userId) return;
    stompClient.subscribe(`/user/${userId}/inbox`, (message: any) => {
      callback(JSON.parse(message.body));
    });
  };

  return (
    <SocketContext.Provider value={{ stompClient, isConnected, connect, disconnect, sendMessage, receiveMessage }} >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };