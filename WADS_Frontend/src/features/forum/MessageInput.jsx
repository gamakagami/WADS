/* eslint-disable react/prop-types */
import { useState } from "react";

function MessageInput({ message, setMessage, socket, roomId, disabled }) {
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!message.trim()) return;

    if (!socket || !roomId) {
      setError("Cannot send message: Connection not established");
      return;
    }

    try {
      socket.emit("forum:send-message", {
        roomId,
        content: message,
      });
      setMessage("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Failed to send message: ${err.message}`);
    }
  };

  return (
    <div className="p-4 border-t border-[#D5D5D5] bg-white rounded-b-md">
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Select a room to chat" : "Type a message..."}
          disabled={disabled}
          className="flex-1 p-2 border border-[#D5D5D5] rounded-md"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
