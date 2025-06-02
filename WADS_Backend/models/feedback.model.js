import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    rating:{
        type: String,
        required: true,
        enum: [
            'positive',
            'neutral',
            'negative'
          ]
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

export default Feedback;
