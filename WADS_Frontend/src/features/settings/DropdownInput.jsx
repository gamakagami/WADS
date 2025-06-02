/* eslint-disable react/prop-types */
function DropdownInput({
  className,
  options = [],
  defaultValue = "",
  children,
}) {
  return (
    <div className="mb-2">
      <p className="block text-sm font-medium text-gray-700 mb-1">{children}</p>
      <select
        defaultValue={defaultValue}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          className || ""
        }`}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownInput;
