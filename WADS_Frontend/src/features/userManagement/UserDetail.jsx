export default function UserDetail({title, detail}){
    return(
        <div>
            <h1 className="text-[#424242] text-md mb-1">{title}</h1>
            <p className="text-[#636363] text-md mb-2">{detail}</p>
        </div>
    )
}