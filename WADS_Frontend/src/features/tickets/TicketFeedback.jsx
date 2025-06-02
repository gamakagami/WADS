import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTicketFeedbackQueryOptions } from "../../queryOptions/getFeedbackQuery";
import { submitFeedback } from "../../api/feedback";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

function TicketFeedback({ ticketId, currentStatus, onClose }) {
  const { user } = useAuthContext();

  const { data: existingFeedback } = useQuery(
    getTicketFeedbackQueryOptions(user.accessToken, ticketId)
  );

  // Submit feedback mutation
  const { mutate: submitFeedbackMutation, isLoading: isSubmittingFeedback } =
    useMutation({
      mutationFn: ({ rating }) =>
        submitFeedback(user.accessToken, ticketId, rating),
      onSuccess: () => {
        toast.success("Feedback submitted successfully!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        });
        if (onClose) onClose();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to submit feedback", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#F44336",
            color: "#fff",
          },
        });
      },
    });

  const handleFeedbackSubmit = (rating) => {
    submitFeedbackMutation({ rating });
  };

  if (user.role !== "user" || currentStatus !== "resolved") {
    return null;
  }

  if (existingFeedback) {
    return (
      <div className="p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Your Feedback
        </h4>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              existingFeedback.rating === "positive"
                ? "bg-green-100 text-green-800"
                : existingFeedback.rating === "neutral"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {existingFeedback.rating.charAt(0).toUpperCase() +
              existingFeedback.rating.slice(1)}
          </span>
          <p className="text-gray-600 text-sm">Thank you for your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-gray-600 mb-4">
        How would you rate your experience with this support ticket?
      </p>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleFeedbackSubmit("positive")}
          disabled={isSubmittingFeedback}
          className="flex flex-col items-center p-4 bg-green-50 text-green-800 rounded-md hover:bg-green-100 disabled:opacity-50 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Positive</span>
        </button>
        <button
          onClick={() => handleFeedbackSubmit("neutral")}
          disabled={isSubmittingFeedback}
          className="flex flex-col items-center p-4 bg-yellow-50 text-yellow-800 rounded-md hover:bg-yellow-100 disabled:opacity-50 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Neutral</span>
        </button>
        <button
          onClick={() => handleFeedbackSubmit("negative")}
          disabled={isSubmittingFeedback}
          className="flex flex-col items-center p-4 bg-red-50 text-red-800 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Negative</span>
        </button>
      </div>
      {isSubmittingFeedback && (
        <div className="mt-4 text-center text-gray-600">
          <svg
            className="animate-spin h-5 w-5 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2">Submitting your feedback...</p>
        </div>
      )}
    </div>
  );
}

TicketFeedback.propTypes = {
  ticketId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default TicketFeedback;
