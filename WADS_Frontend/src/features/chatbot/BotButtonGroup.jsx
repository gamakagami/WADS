import BotButton from "./BotButton";
import { useChatbotContext } from "../../contexts/ChatbotContext";

export default function BotButtonGroup() {
  const { newBotMessage } = useChatbotContext();

  const handleButtonClick = (prompt) => {
    newBotMessage({ message: prompt });
  };

  return (
    <div className="mt-4 flex gap-3">
      <BotButton
        content="Equipment Support"
        onClick={() =>
          handleButtonClick(
            "I need help with my medical equipment. What are the common issues and how can I resolve them?"
          )
        }
      />
      <BotButton
        content="Maintenance Help"
        onClick={() =>
          handleButtonClick(
            "What are the maintenance requirements and schedules for my medical equipment?"
          )
        }
      />
      <BotButton
        content="Create Ticket"
        onClick={() =>
          handleButtonClick(
            "I need to create a support ticket for my medical equipment issue."
          )
        }
      />
    </div>
  );
}
