import DonutChart from "../DonutChart"

export default function AgentPerformanceContent({ data }){

    const totalTickets = data.resolved + data.in_progress + data.pending;
    const resolvedPercentage = (data.resolved / totalTickets) * 100;
    const inProgressPercentage = (data.in_progress / totalTickets) * 100;
    const pendingPercentage = (data.pending / totalTickets) * 100;  

    return(
        <div className="h-72 p-4">
            <DonutChart 
            data={[
                { label: 'Resolved', value: resolvedPercentage, color: '#4AC180' },
                { label: 'In Progress', value: inProgressPercentage, color: '#4A81C0' },
                { label: 'Pending', value: pendingPercentage, color: '#FF6B6B' },
            ]}/>
        </div>
    )
}