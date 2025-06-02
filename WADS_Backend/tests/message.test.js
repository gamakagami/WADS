import mongoose from 'mongoose';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import Room from '../models/room.model.js';
import { createMessage, getMessagesByRoom } from '../controllers/message.controller.js';

// Mock the request and response objects
const mockRequest = () => {
  return {
    params: {},
    body: {},
    user: {},
    query: {},
    app: {
      get: jest.fn().mockReturnValue({
        to: jest.fn().mockReturnThis(),
        emit: jest.fn()
      })
    }
  };
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Message Tests', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Message Creation', () => {
    it('should create a new message successfully', async () => {
      // Mock user data
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      // Mock room data
      const mockRoom = {
        _id: new mongoose.Types.ObjectId(),
        users: [mockUser._id]
      };

      // Setup request
      req.user = mockUser;
      req.params.roomId = mockRoom._id.toString();
      req.body.message = 'Hello, this is a test message';

      // Mock Room.findById
      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      // Mock User.findById
      User.findById = jest.fn().mockResolvedValue(mockUser);

      // Mock Message save
      const mockSavedMessage = {
        _id: new mongoose.Types.ObjectId(),
        content: req.body.message,
        roomId: req.params.roomId,
        user: {
          userId: mockUser._id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email
        }
      };
      Message.prototype.save = jest.fn().mockResolvedValue(mockSavedMessage);

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        content: req.body.message,
        roomId: req.params.roomId,
        user: {
          userId: mockUser._id,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          email: mockUser.email
        }
      }));
    });

    it('should return 400 if message content is missing', async () => {
      req.params.roomId = 'valid-room-id';
      req.body.message = '';

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 400 if room ID is missing', async () => {
      req.params.roomId = '';
      req.body.message = 'Valid message';

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should return 403 if user is not part of the room', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const mockRoom = {
        _id: new mongoose.Types.ObjectId(),
        users: [new mongoose.Types.ObjectId()] // Different user ID
      };

      req.user = mockUser;
      req.params.roomId = mockRoom._id.toString();
      req.body.message = 'Test message';

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      await createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not part of this room' });
    });
  });

  describe('Message Retrieval', () => {
    it('should get messages for a valid room', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user'
      };

      const mockRoom = {
        _id: new mongoose.Types.ObjectId(),
        users: [mockUser._id]
      };

      const mockMessages = [
        {
          _id: new mongoose.Types.ObjectId(),
          content: 'Test message 1',
          roomId: mockRoom._id.toString(),
          user: {
            userId: mockUser._id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
          }
        }
      ];

      req.user = mockUser;
      req.params.roomId = mockRoom._id.toString();
      req.query.page = '1';

      Room.findById = jest.fn().mockResolvedValue(mockRoom);
      Message.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockMessages)
      });

      await getMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 403 if user is not part of the room', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user'
      };

      const mockRoom = {
        _id: new mongoose.Types.ObjectId(),
        users: [new mongoose.Types.ObjectId()] // Different user ID
      };

      req.user = mockUser;
      req.params.roomId = mockRoom._id.toString();

      Room.findById = jest.fn().mockResolvedValue(mockRoom);

      await getMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not part of this room' });
    });

    it('should handle agents room access correctly', async () => {
      const mockAgent = {
        _id: new mongoose.Types.ObjectId(),
        role: 'agent'
      };

      const mockMessages = [
        {
          _id: new mongoose.Types.ObjectId(),
          content: 'Agent message',
          roomId: 'agents-room',
          user: {
            userId: mockAgent._id,
            firstName: 'Agent',
            lastName: 'Smith',
            email: 'agent@example.com'
          }
        }
      ];

      req.user = mockAgent;
      req.params.roomId = 'agents-room';
      req.query.page = '1';

      Message.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockMessages)
      });

      await getMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMessages);
    });

    it('should return 403 if non-agent tries to access agents room', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user'
      };

      req.user = mockUser;
      req.params.roomId = 'agents-room';

      await getMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Only agents can access this room' });
    });

    it('should return 400 for invalid room ID', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        role: 'user'
      };

      req.user = mockUser;
      req.params.roomId = 'invalid-room-id';

      await getMessagesByRoom(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid room ID' });
    });
  });
}); 