export default function AdminDropdown({ options, onChange }) {
  return (
    <select
      className="h-10 border-1 border-neutral-300 text-neutral-500 rounded-md px-2 outline-neutral-400"
      onChange={(e) => onChange(e.target.value)}
    >
      {options && options.length > 0 ? (
        options.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))
      ) : (
        <></>
      )}
    </select>
  );
}
