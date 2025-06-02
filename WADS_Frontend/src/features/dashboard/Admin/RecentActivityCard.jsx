import CardTitle from "../CardTitle"

export default function RecentActivityCard({data}){

    const auditData = data.data
    const activities = Array.isArray(auditData) ? auditData.map(entry => entry.description) : []
    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Recent Activity"/>
            <div className="h-72 p-4">
                <ul className="list-inside list-disc h-full overflow-y-auto">
                    {
                        activities.length > 0
                        ?activities.map((item, index) => {
                            return <li className="mb-3" key={index}>{item}</li>
                        })
                        :
                        <p className="text-[#969696]">No recent activity</p>
                    }
                </ul>
            </div>
        </div>
    )
}