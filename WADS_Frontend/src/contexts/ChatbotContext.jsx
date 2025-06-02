import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { newMessage, getMessageHistory } from "../api/chatbot";
import { useAuthContext } from "./AuthContext";

const ChatbotContext = createContext();

function ChatbotProvider({ children }) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const botMessageHistoryQuery = useQuery({
    queryKey: ["botMessageHistory"],
    queryFn: () => getMessageHistory(user.accessToken),
    enabled: !!user.accessToken,
  });

  const newBotMessageMutation = useMutation({
    mutationFn: (messageData) => newMessage(user.accessToken, messageData),
    onSuccess: () => queryClient.invalidateQueries(["botMessageHistory"]),
    onError: (error) => console.error(`Error: ${error.message}`),
  });

  return (
    <ChatbotContext.Provider
      value={{
        botMessageHistory: botMessageHistoryQuery.data,
        botMessageHistoryLoading: botMessageHistoryQuery.isLoading,
        botMessageHistoryError: botMessageHistoryQuery.error,
        refetchbotMessageHistory: botMessageHistoryQuery.refetch,

        newBotMessage: newBotMessageMutation.mutate,
        newBotMessagePending: newBotMessageMutation.isPending,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

function useChatbotContext() {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error("ChatbotContext is used outside of provider");
  return context;
}

export { useChatbotContext, ChatbotProvider };
