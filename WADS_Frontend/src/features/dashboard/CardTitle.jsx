function CardTitle({title, children}){
    return(
        <div className="w-full p-4 border-b border-neutral-200 flex justify-between items-center"> 
            <h1 className="text-[#424242] text-xl font-normal">{title}</h1>
            <div className="flex gap-4">{children}</div>
        </div>
    )
}

export default CardTitle