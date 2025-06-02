import Ticket from '../models/ticket.model.js';
import Feedback from '../models/feedback.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import responseTime from "../models/responseTime.model.js";
import uptimeLog from '../models/uptimeLog.model.js';

export const getPerformanceMetrics = async (req, res) => {
  try {
    const [total, inProgress, pending, resolved] = await Promise.all([
      Ticket.countDocuments({}),
      Ticket.countDocuments({ status: 'in_progress' }),
      Ticket.countDocuments({ status: 'pending' }),
      Ticket.countDocuments({ status: 'resolved' }),
    ]);

    const resolvedTickets = await Ticket.find({ status: 'resolved' }, 'createdAt updatedAt');

    const totalResolutionTimeInMs = resolvedTickets.reduce((acc, ticket) => {
      return acc + (new Date(ticket.updatedAt) - new Date(ticket.createdAt));
    }, 0);

    const avgResolutionTimeMs = resolvedTickets.length > 0
      ? totalResolutionTimeInMs / resolvedTickets.length
      : 0;

    const totalSeconds = Math.floor(avgResolutionTimeMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const avgResolutionTimeFormatted = `${hours} hrs ${minutes} mins ${seconds} secs`;

    // Get feedback stats for performance overview
    const feedbacks = await Feedback.find({});
    const feedbackDistribution = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    feedbacks.forEach(feedback => {
      if (feedback.rating) {
        feedbackDistribution[feedback.rating]++;
      }
    });

    // Match frontend expected structure exactly
    res.json({
      ticketStats: {
        total,
        pending,
        inProgress,
        resolved
      },
      userStats: {
        totalUsers: await User.countDocuments({}),
        activeToday: await User.countDocuments({ 
          lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        }),
        newUsers: await User.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        }),
        totalAgents: await User.countDocuments({ role: 'agent' })
      },
      feedbackStats: {
        positive: feedbackDistribution.positive,
        neutral: feedbackDistribution.neutral,
        negative: feedbackDistribution.negative,
        totalCount: feedbacks.length
      },
      avgResolutionTime: avgResolutionTimeFormatted,
      // Additional metrics for better dashboard insights
      resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(2) : 0,
      avgResolutionTimeHours: (avgResolutionTimeMs / (1000 * 60 * 60)).toFixed(2)
    });
  } catch (err) {
    console.error('Error fetching performance metrics:', err);
    res.status(500).json({ 
      error: 'Failed to fetch performance metrics',
      message: err.message 
    });
  }
};

export const getAgentMetrics = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' });
    const totalAgents = agents.length;

    // Get performance metrics for each agent
    const agentMetrics = await Promise.all(agents.map(async (agent) => {
      const tickets = await Ticket.find({ assignedTo: agent._id });
      const resolvedTickets = tickets.filter(t => t.status === 'resolved');
      
      const avgResolutionTime = resolvedTickets.length > 0
        ? resolvedTickets.reduce((acc, ticket) => {
            return acc + (new Date(ticket.updatedAt) - new Date(ticket.createdAt));
          }, 0) / resolvedTickets.length
        : 0;

      // Get feedback for this agent
      const agentFeedbacks = await Feedback.find({ agent: agent._id });
      const positiveCount = agentFeedbacks.filter(f => f.rating === 'positive').length;
      const satisfactionRate = agentFeedbacks.length > 0 
        ? ((positiveCount / agentFeedbacks.length) * 100).toFixed(1)
        : 0;

      return {
        id: agent._id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        department: agent.department || 'Not Assigned',
        ticketsResolved: resolvedTickets.length,
        ticketsTotal: tickets.length,
        avgResolutionTime: Math.floor(avgResolutionTime / (1000 * 60)), // Convert to minutes
        satisfactionRate: parseFloat(satisfactionRate),
        status: getAgentStatus(agent.lastLogin) // Helper function for status
      };
    }));

    res.json({
      totalAgents,
      agents: agentMetrics,
      // Summary statistics
      summary: {
        totalTicketsHandled: agentMetrics.reduce((sum, agent) => sum + agent.ticketsTotal, 0),
        totalTicketsResolved: agentMetrics.reduce((sum, agent) => sum + agent.ticketsResolved, 0),
        avgSatisfactionRate: agentMetrics.length > 0 
          ? (agentMetrics.reduce((sum, agent) => sum + agent.satisfactionRate, 0) / agentMetrics.length).toFixed(1)
          : 0
      }
    });
  } catch (error) {
    console.error('Agent metrics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch agent metrics',
      message: error.message 
    });
  }
};

