// routes/audit.routes.js

import express from "express";
import { getAllAuditLogs } from "../controllers/audit.controller.js";
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/audits:
 *   get:
 *     summary: Get all audit logs with pagination (Admin only)
 *     tags: [Audit Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs per page
 *     responses:
 *       200:
 *         description: Paginated list of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLog'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", protect, admin, getAllAuditLogs); // Route for fetching all audit logs with pagination

export default router;
