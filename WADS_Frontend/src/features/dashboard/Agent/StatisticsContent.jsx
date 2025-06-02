import StatisticDisplay from "./StatisticDisplay"

export default function StatisticsContent({totalAssigned, resolvedThisWeek}){
    return(
        <div className="h-72 flex flex-wrap p-4 justify-between items-center">
            <StatisticDisplay title="Total Tickets Assigned">
                {totalAssigned}
            </StatisticDisplay>
            <StatisticDisplay title="Tickets Resolved This Week">
                {resolvedThisWeek}
            </StatisticDisplay>
        </div>
    )
}