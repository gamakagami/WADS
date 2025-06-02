import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

// Create a new notification
export const createNotification = async (req, res) => {
    const { userId, title, content, type, priority, link } = req.body;
  
    try {
      const notification = new Notification({
        userId,
        title,
        content,
        type,
        priority,
        link,
      });
  
      await notification.save();
      res.status(201).json({ message: 'Notification created successfully', notification });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Failed to create notification' });
    }
  };

  // Get a single notification by ID
export const getNotificationById = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      res.status(200).json(notification);
    } catch (error) {
      console.error('Error fetching notification by ID:', error);
      res.status(500).json({ message: 'Failed to fetch notification' });
    }
  };
  
  export const getNotifications = async (req, res) => {
  const userId = req.user._id;

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

  // Get admin notifications
export const getAdminNotifications = async (req, res) => {
  // Ensure only admin users can access this route
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    // Shared admin notifications (not tied to a specific user)
    const notifications = await Notification.find({ isAdminNotification: true }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

  
  // Mark notification as read
  export const markAsRead = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      notification.isRead = true;
      await notification.save();
  
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  };

  // Mark all notifications as read for the logged-in user
export const markAllAsRead = async (req, res) => {
  const userId = req.user._id;

  // Check if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const result = await Notification.updateMany(
      { userId: new mongoose.Types.ObjectId(userId), isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ 
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
};

  
  // Delete a notification
  export const deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notification = await Notification.findByIdAndDelete(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Failed to delete notification' });
    }
  };