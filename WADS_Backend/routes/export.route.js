import express from 'express';
import { exportTickets } from '../controllers/export.controller.js';

const router = express.Router();

router.get('/tickets', exportTickets);

export default router;
