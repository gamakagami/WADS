// Generate a random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending verification code via authenticator app
const sendVerificationCode = async (userId, code) => {
  console.log(`[Authenticator App] Verification code for user ${userId}: ${code}`);
  return true;
};

// Simulate verifying a code
const verifyCode = (storedCode, providedCode) => {
  return storedCode === providedCode;
};

export {
  generateVerificationCode,
  sendVerificationCode,
  verifyCode
}; 