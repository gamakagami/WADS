import CardTitle from "../CardTitle"
import ResponseTimeContent from "./ResponseTimeContent"
import SystemUptimeContent from "./SystemUptimeContent"
import AdminDropdown from "./AdminDropdown"
import { useState } from "react"
import { useAdminDashboardContext } from "../../../contexts/AdminDashboardContext"

export default function PerformanceMetricsCard(){
    const { responseTime, responseTimeLoading, responseTimeError, 
        serverUptime, serverUptimeLoading, serverUptimeError } = useAdminDashboardContext();

    const options = [{label:"Response Time", value:"Response Time"}, {label:"System Uptime", value:"System Uptime"}]

    const [selectedOption, setSelectedOption] = useState(options[0].value)

    const handleOptionChange = (newOption) => {
        setSelectedOption(newOption);
    }

    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Performance Metrics">
                <AdminDropdown options={options} onChange={handleOptionChange}/>
            </CardTitle>
            {selectedOption === "Response Time" && (
                <>
                    {responseTimeLoading && <div className="p-4 text-center">Loading...</div>}
                    {responseTimeError && <div className="p-4 text-center text-red-500">Error loading data</div>}
                    {!responseTimeLoading && !responseTimeError && (
                        <ResponseTimeContent data={responseTime} />
                    )}
                </>
            )}
            {selectedOption === "System Uptime" && (
                <>
                    {serverUptimeLoading && <div className="p-4 text-center">Loading...</div>}
                    {serverUptimeError && <div className="p-4 text-center text-red-500">Error loading data</div>}
                    {!serverUptimeLoading && !serverUptimeError && (
                        <SystemUptimeContent data={serverUptime}/>
                    )}
                </>
            )}
        </div>
    )
}