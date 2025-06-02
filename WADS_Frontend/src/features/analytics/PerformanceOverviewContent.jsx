import MiniStat from "../../components/app/MiniStat"

export default function PerformanceOverviewContent({ stats }){
    return(
        <div className="h-40 grid grid-rows-1 p-4 items-center">
            <div className="grid grid-cols-6 text-lg">
                <MiniStat title="Total Tickets" value={stats.ticketStats.total} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Tickets Pending" value={stats.ticketStats.total} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Tickets In Progress" value={stats.ticketStats.pending} valueColor="text-[#FFD166] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Tickets Resolved" value={stats.ticketStats.pending} valueColor="text-[#FFD166] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Avg Response Time" value={stats.ticketStats.total} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Avg System Uptime" value={stats.ticketStats.pending} valueColor="text-[#FFD166] text-3xl" className={"m-auto text-center"}/>
            </div>
        </div>
    )
}