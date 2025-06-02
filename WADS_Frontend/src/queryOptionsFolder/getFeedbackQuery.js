import { queryOptions } from "@tanstack/react-query";
import { getAgentFeedbackSummary, getFeedbackForTicket } from "../api/feedback";

// Query options for agent feedback summary
function getAgentFeedbackQueryOptions(token, agentId) {
  return queryOptions({
    queryKey: ["feedback", "agent", agentId],
    queryFn: () => getAgentFeedbackSummary(token, agentId),
    enabled: !!agentId && !!token,
  });
}

// Query options for ticket feedback
function getTicketFeedbackQueryOptions(token, ticketId) {
  return queryOptions({
    queryKey: ["feedback", "ticket", ticketId],
    queryFn: () => getFeedbackForTicket(token, ticketId),
    enabled: !!ticketId && !!token,
  });
}

export { getAgentFeedbackQueryOptions, getTicketFeedbackQueryOptions };
