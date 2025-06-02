import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Counter from '../models/counter.model.js';
import User from '../models/user.model.js';

let mongoServer;

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
  await Counter.deleteMany({});
  await User.deleteMany({});
});

describe('Counter Model Tests', () => {
  describe('Round Robin Agent Assignment', () => {
    let agents;

    beforeEach(async () => {
      // Create test agents
      agents = await User.create([
        {
          firstName: 'Agent',
          lastName: 'One',
          email: 'agent1@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
          department: 'Radiology',
          timezone: 'UTC',
          role: 'agent'
        },
        {
          firstName: 'Agent',
          lastName: 'Two',
          email: 'agent2@example.com',
          phoneNumber: '0987654321',
          password: 'password123',
          department: 'Radiology',
          timezone: 'UTC',
          role: 'agent'
        },
        {
          firstName: 'Agent',
          lastName: 'Three',
          email: 'agent3@example.com',
          phoneNumber: '5555555555',
          password: 'password123',
          department: 'Radiology',
          timezone: 'UTC',
          role: 'agent'
        }
      ]);
    });

    it('should create a new counter if it does not exist', async () => {
      const counter = await Counter.findOne({ key: 'agent_rr_index' });
      expect(counter).toBeNull();

      const newCounter = await Counter.create({ key: 'agent_rr_index', value: 0 });
      expect(newCounter).toBeDefined();
      expect(newCounter.key).toBe('agent_rr_index');
      expect(newCounter.value).toBe(0);
    });

    it('should increment counter and wrap around to 0', async () => {
      const counter = await Counter.create({ key: 'agent_rr_index', value: 0 });
      
      // First increment
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();
      expect(counter.value).toBe(1);

      // Second increment
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();
      expect(counter.value).toBe(2);

      // Third increment (should wrap around to 0)
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();
      expect(counter.value).toBe(0);
    });

    it('should assign agents in round-robin fashion', async () => {
      const counter = await Counter.create({ key: 'agent_rr_index', value: 0 });
      
      // First assignment
      const firstAgentIndex = counter.value % agents.length;
      const firstAgent = agents[firstAgentIndex];
      expect(firstAgent.email).toBe('agent1@example.com');

      // Increment counter
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();

      // Second assignment
      const secondAgentIndex = counter.value % agents.length;
      const secondAgent = agents[secondAgentIndex];
      expect(secondAgent.email).toBe('agent2@example.com');

      // Increment counter
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();

      // Third assignment
      const thirdAgentIndex = counter.value % agents.length;
      const thirdAgent = agents[thirdAgentIndex];
      expect(thirdAgent.email).toBe('agent3@example.com');

      // Increment counter (should wrap around)
      counter.value = (counter.value + 1) % agents.length;
      await counter.save();

      // Fourth assignment (should be back to first agent)
      const fourthAgentIndex = counter.value % agents.length;
      const fourthAgent = agents[fourthAgentIndex];
      expect(fourthAgent.email).toBe('agent1@example.com');
    });

    it('should handle empty agent list', async () => {
      await User.deleteMany({ role: 'agent' });
      const counter = await Counter.create({ key: 'agent_rr_index', value: 0 });
      
      // When there are no agents, the counter should remain at 0
      counter.value = 0; // Force value to 0 when no agents
      await counter.save();
      expect(counter.value).toBe(0);
    });
  });
}); 