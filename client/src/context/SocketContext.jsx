import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import socketIO from "../services/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
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

    return () => {
      socketIO.off("connect", handleConnect);
      socketIO.off("disconnect", handleDisconnect);
      socketIO.off("connect_error", handleConnectError);
    };
  }, []);

  const connectSocket = useCallback((token) => {
    if (!token) {
      return;
    }

    if (socketIO.connected && socketIO.auth?.token === token) {
      setSocket(socketIO);
      return;
    }

    if (socketIO.connected) {
      socketIO.disconnect();
    }

    socketIO.auth = { token };
    socketIO.connect();
    setSocket(socketIO);
  }, []);

  const disconnectSocket = useCallback(() => {
    socketIO.off("newPost");

    if (socketIO.connected) {
      socketIO.disconnect();
    }

    socketIO.auth = {};
    setSocket(null);
    setIsConnected(false);
  }, []);

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
