import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Feedback from '../models/feedback.model.js';

let mongoServer;
let testUser;
let testAgent;
let testTicket;
let userToken;
let agentToken;
let adminToken;

// Set up test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Feedback.deleteMany({});

  // Create test user
  const userRes = await request(app)
    .post('/api/users')
    .send({
      firstName: 'Test',
      lastName: 'User',
      email: 'user@example.com',
      phoneNumber: '1234567890',
      password: 'password123',
      department: 'IT',
      timezone: 'UTC'
    });
  testUser = userRes.body;
  userToken = userRes.body.token;

  // Create test agent
  const agentRes = await request(app)
    .post('/api/users')
    .send({
      firstName: 'Test',
      lastName: 'Agent',
      email: 'agent@example.com',
      phoneNumber: '1234567891',
      password: 'password123',
      department: 'IT',
      timezone: 'UTC',
      role: 'agent'
    });
  testAgent = agentRes.body;
  agentToken = agentRes.body.token;

  // Create test admin
  const adminRes = await request(app)
    .post('/api/users')
    .send({
      firstName: 'Test',
      lastName: 'Admin',
      email: 'admin@example.com',
      phoneNumber: '1234567892',
      password: 'password123',
      department: 'IT',
      timezone: 'UTC',
      role: 'admin'
    });
  adminToken = adminRes.body.token;

  // Create test ticket
  const ticketRes = await request(app)
    .post('/api/tickets')
    .set('Authorization', `Bearer ${userToken}`)
    .send({
      title: 'Test Ticket',
      description: 'Test Description',
      department: 'Radiology',
      category: 'Equipment Issue',
      priority: 'medium',
      equipment: {
        name: 'Test Equipment',
        type: 'MRI Scanner'
      }
    });
  testTicket = ticketRes.body;
});

describe('Feedback Tests', () => {
  describe('Create Feedback', () => {
    it('should create feedback successfully', async () => {
      const res = await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe('positive');
      expect(res.body.ticket.toString()).toBe(testTicket.data._id.toString());
      expect(res.body.createdBy.toString()).toBe(testUser._id.toString());
    });

    it('should not create feedback without authentication', async () => {
      const res = await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });

      expect(res.status).toBe(401);
    });

    it('should not create feedback for non-existent ticket', async () => {
      const fakeTicketId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/feedback/tickets/${fakeTicketId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });

      expect(res.status).toBe(404);
    });

    it('should not create duplicate feedback for same ticket', async () => {
      // Create first feedback
      await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });

      // Try to create second feedback
      const res = await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'negative'
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Get Feedback for Ticket', () => {
    beforeEach(async () => {
      // Create feedback for the test ticket
      await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });
    });

    it('should get feedback for ticket successfully', async () => {
      const res = await request(app)
        .get(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.rating).toBe('positive');
      expect(res.body.ticket.toString()).toBe(testTicket.data._id.toString());
    });

    it('should not get feedback without authentication', async () => {
      const res = await request(app)
        .get(`/api/feedback/tickets/${testTicket.data._id}`);

      expect(res.status).toBe(401);
    });

    it('should return 404 for non-existent feedback', async () => {
      const fakeTicketId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/feedback/tickets/${fakeTicketId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('Get Agent Feedback Summary', () => {
    beforeEach(async () => {
      // Create multiple feedback entries for the agent
      await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });
    });

    it('should get agent feedback summary successfully', async () => {
      const res = await request(app)
        .get(`/api/feedback/agents/${testAgent._id}`)
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('positive');
      expect(res.body).toHaveProperty('neutral');
      expect(res.body).toHaveProperty('negative');
    });

    it('should not get agent feedback summary without authentication', async () => {
      const res = await request(app)
        .get(`/api/feedback/agents/${testAgent._id}`);

      expect(res.status).toBe(401);
    });

    it('should not get agent feedback summary without agent role', async () => {
      const res = await request(app)
        .get(`/api/feedback/agents/${testAgent._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(401);
    });
  });

  describe('Get Global Feedback Summary', () => {
    beforeEach(async () => {
      // Create multiple feedback entries
      await request(app)
        .post(`/api/feedback/tickets/${testTicket.data._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: testUser._id,
          rating: 'positive'
        });
    });

    it('should get global feedback summary successfully', async () => {
      const res = await request(app)
        .get('/api/feedback')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('positive');
      expect(res.body).toHaveProperty('neutral');
      expect(res.body).toHaveProperty('negative');
    });

    it('should not get global feedback summary without authentication', async () => {
      const res = await request(app)
        .get('/api/feedback');

      expect(res.status).toBe(401);
    });

    it('should not get global feedback summary without admin role', async () => {
      const res = await request(app)
        .get('/api/feedback')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(401);
    });
  });
});
