import User from '../models/user.model.js';
import { generateSecret, generateQRCode, verifyToken } from '../services/authenticator.service.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from './auth.controller.js';

// @desc    Enable 2FA for a user
// @route   POST /api/2fa/enable
// @access  Private
const enable2FA = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('Enabling 2FA for user:', userId);

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate new secret
  const secret = generateSecret();
  console.log('Generated secret:', secret.base32);
  
  // Generate QR code
  const qrCode = await generateQRCode(secret);
  console.log('Generated QR code');

  // Store the secret temporarily (in production, use Redis or similar)
  user.securitySettings.twoFactorSecret = secret.base32;
  await user.save();
  console.log('Saved secret to user:', user.securitySettings.twoFactorSecret);

  res.json({
    message: '2FA setup initiated',
    qrCode,
    secret: secret.base32 // For manual entry if QR code scanning fails
  });
});

// @desc    Verify and complete 2FA setup
// @route   POST /api/2fa/verify
// @access  Private
const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userId = req.user._id;
  console.log('Verifying 2FA for user:', userId, 'with token:', token);

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  console.log('User security settings:', user.securitySettings);
  if (!user.securitySettings.twoFactorSecret) {
    console.log('No twoFactorSecret found in user settings');
    res.status(400);
    throw new Error('2FA setup not initiated');
  }

  // Verify the token
  const isValid = verifyToken(user.securitySettings.twoFactorSecret, token);
  console.log('Token verification result:', isValid);

  if (!isValid) {
    res.status(400);
    throw new Error('Invalid verification code');
  }

  // Enable 2FA
  user.securitySettings.twoFactorEnabled = true;
  user.securitySettings.twoFactorMethod = 'authenticator';
  await user.save();
  console.log('2FA enabled successfully for user');

  res.json({
    message: '2FA enabled successfully'
  });
});

// @desc    Disable 2FA for a user
// @route   POST /api/2fa/disable
// @access  Private
const disable2FA = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.securitySettings.twoFactorEnabled = false;
  user.securitySettings.twoFactorMethod = null;
  user.securitySettings.twoFactorSecret = null;
  await user.save();

  res.json({
    message: '2FA disabled successfully'
  });
});

// @desc    Verify 2FA code during login
// @route   POST /api/2fa/validate
// @access  Public
const validate2FA = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!user.securitySettings.twoFactorEnabled) {
    res.status(400);
    throw new Error('2FA is not enabled for this user');
  }

  // Verify the token
  const isValid = verifyToken(user.securitySettings.twoFactorSecret, token);
  if (!isValid) {
    res.status(400);
    throw new Error('Invalid verification code');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken
  });
});

export {
  enable2FA,
  verify2FA,
  disable2FA,
  validate2FA
}; 