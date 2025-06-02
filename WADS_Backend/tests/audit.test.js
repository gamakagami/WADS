import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js'; 
import Audit from '../models/audit.model.js';
import User from '../models/user.model.js';
import Ticket from '../models/ticket.model.js';
import Room from '../models/room.model.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Audit.deleteMany({});
  await User.deleteMany({});
  await Ticket.deleteMany({});
  await Room.deleteMany({});

  // Create admin user and generate token
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your-secret-key');
});

describe('Audit Log Routes', () => {
  it('should return paginated audit logs', async () => {
    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@example.com',
      password: 'password123'
    });
    const agent = await User.create({
      firstName: 'Agent',
      lastName: 'User',
      email: 'agent@example.com',
      password: 'password123',
      role: 'agent'
    });
    const room = await Room.create({ name: 'Test Room' });
    const ticket = await Ticket.create({
      title: 'Sample Ticket',
      description: 'This is a sample ticket',
      user: { userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      assignedTo: { userId: agent._id, firstName: agent.firstName, lastName: agent.lastName, email: agent.email },
      roomId: room._id,
      department: 'IT',
      category: 'General'
    });

    for (let i = 0; i < 25; i++) {
      await Audit.create({
        ticket: ticket._id,
        ticketId: ticket._id.toString(),
        action: 'comment_added',
        performedBy: user._id,
      });
    }

    const res = await request(app)
      .get('/api/audits?page=2&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(10);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.pages).toBe(3);
  });
});
