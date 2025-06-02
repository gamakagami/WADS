/* eslint-disable react/prop-types */
import { useState } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import TicketFeedback from "./TicketFeedback";

function DetailHeader({ ticketData }) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-600",
    resolved: "bg-green-100 text-green-600",
    in_progress: "bg-blue-100 text-blue-600",
  };

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-md mb-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          #{ticketData._id} - {ticketData.title}
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 font-medium rounded-md ${
              statusColors[ticketData.status]
            }`}
          >
            {formatStatus(ticketData.status)}
          </span>

          {ticketData.status === "resolved" && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors duration-200 text-sm font-medium flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Rate Experience
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-gray-600">
        Created: {format(parseISO(ticketData.createdAt), "yyyy-MM-dd")} | Last
        Updated:{" "}
        {capitalizeFirstLetter(formatDistanceToNow(ticketData.updatedAt))} ago
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Rate Your Experience
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:bg-gray-100 rounded-full cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <TicketFeedback
              ticketId={ticketData._id}
              currentStatus={ticketData.status}
              onClose={() => setShowFeedbackModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailHeader;
