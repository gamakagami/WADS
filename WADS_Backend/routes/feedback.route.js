import express from 'express'
import { getAgentFeedbackSummary, getFeedbackForTicket, createFeedback } from '../controllers/feedback.controller.js'; 
import { protect, agent, user } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/feedback/agents/{id}:
 *   get:
 *     summary: Get feedback summary (positive, neutral, negative) for a specific agent
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Agent ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback summary for the agent
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/agents/:id', agent, getAgentFeedbackSummary);

/**
 * @swagger
 * /api/feedback/tickets/{id}:
 *   get:
 *     summary: Get feedback for a specific ticket
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback details
 *       404:
 *         description: Feedback not found
 *       500:
 *         description: Server error
 */
router.get('/tickets/:id', getFeedbackForTicket);

/**
 * @swagger
 * /api/feedback/tickets/{id}:
 *   post:
 *     summary: Submit feedback for a specific ticket
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Ticket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - rating
 *             properties:
 *               userId:
 *                 type: string
 *               rating:
 *                 type: string
 *                 enum: [positive, neutral, negative]
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Feedback already submitted or invalid request
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */
router.post('/tickets/:id', user, createFeedback);

export default router;