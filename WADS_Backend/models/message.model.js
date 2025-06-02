import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        firstName: String,
        lastName: String,
        email: String
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;