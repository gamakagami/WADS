// Mock LINE service for testing
let lastGeneratedCode = null;

const generateVerificationCode = () => {
  lastGeneratedCode = Math.floor(100000 + Math.random() * 900000).toString();
  return lastGeneratedCode;
};

const sendVerificationCode = async (lineUserId, code) => {
  // In tests, we'll just store the code
  lastGeneratedCode = code;
  return true;
};

const verifyLineSignature = (signature, body) => {
  // Always return true in tests
  return true;
};

const handleLineWebhook = async (events) => {
  // Mock webhook handling
  return true;
};

const getLastGeneratedCode = () => lastGeneratedCode;

export {
  generateVerificationCode,
  sendVerificationCode,
  verifyLineSignature,
  handleLineWebhook,
  getLastGeneratedCode
}; 