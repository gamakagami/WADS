import MiniStat from "../../../components/app/MiniStat"

export default function TicketOverviewContent({ stats }){
    return(
        <div className="h-72 grid grid-rows-2 p-4 items-center">
            <div className="grid grid-cols-2 text-lg">
                <MiniStat title="Total" value={stats.ticketStats.total} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Pending" value={stats.ticketStats.pending} valueColor="text-[#FFD166] text-3xl" className={"m-auto text-center"}/>
            </div>

            <div className="grid grid-cols-2 text-lg">
                <MiniStat title="In Progress" value={stats.ticketStats.inProgress} valueColor="text-[#4A81C0] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Resolved" value={stats.ticketStats.resolved} valueColor="text-[#4AC180] text-3xl" className={"m-auto text-center"}/>
            </div>
        </div>
    )
}