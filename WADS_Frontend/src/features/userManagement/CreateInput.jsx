export default function CreateInput({title, type, onChange}){
    return(
        <div className="flex-grow w-full mb-2">
            <h1>{title}</h1>
            <input className="w-full text-gray-600 border border-gray-400 py-2 px-4 rounded-sm mt-2 mx-auto" type={type} onChange={(e) => onChange(e.target.value)}/>
        </div>
    )
}