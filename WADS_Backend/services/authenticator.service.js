import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Generate a new secret key for TOTP
const generateSecret = () => {
  return speakeasy.generateSecret({
    length: 20,
    name: 'Semesta Medika Ticketing System' 
  });
};

// Generate QR code for the secret
const generateQRCode = async (secret) => {
  try {
    return await QRCode.toDataURL(secret.otpauth_url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

// Verify TOTP token
const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1 // Allow 1 step before and after for clock skew
  });
};

export {
  generateSecret,
  generateQRCode,
  verifyToken
}; 