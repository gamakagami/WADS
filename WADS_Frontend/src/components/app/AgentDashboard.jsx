import StatisticsCard from "../../features/dashboard/Agent/StatisticsCard"
import CustomerSatisfactionCard from "../../features/dashboard/CustomerSatisfactionCard"
import DashboardTicketCard from "../../features/dashboard/DashboardTicketCard"
import TicketStatusCard from "../../features/dashboard/Agent/TicketStatusCard"
import { getAgentRecentOptions } from "../../queryoptions/getRecentTicketQuery";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useAgentDashboardContext } from "../../contexts/AgentDashboardContext"

export default function AgentDashboard() {

    const { agentStats, agentTicketStatus } = useAgentDashboardContext();
    const tempStats = {
        totalAssigned: "...",
        resolvedThisWeek: "...",
        feedbackStats: {
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "totalCount": "..."
          }
    }
    const tempTicketStatus = {
        "pending": 0,
        "in_progress": 0,
        "resolved": 0
    }

    // Recent ticket data
    const { user } = useAuthContext();
    const { data, isLoading } = useQuery(getAgentRecentOptions(user.accessToken));

    // Wait for data to finish loading
    if (isLoading) return <p>Loading...</p>;

    return(
        <div className="grid grid-rows-2 gap-12">
            <div className="grid grid-cols-[2fr_3fr] gap-12">
                <div><StatisticsCard stats={agentStats || tempStats}/></div>
            <div><CustomerSatisfactionCard stats={agentStats || tempStats}/></div>
        </div>

        <div className="grid grid-cols-[3fr_1fr] gap-12">
            <div>
                <DashboardTicketCard data={data}/>
            </div>
            <div>
                <TicketStatusCard status={agentTicketStatus || tempTicketStatus}/>
            </div>
            </div>
        </div>
    )
}