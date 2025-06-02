import mongoose from 'mongoose';

const uptimeLogSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now,
    expires: 2592000
  },
  status: { type: String, enum: ['up', 'down'], required: true },
  message: { type: String }
});

const uptimeLog = mongoose.model('UptimeLog', uptimeLogSchema);
export default uptimeLog;
