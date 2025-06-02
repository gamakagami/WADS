import MiniStat from "../../../components/app/MiniStat";

export default function SystemUptimeContent({ data }) {
    const isOperational = data.currentStatus === "Operational";

    return (
        <div className="w-full h-72 p-6 bg-white rounded-2xl shadow-md flex flex-col">
            <div className="text-xl font-medium text-gray-700 mb-4">
                System Status:&nbsp;
                <span className={isOperational ? "text-green-500" : "text-red-500"}>
                    {data.currentStatus}
                </span>
            </div>

            <div className="flex-1 flex items-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    <MiniStat title="24 Hours" value={`${data.uptime["24h"]}%`} />
                    <MiniStat title="7 Days" value={`${data.uptime["7d"]}%`} />
                    <MiniStat title="30 Days" value={`${data.uptime["30d"]}%`} />
                    <MiniStat title="90 Days" value={`${data.uptime["90d"]}%`} />
                </div>
            </div>
        </div>
    );
}

