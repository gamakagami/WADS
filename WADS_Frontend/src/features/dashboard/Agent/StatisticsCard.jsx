import CardTitle from "../CardTitle"
import StatisticsContent from "./StatisticsContent"

export default function StatisticsCard({ stats }){
    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Statistics" />
            <StatisticsContent totalAssigned={stats.totalAssigned} resolvedThisWeek={stats.resolvedThisWeek}/>
        </div>
    )
}