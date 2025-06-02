import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter"

export default function EditableUserDetail({options, onChange, value, title}){
    return(
        <>
        <h1 className="text-[#424242] text-md mb-1">{title}</h1>
        <select
            className="h-10 w-full mb-4 border-1 border-neutral-300 text-neutral-500 rounded-md px-2 outline-neutral-400"
            onChange={(e) => onChange(e.target.value)}
            value={value}
        >
        {options && options.length > 0 ? (
            options.map((option, index) => (
            <option value={option} key={index}>
                {capitalizeFirstLetter(option)}
            </option>
            ))
        ) : (
            <></>
        )}
        </select>
        </>
    )
}