import CardTitle from "../dashboard/CardTitle"
import PerformanceOverviewContent from "./PerformanceOverviewContent"

export default function PerformanceCard({ stats }){
    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Performance Metrics"/>
            <PerformanceOverviewContent stats={stats}/>
        </div>
    )
}