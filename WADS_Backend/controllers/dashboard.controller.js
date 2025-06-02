import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import Audit from "../models/audit.model.js";
import mongoose from 'mongoose';
import Feedback from '../models/feedback.model.js';
import responseTime from "../models/responseTime.model.js";
import uptimeLog from '../models/uptimeLog.model.js';

export const getGlobalStats = async (req, res) => {
  try {
    // Global ticket statistics
    const counts = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const ticketStats = {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
    };

    for (const item of counts) {
      ticketStats.total += item.count;
      switch (item._id) {
        case "pending":
          ticketStats.pending = item.count;
          break;
        case "in_progress":
          ticketStats.inProgress = item.count;
          break;
        case "resolved":
          ticketStats.resolved = item.count;
          break;
        default:
          break;
      }
    }

    // If your total includes all tickets regardless of status, consider using .countDocuments() instead
    const totalTicketCount = await Ticket.countDocuments();
    ticketStats.total = totalTicketCount;

    // Global user statistics
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [totalUsers, activeToday, newUsers, totalAgents] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ role: 'agent' })
    ]);

    const userStats = {
      totalUsers,
      activeToday,
      newUsers,
      totalAgents
    };

    // Global feedback statistics
    const totalCount = await Feedback.countDocuments();
    const ratings = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    const feedbackStats = { 
      positive: 0, 
      neutral: 0, 
      negative: 0, 
      totalCount 
    };

    ratings.forEach(({ _id, count }) => {
      feedbackStats[_id] = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    });

    // Final Result to be sent to frontend
    const result ={
      ticketStats,
      userStats,
      feedbackStats
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching global statistics:', error);
    res.status(500).json({ message: 'Failed to fetch global statistics' });
  }
};

const getAuditDescription = (log) => {
  const user = log.performedBy;
  const userName = user ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ${user.firstName} ${user.lastName[0]}.` : "A user";

  const ticketId = log.ticket?._id?.toString() || log.ticketId || "xxxxx";
  const shortTicketId = ticketId.slice(-5);

  switch (log.action) {
    case 'created':
      return `${userName} created ticket #${shortTicketId}`;
    case 'updated':
      return `${userName} updated ticket #${shortTicketId}`;
    case 'resolved':
      return `${userName} resolved ticket #${shortTicketId}`;
    case 'deleted':
      return `${userName} deleted ticket #${shortTicketId}`;
    default:
      return `${userName} performed an action on ticket #${shortTicketId}`;
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const auditLogs = await Audit.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate({ path: 'ticket', select: 'title' })
      .populate({ path: 'performedBy', select: 'firstName lastName email role' });

    const logsWithDescription = auditLogs.map(log => ({
      ...log.toObject(),
      description: getAuditDescription(log),
    }));

    res.status(200).json({ success: true, data: logsWithDescription });
  } catch (error) {
    console.error("Error fetching recent audit logs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getRecentTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('category status user assignedTo createdAt updatedAt') // minimal data needed
      .lean();

    const formatted = tickets.map(ticket => ({
      category: ticket.category,
      status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
      submittedBy: ticket.user,
      assignedTo: ticket.assignedTo,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      _id: ticket._id
    }));

    res.status(200).json({ recentTickets: formatted });
  } catch (err) {
    console.error('Failed to fetch recent tickets:', err);
    res.status(500).json({ message: 'Error retrieving recent tickets' });
  }
};

