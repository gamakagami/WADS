import express from 'express';
import { 
    chatWithGemini, 
    getChatHistory, 
    deleteChat, 
    updateChat 
} from '../controllers/chat.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat API endpoints
 */

// Chat endpoints
router.post('/', authenticateToken, chatWithGemini);
router.get('/history', authenticateToken, getChatHistory);
router.delete('/:chatId', authenticateToken, deleteChat);
router.patch('/:chatId', authenticateToken, updateChat);

export default router; 