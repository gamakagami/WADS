export default function SatisfactionBar({title, percentage, className}){
    return(
        <div className="w-full flex flex-wrap">
            <h1 className="w-full text-[#636363]">{title}</h1>
            <div className="w-5/6 h-5 rounded-xl bg-neutral-300 overflow-hidden">
                <div className={`h-full rounded-xl transition-all duration-500 ${className}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}