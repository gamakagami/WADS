import express from 'express';
import { admin, protect } from '../middleware/auth.js';
import { 
  getPerformanceMetrics, 
  getAgentMetrics, 
  getCustomerSatisfaction, 
  getServerResponseTime, 
  getUptimeOverview, 
  getFeedbackTable,
  getRecentActivity,
  getAgentDetailMetrics 
} from '../controllers/analytic.controller.js';

const router = express.Router();
router.use(protect, admin);

/**
 * @swagger
 * /api/analytics/performance:
 *   get:
 *     summary: Get overall performance metrics including tickets, users, and feedback
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticketStats:
 *                   type: object
 *                   properties:
 *                     total: { type: number }
 *                     pending: { type: number }
 *                     inProgress: { type: number }
 *                     resolved: { type: number }
 *                 userStats:
 *                   type: object
 *                   properties:
 *                     totalUsers: { type: number }
 *                     activeToday: { type: number }
 *                     newUsers: { type: number }
 *                     totalAgents: { type: number }
 *                 feedbackStats:
 *                   type: object
 *                   properties:
 *                     positive: { type: number }
 *                     neutral: { type: number }
 *                     negative: { type: number }
 *                     totalCount: { type: number }
 *                 avgResolutionTime: { type: string }
 *                 resolutionRate: { type: number }
 *                 avgResolutionTimeHours: { type: number }
 *       500:
 *         description: Server error
 */
router.get('/performance', getPerformanceMetrics);

/**
 * @swagger
 * /api/analytics/agents:
 *   get:
 *     summary: Get metrics for all agents
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAgents: { type: number }
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       name: { type: string }
 *                       email: { type: string }
 *                       department: { type: string }
 *                       ticketsResolved: { type: number }
 *                       ticketsTotal: { type: number }
 *                       avgResolutionTime: { type: number }
 *                       satisfactionRate: { type: number }
 *                       status: { type: string }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalTicketsHandled: { type: number }
 *                     totalTicketsResolved: { type: number }
 *                     avgSatisfactionRate: { type: number }
 *       500:
 *         description: Server error
 */
router.get('/agents', getAgentMetrics);

/**
 * @swagger
 * /api/analytics/agents/:id:
 *   get:
 *     summary: Get detailed metrics for a specific agent
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agentInfo:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     department: { type: string }
 *                     availability: { type: string }
 *                     lastLogin: { type: string }
 *                     joinedDate: { type: string }
 *                 ticketStats:
 *                   type: object
 *                   properties:
 *                     total: { type: number }
 *                     resolved: { type: number }
 *                     inProgress: { type: number }
 *                     pending: { type: number }
 *                     closed: { type: number }
 *                 performanceMetrics:
 *                   type: object
 *                   properties:
 *                     total: { type: number }
 *                     resolved: { type: number }
 *                     inProgress: { type: number }
 *                     pending: { type: number }
 *                     resolutionRate: { type: number }
 *                     avgResolutionTimeMinutes: { type: number }
 *                     avgResolutionTimeFormatted: { type: string }
 *                 feedbackStats:
 *                   type: object
 *                   properties:
 *                     total: { type: number }
 *                     positive: { type: number }
 *                     neutral: { type: number }
 *                     negative: { type: number }
 *                 satisfaction:
 *                   type: object
 *                   properties:
 *                     totalResponses: { type: number }
 *                     positive: { type: number }
 *                     neutral: { type: number }
 *                     negative: { type: number }
 *                     overallRating: { type: number }
 *                 recentActivity:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       type: { type: string }
 *                       status: { type: string }
 *                       title: { type: string }
 *                       priority: { type: string }
 *                       createdAt: { type: string }
 *                       updatedAt: { type: string }
 *                       createdBy: { type: string }
 *       400:
 *         description: Invalid agent ID
 *       404:
 *         description: Agent not found
 *       500:
 *         description: Server error
 */
router.get('/agents/:id', getAgentDetailMetrics);