export const getAgentPerformance = async (req, res) => {
  try {

    const aggregation = await Ticket.aggregate([
      {
        $group: {
          _id: {
            assignedTo: '$assignedTo',
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.assignedTo',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      }
    ]);    

    const formatted = aggregation.map(agent => {
      const statusMap = {
        pending: 0,
        in_progress: 0,
        resolved: 0
      };
    
      for (const s of agent.statuses) {
        statusMap[s.status] = s.count;
      }
    
      return {
        assignedTo: agent._id,
        ...statusMap
      };
    });

    //const totalResolved = aggregation.reduce((sum, agent) => sum + agent.resolvedCount, 0);

    res.status(200).json({
      performance: formatted
    });
  } catch (err) {
    console.error('Agent performance fetch failed:', err);
    res.status(500).json({ message: 'Unable to get agent performance' });
  }
};

// agent dashboard

export const getAgentDashboardStats = async (req, res) => {
  try {
     const agentId = req.user._id;

    // Total tickets assigned to the agent
    const totalAssigned = await Ticket.countDocuments({ 'assignedTo.userId': agentId });

    // Tickets resolved this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    const resolvedThisWeek = await Ticket.countDocuments({
      'assignedTo.userId': agentId,
      status: 'resolved',
      updatedAt: { $gte: startOfWeek }
    });

    // Customer satisfaction ratings for this agent
    const feedbackAggregation = await Feedback.aggregate([
      { $match: { agent: new mongoose.Types.ObjectId(agentId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    

    const totalCount = feedbackAggregation.reduce((sum, { count }) => sum + count, 0);
    
    const feedbackStats = { 
      positive: 0, 
      neutral: 0, 
      negative: 0,
      totalCount
    };

     feedbackAggregation.forEach(({ _id, count }) => {
      feedbackStats[_id] = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    });
    
    // Send response
    res.status(200).json({
      totalAssigned,
      resolvedThisWeek,
      feedbackStats
    });

  } catch (err) {
    console.error('Agent dashboard error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecentAgentTickets = async (req, res) => {
  const agentId = req.user._id;

  if (!agentId) {
    return res.status(401).json({ message: 'Unauthorized: Agent not authenticated' });
  }

  try {
    const tickets = await Ticket.find({ 'assignedTo.userId': agentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('category status user createdAt updatedAt')
      .lean();

    const formatted = tickets.map(ticket => ({
      category: ticket.category,
      status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
      submittedBy: ticket.user,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      _id: ticket._id
    }));

    res.status(200).json({ recentTickets: formatted });
  } catch (err) {
    console.error('Failed to fetch recent tickets for agent:', err);
    res.status(500).json({ message: 'Error retrieving recent tickets for agent' });
  }
};


export const getAgentTicketStatus = async (req, res) => {
  try {
    const agentId = req.user._id;

    const statusCounts = await Ticket.aggregate([
      { $match: { 'assignedTo.userId': new mongoose.Types.ObjectId(agentId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format result into consistent structure
    const formatted = {
      pending: 0,
      in_progress: 0,
      resolved: 0
    };

    for (const s of statusCounts) {
      formatted[s._id] = s.count;
    }
    
    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error getting agent ticket status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// user dashboard

export const getRecentUserTickets = async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required in the route params' });
  }

  try {
    const tickets = await Ticket.find({ 'user.userId': userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('category status assignedTo createdAt updatedAt')
      .lean();

    const formatted = tickets.map(ticket => ({
      category: ticket.category,
      status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
      assignedTo: ticket.assignedTo,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      _id: ticket._id
    }));

    res.status(200).json({ recentTickets: formatted });
  } catch (err) {
    console.error('Failed to fetch recent tickets for user:', err);
    res.status(500).json({ message: 'Error retrieving recent tickets for user' });
  }
};

//////////////////////////////////////////////////////////
// SERVER PERFORMANCE METRICS////////////////////////////
////////////////////////////////////////////////////////

// Response Time logs

export const getServerResponseTime = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24 hours
    const end = endDate ? new Date(endDate) : new Date();

    const metrics = await responseTime.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $toDate: {
              $subtract: [
                { $toLong: "$timestamp" },
                { $mod: [{ $toLong: "$timestamp" }, 1000 * 60 * 10] } // 10 min buckets
              ]
            }
          },
          avgResponseTimeMs: { $avg: "$durationMs" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          interval: "$_id",
          avgResponseTimeMs: { $round: ["$avgResponseTimeMs", 2] },
          count: 1
        }
      }
    ]);

    res.json(metrics);
  } catch (err) {
    console.error('Error fetching server metrics:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

// Uptime logs

// Helper to calculate uptime percentage for a given period
async function calculateUptimeForPeriod(start, end) {
  const logs = await uptimeLog.find({
    timestamp: { $gte: start, $lte: end }
  }).sort({ timestamp: 1 });

  if (logs.length < 2) return 100; // Assume 100% if not enough data

  let totalUp = 0, totalDown = 0;
  for (let i = 0; i < logs.length - 1; i++) {
    const duration = logs[i + 1].timestamp - logs[i].timestamp;
    if (logs[i].status === 'up') totalUp += duration;
    else totalDown += duration;
  }
  const total = totalUp + totalDown;
  return total ? (totalUp / total) * 100 : 100;
}

export const getUptimeOverview = async (req, res) => {
  try {
    const now = new Date();
    const periods = {
      last24h: [new Date(now - 24 * 60 * 60 * 1000), now],
      last7d: [new Date(now - 7 * 24 * 60 * 60 * 1000), now],
      last30d: [new Date(now - 30 * 24 * 60 * 60 * 1000), now],
      last90d: [new Date(now - 90 * 24 * 60 * 60 * 1000), now],
    };

    const [uptime24h, uptime7d, uptime30d, uptime90d] = await Promise.all([
      calculateUptimeForPeriod(...periods.last24h),
      calculateUptimeForPeriod(...periods.last7d),
      calculateUptimeForPeriod(...periods.last30d),
      calculateUptimeForPeriod(...periods.last90d),
    ]);

    // Current status (last log)
    const lastLog = await uptimeLog.findOne().sort({ timestamp: -1 });
    const currentStatus = lastLog?.status === 'up' ? 'Operational' : 'Down';

    res.json({
      currentStatus,
      uptime: {
        '24h': uptime24h.toFixed(3),
        '7d': uptime7d.toFixed(3),
        '30d': uptime30d.toFixed(3),
        '90d': uptime90d.toFixed(3),
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Unable to compute uptime overview' });
  }
};