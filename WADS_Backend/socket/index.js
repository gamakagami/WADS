import { Server } from "socket.io";
import { handleTicketJoin, handleTicketMessage } from "./ticketHandlers.js";
import Message from "../models/message.model.js";
import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    transports: ["websocket"],
  });

  console.log("Socket.IO server initialized with config:", {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/socket.io",
    transports: ["websocket"],
  });

  // Middleware to attach user to socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    console.log(
      "Socket connection attempt with token:",
      token ? "Token present" : "No token",
      {
        socketId: socket.id,
        handshake: {
          auth: socket.handshake.auth,
          headers: socket.handshake.headers,
          query: socket.handshake.query,
        },
      }
    );

    if (!token) {
      console.error("Socket connection rejected: No token provided");
      return next(new Error("Authentication error"));
    }

    try {
      // Verify token and attach user to socket
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", {
        userId: decoded.id,
        role: decoded.role,
        decodedData: decoded,
      });

      // Verify user exists in database
      const user = await User.findById(decoded.id);
      if (!user) {
        console.error("User not found in database:", decoded.id);
        return next(new Error("User not found"));
      }

      // Attach full user data to socket
      socket.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      console.log("Socket user data attached:", {
        socketId: socket.id,
        user: socket.user,
      });
      next();
    } catch (error) {
      console.error("Socket authentication error:", {
        message: error.message,
        token: token.substring(0, 20) + "...",
        socketId: socket.id,
      });
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", {
      socketId: socket.id,
      userId: socket.user?._id,
      role: socket.user?.role,
      userData: socket.user,
      transport: socket.conn.transport.name,
    });

    // Ticket events
    socket.on("ticket:join", (ticketId) => {
      console.log("Received ticket:join event:", {
        socketId: socket.id,
        userId: socket.user?._id,
        ticketId,
      });
      handleTicketJoin(socket, ticketId);
    });

    socket.on("ticket:message", (data, callback) => {
      console.log("Received ticket:message event:", {
        socketId: socket.id,
        userId: socket.user?._id,
        data,
      });
      handleTicketMessage(socket, data, callback, io);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", {
        socketId: socket.id,
        userId: socket.user?._id,
      });
    });

    // Join normal chat room
    socket.on("forum:join-room", async (roomId) => {
      try {
        // Join the room
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);

        // Get existing messages
        const messages = await Message.find({ roomId })
          .sort({ createdAt: -1 })
          .limit(50);

        // Send existing messages to the user
        socket.emit("forum:messages", messages.reverse());
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Error joining room" });
      }
    });

    // Handle normal messages
    socket.on("forum:send-message", async ({ content, roomId }, callback) => {
      try {
        if (!socket.user) {
          console.error("User not authenticated");
          if (typeof callback === 'function') {
            callback({ error: "User not authenticated" });
          }
          return;
        }

        if (!content?.trim()) {
          console.error("Message content required");
          if (typeof callback === 'function') {
            callback({ error: "Message content required" });
          }
          return;
        }

        if (!roomId) {
          console.error("Room ID required");
          if (typeof callback === 'function') {
            callback({ error: "Room ID required" });
          }
          return;
        }

        const newMessage = new Message({
          content: content.trim(),
          roomId,
          user: {
            userId: socket.user._id,
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
            email: socket.user.email,
          },
        });

        await newMessage.save();

        // Broadcast to all users in the room including sender
        io.to(roomId).emit("forum:message-received", newMessage);
        console.log(`Message sent to ${roomId}:`, newMessage);

        // Acknowledge successful message if callback is provided
        if (typeof callback === 'function') {
          callback({ success: true, message: newMessage });
        }
      } catch (error) {
        console.error("Error handling message:", error);
        if (typeof callback === 'function') {
          callback({ error: "Error sending message" });
        }
      }
    });
  });

  return io;
};
