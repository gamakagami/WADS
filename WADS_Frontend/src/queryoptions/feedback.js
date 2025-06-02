import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgentFeedbackSummary,
  getFeedbackForTicket,
  submitFeedback,
} from "../api/feedback";

// Query key factory
export const feedbackKeys = {
  all: ["feedback"],
  agentSummary: (agentId) => [...feedbackKeys.all, "agent", agentId],
  ticketFeedback: (ticketId) => [...feedbackKeys.all, "ticket", ticketId],
};

// Get agent feedback summary
export const useAgentFeedbackSummary = (agentId) => {
  return useQuery({
    queryKey: feedbackKeys.agentSummary(agentId),
    queryFn: () => getAgentFeedbackSummary(agentId),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get ticket feedback
export const useTicketFeedback = (ticketId) => {
  return useQuery({
    queryKey: feedbackKeys.ticketFeedback(ticketId),
    queryFn: () => getFeedbackForTicket(ticketId),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Submit feedback mutation
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, rating }) => submitFeedback(ticketId, rating),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(
        feedbackKeys.ticketFeedback(variables.ticketId)
      );

      // If we have the agent ID, we should also invalidate their summary
      if (data.agent) {
        queryClient.invalidateQueries(feedbackKeys.agentSummary(data.agent));
      }
    },
  });
};
