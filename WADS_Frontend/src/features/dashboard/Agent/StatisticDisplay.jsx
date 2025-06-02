export default function StatisticDisplay({title, children}) {
    return(
        <div className="w-full flex flex-wrap justify-evenly rounded-sm gap-2 bg-neutral-100 p-3">
            <h1 className="w-full text-center text-[#636363]">{title}</h1>
            <h1 className="w-full text-center text-[#1D3B5C] text-3xl font-semibold">{children}</h1>
        </div>
    )
}