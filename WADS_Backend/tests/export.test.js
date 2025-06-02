import mongoose from 'mongoose';
import { chatService } from '../services/chat.service.js';

// Mock the request and response objects
const mockRequest = () => {
  return {
    params: {},
    body: {},
    user: {},
    query: {}
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Export Tests', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Chat History Export', () => {
    it('should export chat history with pagination', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'test-user-123'
      };

      const mockChats = [
        {
          _id: new mongoose.Types.ObjectId(),
          userId: mockUser.id,
          message: 'Test message 1',
          response: 'Test response 1',
          timestamp: new Date(),
          metadata: {
            messageType: 'general',
            productCategory: 'Hospital Products',
            sentiment: 'positive',
            language: 'en'
          }
        },
        {
          _id: new mongoose.Types.ObjectId(),
          userId: mockUser.id,
          message: 'Test message 2',
          response: 'Test response 2',
          timestamp: new Date(),
          metadata: {
            messageType: 'general',
            productCategory: 'Homecare Products',
            sentiment: 'neutral',
            language: 'en'
          }
        }
      ];

      // Mock chatService.getChatHistory
      chatService.getChatHistory = jest.fn().mockResolvedValue({
        success: true,
        chats: mockChats,
        hasMore: false,
        total: 2
      });

      const result = await chatService.getChatHistory(mockUser.id, {
        limit: 10,
        skip: 0
      });

      expect(result.success).toBe(true);
      expect(result.chats).toHaveLength(2);
      expect(result.hasMore).toBe(false);
      expect(result.total).toBe(2);
      expect(result.chats[0]).toHaveProperty('message');
      expect(result.chats[0]).toHaveProperty('response');
      expect(result.chats[0]).toHaveProperty('metadata');
    });

    it('should handle date range filtering', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'test-user-123'
      };

      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      // Mock chatService.getChatHistory
      chatService.getChatHistory = jest.fn().mockResolvedValue({
        success: true,
        chats: [],
        hasMore: false,
        total: 0
      });

      await chatService.getChatHistory(mockUser.id, {
        startDate,
        endDate
      });

      expect(chatService.getChatHistory).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          startDate,
          endDate
        })
      );
    });

    it('should handle product category filtering', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'test-user-123'
      };

      const productCategory = 'Hospital Products';

      // Mock chatService.getChatHistory
      chatService.getChatHistory = jest.fn().mockResolvedValue({
        success: true,
        chats: [],
        hasMore: false,
        total: 0
      });

      await chatService.getChatHistory(mockUser.id, {
        productCategory
      });

      expect(chatService.getChatHistory).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          productCategory
        })
      );
    });
  });

  describe('Chat Statistics Export', () => {
    it('should export user chat statistics', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'test-user-123'
      };

      // Mock chatService.getUserChatStats
      chatService.getUserChatStats = jest.fn().mockResolvedValue({
        success: true,
        stats: {
          totalMessages: 5,
          productCategories: {
            'Hospital Products': 3,
            'Homecare Products': 2
          },
          messageTypes: {
            general: 4,
            support: 1
          },
          languages: {
            en: 5
          },
          sentiments: {
            positive: 3,
            neutral: 1,
            negative: 1
          }
        }
      });

      const result = await chatService.getUserChatStats(mockUser.id);

      expect(result.success).toBe(true);
      expect(result.stats).toHaveProperty('totalMessages', 5);
      expect(result.stats.productCategories['Hospital Products']).toBe(3);
      expect(result.stats.messageTypes.general).toBe(4);
      expect(result.stats.languages.en).toBe(5);
      expect(result.stats.sentiments.positive).toBe(3);
    });

    it('should handle empty statistics for new user', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        id: 'new-user-123'
      };

      // Mock chatService.getUserChatStats for new user
      chatService.getUserChatStats = jest.fn().mockResolvedValue({
        success: true,
        stats: {
          totalMessages: 0,
          productCategories: {},
          messageTypes: {},
          languages: {},
          sentiments: {
            positive: 0,
            neutral: 0,
            negative: 0
          }
        }
      });

      const result = await chatService.getUserChatStats(mockUser.id);

      expect(result.success).toBe(true);
      expect(result.stats.totalMessages).toBe(0);
      expect(result.stats.sentiments).toEqual({
        positive: 0,
        neutral: 0,
        negative: 0
      });
    });
  });

  // Clean up after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });
}); 