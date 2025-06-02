/* eslint-disable react/prop-types */
const Input = ({
  className,
  children,
  type = "",
  value = "",
  onChange = () => {},
  options = [],
  readOnly = false,
  disabled = false,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-2">
      <p className="block text-sm font-medium text-gray-700 mb-1">{children}</p>
      {type === "" && (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            className || ""
          } ${readOnly || disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      )}
      {type === "dropdown" && (
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            className || ""
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Input;
