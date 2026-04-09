import { createContext, useContext, useEffect, useState } from "react";
import socketIO from "../services/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = (token) => {
    if (token && !socketIO.connected) {
      socketIO.auth = {
        token: token,
      };

      const handleConnect = () => {
        console.log("✅ Socket connected:", socketIO.id);
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      };

      const handleConnectError = (error) => {
        console.error("Socket auth error:", error.message);
        setIsConnected(false);
      };

      socketIO.on("connect", handleConnect);
      socketIO.on("disconnect", handleDisconnect);
      socketIO.on("connect_error", handleConnectError);

      socketIO.connect();
      setSocket(socketIO);
    }
  };

  const disconnectSocket = () => {
    if (socketIO && socketIO.connected) {
      socketIO.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket || socketIO,
        isConnected,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
