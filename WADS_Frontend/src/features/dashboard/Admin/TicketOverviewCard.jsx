import CardTitle from "../CardTitle"
import TicketOverviewContent from "./TicketOverviewContent"

export default function TicketOverviewCard({ stats }){
    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Tickets Overview"/>
            <TicketOverviewContent stats={stats}/>
        </div>
    )
}