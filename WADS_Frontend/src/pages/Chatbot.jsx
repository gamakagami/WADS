import MessageInput from "../features/chatbot/MessageInput";
import ChatMessages from "../features/chatbot/ChatMessages";
import { ChatbotProvider } from "../contexts/ChatbotContext";
import { useState } from "react";

export default function Chatbot() {
  const [tempMessage, setTempMessage] = useState("");
  return (
    <ChatbotProvider>
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-grow h-full">
          <ChatMessages tempMessage={tempMessage} setTempMessage={setTempMessage}/>
          <MessageInput setTempMessage={setTempMessage}/>
        </div>
      </div>
    </ChatbotProvider>
  );
}
