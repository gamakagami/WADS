import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Feedback from '../models/feedback.model.js';
import Audit from '../models/audit.model.js';
import ResponseTime from '../models/responseTime.model.js';
import Room from '../models/room.model.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let adminToken;
let agentToken;
let userToken;

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
  await Audit.deleteMany({});
  await ResponseTime.deleteMany({});

  // Create test users for different roles
  const adminUser = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    department: 'Radiology',
    timezone: 'UTC',
    phoneNumber: '1234567890'
  });

  const agentUser = await User.create({
    firstName: 'Agent',
    lastName: 'User',
    email: 'agent@test.com',
    password: 'password123',
    role: 'agent',
    department: 'Radiology',
    timezone: 'UTC',
    phoneNumber: '2345678901'
  });

  const regularUser = await User.create({
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@test.com',
    password: 'password123',
    role: 'user',
    department: 'Radiology',
    timezone: 'UTC',
    phoneNumber: '3456789012'
  });

  // Login and get tokens
  const adminLogin = await request(app)
    .post('/api/users/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = jwt.sign(
    { id: adminUser._id, role: 'admin' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  const agentLogin = await request(app)
    .post('/api/users/login')
    .send({ email: 'agent@test.com', password: 'password123' });
  agentToken = jwt.sign(
    { id: agentUser._id, role: 'agent' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  const userLogin = await request(app)
    .post('/api/users/login')
    .send({ email: 'user@test.com', password: 'password123' });
  userToken = jwt.sign(
    { id: regularUser._id, role: 'user' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  // Create some test data
  const room = await Room.create({ name: 'Test Room' });
  const testTicket = await Ticket.create({
    title: 'Test Ticket 1',
    description: 'Test Description',
    status: 'pending',
    priority: 'high',
    department: 'Radiology',
    category: 'Equipment Issue',
    equipment: {
      name: 'MRI Scanner 1',
      type: 'MRI Scanner'
    },
    user: {
      userId: regularUser._id,
      firstName: regularUser.firstName,
      lastName: regularUser.lastName,
      email: regularUser.email
    },
    assignedTo: {
      userId: agentUser._id,
      firstName: agentUser.firstName,
      lastName: agentUser.lastName,
      email: agentUser.email
    },
    roomId: room._id,
    activityLog: [{
      action: 'created',
      performedBy: regularUser._id,
      timestamp: new Date()
    }]
  });

  await Feedback.create({
    rating: 'positive',
    ticket: testTicket._id,
    createdBy: regularUser._id,
    agent: agentUser._id,
    comment: 'Great service!',
    timestamp: new Date()
  });

  await Audit.create({
    ticket: testTicket._id,
    ticketId: testTicket._id.toString(),
    action: 'created',
    performedBy: regularUser._id,
    fieldChanged: 'status',
    previousValue: null,
    newValue: 'pending',
    timestamp: new Date()
  });

  await ResponseTime.create({
    timestamp: new Date(),
    durationMs: 100,
    endpoint: '/api/dashboard/overview',
    method: 'GET'
  });
});

describe('Dashboard Tests', () => {
  describe('Admin Dashboard', () => {
    it('should get ticket overview', async () => {
      const res = await request(app)
        .get('/api/dashboard/global-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('ticketStats');
      expect(res.body.ticketStats).toHaveProperty('total');
      expect(res.body.ticketStats).toHaveProperty('pending');
      expect(res.body.ticketStats).toHaveProperty('inProgress');
      expect(res.body.ticketStats).toHaveProperty('resolved');
    });

    it('should get user statistics', async () => {
      const res = await request(app)
        .get('/api/dashboard/global-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userStats');
      expect(res.body.userStats).toHaveProperty('totalUsers');
      expect(res.body.userStats).toHaveProperty('activeToday');
      expect(res.body.userStats).toHaveProperty('newUsers');
      expect(res.body.userStats).toHaveProperty('totalAgents');
    });

    it('should get customer satisfaction metrics', async () => {
      const res = await request(app)
        .get('/api/dashboard/global-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('feedbackStats');
      expect(res.body.feedbackStats).toHaveProperty('positive');
      expect(res.body.feedbackStats).toHaveProperty('neutral');
      expect(res.body.feedbackStats).toHaveProperty('negative');
    });

    it('should get recent activity', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-activity')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get server response time metrics', async () => {
      const res = await request(app)
        .get('/api/dashboard/response-time')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('interval');
        expect(res.body[0]).toHaveProperty('avgResponseTimeMs');
        expect(res.body[0]).toHaveProperty('count');
      }
    });
  });

  describe('Agent Dashboard', () => {
    it('should get agent dashboard stats', async () => {
      const res = await request(app)
        .get('/api/dashboard/agent-stats')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalAssigned');
      expect(res.body).toHaveProperty('resolvedThisWeek');
      expect(res.body).toHaveProperty('feedbackStats');
    });

    it('should get recent agent tickets', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-agent-ticket')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('recentTickets');
      expect(Array.isArray(res.body.recentTickets)).toBe(true);
    });

    it('should get agent ticket status', async () => {
      const res = await request(app)
        .get('/api/dashboard/agent/ticket-status')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('pending');
      expect(res.body).toHaveProperty('in_progress');
      expect(res.body).toHaveProperty('resolved');
    });
  });

  describe('User Dashboard', () => {
    it('should get recent user tickets', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-user-ticket')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('recentTickets');
      expect(Array.isArray(res.body.recentTickets)).toBe(true);
    });
  });

  describe('Authorization Tests', () => {
    it('should not allow user to access admin endpoints', async () => {
      const res = await request(app)
        .get('/api/dashboard/global-stats')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(401);
    });

    it('should not allow agent to access admin endpoints', async () => {
      const res = await request(app)
        .get('/api/dashboard/global-stats')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(401);
    });

    it('should not allow admin to access agent-specific endpoints', async () => {
      const res = await request(app)
        .get('/api/dashboard/agent-stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(401);
    });

    it('should not allow agent to access user-specific endpoints', async () => {
      const res = await request(app)
        .get('/api/dashboard/recent-user-ticket')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(res.status).toBe(401);
    });
  });
}); 