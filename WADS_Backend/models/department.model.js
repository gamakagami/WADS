import mongoose from "mongoose";
const { Schema } = mongoose;

const DepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Array of users assigned to this department
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", DepartmentSchema);

export default Department;
