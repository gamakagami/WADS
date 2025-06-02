// routes/dashboard.routes.js
import express from 'express';
import { getGlobalStats, getRecentActivity, getRecentTickets, getAgentPerformance, 
    getRecentAgentTickets, getRecentUserTickets, getAgentDashboardStats, getAgentTicketStatus, getServerResponseTime, getUptimeOverview } from '../controllers/dashboard.controller.js';
import { admin, agent, protect, user } from '../middleware/auth.js';

const router = express.Router();
router.use(protect)

// ======================== USER DASHBOARD ========================

/**
 * @swagger
 * /api/dashboard/recent-user-ticket:
 *   get:
 *     summary: Get recent tickets created by the user
 *     tags: [User Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent user tickets
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-user-ticket', user , getRecentUserTickets)

// ======================== AGENT DASHBOARD ========================

/**
 * @swagger
 * /api/dashboard/recent-agent-ticket:
 *   get:
 *     summary: Get recent tickets assigned to the agent
 *     tags: [Agent Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent agent tickets
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-agent-ticket', agent, getRecentAgentTickets);

/**
 * @swagger
 * /api/dashboard/agent-stats:
 *   get:
 *     summary: Get agent dashboard statistics
 *     tags: [Agent Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent stats data
 *       401:
 *         description: Unauthorized
 */
router.get('/agent-stats', agent, getAgentDashboardStats);

/**
 * @swagger
 * /api/dashboard/agent/ticket-status:
 *   get:
 *     summary: Get status of tickets assigned to agent
 *     tags: [Agent Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket status summary
 *       401:
 *         description: Unauthorized
 */
router.get('/agent/ticket-status', agent, getAgentTicketStatus);

// ======================== ADMIN DASHBOARD ========================

/**
 * @swagger
 * /api/dashboard/global-stats:
 *   get:
 *     summary: Get global statistics - Tickets, users, ratings 
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Global stats
 *       401:
 *         description: Unauthorized
 */
router.get('/global-stats', admin, getGlobalStats);

/**
 * @swagger
 * /api/dashboard/recent-activity:
 *   get:
 *     summary: Get recent activity logs
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-activity', admin, getRecentActivity);

/**
 * @swagger
 * /api/dashboard/recent-ticket:
 *   get:
 *     summary: Get recently created tickets
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent tickets
 *       401:
 *         description: Unauthorized
 */
router.get('/recent-ticket', admin, getRecentTickets);

/**
 * @swagger
 * /api/dashboard/agent-performance:
 *   get:
 *     summary: Get agent performance metrics
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics
 *       401:
 *         description: Unauthorized
 */
router.get('/agent-performance', admin, getAgentPerformance);

/**
 * @swagger
 * /api/dashboard/response-time:
 *   get:
 *     summary: Get average server response time
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Response time data
 *       401:
 *         description: Unauthorized
 */
router.get('/response-time', admin, getServerResponseTime);

/**
 * @swagger
 * /api/dashboard/server-uptime:
 *   get:
 *     summary: Get server uptime overview
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uptime data
 *       401:
 *         description: Unauthorized
 */
router.get('/server-uptime', admin, getUptimeOverview);


export default router;
