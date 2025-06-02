import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js'; // your Express app instance
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

let mongoServer;
let adminToken;
let userToken;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Notification.deleteMany({});
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });

  // Create regular user
  const user = await User.create({
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@test.com',
    password: 'password123',
    role: 'user'
  });

  userId = user._id;

  // Generate tokens
  adminToken = jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );

  userToken = jwt.sign(
    { id: user._id, role: 'user' },
    process.env.JWT_SECRET || 'test-jwt-secret'
  );
});

describe('Notification API', () => {
  it('should create a new notification', async () => {
    const notificationData = {
      title: 'Test Notification',
      content: 'This is a test notification',
      type: 'info',
      userId: userId,
      priority: 'medium'
    };

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(notificationData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('notification');
    expect(res.body.notification.title).toBe('Test Notification');
  });

  it('should fetch all notifications for a user', async () => {
    // Create some test notifications
    await Notification.create([
      {
        title: 'Notification 1',
        content: 'Test message 1',
        type: 'info',
        userId: userId,
        priority: 'medium'
      },
      {
        title: 'Notification 2',
        content: 'Test message 2',
        type: 'warning',
        userId: userId,
        priority: 'high'
      }
    ]);

    const res = await request(app)
      .get('/api/notifications/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should mark a notification as read', async () => {
    const notification = await Notification.create({
      title: 'Unread Notification',
      content: 'This is an unread notification',
      type: 'info',
      userId: userId,
      priority: 'medium'
    });

    const res = await request(app)
      .put(`/api/notifications/${notification._id}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.notification.isRead).toBe(true);
  });

  it('should delete a notification', async () => {
    const notification = await Notification.create({
      title: 'To Delete',
      content: 'This notification will be deleted',
      type: 'info',
      userId: userId,
      priority: 'medium'
    });

    const res = await request(app)
      .delete(`/api/notifications/${notification._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it('should get a notification by ID', async () => {
    const notification = await Notification.create({
      title: 'Single Notification',
      content: 'This is a single notification',
      type: 'info',
      userId: userId,
      priority: 'medium'
    });

    const res = await request(app)
      .get(`/api/notifications/${notification._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Single Notification');
  });

  it('should get all notifications (admin)', async () => {
    // Create some test notifications
    await Notification.create([
      {
        title: 'Admin Notification 1',
        content: 'Test message 1',
        type: 'info',
        userId: userId,
        priority: 'medium',
        isAdminNotification: true
      },
      {
        title: 'Admin Notification 2',
        content: 'Test message 2',
        type: 'warning',
        userId: userId,
        priority: 'high',
        isAdminNotification: true
      }
    ]);

    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });
});
