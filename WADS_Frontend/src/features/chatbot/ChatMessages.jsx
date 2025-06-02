import React from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import BotButtonGroup from "./BotButtonGroup";
import { useChatbotContext } from "../../contexts/ChatbotContext";
import { useEffect, useRef } from "react";

export default function ChatMessages({ tempMessage, setTempMessage }) {
  const {
    botMessageHistory,
    botMessageHistoryLoading,
    botMessageHistoryError,
    newBotMessagePending
  } = useChatbotContext();

  if(!newBotMessagePending && tempMessage !== "") {
    setTempMessage("");
  }

  const bottomRef = useRef(null);

  // Instantly scroll to latest chats during initial load
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // Smooth scrolling when you send a new message
  useEffect(() => {
    if (newBotMessagePending) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [newBotMessagePending]);

  return (
    <div className="flex-grow overflow-y-auto p-4">
      <BotMessage
        buttons={<BotButtonGroup />}
        content="Hello! I'm your medical equipment support assistant. How can I help you today?"
      />

      {botMessageHistoryError && (<div className="w-full text-center text-neutral-300">Error Fetching Messages</div>)}
      {botMessageHistoryLoading && (<div className="w-full text-center text-neutral-300">...</div>)}
      {botMessageHistory &&
        [...botMessageHistory.chats]
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .map((data, index) => (
            <React.Fragment key={index}>
              <div className="w-full text-xs text-gray-500 text-center mb-4">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(new Date(data.timestamp))}
              </div>
              <UserMessage content={data.message} />
              {data.response && <BotMessage content={data.response} />}
            </React.Fragment>
          ))}

          
          {newBotMessagePending &&
          <>
            <UserMessage content={tempMessage} />
            <BotMessage>
              <div className="w-full flex gap-2">
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></div>
              </div> 
            </BotMessage>
          </>
          }
          

        <div ref={bottomRef} />
    </div>
  );
}
