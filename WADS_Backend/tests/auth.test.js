import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

let mongoServer;

// Set up test environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  // Ensure JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test-jwt-secret';
  }
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Authentication Tests', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    password: 'password123',
    department: 'IT',
    timezone: 'UTC'
  };

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should not register a user with existing email', async () => {
      // First registration
      await request(app)
        .post('/api/users')
        .send(testUser);

      // Second registration with same email
      const res = await request(app)
        .post('/api/users')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('already registered');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('required fields');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Clear users and create a fresh test user
      await User.deleteMany({});
      
      // Create test user through registration endpoint
      const registerRes = await request(app)
        .post('/api/users')
        .send(testUser);
      
      expect(registerRes.status).toBe(201);
      console.log('Test user created:', registerRes.body._id);
    });

    it('should login successfully with correct credentials', async () => {
      console.log('Attempting login with test user credentials');
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      console.log('Login response:', {
        status: res.status,
        body: res.body
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should not login with incorrect password', async () => {
      console.log('Attempting login with incorrect password');
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      console.log('Login response:', {
        status: res.status,
        body: res.body
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      console.log('Attempting login with non-existent email');
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      console.log('Login response:', {
        status: res.status,
        body: res.body
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });
  });

  describe('Email Check', () => {
    it('should return false for non-existent email', async () => {
      const res = await request(app)
        .post('/api/users/check')
        .send({ email: 'new@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.exists).toBe(false);
    });

    it('should return true for existing email', async () => {
      // Register a user first
      await request(app)
        .post('/api/users')
        .send(testUser);

      const res = await request(app)
        .post('/api/users/check')
        .send({ email: testUser.email });

      expect(res.status).toBe(200);
      expect(res.body.exists).toBe(true);
    });
  });

  describe('Protected Routes', () => {
    let token;

    beforeEach(async () => {
      // Register and login to get token
      const registerRes = await request(app)
        .post('/api/users')
        .send(testUser);
      token = registerRes.body.token;
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should not access protected route without token', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(401);
    });

    it('should not access protected route with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
}); 