import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const handleTicketJoin = async (socket, ticketId) => {
  try {
    const userId = socket.user?._id;
    console.log("Attempting to join ticket:", {
      ticketId,
      userId,
      socketUser: socket.user,
      socketId: socket.id,
      socketAuth: socket.auth,
    });

    if (!userId) {
      console.error("No user ID in socket.user:", socket.user);
      socket.emit("error", { message: "User not authenticated" });
      return;
    }

    // Find ticket and verify user has access
    const ticket = await Ticket.findOne({
      _id: ticketId,
      $or: [
        { "user.userId": userId },
        { "assignedTo.userId": userId },
        { "participants.userId": userId },
      ],
    });

    if (!ticket) {
      console.error("Ticket access denied:", {
        ticketId,
        userId,
        query: {
          _id: ticketId,
          $or: [
            { "user.userId": userId },
            { "assignedTo.userId": userId },
            { "participants.userId": userId },
          ],
        },
      });
      socket.emit("error", { message: "Not authorized or ticket not found" });
      return;
    }

    console.log("Ticket access granted:", {
      ticketId,
      userId,
      ticketParticipants: ticket.participants.map((p) => p.userId),
      ticketUser: ticket.user.userId,
      ticketAssignedTo: ticket.assignedTo.userId,
    });

    // Join the ticket room
    socket.join(`ticket-${ticketId}`);

    // Send existing messages to the user
    console.log("Sending existing messages:", ticket.messages);
    socket.emit("ticket-messages", ticket.messages);
  } catch (error) {
    console.error("Error in handleTicketJoin:", error);
    socket.emit("error", { message: "Server error" });
  }
};

export const handleTicketMessage = async (socket, data, callback, io) => {
  try {
    const { ticketId, content } = data;
    const userId = socket.user?._id;
    console.log("Attempting to send message:", {
      ticketId,
      userId,
      socketUser: socket.user,
    });

    if (!userId) {
      console.error("No user ID in socket.user:", socket.user);
      callback({ error: "User not authenticated" });
      return;
    }

    if (!content?.trim()) {
      callback({ error: "Message content required" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found in database:", {
        userId,
        socketUser: socket.user,
      });
      callback({ error: "User not found" });
      return;
    }

    console.log("User found:", {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    const ticket = await Ticket.findOne({
      _id: ticketId,
      $or: [
        { "user.userId": userId },
        { "assignedTo.userId": userId },
        { "participants.userId": userId },
      ],
    });

    if (!ticket) {
      console.error("Ticket access denied for message:", {
        ticketId,
        userId,
        userRole: user.role,
        query: {
          _id: ticketId,
          $or: [
            { "user.userId": userId },
            { "assignedTo.userId": userId },
            { "participants.userId": userId },
          ],
        },
      });
      callback({ error: "Not authorized or ticket not found" });
      return;
    }

    console.log("Message access granted:", {
      ticketId,
      userId,
      userRole: user.role,
      ticketParticipants: ticket.participants.map((p) => p.userId),
    });

    // Create new message
    const newMessage = {
      content,
      sender: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      createdAt: new Date(),
    };

    // Add message to ticket
    ticket.messages.push(newMessage);
    await ticket.save();

    // Emit message to all users in the ticket room including sender
    socket.broadcast
      .to(`ticket-${ticketId}`)
      .emit("ticket-message", newMessage);
    // Also emit to sender
    socket.emit("ticket-message", newMessage);

    // Create notifications for other participants
    const otherParticipants = ticket.participants.filter(
      (p) => !p.userId.equals(userId)
    );

    await Promise.all(
      otherParticipants.map(async (participant) => {
        const recipient = await User.findById(participant.userId);

        if (recipient?.notificationSettings?.email?.newResponses) {
          const notification = new Notification({
            userId: participant.userId,
            title: `New message in ticket #${ticket._id}`,
            content: `New message from ${user.firstName}: ${content.substring(
              0,
              50
            )}...`,
            type: "ticket-message",
            priority: "medium",
            link: `/tickets/${ticket._id}`,
          });
          await notification.save();
        }
      })
    );

    // Send acknowledgment to sender
    callback({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error in handleTicketMessage:", error);
    callback({ error: "Server error" });
  }
};
