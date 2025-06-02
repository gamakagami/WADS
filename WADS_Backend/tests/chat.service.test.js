import { jest } from '@jest/globals';
import { chatService } from '../services/chat.service.js';
import mongoose from 'mongoose';
import { setup, teardown, clearDatabase } from './setup.js';

// Mock fetch for Gemini API calls
global.fetch = jest.fn();

describe('Chat Service', () => {
    const testUserId = 'test-user-123';
    const testMessage = 'What hospital products do you have?';
    const mockGeminiResponse = {
        candidates: [{
            content: {
                parts: [{
                    text: 'Here are our hospital products...'
                }]
            }
        }]
    };

    beforeAll(async () => {
        await setup();
    });

    afterAll(async () => {
        await teardown();
    });

    beforeEach(async () => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Clear database
        await clearDatabase();
        
        // Mock successful Gemini API response
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockGeminiResponse)
        });
    });

    describe('processMessage', () => {
        it('should process a message and return AI response', async () => {
            const result = await chatService.processMessage(testUserId, testMessage);
            
            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('chatId');
            expect(result).toHaveProperty('response');
            expect(result).toHaveProperty('metadata');
            expect(result.metadata).toHaveProperty('messageType', 'general');
        });

        it('should handle Gemini API errors', async () => {
            // Mock Gemini API error
            global.fetch.mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({
                    error: {
                        code: 400,
                        message: 'API key not valid'
                    }
                })
            });

            await expect(chatService.processMessage(testUserId, testMessage))
                .rejects
                .toThrow('Chat processing failed');
        });
    });

    describe('getChatHistory', () => {
        it('should retrieve chat history for a user', async () => {
            // First create a chat message
            await chatService.processMessage(testUserId, testMessage);

            const result = await chatService.getChatHistory(testUserId);
            
            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('chats');
            expect(result).toHaveProperty('hasMore');
            expect(result).toHaveProperty('total');
            expect(Array.isArray(result.chats)).toBe(true);
        });

        it('should handle pagination correctly', async () => {
            const result = await chatService.getChatHistory(testUserId, {
                limit: 5,
                skip: 0
            });
            
            expect(result.chats.length).toBeLessThanOrEqual(5);
        });
    });

    describe('updateChat', () => {
        it('should update a chat message', async () => {
            // First create a chat message
            const chat = await chatService.processMessage(testUserId, testMessage);
            
            const updateResult = await chatService.updateChat(
                chat.chatId,
                testUserId,
                { metadata: { messageType: 'updated' } }
            );
            
            expect(updateResult).toHaveProperty('success', true);
            expect(updateResult).toHaveProperty('message', 'Chat updated successfully');
        });

        it('should not update chat with invalid ID', async () => {
            await expect(chatService.updateChat(
                'invalid-id',
                testUserId,
                { metadata: { messageType: 'updated' } }
            )).rejects.toThrow('Chat not found or unauthorized');
        });
    });

    describe('deleteChat', () => {
        it('should delete a chat message', async () => {
            // First create a chat message
            const chat = await chatService.processMessage(testUserId, testMessage);
            
            const deleteResult = await chatService.deleteChat(chat.chatId, testUserId);
            
            expect(deleteResult).toHaveProperty('success', true);
            expect(deleteResult).toHaveProperty('message', 'Chat deleted successfully');
        });

        it('should not delete chat with invalid ID', async () => {
            await expect(chatService.deleteChat(
                'invalid-id',
                testUserId
            )).rejects.toThrow('Chat not found or unauthorized');
        });
    });

    describe('getUserChatStats', () => {
        it('should return user chat statistics', async () => {
            // First create a chat message
            await chatService.processMessage(testUserId, testMessage);
            
            const stats = await chatService.getUserChatStats(testUserId);
            
            expect(stats).toHaveProperty('success', true);
            expect(stats).toHaveProperty('stats');
            expect(stats.stats).toHaveProperty('totalMessages');
            expect(stats.stats).toHaveProperty('productCategories');
            expect(stats.stats).toHaveProperty('messageTypes');
            expect(stats.stats).toHaveProperty('languages');
            expect(stats.stats).toHaveProperty('sentiments');
        });

        it('should return empty stats for new user', async () => {
            const stats = await chatService.getUserChatStats('new-user');
            
            expect(stats.stats.totalMessages).toBe(0);
            expect(stats.stats.sentiments).toEqual({
                positive: 0,
                neutral: 0,
                negative: 0
            });
        });
    });
}); 