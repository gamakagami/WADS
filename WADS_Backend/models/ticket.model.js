import mongoose from "mongoose";
import Audit from "./audit.model.js";
import User from "./user.model.js";
const { Schema } = mongoose;

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter ticket title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter ticket description"],
      trim: true,
    },
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      firstName: String,
      lastName: String,
      email: String,
    },
    assignedTo: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
          validator: async function (value) {
            if (!value) return true;
            const user = await User.findById(value);
            if (!user) return false;
            return user.role === "agent";
          },
          message: 'Assigned user must exist and have the "agent" role',
        },
      },
      firstName: String,
      lastName: String,
      email: String,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    equipment: {
      name: {
        type: String,
        required: function () {
          return this.category === "Equipment Issue";
        },
      },
      type: {
        type: String,
        required: function () {
          return this.category === "Equipment Issue";
        },
      },
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      required: true,
    },
    activityLog: [
      {
        action: {
          type: String,
          enum: [
            "created",
            "updated",
            "status_changed",
            "assigned",
            "comment_added",
            "attachment_added",
          ],
        },
        performedBy: { type: Schema.Types.ObjectId, ref: "User" },
        previousValue: Schema.Types.Mixed,
        newValue: Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    attachments: [
      {
        fileName: { type: String, required: true },
        fileUrl: String,
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    messages: [
      {
        content: { type: String, required: true },
        sender: {
          userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          firstName: String,
          lastName: String,
          email: String,
          role: String,
        },
        attachments: [
          {
            fileName: String,
            fileUrl: String,
            uploadedAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Add participants (user + assigned agent)
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        firstName: String,
        lastName: String,
        email: String,
        role: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add audit logging middleware
TicketSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const options = this.getOptions();
    const userId = options.context?.user?._id; // requires user to be passed in options.context

    if (!userId) return next(); // Skip if no user info (shouldn't happen if secure)

    const ticketBefore = await this.model.findOne(this.getQuery()).lean();

    const auditEntries = [];

    // Fields to audit
    const fieldsToAudit = [
      "status",
      "priority",
      "assignedTo",
      "title",
      "description",
    ];

    for (let field of fieldsToAudit) {
      if (
        update[field] !== undefined &&
        update[field] !== ticketBefore[field]
      ) {
        auditEntries.push({
          ticket: ticketBefore._id,
          action: `${field}_changed`,
          fieldChanged: field,
          previousValue: ticketBefore[field],
          newValue: update[field],
          performedBy: userId,
        });
      }
    }

    if (auditEntries.length > 0) {
      await Audit.insertMany(auditEntries);
    }

    next();
  } catch (err) {
    console.error("Audit logging failed:", err);
    next(); // Never block ticket update
  }
});

const Ticket = mongoose.model("Ticket", TicketSchema);

export default Ticket;