// Helper function to determine agent status
function getAgentStatus(lastLogin) {
  if (!lastLogin) return 'inactive';
  
  const now = new Date();
  const loginTime = new Date(lastLogin);
  const minutesSinceLogin = (now - loginTime) / (1000 * 60);
  
  if (minutesSinceLogin <= 10) return 'online';
  if (minutesSinceLogin <= 60) return 'away';
  return 'offline';
}

export const getCustomerSatisfaction = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});

    const distribution = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    feedbacks.forEach(feedback => {
      if (feedback.rating) {
        distribution[feedback.rating]++;
      }
    });

    const total = feedbacks.length;

    // Calculate trend (compare with last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [recentFeedbacks, previousFeedbacks] = await Promise.all([
      Feedback.find({ createdAt: { $gte: last7Days } }),
      Feedback.find({ 
        createdAt: { 
          $gte: previous7Days, 
          $lt: last7Days 
        } 
      })
    ]);

    const recentPositive = recentFeedbacks.filter(f => f.rating === 'positive').length;
    const previousPositive = previousFeedbacks.filter(f => f.rating === 'positive').length;
    
    const recentRate = recentFeedbacks.length > 0 ? (recentPositive / recentFeedbacks.length) * 100 : 0;
    const previousRate = previousFeedbacks.length > 0 ? (previousPositive / previousFeedbacks.length) * 100 : 0;
    const trend = recentRate - previousRate;

    // Match frontend expected structure
    res.json({
      feedbackStats: {
        positive: distribution.positive,
        neutral: distribution.neutral,
        negative: distribution.negative,
        totalCount: total
      },
      distribution: {
        positive: {
          count: distribution.positive,
          percentage: total > 0 ? (distribution.positive / total * 100).toFixed(2) : 0
        },
        neutral: {
          count: distribution.neutral,
          percentage: total > 0 ? (distribution.neutral / total * 100).toFixed(2) : 0
        },
        negative: {
          count: distribution.negative,
          percentage: total > 0 ? (distribution.negative / total * 100).toFixed(2) : 0
        }
      },
      // Additional insights
      trend: {
        current: recentRate.toFixed(1),
        previous: previousRate.toFixed(1),
        change: trend.toFixed(1),
        direction: trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable'
      },
      summary: {
        satisfactionRate: total > 0 ? ((distribution.positive + distribution.neutral) / total * 100).toFixed(1) : 0,
        averageRating: calculateNumericAverageRating(feedbacks)
      }
    });
  } catch (error) {
    console.error('Customer satisfaction error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch customer satisfaction data',
      message: error.message 
    });
  }
};

// Helper function for numeric average rating
function calculateNumericAverageRating(feedbacks) {
  const ratingMap = { positive: 5, neutral: 3, negative: 1 };
  const validFeedbacks = feedbacks.filter(fb => fb.rating && ratingMap[fb.rating]);
  
  if (validFeedbacks.length === 0) return 0;
  
  const total = validFeedbacks.reduce((sum, fb) => sum + ratingMap[fb.rating], 0);
  return (total / validFeedbacks.length).toFixed(1);
}

