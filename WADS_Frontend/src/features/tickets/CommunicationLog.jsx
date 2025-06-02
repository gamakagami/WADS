import { useState, useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { format } from "date-fns";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import useUpdateTicketStatus from "../../queryoptions/updateTicketStatusQuery";

function CommunicationLog({
  ticketId,
  messages: initialMessages = [],
  currentStatus,
}) {
  const { user } = useAuthContext();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState(initialMessages);
  const [reply, setReply] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    useUpdateTicketStatus(ticketId);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "in_progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "resolved",
      label: "Resolved",
      color: "bg-green-100 text-green-800",
    },
  ];

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

  const handleStatusChange = (newStatus) => {
    updateStatus(newStatus, {
      onSuccess: () => {
        toast.success("Ticket status updated successfully!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        });
        setIsStatusDropdownOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update ticket status", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#F44336",
            color: "#fff",
          },
        });
      },
    });
  };

  useEffect(() => {
    if (user.role === "admin") {
      return;
    }

    if (!socket) {
      console.log("Socket not initialized");
      setError("Socket connection not available");
      return;
    }

    if (!ticketId) {
      console.log("No ticket ID provided");
      return;
    }

    if (!isConnected) {
      console.log("Socket not connected, waiting for connection...");
      return;
    }

    console.log("Setting up socket listeners for ticket:", ticketId);
    console.log("Socket connection state:", {
      connected: socket.connected,
      id: socket.id,
      auth: socket.auth,
      user: user,
    });

    // Join the ticket room
    socket.emit("ticket:join", ticketId, (response) => {
      console.log("Ticket join response:", response);
      if (response?.error) {
        toast.error("Failed to join ticket room", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#F44336",
            color: "#fff",
          },
        });
      }
    });

    // Listen for existing messages
    socket.on("ticket-messages", (existingMessages) => {
      console.log("Received existing messages:", existingMessages);
      setMessages(existingMessages);
      setError(null);
    });

    // Listen for new messages
    socket.on("ticket-message", (message) => {
      console.log("Received new message:", message);
      setMessages((prev) => [...prev, message]);

      // Show toast for new message if it's not from the current user
      if (message.sender.userId !== user._id) {
        toast.success(`New message from ${message.sender.firstName}`, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        });
      }
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error received:", error);
      setError(error.message);
      toast.error(error.message, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
    });

    // Cleanup function
    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("ticket-messages");
      socket.off("ticket-message");
      socket.off("error");
    };
  }, [socket, ticketId, user, isConnected]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    if (!isConnected) {
      setError("Not connected to server. Please wait...");
      toast.error("Not connected to server. Please wait...", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
      return;
    }

    if (!socket.connected) {
      setError("Socket not connected. Please wait...");
      toast.error("Socket not connected. Please wait...", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
      return;
    }

    setIsSending(true);
    setError(null);

    console.log("Sending message:", { ticketId, content: reply });
    socket.emit(
      "ticket:message",
      {
        ticketId,
        content: reply,
      },
      (response) => {
        setIsSending(false);
        if (response?.error) {
          setError(response.error);
          toast.error(response.error, {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#F44336",
              color: "#fff",
            },
          });
        } else {
          setReply("");
          toast.success("Message sent successfully!", {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          });
        }
      }
    );
  };

  return (
    <div className="col-span-5 bg-white p-5 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Communication Log
        </h3>

        {user.role === "agent" && (
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 cursor-pointer transition-colors duration-200 hover:bg-opacity-80 hover:bg-gray-100 `}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                <>
                  {formatStatus(currentStatus)}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isStatusDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white transition-all z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className={`w-full text-left cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentStatus === status.value ? "bg-gray-50" : ""
                      }`}
                      role="menuitem"
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          status.color.split(" ")[0]
                        }`}
                      ></span>
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          Connecting to server...
        </div>
      )}

      <div className="space-y-4 mb-5">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`border-l-4 pl-4 ${
                message.sender.userId === user._id
                  ? "border-green-500"
                  : "border-blue-600"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <strong
                  className={
                    message.sender.userId === user._id
                      ? "text-green-800"
                      : "text-blue-800"
                  }
                >
                  {message.sender.userId === user._id
                    ? "You"
                    : `${message.sender.firstName} ${message.sender.lastName}`}
                </strong>
                <span className="text-gray-500 text-sm">
                  {format(new Date(message.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Reply Box */}
      {user.role !== "admin" && (
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={!isConnected || isSending}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isConnected || isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}

CommunicationLog.propTypes = {
  ticketId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        userId: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  currentStatus: PropTypes.string.isRequired,
};

export default CommunicationLog;
