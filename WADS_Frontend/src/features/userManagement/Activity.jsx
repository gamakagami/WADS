export default function Activity({content}){
    const title = content.ticketData ? content.ticketData.title : "a ticket"
    return(
        <div className="w-full h-20 rounded-md shadow-sm border border-gray-300 mb-2 p-4 flex items-center">
            <h1>{content.performedBy.firstName} {content.performedBy.lastName} {content.action} <strong>{title}</strong></h1>
        </div>
    )
}