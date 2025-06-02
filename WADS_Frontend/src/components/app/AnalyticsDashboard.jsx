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
import PerformanceCard from "../../features/analytics/PerformanceCard"
import AgentDetailPerformanceCard from "../../features/analytics/AgentDetailPerformanceCard"
import UserFeedbackCard from "../../features/analytics/UserFeedbackCard"

export default function AnalyticsDashboard(){
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
      
   return (
  <div className="grid grid-rows-1 gap-6">
    {/* Top performance card row */}
    <div className="grid grid-cols-1 gap-6">
      <PerformanceCard stats={globalStats || tempStats} />
    </div>

    {/* Main layout: 2 cards left (stacked), 1 tall card right */}
    <div className="grid grid-cols-3 gap-6">
      {/* Left side (2 stacked cards) */}
      <div className="flex flex-col gap-6">
        <CustomerSatisfactionCard stats={globalStats || tempStats} />
        <RecentActivityCard data={recentActivity || tempRecentActivity} />
      </div>

      {/* Right side (tall card spanning 2 rows) */}
      <div className="col-span-2 flex flex-col gap-6">
        <AgentDetailPerformanceCard stats={globalStats || tempStats} />
        <PerformanceMetricsCard />
      </div>
    </div>
    <UserFeedbackCard />
  </div>
);
}