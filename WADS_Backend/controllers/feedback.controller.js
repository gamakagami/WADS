import mongoose from "mongoose";
import Feedback from "../models/feedback.model.js";
import Ticket from "../models/ticket.model.js";
import Notification from "../models/notification.model.js";

// Retrieving Feedback (Ratings count) For Agent's Dashboard
export const getAgentFeedbackSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const stats = await Feedback.aggregate([
      {
        $match: {
          agent: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    stats.forEach((s) => {
      formatted[s._id] = s.count;
    });

    res.status(200).json(formatted);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve feedback stats for agent" });
  }
};

// Retrieving feedback for each ticket
export const getFeedbackForTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findOne({ ticket: id });

    if (!feedback) {
      return res
        .status(404)
        .json({ message: "No feedback found for this ticket." });
    }

    res.status(200).json(feedback);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to retrieve feedback for this ticket." });
  }
};

// Creating feedback
export const createFeedback = async (req, res) => {
  const { rating } = req.body;
  const { id } = req.params;
  const userId = req.user._id;

  try {
    // Check if user already submitted feedback for this ticket
    const existing = await Feedback.findOne({ ticket: id, createdBy: userId });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Feedback already submitted for this ticket" });
    }

    // Fetch ticket and get assigned agent
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.status !== "resolved") {
      return res.status(400).json({ error: "Ticket has not been resolved" });
    }

    const agentId = ticket.assignedTo;

    if (!agentId) {
      return res.status(400).json({ error: "Ticket has no agent assigned" });
    }

    // Create feedback
    const feedback = new Feedback({
      ticket: id,
      createdBy: userId,
      agent: agentId,
      rating,
    });

    await feedback.save();

    // 🔔 User Notification
    const userNotification = new Notification({
      userId,
      title: "Feedback Submitted",
      content: `Your feedback for ticket "${ticket.title}" has been successfully submitted.`,
      type: "feedback",
      priority: "low",
      link: `/tickets/${ticket._id}`,
    });

    // 🔔 Agent Notification
    const agentNotification = new Notification({
      userId: agentId,
      title: "New Feedback Received",
      content: `You received feedback for resolved ticket "${ticket.title}".`,
      type: "feedback",
      priority: "medium",
      link: `/tickets/${ticket._id}`,
    });

    // 🔔 Admin Notification
    const adminNotification = new Notification({
      title: "New Feedback Submitted",
      content: `Feedback was submitted for ticket "${ticket.title}" by a user.`,
      type: "feedback",
      priority: "medium",
      link: `/tickets/${ticket._id}`,
      isAdminNotification: true,
    });

    await Promise.all([
      userNotification.save(),
      agentNotification.save(),
      adminNotification.save(),
    ]);

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
};
