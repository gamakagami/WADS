import SatisfactionBar from "../../components/app/SatisfactionBar"
import MiniStat from "../../components/app/MiniStat"

export default function CustomerSatisfactionContent({ stats }){
    return(
        <div className="h-72 p-4 flex flex-wrap">
            <MiniStat value={stats.feedbackStats.totalCount} title="Total Reviews" valueColor="text-[#1D3B5C]"/>
            <SatisfactionBar title="Positive" percentage={stats.feedbackStats.positive} className={"bg-[#4AC180]"}/>
            <SatisfactionBar title="Neutral" percentage={stats.feedbackStats.neutral} className={"bg-[#FFD166]"}/>
            <SatisfactionBar title="Negative" percentage={stats.feedbackStats.negative} className={"bg-[#FF6B6B]"}/>
        </div>
    )
}