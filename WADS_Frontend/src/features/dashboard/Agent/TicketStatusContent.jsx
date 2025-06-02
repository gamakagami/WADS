import DonutChart from "../DonutChart"

export default function TicketStatusContent({ status }){

    const totalTickets = status.resolved + status.in_progress + status.pending;
    const resolvedPercentage = (status.resolved / totalTickets) * 100;
    const inProgressPercentage = (status.in_progress / totalTickets) * 100;
    const pendingPercentage = (status.pending / totalTickets) * 100;    

    return(
        <div className="h-72 flex flex-wrap p-4 justify-between items-center">
            <DonutChart 
            data={[
                { label: 'Resolved', value: resolvedPercentage, color: '#4AC180' },
                { label: 'In Progress', value: inProgressPercentage, color: '#4A81C0' },
                { label: 'Pending', value: pendingPercentage, color: '#FF6B6B' },
            ]}/>
        </div>
    )
}