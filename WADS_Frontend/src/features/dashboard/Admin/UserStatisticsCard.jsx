import CardTitle from "../CardTitle"
import UserStatisticsContent from "./UserStatisticsContent"

export default function UserStatisticsCard({ stats }){
    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="User Statistics"/>
            <UserStatisticsContent stats={stats}/>
        </div>
    )
}