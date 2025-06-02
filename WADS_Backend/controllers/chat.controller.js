import { chatService } from '../services/chat.service.js';

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Chat with the AI assistant about Semesta Medika products
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's question about products
 *                 example: "What is the price of the U-life Mobile Cart?"
 *               messageType:
 *                 type: string
 *                 description: Type of message (e.g., 'general', 'product', 'support')
 *                 example: "product"
 *               conversationContext:
 *                 type: string
 *                 description: Previous conversation context
 *                 example: "Previous question about hospital products"
 *     responses:
 *       200:
 *         description: Successful response from the AI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chatId:
 *                   type: string
 *                   example: "abc123"
 *                 response:
 *                   type: string
 *                   example: "The U-life Mobile Cart for Laptop is priced at Rp 4.900.000."
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     messageType:
 *                       type: string
 *                     productCategory:
 *                       type: string
 *                     sentiment:
 *                       type: string
 *                     language:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const chatWithGemini = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('User:', req.user);
        
        const { message, messageType, conversationContext } = req.body;
        const userId = req.user.id;
        
        if (!message) {
            console.log('No message provided');
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        console.log('Calling chat service with:', { userId, message, messageType, conversationContext });
        const result = await chatService.processMessage(userId, message, {
            messageType,
            conversationContext
        });
        console.log('Chat service result:', result);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history for the authenticated user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of messages to return
 *       - in: query
 *         name: lastDocId
 *         schema:
 *           type: string
 *         description: ID of the last document for pagination
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: productCategory
 *         schema:
 *           type: string
 *         description: Filter by product category
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 chats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       message:
 *                         type: string
 *                       response:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                 hasMore:
 *                   type: boolean
 *                 lastDocId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit, lastDocId, startDate, endDate, productCategory } = req.query;
        
        const history = await chatService.getChatHistory(userId, {
            limit: parseInt(limit),
            lastDocId,
            startDate,
            endDate,
            productCategory
        });
        
        res.json(history);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @swagger
 * /api/chat/{chatId}:
 *   delete:
 *     summary: Delete a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat to delete
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        
        const result = await chatService.deleteChat(chatId, userId);
        res.json(result);
    } catch (error) {
        if (error.message === 'Chat not found') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @swagger
 * /api/chat/{chatId}:
 *   patch:
 *     summary: Update a chat message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               response:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Chat updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
export const updateChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        const updates = req.body;
        
        const result = await chatService.updateChat(chatId, userId, updates);
        res.json(result);
    } catch (error) {
        if (error.message === 'Chat not found') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}; 