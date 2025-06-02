export default function MiniStat({title, value, valueColor, className}){
    return(
        <div className={`${className}`}>
            <h1 className="w-full text-[#636363]">{title}</h1>
            <h1 className={`w-full ${valueColor} text-2xl font-semibold`}>{value}</h1>
        </div>
    )
}