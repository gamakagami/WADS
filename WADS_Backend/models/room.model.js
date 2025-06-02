import mongoose from "mongoose";
const { Schema } = mongoose;

const RoomSchema = new Schema({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isPublic: { type: Boolean, default: false },
  ticketId: { type: Schema.Types.ObjectId, ref: "Ticket" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
