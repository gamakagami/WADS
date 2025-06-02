// FILE: controllers/userController.js
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import Audit from "../models/audit.model.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import passport from "passport";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth.controller.js";
import Room from "../models/room.model.js";

// @desc    Check if user exists
// @route   POST /api/users/check
// @access  Public
const checkUserExists = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email address");
  }

  const userExists = await User.findOne({ email });

  res.json({
    exists: !!userExists,
    message: userExists ? "Email is already registered" : "Email is available",
  });
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    department,
    timezone,
    role,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  // If role is not provided, assume it's 'user'
  const assignedRole = role || "user";

  // Require department only for non-user roles
  if (assignedRole !== "user" && (!department || !timezone)) {
    res.status(400);
    throw new Error("Department and timezone are required for this role");
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error(
      "Email is already registered. Please use a different email or try logging in."
    );
  }

  try {
    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      department,
      timezone,
      role: role || "user",
      notificationSettings: {
        email: {
          ticketStatusUpdates: true,
          newAgentResponses: true,
          ticketResolution: true,
          marketingUpdates: false,
        },
        inApp: {
          desktopNotifications: true,
          soundNotifications: true,
        },
      },
      securitySettings: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        lastPasswordChange: Date.now(),
        passwordStrength:
          password.length >= 8
            ? "strong"
            : password.length >= 6
            ? "medium"
            : "weak",
      },
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // If 2FA is not enabled, return full user data with tokens
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      accessToken,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400);
    throw new Error("Error creating user: " + error.message);
  }
});

