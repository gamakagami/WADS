import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { getAgentStats, getAgentTicketStatus, getAgentRecentTickets } from "../api/dashboard";
import { useAuthContext } from "./AuthContext";

const AgentDashboardContext = createContext();

function AgentDashboardProvider({ children }) {
  const { user } = useAuthContext();

  const agentStatsQuery = useQuery({
    queryKey: ["agentStats"],
    queryFn: () => getAgentStats(user.accessToken),
    enabled: !!user.accessToken,
  });

  const agentTicketStatusQuery = useQuery({
    queryKey: ["agentTicketStatus"],
    queryFn: () => getAgentTicketStatus(user.accessToken),
    enabled: !!user.accessToken,
  });

  const agentRecentTicketsQuery = useQuery({
    queryKey: ["agentRecentTickets"],
    queryFn: () => getAgentRecentTickets(user.accessToken),
    enabled: !!user.accessToken,
  });

  return (
    <AgentDashboardContext.Provider
    value={{
        agentStats: agentStatsQuery.data,
        agentStatsLoading: agentStatsQuery.isLoading,
        agentStatsError: agentStatsQuery.error,
        refetchAgentStats: agentStatsQuery.refetch,

        agentTicketStatus: agentTicketStatusQuery.data,
        agentTicketStatusLoading: agentTicketStatusQuery.isLoading,
        agentTicketStatusError: agentTicketStatusQuery.error,
        refetchAgentTicketStatus: agentTicketStatusQuery.refetch,

        agentRecentTickets: agentRecentTicketsQuery.data,
        agentRecentTicketsLoading: agentRecentTicketsQuery.isLoading,
        agentRecentTicketsError: agentRecentTicketsQuery.error,
        refetchAgentRecentTickets: agentRecentTicketsQuery.refetch,
    }}
    >
    {children}
    </AgentDashboardContext.Provider>
  );
}

function useAgentDashboardContext() {
  const context = useContext(AgentDashboardContext);
  if (!context) throw new Error("AgentDashboardContext is used outside of provider");
  return context;
}

export { useAgentDashboardContext, AgentDashboardProvider };
