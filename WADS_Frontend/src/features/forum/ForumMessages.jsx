import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSocket } from "../../contexts/SocketContext";
import { getRoomMessagesQueryOptions } from "../../queryOptionsFolder/getForumQuery";
import MessageInput from "./MessageInput";
import MessageArea from "./MessageArea";
import MessageHeader from "./MessageHeader";
import PropTypes from "prop-types";

function ForumMessages({ selectedRoomId, onBackClick }) {
  const { user } = useAuthContext();
  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const {
    data: roomMessages,
    isLoading,
    error: queryError,
  } = useQuery(getRoomMessagesQueryOptions(user.accessToken, selectedRoomId));

  // Initialize messages from the query result
  useEffect(() => {
    if (roomMessages) {
      console.log("Room messages loaded:", roomMessages);
      setMessages(roomMessages);
    }
  }, [roomMessages]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!selectedRoomId || !socket) {
      console.log("Socket or roomId not available:", {
        socket,
        selectedRoomId,
      });
      return;
    }

    console.log("Joining room:", selectedRoomId);
    // Join the room
    socket.emit("forum:join-room", selectedRoomId);

    // Listen for initial messages
    socket.on("forum:messages", (initialMessages) => {
      console.log("Initial messages received:", initialMessages);
      setMessages(initialMessages);
    });

    // Listen for new messages
    socket.on("forum:message-received", (data) => {
      console.log("New message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setError(error.message);
    });

    return () => {
      console.log("Cleaning up socket listeners for room:", selectedRoomId);
      socket.off("forum:messages");
      socket.off("forum:message-received");
      socket.off("error");
    };
  }, [selectedRoomId, socket]);

  if (isLoading)
    return (
      <div className="flex-1 flex flex-col h-full bg-white border border-[#D5D5D5] rounded-md">
        <div className="p-4 text-center">Loading messages...</div>
      </div>
    );

  if (queryError || error)
    return (
      <div className="flex-1 flex flex-col h-full bg-white border border-[#D5D5D5] rounded-md">
        <div className="p-4 text-red-500 text-center">
          Error loading messages: {queryError?.message || error}
        </div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full bg-white border border-[#D5D5D5] rounded-md">
      <MessageHeader
        agentName={selectedRoomId ? "Public Forum" : "Select a room"}
        onBackClick={onBackClick}
      />
      <MessageArea messageReceived={messages} />
      <MessageInput
        message={message}
        setMessage={setMessage}
        socket={socket}
        roomId={selectedRoomId}
        disabled={!selectedRoomId || !socket}
      />
    </div>
  );
}

ForumMessages.propTypes = {
  selectedRoomId: PropTypes.string,
  onBackClick: PropTypes.func,
};

export default ForumMessages;
