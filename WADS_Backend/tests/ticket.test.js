import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import Ticket from '../models/ticket.model.js';
import User from '../models/user.model.js';
import Room from '../models/room.model.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let adminToken;
let agentToken;
let userToken;
let userId;
let agentId;
let roomId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Ticket.deleteMany({});
  await User.deleteMany({});
  await Room.deleteMany({});

  // Create test room
  const room = await Room.create({
    name: 'Test Room',
    capacity: 10,
    status: 'active'
  });
  roomId = room._id;

  // Create admin user
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    department: 'IT',
    timezone: 'UTC'
  });

  // Create agent user
  const agent = await User.create({
    firstName: 'Agent',
    lastName: 'User',
    email: 'agent@test.com',
    password: 'password123',
    role: 'agent',
    department: 'IT',
    timezone: 'UTC'
  });
  agentId = agent._id;

  // Create regular user
  const user = await User.create({
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@test.com',
    password: 'password123',
    role: 'user',
    department: 'IT',
    timezone: 'UTC'
  });
  userId = user._id;

  // Generate tokens
  adminToken = jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  agentToken = jwt.sign(
    { id: agent._id, role: 'agent' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  userToken = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );
});

describe('Ticket Tests', () => {
  describe('Create Ticket', () => {
    it('should create a new ticket successfully', async () => {
      const testTicket = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        category: 'Software Problem',
        priority: 'high',
        department: 'IT',
        equipment: {
          name: 'Test Equipment',
          type: 'Computer'
        },
        roomId: roomId,
        user: {
          userId: userId,
          firstName: 'Regular',
          lastName: 'User',
          email: 'user@test.com'
        },
        assignedTo: {
          userId: agentId,
          firstName: 'Agent',
          lastName: 'User',
          email: 'agent@test.com'
        }
      };

      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testTicket);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(testTicket.title);
      expect(res.body.data.assignedTo).toBeDefined();
    });

    it('should not create ticket without required fields', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should not create ticket without authentication', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('Get Tickets', () => {
    let ticketId;

    beforeEach(async () => {
      const testTicket = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        category: 'Software Problem',
        priority: 'high',
        department: 'IT',
        equipment: {
          name: 'Test Equipment',
          type: 'Computer'
        },
        roomId: roomId,
        user: {
          userId: userId,
          firstName: 'Regular',
          lastName: 'User',
          email: 'user@test.com'
        },
        assignedTo: {
          userId: agentId,
          firstName: 'Agent',
          lastName: 'User',
          email: 'agent@test.com'
        }
      };

      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testTicket);

      ticketId = createRes.body.data._id;
    });

    it('should get all tickets for the user', async () => {
      const res = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should get a specific ticket by ID', async () => {
      const res = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id.toString()).toBe(ticketId.toString());
    });

    it('should not get ticket with invalid ID', async () => {
      const res = await request(app)
        .get('/api/tickets/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Ticket not found");
    });
  });

  describe('Update Ticket', () => {
    let ticketId;

    beforeEach(async () => {
      const testTicket = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        category: 'Software Problem',
        priority: 'high',
        department: 'IT',
        equipment: {
          name: 'Test Equipment',
          type: 'Computer'
        },
        roomId: roomId,
        user: {
          userId: userId,
          firstName: 'Regular',
          lastName: 'User',
          email: 'user@test.com'
        },
        assignedTo: {
          userId: agentId,
          firstName: 'Agent',
          lastName: 'User',
          email: 'agent@test.com'
        }
      };

      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testTicket);

      ticketId = createRes.body.data._id;
    });

    it('should update ticket successfully', async () => {
      const updateData = {
        title: 'Updated Ticket',
        description: 'This is an updated ticket',
        priority: 'medium'
      };

      const res = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.description).toBe(updateData.description);
      expect(res.body.data.priority).toBe(updateData.priority);
    });

    it('should not update ticket with invalid ID', async () => {
      const res = await request(app)
        .put('/api/tickets/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Updated Ticket' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Delete Ticket', () => {
    let ticketId;

    beforeEach(async () => {
      const testTicket = {
        title: 'Test Ticket',
        description: 'This is a test ticket',
        category: 'Software Problem',
        priority: 'high',
        department: 'IT',
        equipment: {
          name: 'Test Equipment',
          type: 'Computer'
        },
        roomId: roomId,
        user: {
          userId: userId,
          firstName: 'Regular',
          lastName: 'User',
          email: 'user@test.com'
        },
        assignedTo: {
          userId: agentId,
          firstName: 'Agent',
          lastName: 'User',
          email: 'agent@test.com'
        }
      };

      const createRes = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(testTicket);

      ticketId = createRes.body.data._id;
    });

    it('should delete ticket successfully', async () => {
      const res = await request(app)
        .delete(`/api/tickets/${ticketId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Ticket deleted');
    });

    it('should not delete ticket with invalid ID', async () => {
      const res = await request(app)
        .delete('/api/tickets/invalid-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
