import Activity from "./Activity"
import EmptyPlaceholder from "../tickets/EmptyPlaceholder"

export default function UserActivity({ activities }){
    return(
        <div className="w-full h-full flex flex-col gap-4 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
            <h1 className="flex-grow text-lg font-medium border-b border-gray-300">Recent Activity</h1>
            <div className="w-full h-120 overflow-y-auto">
                {activities.length>0 ? 
                activities.map((activity, index) =>{
                    return <Activity content={activity} key={index}/>
                }):
                <div className="w-full flex items-center justify-center">
                    <EmptyPlaceholder/>
                </div>
                }
            </div>
        </div>
    )
}