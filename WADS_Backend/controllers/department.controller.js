import Department from "../models/department.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// Create a new department
export const createDepartment = async (req, res) => {
  const { name, description, users } = req.body;

  try {
    // Check if the department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: `Department with name "${name}" already exists.` });
    }

    const department = new Department({
      name,
      description,
      users,
    });

    await department.save();

    // 🔔 Agent Notification
    const agentNotifications = users.map(userId => new Notification({
      userId,
      title: 'Added to Department',
      content: `You have been added to the "${name}" department.`,
      type: 'department',
      priority: 'medium',
      link: `/departments/${department._id}`
    }));

    // 🔔 Admin Notification
    const adminNotification = new Notification({
      title: 'New Department Created',
      content: `A new department "${name}" has been created.`,
      type: 'department',
      priority: 'medium',
      link: `/departments/${department._id}`,
      isAdminNotification: true
    });

    // Save all notifications
    await Promise.all([
      ...agentNotifications.map(n => n.save()),
      adminNotification.save()
    ]);

    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Failed to create department' });
  }
};


// Get all user IDs associated with a specific department
export const getUsersByDepartment = async (req, res) => {
    const { departmentId } = req.params;
  
    try {
      // Find the department by ID
      const department = await Department.findById(departmentId).populate('users', '_id');
      
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
      // Extract the user IDs from the populated 'users' field
      const userIds = department.users.map(user => user._id);
  
      res.status(200).json({ userIds });
    } catch (error) {
      console.error('Error fetching users by department:', error);
      res.status(500).json({ message: 'Failed to fetch users by department' });
    }
  };

// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('users', 'name email');
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
};

// Get a single department by ID
export const getDepartmentById = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.findById(departmentId).populate('users', 'name email');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({ message: 'Failed to fetch department' });
  }
};

export const addUserToDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required in request body' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyExists = department.users
  .filter((user) => user !== null)
  .some((user) => user.toString() === userId);

    if (alreadyExists) {
      return res.status(400).json({ message: 'User already in department' });
    }

    department.users.push(userId);
    await department.save();

    // 🔔 User Notification
    const userNotification = new Notification({
      userId,
      title: 'Added to Department',
      content: `You have been added to the "${department.name}" department.`,
      type: 'department',
      priority: 'medium',
      link: `/departments/${department._id}`
    });

    // 🔔 Admin Notification
    const adminNotification = new Notification({
      title: 'User Added to Department',
      content: `Agent ${user.firstName+" "+user.lastName} has been added to the "${department.name}" department.`,
      type: 'department',
      priority: 'low',
      link: `/departments/${department._id}`,
      isAdminNotification: true
    });

    await Promise.all([userNotification.save(), adminNotification.save()]);

    res.status(200).json({
      message: 'User added to department successfully',
      department,
    });
  } catch (error) {
    console.error('Error adding user to department:', error);
    res.status(500).json({ message: 'Failed to add user to department' });
  }
};

// Update department details
export const updateDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { name, description, users } = req.body;

  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name || department.name;
    department.description = description || department.description;
    department.users = users || department.users;

    await department.save();

     // 🔔 Notify all users in the department
    const userNotifications = (department.users || []).map((userId) => {
      return new Notification({
        userId,
        title: 'Department Updated',
        content: `The "${department.name}" department has been updated.`,
        type: 'department',
        priority: 'low',
        link: `/departments/${department._id}`
      });
    });

    // 🔔 Admin notification
    const adminNotification = new Notification({
      title: 'Department Updated',
      content: `The "${department.name}" department has been updated.`,
      type: 'department',
      priority: 'low',
      link: `/departments/${department._id}`,
      isAdminNotification: true
    });

    await Promise.all([...userNotifications.map(n => n.save()), adminNotification.save()]);

    res.status(200).json({ message: 'Department updated successfully', department });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department' });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const department = await Department.findByIdAndDelete(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

     const departmentUsers = department.users || [];

    await department.deleteOne();

    // 🔔 Notify department users
    const userNotifications = departmentUsers.map((userId) => {
      return new Notification({
        userId,
        title: 'Department Deleted',
        content: `The department "${department.name}" you were part of has been deleted.`,
        type: 'department',
        priority: 'medium',
        link: `/departments`
      });
    });

    // 🔔 Admin Notification
    const adminNotification = new Notification({
      title: 'Department Deleted',
      content: `The department "${department.name}" has been deleted.`,
      type: 'department',
      priority: 'medium',
      link: `/departments`,
      isAdminNotification: true
    });

    await Promise.all([...userNotifications.map(n => n.save()), adminNotification.save()]);

    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department' });
  }
};
