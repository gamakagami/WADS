import CustomerSatisfactionCard from "../../features/dashboard/CustomerSatisfactionCard"
import UserStatisticsCard from "../../features/dashboard/Admin/UserStatisticsCard"
import TicketOverviewCard from "../../features/dashboard/Admin/TicketOverviewCard"
import DashboardTicketCard from "../../features/dashboard/DashboardTicketCard"
import RecentActivityCard from "../../features/dashboard/Admin/RecentActivityCard"
import PerformanceMetricsCard from "../../features/dashboard/Admin/PerformanceMetricsCard"
import AgentPerformanceCard from "../../features/dashboard/Admin/AgentPerformanceCard"
import { useAdminDashboardContext } from "../../contexts/AdminDashboardContext"
import { getAdminRecentOptions } from "../../queryoptions/getRecentTicketQuery";
import { useAuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard(){
    const { globalStats, recentActivity } = useAdminDashboardContext();
    const tempStats = {
      ticketStats: {
        "total": "...",
        "pending": "...",
        "inProgress": "...",
        "resolved": "..."
      },
      userStats: {
        "totalUsers": "...",
        "activeToday": "...",
        "newUsers": "...",
        "totalAgents": "..."
      },
      feedbackStats: {
        "positive": 0,
        "neutral": 0,
        "negative": 0,
        "totalCount": "..."
      }
    }

    const tempRecentActivity = [
        "..."
    ]

      // Recent ticket data
    const { user } = useAuthContext();
    const { data, isLoading } = useQuery(getAdminRecentOptions(user.accessToken));

    // Wait for data to finish loading
    if (isLoading) return <p>Loading...</p>;
      
    return(
        <div className="grid grid-rows-3 gap-6">
            <div className="grid grid-cols-3 gap-6">
                <div><TicketOverviewCard stats={globalStats || tempStats}/></div>
                <div><UserStatisticsCard stats={globalStats || tempStats}/></div>
                <div><CustomerSatisfactionCard stats={globalStats || tempStats}/></div>
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-6">
                <div><DashboardTicketCard data={data}/></div>
                <div><RecentActivityCard data={recentActivity || tempRecentActivity}/></div>
            </div>

            <div className="grid grid-cols-[1fr_2fr] gap-6">
                <div><AgentPerformanceCard/></div>
                <div><PerformanceMetricsCard/></div>
            </div>
        </div>
    )
}