// @desc    Admin creates a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const adminCreateUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    department,
    timezone,
    role,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const assignedRole = role || "user";

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error("Email is already registered.");
  }

  try {
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      department,
      timezone,
      role: assignedRole,
      notificationSettings: {
        email: {
          ticketStatusUpdates: true,
          newAgentResponses: true,
          ticketResolution: true,
          marketingUpdates: false,
        },
        inApp: {
          desktopNotifications: true,
          soundNotifications: true,
        },
      },
      securitySettings: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        lastPasswordChange: Date.now(),
        passwordStrength:
          password.length >= 8
            ? "strong"
            : password.length >= 6
            ? "medium"
            : "weak",
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin user creation failed:", error);
    res.status(400);
    throw new Error("Error creating user: " + error.message);
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Get user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Update last login timestamp
  user.lastLogin = Date.now();
  await user.save();

  // If 2FA is enabled, return only the user ID
  if (user.securitySettings.twoFactorEnabled) {
    res.json({
      _id: user._id,
      requires2FA: true,
    });
    return;
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // If 2FA is not enabled, return full user data with tokens
  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    accessToken,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.department = req.body.department || user.department;
    user.timezone = req.body.timezone || user.timezone;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // Only admins can change roles
    if (req.user.role === "admin" && req.body.role) {
      user.role = req.body.role;
    }

    // Update notification settings if provided
    if (req.body.notificationSettings) {
      if (req.body.notificationSettings.email) {
        Object.assign(
          user.notificationSettings.email,
          req.body.notificationSettings.email
        );
      }
      if (req.body.notificationSettings.inApp) {
        Object.assign(
          user.notificationSettings.inApp,
          req.body.notificationSettings.inApp
        );
      }
    }

    // Update security settings if provided
    if (req.body.securitySettings) {
      Object.assign(user.securitySettings, req.body.securitySettings);
    }

    // Change password if provided
    if (req.body.password && req.body.currentPassword) {
      // Verify current password first
      const isPasswordValid = await user.matchPassword(
        req.body.currentPassword
      );
      if (!isPasswordValid) {
        res.status(401);
        throw new Error("Current password is incorrect");
      }

      user.password = req.body.password; // Will be hashed by pre-validate hook
      user.securitySettings.lastPasswordChange = Date.now();
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update the password handling in updateUser
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.department = req.body.department || user.department;
    user.timezone = req.body.timezone || user.timezone;
    user.role = req.body.role || user.role;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // Update notification settings if provided
    if (req.body.notificationSettings) {
      if (req.body.notificationSettings.email) {
        Object.assign(
          user.notificationSettings.email,
          req.body.notificationSettings.email
        );
      }
      if (req.body.notificationSettings.inApp) {
        Object.assign(
          user.notificationSettings.inApp,
          req.body.notificationSettings.inApp
        );
      }
    }

    // Update security settings if provided
    if (req.body.securitySettings) {
      Object.assign(user.securitySettings, req.body.securitySettings);
    }

    // Update admin dashboard metrics if provided and user is admin
    if (req.body.adminDashboard && user.role === "admin") {
      if (req.body.adminDashboard.userStatistics) {
        Object.assign(
          user.adminDashboard.userStatistics,
          req.body.adminDashboard.userStatistics
        );
      }
      if (req.body.adminDashboard.performanceMetrics) {
        Object.assign(
          user.adminDashboard.performanceMetrics,
          req.body.adminDashboard.performanceMetrics
        );
      }
      if (req.body.adminDashboard.agentMetrics) {
        Object.assign(
          user.adminDashboard.agentMetrics,
          req.body.adminDashboard.agentMetrics
        );
      }
      if (req.body.adminDashboard.customerSatisfaction) {
        Object.assign(
          user.adminDashboard.customerSatisfaction,
          req.body.adminDashboard.customerSatisfaction
        );
      }
    }

    // Change password if provided
    if (req.body.password) {
      user.password = req.body.password; // Will be hashed by pre-validate hook
      user.securitySettings.lastPasswordChange = Date.now();
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update security settings
const updateSecuritySettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if current user is the user or an admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }

  // Update security settings
  if (req.body.twoFactorEnabled !== undefined) {
    user.securitySettings.twoFactorEnabled = req.body.twoFactorEnabled;
  }

  if (req.body.twoFactorMethod) {
    user.securitySettings.twoFactorMethod = req.body.twoFactorMethod;
  }

  // Change password if provided
  if (req.body.password) {
    user.password = req.body.password; // Will be hashed by pre-validate hook
    user.securitySettings.lastPasswordChange = Date.now();
  }

  // Update password strength if provided
  if (req.body.passwordStrength) {
    user.securitySettings.passwordStrength = req.body.passwordStrength;
  }

  const updatedUser = await user.save();

  res.json({
    securitySettings: updatedUser.securitySettings,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("rooms");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments({});
    res.status(200).json({
      success: true,
      type: "users",
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers: totalUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");

  try {
    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    } 
  } catch (error) {
      console.log("Error in fetching user:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
  }
  
});

// @desc    Get user activity by ID
// @route   GET /api/users/activity/:id
// @access  Private/Admin
const getAuditLogsByUser = asyncHandler(async (req,res) => {
  const { id } = req.params;
  const auditLogs = await Audit.find({ performedBy: id })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate({ path: 'performedBy', select: 'firstName lastName email role' });

  const result = await Promise.all(
    auditLogs.map(async (log) => {
      const ticket = await Ticket.findOne({ _id: log.ticketId }).select('title status'); // customize fields
      return {
        ...log.toObject(),
        ticketData: ticket || null, 
      };
    })
  );
  try {
    if(id){
      res.status(200).json(result);
    }else {
      return res.status(404).json({ success: false, message: "User not found" });
    } 
  } catch (error) {
    console.error("Error fetching audit logs by user:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
})

// @desc    Update user notification settings
// @route   PUT /api/users/:id/notifications
// @access  Private
const updateNotificationSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if current user is the user or an admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this user");
  }

  if (req.body.email) {
    Object.assign(user.notificationSettings.email, req.body.email);
  }

  if (req.body.inApp) {
    Object.assign(user.notificationSettings.inApp, req.body.inApp);
  }

  const updatedUser = await user.save();

  res.json({
    notificationSettings: updatedUser.notificationSettings,
  });
});

// Google OAuth login
const googleLogin = (req, res, next) => {
  const frontendCallbackUrl = req.query.redirect_uri || 'http://localhost:5173/auth/google/callback';
  
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: frontendCallbackUrl // Pass the frontend callback URL in state
  })(req, res, next);
};

// Google OAuth callback - Handles Google's response
const googleCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/login", session: false },
    async (err, user) => {
      try {
        if (err) {
          console.error('Google OAuth Error:', err);
          return res.redirect('http://localhost:5173/login?error=auth_failed');
        }

        if (!user) {
          return res.redirect('http://localhost:5173/login?error=no_user');
        }

        // Get the state parameter which should contain the frontend callback URL
        const frontendCallbackUrl = req.query.state || 'http://localhost:5173/auth/google/callback';

        // Prepare user data
        const userData = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          accessToken: user.accessToken,
        };

        // Redirect to frontend with user data
        const redirectUrl = `${frontendCallbackUrl}?userData=${encodeURIComponent(JSON.stringify(userData))}`;
        console.log('Redirecting to:', redirectUrl);
        return res.redirect(redirectUrl);
        
      } catch (error) {
        console.error('Google Callback Error:', error);
        return res.redirect('http://localhost:5173/login?error=server_error');
      }
    }
  )(req, res, next);
};

export const uploadProfilePicture = async (req, res) => {
  console.log("Incoming file:", req.file);
  console.log("User ID:", req.user._id); // if you're using userId

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;

    const base64DataUri = `data:${mimeType};base64,${base64Image}`;

    // Assume you get userId from req.body (or req.params)
    const userId = req.user._id; // Adjust this as needed
    console.log("Updating user with ID:", userId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: base64DataUri },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error("Upload PFP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export all your functions here
export {
  registerUser,
  adminCreateUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  getAuditLogsByUser,
  updateUser,
  updateNotificationSettings,
  updateSecuritySettings,
  googleLogin,
  googleCallback,
  checkUserExists,
};