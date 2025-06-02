import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Department from '../models/department.model.js';
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
  await Department.deleteMany({});
  await User.deleteMany({});
});

describe('Department Model Tests', () => {
  describe('Department Creation', () => {
    it('should create a new department successfully', async () => {
      const departmentData = {
        name: 'Radiology',
        description: 'Radiology Department'
      };

      const department = await Department.create(departmentData);
      expect(department).toBeDefined();
      expect(department.name).toBe(departmentData.name);
      expect(department.description).toBe(departmentData.description);
      expect(department.users).toHaveLength(0);
    });

    it('should not create department with duplicate name', async () => {
      const departmentData = {
        name: 'Radiology',
        description: 'Radiology Department'
      };

      await Department.create(departmentData);

      try {
        await Department.create(departmentData);
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.code).toBe(11000); // MongoDB duplicate key error
      }
    });

    it('should create department with required fields only', async () => {
      const departmentData = {
        name: 'Cardiology'
      };

      const department = await Department.create(departmentData);
      expect(department).toBeDefined();
      expect(department.name).toBe(departmentData.name);
      expect(department.description).toBe(''); // Default empty string
      expect(department.users).toHaveLength(0);
    });
  });

  describe('Department User Management', () => {
    let department;
    let users;

    beforeEach(async () => {
      // Create a test department
      department = await Department.create({
        name: 'Radiology',
        description: 'Radiology Department'
      });

      // Create test users
      users = await User.create([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phoneNumber: '1234567890',
          password: 'password123',
          department: 'Radiology',
          timezone: 'UTC',
          role: 'user'
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phoneNumber: '0987654321',
          password: 'password123',
          department: 'Radiology',
          timezone: 'UTC',
          role: 'user'
        }
      ]);
    });

    it('should add users to department', async () => {
      department.users.push(users[0]._id, users[1]._id);
      await department.save();

      const updatedDepartment = await Department.findById(department._id)
        .populate('users', 'firstName lastName email');

      expect(updatedDepartment.users).toHaveLength(2);
      expect(updatedDepartment.users[0].email).toBe('john@example.com');
      expect(updatedDepartment.users[1].email).toBe('jane@example.com');
    });

    it('should remove users from department', async () => {
      // First add users
      department.users.push(users[0]._id, users[1]._id);
      await department.save();

      // Then remove one user
      department.users = department.users.filter(
        userId => userId.toString() !== users[0]._id.toString()
      );
      await department.save();

      const updatedDepartment = await Department.findById(department._id)
        .populate('users', 'firstName lastName email');

      expect(updatedDepartment.users).toHaveLength(1);
      expect(updatedDepartment.users[0].email).toBe('jane@example.com');
    });
  });

  describe('Department Queries', () => {
    beforeEach(async () => {
      // Create multiple departments
      await Department.create([
        {
          name: 'Radiology',
          description: 'Radiology Department'
        },
        {
          name: 'Cardiology',
          description: 'Cardiology Department'
        },
        {
          name: 'Emergency',
          description: 'Emergency Department'
        }
      ]);
    });

    it('should find department by name', async () => {
      const department = await Department.findOne({ name: 'Radiology' });
      expect(department).toBeDefined();
      expect(department.name).toBe('Radiology');
    });

    it('should get all departments', async () => {
      const departments = await Department.find();
      expect(departments).toHaveLength(3);
      expect(departments.map(d => d.name)).toEqual(
        expect.arrayContaining(['Radiology', 'Cardiology', 'Emergency'])
      );
    });

    it('should update department details', async () => {
      const department = await Department.findOne({ name: 'Radiology' });
      department.description = 'Updated Radiology Department';
      await department.save();

      const updatedDepartment = await Department.findById(department._id);
      expect(updatedDepartment.description).toBe('Updated Radiology Department');
    });

    it('should delete department', async () => {
      const department = await Department.findOne({ name: 'Radiology' });
      await Department.findByIdAndDelete(department._id);

      const deletedDepartment = await Department.findById(department._id);
      expect(deletedDepartment).toBeNull();
    });
  });
}); 