export const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get recent tickets
    const recentTickets = await Ticket.find({})
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('assignedTo', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');

    // Get recent feedbacks
    const recentFeedbacks = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'firstName lastName')
      .populate('agent', 'firstName lastName');

    // Combine and format activities
    const ticketActivities = recentTickets.map(ticket => ({
      id: ticket._id,
      type: 'ticket',
      action: getTicketActionText(ticket.status),
      description: `Ticket #${ticket._id.toString().slice(-6)} was ${ticket.status.replace('_', ' ')}`,
      user: ticket.assignedTo 
        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` 
        : 'Unassigned',
      createdBy: ticket.createdBy 
        ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}` 
        : 'Unknown',
      timestamp: ticket.updatedAt,
      status: ticket.status,
      priority: ticket.priority || 'normal'
    }));

    const feedbackActivities = recentFeedbacks.map(feedback => ({
      id: feedback._id,
      type: 'feedback',
      action: 'feedback_received',
      description: `New ${feedback.rating} feedback received`,
      user: feedback.agent 
        ? `${feedback.agent.firstName} ${feedback.agent.lastName}` 
        : 'System',
      createdBy: feedback.createdBy 
        ? `${feedback.createdBy.firstName} ${feedback.createdBy.lastName}` 
        : 'Anonymous',
      timestamp: feedback.createdAt,
      rating: feedback.rating
    }));

    // Combine and sort by timestamp
    const allActivities = [...ticketActivities, ...feedbackActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json(allActivities);
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent activity',
      message: error.message 
    });
  }
};

// Helper function for ticket action text
function getTicketActionText(status) {
  const statusMap = {
    'pending': 'created',
    'in_progress': 'started',
    'resolved': 'resolved',
    'closed': 'closed'
  };
  return statusMap[status] || status;
}

export const getFeedbackTable = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({})
      .populate({
        path: 'ticket',
        select: '_id title category priority status createdAt updatedAt'
      })
      .populate('createdBy', 'firstName lastName email')
      .populate('agent', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalCount = await Feedback.countDocuments({});

    const tableData = feedbacks.map(fb => {
      if (!fb.ticket) return null; // Skip if ticket is null

      const ticket = fb.ticket;
      const user = fb.createdBy;
      const agent = fb.agent;

      const resolutionTime = ticket.updatedAt && ticket.createdAt
        ? Math.ceil((new Date(ticket.updatedAt) - new Date(ticket.createdAt)) / (1000 * 60)) + ' mins'
        : 'N/A';

      return {
        id: fb._id,
        ticketId: ticket._id.toString(),
        ticketTitle: ticket.title || `Ticket #${ticket._id.toString().slice(-6)}`,
        userId: user?._id?.toString() || 'N/A',
        userName: user ? `${user.firstName} ${user.lastName}` : 'Anonymous',
        userEmail: user?.email || 'N/A',
        category: ticket.category || 'N/A',
        priority: ticket.priority || 'N/A',
        status: ticket.status || 'N/A',
        agentAssigned: agent ? `${agent.firstName} ${agent.lastName}` : 'Unassigned',
        agentEmail: agent?.email || 'N/A',
        resolutionTime,
        feedbackScore: fb.rating || 'N/A',
        feedbackComment: fb.comment || 'No comment',
        createdAt: fb.createdAt,
        details: `/tickets/${ticket._id}`
      };
    }).filter(Boolean); // Remove null entries

    res.status(200).json({
      feedback: tableData,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      averageRating: calculateAverageRating(feedbacks.filter(fb => fb.ticket)),
      summary: {
        totalFeedbacks: totalCount,
        positiveFeedbacks: tableData.filter(fb => fb.feedbackScore === 'positive').length,
        neutralFeedbacks: tableData.filter(fb => fb.feedbackScore === 'neutral').length,
        negativeFeedbacks: tableData.filter(fb => fb.feedbackScore === 'negative').length
      }
    });
  } catch (error) {
    console.error('Failed to fetch ticket feedback table:', error);
    res.status(500).json({ 
      feedback: [],
      total: 0,
      page: 1,
      totalPages: 0,
      averageRating: 0,
      error: 'Failed to fetch feedback table',
      message: error.message
    });
  }
};

// Helper function to calculate average rating (keep existing)
function calculateAverageRating(feedbacks) {
  const ratingMap = { positive: 3, neutral: 2, negative: 1 };
  const validFeedbacks = feedbacks.filter(fb => fb.rating && ratingMap[fb.rating]);
  
  if (validFeedbacks.length === 0) return 0;
  
  const total = validFeedbacks.reduce((sum, fb) => sum + ratingMap[fb.rating], 0);
  return (total / validFeedbacks.length).toFixed(1);
}

