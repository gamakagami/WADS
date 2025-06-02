import mongoose from "mongoose";
const { Schema } = mongoose;

const AuditSchema = new Schema({
  ticket: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  ticketId: {
  type: String,
  required: true
},
  action: {
    type: String,
    required: true,
  },
  fieldChanged: {
    type: String,
    required: false, // Not all actions need a field change (e.g., comment_added)
  },
  previousValue: {
    type: Schema.Types.Mixed
  },
  newValue: {
    type: Schema.Types.Mixed
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},{
    timestamps: true
});

const Audit = mongoose.model('Audit', AuditSchema);

export default Audit;
