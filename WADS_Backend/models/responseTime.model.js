import mongoose from "mongoose";

const responseTimeSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now,
    expires: 108000
  },
  durationMs: { type: Number, required: true }
});

const responseTime = mongoose.model('ServerMetric', responseTimeSchema);

export default responseTime
