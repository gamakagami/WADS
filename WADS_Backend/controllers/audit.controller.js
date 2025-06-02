import Audit from "../models/audit.model.js";

// Get all audit logs with pagination
export const getAllAuditLogs = async (req, res) => {
    try {
      // Default to page 1 and limit 20 logs per page
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;
  
      // Fetch all audit logs with pagination
      const auditLogs = await Audit.find()
        .skip(skip)
        .limit(limit)
        .sort({ timestamp: -1 })  // Sort by most recent first
        .populate('ticket')  // Optional: populate ticket details
        .populate('performedBy');  // Optional: populate user who performed action
  
      // Fetch the total number of audit logs for pagination
      const totalLogs = await Audit.countDocuments();
  
      res.status(200).json({
        success: true,
        data: auditLogs,
        pagination: {
          total: totalLogs,
          page,
          pages: Math.ceil(totalLogs / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching all audit logs:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };