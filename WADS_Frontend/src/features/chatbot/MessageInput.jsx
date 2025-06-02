import { FaArrowUp } from "react-icons/fa";
import { useState } from "react";
import { useChatbotContext } from "../../contexts/ChatbotContext";

export default function MessageInput({ setTempMessage }) {
    const [message, setMessage] = useState("");
    const { newBotMessage } = useChatbotContext();

    const handleSubmit = (e) => {
      if (e) e.preventDefault();

      if(message !== "") newBotMessage({message: message})

      setMessage("");
      setTempMessage(message);
    };
    return (
      <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-md">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow rounded-l-lg text-sm border border-gray-300 p-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <button 
            onClick={handleSubmit}
            className="bg-[#1D3B5C] rounded-r-lg p-2 aspect-square w-10 text-white hover:cursor-pointer"
          >
            <FaArrowUp size={15} className="m-auto" />
          </button>
        </div>
      </div>
    );
  }