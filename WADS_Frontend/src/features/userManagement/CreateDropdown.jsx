import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter"

export default function CreateDropdown({title, options, onChange}){
    return(
        <div className="flex-grow w-full mb-2">
            <h1>{title}</h1>
            <select
            className="w-full h-10 border-1 border-neutral-300 text-neutral-600 rounded-md py-2 px-4 outline-neutral-400 mt-2"
            onChange={(e) => {onChange(e.target.value)}}
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
        </div>
    )
}