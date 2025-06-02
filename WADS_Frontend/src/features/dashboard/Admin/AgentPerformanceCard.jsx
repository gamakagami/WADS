import CardTitle from "../CardTitle"
import AgentPerformanceContent from "./AgentPerformanceContent"
import AdminDropdown from "./AdminDropdown"
import { useAdminDashboardContext } from "../../../contexts/AdminDashboardContext"
import { useState } from "react"

export default function AgentPerformanceCard(){

    const { agentPerformance, agentPerformanceLoading } = useAdminDashboardContext();
    let options
    if(!agentPerformanceLoading) options = agentPerformance.performance.map((agent, index) => {
        const { firstName, lastName, userId } = agent.assignedTo;
        const shortId = userId.slice(-4);
        return {
            label: `${firstName} ${lastName} (#${shortId})`,
            value: index
        };
    });

    const [selectedOption, setSelectedOption] = useState(0)

    const handleOptionChange = (newOption) => {
        setSelectedOption(newOption);
    }

    if(agentPerformanceLoading) return <>Loading...</>

    return(
        <div className="bg-white rounded-sm shadow-md border border-neutral-200">
            <CardTitle title="Agent Performance">
                <AdminDropdown options={options} onChange={handleOptionChange}/>
            </CardTitle>
            <AgentPerformanceContent data={agentPerformance.performance[selectedOption]}/>
        </div>
    )
}