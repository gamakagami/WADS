import CardTitle from "../dashboard/CardTitle";
import MiniStat from "../../components/app/MiniStat";
import AdminDropdown from "../dashboard/Admin/AdminDropdown";
import { useAdminDashboardContext } from "../../contexts/AdminDashboardContext";
import { useState } from "react";

export default function AgentDetailPerformanceCard({ stats }) {

     const { agentPerformance, agentPerformanceLoading } = useAdminDashboardContext();
    let options
    if(!agentPerformanceLoading) options = agentPerformance.performance.map((agent, index) => {
        const { firstName, lastName, userId } = agent.assignedTo;
        const shortId = userId.slice(-4);
        return {
            label: `${firstName} ${lastName} (#${shortId})`,
            value: index
        };
    });

    const [selectedOption, setSelectedOption] = useState(0)

    const handleOptionChange = (newOption) => {
        setSelectedOption(newOption);
    }

    if(agentPerformanceLoading) return <>Loading...</>
  return (
    <div className="bg-white rounded-sm shadow-md border border-neutral-200 h-[480px] flex flex-col">
      <CardTitle title="Agent Performance" >
      <AdminDropdown options={options} onChange={handleOptionChange}/>
      </CardTitle>

      {/* Grid container: 2 columns [2fr 3fr] */}
      <div className="grid grid-cols-[2fr_3fr] gap-4 p-6 flex-1 overflow-y-auto items-start">
        
        {/* Left column */}
        <div className="flex flex-col gap-y-9">
          <MiniStat title="Tickets Resolved" value={stats.ticketStats.resolved} />
          <MiniStat title="Tickets In Progress" value={stats.ticketStats.inProgress} />
          <MiniStat title="Tickets Pending" value={stats.ticketStats.pending} />
          <MiniStat title="Avg Resolution Time" value={stats.ticketStats.avgResolutionTime || "—"} />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-y-9">
          <MiniStat title="Department" value={stats.userStats.department || "—"} />
          <MiniStat title="Availability" value={stats.userStats.availability || "—"} />
          
          {/* Satisfaction Score breakdown */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Satisfaction Score</h4>
            <p className="text-sm text-gray-500 mb-1">
              Total Responses: {stats.feedbackStats.totalCount}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-500">Positive</span>
                <div className="w-full bg-gray-200 rounded h-2 mx-2">
                  <div
                    className="bg-green-400 h-2 rounded"
                    style={{ width: `${stats.feedbackStats.positive}%` }}
                  ></div>
                </div>
                <span className="text-sm">{stats.feedbackStats.positive}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500">Neutral</span>
                <div className="w-full bg-gray-200 rounded h-2 mx-2">
                  <div
                    className="bg-yellow-400 h-2 rounded"
                    style={{ width: `${stats.feedbackStats.neutral}%` }}
                  ></div>
                </div>
                <span className="text-sm">{stats.feedbackStats.neutral}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-500">Negative</span>
                <div className="w-full bg-gray-200 rounded h-2 mx-2">
                  <div
                    className="bg-red-400 h-2 rounded"
                    style={{ width: `${stats.feedbackStats.negative}%` }}
                  ></div>
                </div>
                <span className="text-sm">{stats.feedbackStats.negative}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
