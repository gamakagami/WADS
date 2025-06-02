import express from 'express';
import {
  enable2FA,
  verify2FA,
  disable2FA,
  validate2FA
} from '../controllers/twoFactor.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/2fa/enable:
 *   post:
 *     summary: Enable 2FA for a user
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [authenticator, sms]
 *     responses:
 *       200:
 *         description: Verification code sent successfully
 */
router.post('/enable', protect, enable2FA);

/**
 * @swagger
 * /api/2fa/verify:
 *   post:
 *     summary: Verify and complete 2FA setup
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - method
 *             properties:
 *               code:
 *                 type: string
 *               method:
 *                 type: string
 *                 enum: [authenticator, sms]
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 */
router.post('/verify', protect, verify2FA);

/**
 * @swagger
 * /api/2fa/disable:
 *   post:
 *     summary: Disable 2FA for a user
 *     tags: [2FA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA disabled successfully
 */
router.post('/disable', protect, disable2FA);

/**
 * @swagger
 * /api/2fa/validate:
 *   post:
 *     summary: Validate 2FA code during login
 *     tags: [2FA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: 2FA validation successful
 */
router.post('/validate', validate2FA);

export default router; 