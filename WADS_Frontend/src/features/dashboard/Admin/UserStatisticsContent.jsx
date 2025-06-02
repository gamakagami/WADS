import MiniStat from "../../../components/app/MiniStat"

export default function UserStatisticsContent({ stats }){
    return(
        <div className="h-72 grid grid-rows-2 p-4 items-center">
            <div className="grid grid-cols-2 text-lg">
                <MiniStat title="Total Users" value={stats.userStats.totalUsers} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="Active Today" value={stats.userStats.activeToday} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
            </div>

            <div className="grid grid-cols-2 text-lg">
                <MiniStat title="Total Agents" value={stats.userStats.totalAgents} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
                <MiniStat title="New Users" value={stats.userStats.newUsers} valueColor="text-[#1D3B5C] text-3xl" className={"m-auto text-center"}/>
            </div>
        </div>
    )
}