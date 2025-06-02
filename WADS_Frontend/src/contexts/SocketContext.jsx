import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import PropTypes from "prop-types";

const SocketContext = createContext();

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    let newSocket = null;

    const initializeSocket = () => {
      if (user && user._id && user.accessToken) {
        console.log("Socket initialization - User data:", {
          userId: user._id,
          role: user.role,
          hasToken: !!user.accessToken,
          fullUser: user,
        });

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        console.log("Initializing socket connection to:", apiUrl);

        newSocket = io(apiUrl, {
          auth: {
            token: user.accessToken,
          },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true,
          path: "/socket.io",
        });

        newSocket.on("connect", () => {
          console.log("Socket connected successfully:", {
            socketId: newSocket.id,
            userId: user._id,
            auth: newSocket.auth,
            userData: user,
            connected: newSocket.connected,
            transport: newSocket.io.engine.transport.name,
          });
          setIsConnected(true);
        });

        newSocket.on("connect_error", (error) => {
          console.error("Socket connection error:", {
            error: error.message,
            userId: user._id,
            auth: newSocket.auth,
            userData: user,
            connected: newSocket.connected,
            transport: newSocket.io.engine?.transport?.name,
          });
          setIsConnected(false);
        });

        newSocket.on("error", (error) => {
          console.error("Socket error:", {
            error: error.message,
            userId: user._id,
            userData: user,
          });
          setIsConnected(false);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", {
            reason,
            userId: user._id,
            userData: user,
          });
          setIsConnected(false);
        });

        newSocket.on("connect_timeout", () => {
          console.error("Socket connection timeout");
          setIsConnected(false);
        });

        newSocket.on("reconnect", (attemptNumber) => {
          console.log("Socket reconnected after", attemptNumber, "attempts");
          setIsConnected(true);
        });

        newSocket.on("reconnect_error", (error) => {
          console.error("Socket reconnection error:", error);
          setIsConnected(false);
        });

        newSocket.on("reconnect_failed", () => {
          console.error("Socket reconnection failed after all attempts");
          setIsConnected(false);
        });

        setSocket(newSocket);
      }
    };

    initializeSocket();

    return () => {
      console.log("Cleaning up socket connection");
      if (newSocket) {
        if (newSocket.connected) {
          newSocket.disconnect();
        }
        newSocket.close();
      }
      setIsConnected(false);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { SocketProvider, useSocket };
