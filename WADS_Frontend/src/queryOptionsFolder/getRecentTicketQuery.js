import { queryOptions } from "@tanstack/react-query";
import { getUserRecentTickets, getAgentRecentTickets, getRecentTicketsGlobal } from "../api/dashboard";

function getUserRecentOptions(token) {
  return queryOptions({
    queryKey: ["user-recent-tickets"],
    queryFn: () => getUserRecentTickets(token),
  });
}

function getAgentRecentOptions(token) {
  return queryOptions({
    queryKey: ["agent-recent-tickets"],
    queryFn: () => getAgentRecentTickets(token),
  });
}

function getAdminRecentOptions(token) {
  return queryOptions({
    queryKey: ["global-recent-tickets"],
    queryFn: () => getRecentTicketsGlobal(token),
  });
}

export { getUserRecentOptions, getAgentRecentOptions, getAdminRecentOptions };