/**
 * @swagger
 * /api/analytics/satisfaction:
 *   get:
 *     summary: Get customer satisfaction metrics and trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedbackStats:
 *                   type: object
 *                   properties:
 *                     positive: { type: number }
 *                     neutral: { type: number }
 *                     negative: { type: number }
 *                     totalCount: { type: number }
 *                 distribution:
 *                   type: object
 *                   properties:
 *                     positive:
 *                       type: object
 *                       properties:
 *                         count: { type: number }
 *                         percentage: { type: number }
 *                     neutral:
 *                       type: object
 *                       properties:
 *                         count: { type: number }
 *                         percentage: { type: number }
 *                     negative:
 *                       type: object
 *                       properties:
 *                         count: { type: number }
 *                         percentage: { type: number }
 *                 trend:
 *                   type: object
 *                   properties:
 *                     current: { type: number }
 *                     previous: { type: number }
 *                     change: { type: number }
 *                     direction: { type: string }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     satisfactionRate: { type: number }
 *                     averageRating: { type: number }
 *       500:
 *         description: Server error
 */
router.get('/satisfaction', getCustomerSatisfaction);

/**
 * @swagger
 * /api/analytics/activity:
 *   get:
 *     summary: Get recent system activity
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of activities to return
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   type: { type: string }
 *                   action: { type: string }
 *                   description: { type: string }
 *                   user: { type: string }
 *                   createdBy: { type: string }
 *                   timestamp: { type: string }
 *                   status: { type: string }
 *                   priority: { type: string }
 *                   rating: { type: string }
 *       500:
 *         description: Server error
 */
router.get('/activity', getRecentActivity);

/**
 * @swagger
 * /api/analytics/feedback:
 *   get:
 *     summary: Get feedback data in table format
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       ticketId: { type: string }
 *                       ticketTitle: { type: string }
 *                       userId: { type: string }
 *                       userName: { type: string }
 *                       userEmail: { type: string }
 *                       category: { type: string }
 *                       priority: { type: string }
 *                       status: { type: string }
 *                       agentAssigned: { type: string }
 *                       agentEmail: { type: string }
 *                       resolutionTime: { type: string }
 *                       feedbackScore: { type: string }
 *                       feedbackComment: { type: string }
 *                       createdAt: { type: string }
 *                       details: { type: string }
 *                 total: { type: number }
 *                 page: { type: number }
 *                 totalPages: { type: number }
 *                 averageRating: { type: number }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalFeedbacks: { type: number }
 *                     positiveFeedbacks: { type: number }
 *                     neutralFeedbacks: { type: number }
 *                     negativeFeedbacks: { type: number }
 *       500:
 *         description: Server error
 */
router.get('/feedback', getFeedbackTable);

/**
 * @swagger
 * /api/analytics/performance/response-time:
 *   get:
 *     summary: Get server response time metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filtering
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *           enum: ['5m', '10m', '15m', '30m', '1h']
 *         description: Time interval for grouping data
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metrics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp: { type: string }
 *                       avgResponseTime: { type: number }
 *                       minResponseTime: { type: number }
 *                       maxResponseTime: { type: number }
 *                       requestCount: { type: number }
 *                 summary:
 *                   type: object
 *                   properties:
 *                     avgResponseTime: { type: number }
 *                     minResponseTime: { type: number }
 *                     maxResponseTime: { type: number }
 *                     p95ResponseTime: { type: number }
 *                     totalRequests: { type: number }
 *                 period:
 *                   type: object
 *                   properties:
 *                     start: { type: string }
 *                     end: { type: string }
 *                     interval: { type: string }
 *       500:
 *         description: Server error
 */
router.get('/performance/response-time', getServerResponseTime);

/**
 * @swagger
 * /api/analytics/performance/uptime:
 *   get:
 *     summary: Get server uptime metrics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentStatus: { type: string }
 *                 uptime:
 *                   type: object
 *                   properties:
 *                     24h: { type: number }
 *                     7d: { type: number }
 *                     30d: { type: number }
 *                     90d: { type: number }
 *                 incidents:
 *                   type: object
 *                   properties:
 *                     24h: { type: number }
 *                     7d: { type: number }
 *                     30d: { type: number }
 *                     90d: { type: number }
 *                 lastChecked: { type: string }
 *       500:
 *         description: Server error
 */
router.get('/performance/uptime', getUptimeOverview);

export default router;