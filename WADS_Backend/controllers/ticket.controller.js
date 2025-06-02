import mongoose from "mongoose";
import Ticket from "../models/ticket.model.js";
import Audit from "../models/audit.model.js";
import Counter from "../models/counter.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Room from "../models/room.model.js";

// Get all tickets for the current user
export const getTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!req.user || !req.user._id || !req.user.role) {
      console.error("❌ Missing user info in request:", req.user);
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized or invalid token" });
    }

    console.log("👤 User ID:", req.user._id);
    console.log("🔑 Role:", req.user.role);

    let query = {};

    if (req.user.role === "agent") {
      query = { "assignedTo.userId": req.user._id };
    } else if (req.user.role === "user") {
      query = { "user.userId": req.user._id };
    } else if (req.user.role === "admin") {
      query = {}; // Admin sees all tickets
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Unknown role" });
    }

    const tickets = await Ticket.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTickets = await Ticket.countDocuments(query);

    console.log("✅ Tickets fetched:", tickets.length);

    res.status(200).json({
      success: true,
      type: "tickets",
      data: tickets,
      currentPage: page,
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets: totalTickets,
    });
  } catch (error) {
    console.error("🚨 Error fetching tickets:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a specific ticket by ID
export const getTicket = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    let query = { _id: id };

    // Different query based on user role
    if (req.user.role === "user") {
      query["user.userId"] = req.user._id;
    } else if (req.user.role === "agent") {
      query["assignedTo.userId"] = req.user._id;
    }
    // Admin can view all tickets, so no additional query needed

    const ticket = await Ticket.findOne(query);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.log("Error in fetching ticket:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createTicket = async (req, res) => {
  const ticketData = req.body;

  // Validate required fields
  if (
    !ticketData.title ||
    !ticketData.category ||
    !ticketData.description ||
    !ticketData.department
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    console.log("Ticket data:", ticketData.attachments);

    // Convert attachments to match model structure if they exist
    if (ticketData.attachments && Array.isArray(ticketData.attachments)) {
      ticketData.attachments = ticketData.attachments.map(file => ({
        fileName: file.fileName,
        fileUrl: file.fileUrl || '', // Store base64 as fileUrl
        uploadedBy: req.user._id,
        uploadedAt: new Date()
      }));
    }

    // Round-robin agent assignment
    const agents = await User.find({ role: "agent" }).sort({ _id: 1 });
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No agents available for assignment",
      });
    }

    let counter = await Counter.findOne({ key: "agent_rr_index" });
    if (!counter) {
      counter = await Counter.create({ key: "agent_rr_index", value: 0 });
    }

    const agentIndex = counter.value % agents.length;
    const assignedAgent = agents[agentIndex];

    // Update counter
    counter.value = (counter.value + 1) % agents.length;
    await counter.save();

    // Create a room for the ticket
    const room = new Room({
      name: `Ticket: ${ticketData.title}`,
      users: [req.user._id, assignedAgent._id],
      isPublic: false,
      ticketId: null, // Will be set after ticket creation
    });
    await room.save();

    // Create the ticket with assigned agent
    const newTicket = new Ticket({
      ...ticketData,
      user: {
        userId: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
      assignedTo: {
        userId: assignedAgent._id,
        firstName: assignedAgent.firstName,
        lastName: assignedAgent.lastName,
        email: assignedAgent.email,
      },
      activityLog: [
        { action: "created", performedBy: req.user._id },
        {
          action: "assigned",
          performedBy: req.user._id,
          newValue: assignedAgent._id,
        },
      ],
      roomId: room._id, // Add room reference to ticket
    });

    await newTicket.save();

    // Update room with ticket ID
    room.ticketId = newTicket._id;
    await room.save();

    // Add room to user's rooms array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { rooms: room._id },
    });

    // Add room to agent's rooms array
    await User.findByIdAndUpdate(assignedAgent._id, {
      $push: { rooms: room._id },
    });

    // Audit log
    const auditLog = new Audit({
      ticket: newTicket._id,
      ticketId: newTicket._id.toString(),
      action: "created",
      performedBy: req.user._id,
      timestamp: new Date(),
    });
    await auditLog.save();

    // 🔔 Notifications
    const notificationsToSave = [];

    // Fetch user and agent for notification preferences
    const ticketOwner = await User.findById(req.user._id);
    const agentUser = await User.findById(assignedAgent._id);

    // 🔔 User Notification
    if (ticketOwner?.notificationSettings?.email?.ticketStatusUpdates) {
      const userNotification = new Notification({
        userId: req.user._id,
        title: "Ticket Submitted",
        content: `Your ticket "${ticketData.title}" has been successfully created and assigned to an agent.`,
        type: "ticket",
        priority: "low",
        link: `/tickets/${newTicket._id}`,
      });
      notificationsToSave.push(userNotification.save());
    }

    // 🔔 Agent Notification
    if (agentUser?.notificationSettings?.email?.ticketStatusUpdates) {
      const agentNotification = new Notification({
        userId: assignedAgent._id,
        title: "New Ticket Assigned",
        content: `A new ticket "${ticketData.title}" has been assigned to you.`,
        type: "ticket",
        priority: "medium",
        link: `/tickets/${newTicket._id}`,
      });
      notificationsToSave.push(agentNotification.save());
    }

    // 🔔 Admin Notification (always sent)
    const adminNotification = new Notification({
      title: "New Ticket Created",
      content: `A new ticket "${ticketData.title}" has been created and assigned to Agent ${assignedAgent.firstName} ${assignedAgent.lastName}.`,
      type: "ticket",
      priority: "medium",
      link: `/tickets/${newTicket._id}`,
      isAdminNotification: true,
    });
    notificationsToSave.push(adminNotification.save());

    await Promise.all(notificationsToSave);

    res.status(201).json({ success: true, data: newTicket });
  } catch (error) {
    console.error("Error in creating ticket:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update an existing ticket
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const ticketData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Ticket ID" });
  }

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      "user.userId": req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or not authorized",
      });
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, ticketData, {
      new: true,
    });

    // Audit Log: Ticket update
    const auditLog = new Audit({
      ticket: updatedTicket._id,
      ticketId: updatedTicket._id.toString(),
      action: "updated",
      performedBy: req.user._id,
      timestamp: new Date(),
    });
    await auditLog.save();

    // Fetch the user who owns the ticket to check their notification preferences
    const ticketOwner = await User.findById(req.user._id);

    const notificationsToSave = [];

    // 🔔 User Notification
    if (ticketOwner.notificationSettings?.email?.ticketStatusUpdates) {
      const userNotification = new Notification({
        userId: req.user._id,
        title: "Ticket Updated",
        content: `Your ticket "${updatedTicket.title}" has been updated.`,
        type: "ticket",
        priority: "low",
        link: `/tickets/${updatedTicket._id}`,
      });
      notificationsToSave.push(userNotification.save());
    }

    // 🔔 Agent Notification (You may want to check agent preferences too, if applicable)
    if (updatedTicket.assignedTo?.userId) {
      const agentUser = await User.findById(updatedTicket.assignedTo.userId);

      if (agentUser?.notificationSettings?.email?.ticketStatusUpdates) {
        const agentNotification = new Notification({
          userId: updatedTicket.assignedTo.userId,
          title: "Ticket Updated",
          content: `Ticket "${updatedTicket.title}" assigned to you has been updated by the user.`,
          type: "ticket",
          priority: "low",
          link: `/tickets/${updatedTicket._id}`,
        });
        notificationsToSave.push(agentNotification.save());
      }
    }

    // 🔔 Admin Notification (always send if it's a global admin board notification)
    const adminNotification = new Notification({
      title: "Ticket Updated",
      content: `Ticket "${updatedTicket.title}" has been updated by the user.`,
      type: "ticket",
      priority: "low",
      link: `/tickets/${updatedTicket._id}`,
      isAdminNotification: true,
    });
    notificationsToSave.push(adminNotification.save());

    await Promise.all(notificationsToSave);

    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    console.log("Error in updating ticket:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Ticket Id" });
  }

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      "user.userId": req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or not authorized",
      });
    }

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    // Audit Log: Ticket deletion
    const auditLog = new Audit({
      ticket: deletedTicket._id,
      ticketId: deletedTicket._id.toString(),
      action: "deleted",
      performedBy: req.user._id,
      timestamp: new Date(),
    });
    await auditLog.save();

    // Fetch the user who owns the ticket to check their notification preferences
    const ticketOwner = await User.findById(req.user._id);

    const notificationsToSave = [];

    // 🔔 User Notification
    if (ticketOwner.notificationSettings?.email?.ticketStatusUpdates) {
      const userNotification = new Notification({
        userId: req.user._id,
        title: "Ticket Deleted",
        content: `Your ticket "${ticket.title}" has been deleted.`,
        type: "ticket",
        priority: "low",
        link: `/tickets`,
      });
      notificationsToSave.push(userNotification.save());
    }

    // 🔔 Agent Notification (if assigned and has preferences)
    if (ticket.assignedTo?.userId) {
      const agentUser = await User.findById(ticket.assignedTo.userId);

      if (agentUser?.notificationSettings?.email?.ticketStatusUpdates) {
        const agentNotification = new Notification({
          userId: ticket.assignedTo.userId,
          title: "Ticket Deleted",
          content: `Ticket "${ticket.title}" assigned to you has been deleted by the user.`,
          type: "ticket",
          priority: "low",
          link: `/tickets`,
        });
        notificationsToSave.push(agentNotification.save());
      }
    }

    // 🔔 Admin Notification (always send)
    const adminNotification = new Notification({
      title: "Ticket Deleted",
      content: `Ticket "${ticket.title}" has been deleted by the user.`,
      type: "ticket",
      priority: "low",
      link: `/tickets`,
      isAdminNotification: true,
    });
    notificationsToSave.push(adminNotification.save());

    await Promise.all(notificationsToSave);

    res.status(200).json({ success: true, message: "Ticket deleted" });
  } catch (error) {
    console.error("Error in deleting ticket:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const uploadTicketAttachment = async (req, res) => {
  console.log("Incoming ticket attachment:", req.file);
  console.log("Ticket ID:", req.params.id);
  console.log("User ID:", req.user._id);

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Ticket ID" });
    }

    // Convert file to base64
    const base64File = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;
    const base64DataUri = `data:${mimeType};base64,${base64File}`;

    // Create attachment object
    const newAttachment = {
      fileName: req.file.originalname,
      fileUrl: base64DataUri,
      uploadedBy: req.user._id,
    };

    // Update ticket with new attachment
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $push: { attachments: newAttachment } },
      { new: true }
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Add to activity log
    updatedTicket.activityLog.push({
      action: "attachment_added",
      performedBy: req.user._id,
      newValue: req.file.originalname,
    });
    await updatedTicket.save();

    // Audit Log
    const auditLog = new Audit({
      ticket: updatedTicket._id,
      ticketId: updatedTicket._id.toString(),
      action: "attachment_added",
      performedBy: req.user._id,
      timestamp: new Date(),
      newValue: req.file.originalname,
    });
    await auditLog.save();

    // Notifications
    const notifications = [];

    // User notification (if not the user who uploaded)
    if (!updatedTicket.user.userId.equals(req.user._id)) {
      notifications.push(
        new Notification({
          userId: updatedTicket.user.userId,
          title: "Attachment Added",
          content: `An attachment was added to your ticket "${updatedTicket.title}"`,
          type: "ticket",
          priority: "low",
          link: `/tickets/${updatedTicket._id}`,
        })
      );
    }

    // Agent notification (if not the agent who uploaded)
    if (!updatedTicket.assignedTo.userId.equals(req.user._id)) {
      notifications.push(
        new Notification({
          userId: updatedTicket.assignedTo.userId,
          title: "Attachment Added",
          content: `An attachment was added to ticket "${updatedTicket.title}"`,
          type: "ticket",
          priority: "low",
          link: `/tickets/${updatedTicket._id}`,
        })
      );
    }

    // Admin notification
    notifications.push(
      new Notification({
        title: "Attachment Added",
        content: `An attachment was added to ticket "${updatedTicket.title}"`,
        type: "ticket",
        priority: "low",
        link: `/tickets/${updatedTicket._id}`,
        isAdminNotification: true,
      })
    );

    await Promise.all(notifications.map((n) => n.save()));

    res.status(200).json({
      success: true,
      message: "Attachment uploaded successfully",
      data: {
        fileName: newAttachment.fileName,
        fileUrl: newAttachment.fileUrl,
        uploadedAt: newAttachment.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload Ticket Attachment Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTicketMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const ticket = await Ticket.findOne({
      _id: id,
      $or: [
        { "user.userId": userId },
        { "assignedTo.userId": userId },
        { "participants.userId": userId },
      ],
    });

    if (!ticket) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket.messages,
    });
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const sendTicketMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, attachments } = req.body;
    const userId = req.user._id;

    if (!content && (!attachments || attachments.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Message content or attachment required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const ticket = await Ticket.findOne({
      _id: id,
      $or: [
        { "user.userId": userId },
        { "assignedTo.userId": userId },
        { "participants.userId": userId },
      ],
    });

    if (!ticket) {
      return res.status(403).json({
        success: false,
        message: "Not authorized or ticket not found",
      });
    }

    // Ensure user is in participants
    const isParticipant = ticket.participants.some((p) =>
      p.userId.equals(userId)
    );
    if (!isParticipant) {
      ticket.participants.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }

    const newMessage = {
      content,
      sender: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      attachments: attachments || [],
    };

    ticket.messages.push(newMessage);
    await ticket.save();

    // Emit real-time message
    req.app.get("io").to(`ticket-${id}`).emit("ticket-message", newMessage);

    // Create notifications for other participants
    const otherParticipants = ticket.participants.filter(
      (p) => !p.userId.equals(userId)
    );

    await Promise.all(
      otherParticipants.map(async (participant) => {
        const recipient = await User.findById(participant.userId);

        // Only notify if newResponses email setting is enabled
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

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending ticket message:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Ticket ID" });
  }

  // Validate status
  const validStatuses = ["pending", "in_progress", "resolved"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be one of: pending, in_progress, resolved",
    });
  }

  try {
    // Find ticket and verify agent is assigned to it
    const ticket = await Ticket.findOne({
      _id: id,
      "assignedTo.userId": req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found or not assigned to you",
      });
    }

    // Update ticket status
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // Create audit log
    const auditLog = new Audit({
      ticket: updatedTicket._id,
      ticketId: updatedTicket._id.toString(),
      action: "status_changed",
      fieldChanged: "status",
      previousValue: ticket.status,
      newValue: status,
      performedBy: req.user._id,
    });
    await auditLog.save();

    // Create notifications
    const notificationsToSave = [];

    // User notification
    const userNotification = new Notification({
      userId: ticket.user.userId,
      title: "Ticket Status Updated",
      content: `Your ticket "${ticket.title}" status has been updated to ${status}.`,
      type: "ticket",
      priority: "medium",
      link: `/tickets/${ticket._id}`,
    });
    notificationsToSave.push(userNotification.save());

    // Admin notification
    const adminNotification = new Notification({
      title: "Ticket Status Updated",
      content: `Ticket "${ticket.title}" status has been updated to ${status} by ${req.user.firstName} ${req.user.lastName}.`,
      type: "ticket",
      priority: "medium",
      link: `/tickets/${ticket._id}`,
      isAdminNotification: true,
    });
    notificationsToSave.push(adminNotification.save());

    await Promise.all(notificationsToSave);

    res.status(200).json({
      success: true,
      data: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
