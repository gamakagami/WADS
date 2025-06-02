/* eslint-disable react/prop-types */
import Text from "./Text";
import { useAuthContext } from "../../contexts/AuthContext";
import { useEffect, useRef } from "react";

function MessageArea({ messageReceived }) {
  const { user } = useAuthContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageReceived]);

  // Sort messages by creation time
  const sortedMessages = [...messageReceived].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white border-t border-b border-[#D5D5D5]">
      {sortedMessages.map((msg, index) => {
        // Skip messages without proper user data
        if (!msg?.user?.userId) {
          console.warn("Message missing user data:", msg);
          return null;
        }

        return (
          <Text
            key={msg._id || index}
            sender={{
              firstName: msg.user.firstName,
              lastName: msg.user.lastName,
              isCurrentUser: msg.user.userId === user._id,
            }}
            text={msg.content}
            time={formatTime(msg.createdAt)}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageArea;