export const getAgentDetailMetrics = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ error: "Invalid agent ID format" });
    }

    const agent = await User.findById(agentId);

    if (!agent || agent.role !== "agent") {
      return res.status(404).json({ error: "Agent not found or invalid role" });
    }

    // Get all tickets assigned to this agent
    const tickets = await Ticket.find({ assignedTo: agentId });
    
    // Get feedback for this agent
    const feedbacks = await Feedback.find({ agent: agentId });

    // Calculate ticket statistics
    const ticketStats = {
      total: tickets.length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      pending: tickets.filter(t => t.status === 'pending').length,
      closed: tickets.filter(t => t.status === 'closed').length
    };

    // Calculate resolution times
    const resolvedTickets = tickets.filter(t => t.status === 'resolved');
    const resolutionTimes = resolvedTickets.map(ticket => {
      return (new Date(ticket.updatedAt) - new Date(ticket.createdAt)) / (1000 * 60); // in minutes
    });

    const avgResolutionTime = resolutionTimes.length
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
      : 0;

    // Calculate feedback statistics
    const feedbackStats = {
      total: feedbacks.length,
      positive: feedbacks.filter(f => f.rating === 'positive').length,
      neutral: feedbacks.filter(f => f.rating === 'neutral').length,
      negative: feedbacks.filter(f => f.rating === 'negative').length
    };

    // Calculate satisfaction percentages
    const satisfaction = {
      positive: feedbackStats.total ? (feedbackStats.positive / feedbackStats.total) * 100 : 0,
      neutral: feedbackStats.total ? (feedbackStats.neutral / feedbackStats.total) * 100 : 0,
      negative: feedbackStats.total ? (feedbackStats.negative / feedbackStats.total) * 100 : 0
    };

    // Get recent activity (last 10 tickets)
    const recentTickets = await Ticket.find({ assignedTo: agentId })
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate('createdBy', 'firstName lastName');

    const recentActivity = recentTickets.map(ticket => ({
      id: ticket._id,
      type: 'ticket',
      status: ticket.status,
      title: ticket.title || `Ticket #${ticket._id.toString().slice(-6)}`,
      priority: ticket.priority || 'normal',
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      createdBy: ticket.createdBy ? `${ticket.createdBy.firstName} ${ticket.createdBy.lastName}` : 'Unknown'
    }));

    // Calculate performance metrics - MATCH FRONTEND STRUCTURE
    const performanceMetrics = {
      total: ticketStats.total,
      resolved: ticketStats.resolved,
      inProgress: ticketStats.inProgress,
      pending: ticketStats.pending,
      // Additional performance data
      resolutionRate: ticketStats.total > 0 ? ((ticketStats.resolved / ticketStats.total) * 100).toFixed(1) : 0,
      avgResolutionTimeMinutes: Math.round(avgResolutionTime),
      avgResolutionTimeFormatted: formatMinutesToHours(avgResolutionTime)
    };

    // Get availability status
    const TEN_MINUTES = 10 * 60 * 1000; // 10 minutes in ms
    const isAvailable = agent.lastLogin && (Date.now() - new Date(agent.lastLogin).getTime() <= TEN_MINUTES);

    const response = {
      agentInfo: {
        id: agent._id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        department: agent.department || 'Not Assigned',
        availability: isAvailable ? 'Available' : 'Unavailable',
        lastLogin: agent.lastLogin,
        joinedDate: agent.createdAt
      },
      ticketStats,
      performanceMetrics, // This matches what your frontend expects
      feedbackStats,
      satisfaction: {
        totalResponses: feedbackStats.total,
        positive: Math.round(satisfaction.positive),
        neutral: Math.round(satisfaction.neutral),
        negative: Math.round(satisfaction.negative),
        overallRating: calculateNumericAverageRating(feedbacks)
      },
      recentActivity
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching agent detail metrics:", error);
    res.status(500).json({ 
      error: "Failed to fetch agent detail metrics",
      message: error.message 
    });
  }
};

