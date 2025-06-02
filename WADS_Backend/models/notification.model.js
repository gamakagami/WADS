import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, default: 'system' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    link: { type: String, default: '' },
    isAdminNotification: { type: Boolean, default: false }
},  { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