// Helper function to format minutes to readable time
function formatMinutesToHours(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}m`;
}

//////////////////////////////////////////////////////////
// SERVER PERFORMANCE METRICS////////////////////////////
////////////////////////////////////////////////////////

export const getServerResponseTime = async (req, res) => {
  try {
    const { startDate, endDate, interval = '10m' } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24 hours
    const end = endDate ? new Date(endDate) : new Date();

    // Convert interval to milliseconds
    const intervalMap = {
      '5m': 5 * 60 * 1000,
      '10m': 10 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000
    };
    const intervalMs = intervalMap[interval] || intervalMap['10m'];

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
                { $mod: [{ $toLong: "$timestamp" }, intervalMs] }
              ]
            }
          },
          avgResponseTimeMs: { $avg: "$durationMs" },
          minResponseTimeMs: { $min: "$durationMs" },
          maxResponseTimeMs: { $max: "$durationMs" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          timestamp: "$_id",
          avgResponseTime: { $round: ["$avgResponseTimeMs", 2] },
          minResponseTime: { $round: ["$minResponseTimeMs", 2] },
          maxResponseTime: { $round: ["$maxResponseTimeMs", 2] },
          requestCount: "$count"
        }
      }
    ]);

    // Calculate overall statistics
    const overallStats = await responseTime.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$durationMs" },
          minResponseTime: { $min: "$durationMs" },
          maxResponseTime: { $max: "$durationMs" },
          totalRequests: { $sum: 1 },
          p95ResponseTime: { $push: "$durationMs" }
        }
      }
    ]);

    let p95 = 0;
    if (overallStats.length > 0 && overallStats[0].p95ResponseTime.length > 0) {
      const sortedTimes = overallStats[0].p95ResponseTime.sort((a, b) => a - b);
      const p95Index = Math.floor(sortedTimes.length * 0.95);
      p95 = sortedTimes[p95Index] || 0;
    }

    res.json({
      metrics,
      summary: overallStats.length > 0 ? {
        avgResponseTime: Math.round(overallStats[0].avgResponseTime * 100) / 100,
        minResponseTime: overallStats[0].minResponseTime,
        maxResponseTime: overallStats[0].maxResponseTime,
        p95ResponseTime: Math.round(p95 * 100) / 100,
        totalRequests: overallStats[0].totalRequests
      } : {
        avgResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p95ResponseTime: 0,
        totalRequests: 0
      },
      period: {
        start,
        end,
        interval
      }
    });
  } catch (err) {
    console.error('Error fetching server response time metrics:', err);
    res.status(500).json({ 
      error: 'Failed to fetch response time metrics',
      message: err.message 
    });
  }
};

// Keep existing uptime functions but add error handling
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

    // Get incident count for each period
    const incidents = await Promise.all([
      getIncidentCount(...periods.last24h),
      getIncidentCount(...periods.last7d),
      getIncidentCount(...periods.last30d),
      getIncidentCount(...periods.last90d),
    ]);

    res.json({
      currentStatus,
      uptime: {
        '24h': uptime24h.toFixed(3),
        '7d': uptime7d.toFixed(3),  
        '30d': uptime30d.toFixed(3),
        '90d': uptime90d.toFixed(3),
      },
      incidents: {
        '24h': incidents[0],
        '7d': incidents[1],
        '30d': incidents[2],
        '90d': incidents[3]
      },
      lastChecked: lastLog?.timestamp || now
    });
  } catch (err) {
    console.error('Error fetching uptime overview:', err);
    res.status(500).json({ 
      error: 'Unable to compute uptime overview',
      message: err.message 
    });
  }
};

// Helper to calculate uptime percentage for a given period (keep existing)
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

// Helper to count incidents in a period
async function getIncidentCount(start, end) {
  const incidents = await uptimeLog.aggregate([
    {
      $match: {
        timestamp: { $gte: start, $lte: end },
        status: 'down'
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ]);
  
  return incidents.length > 0 ? incidents[0].count : 0;
}