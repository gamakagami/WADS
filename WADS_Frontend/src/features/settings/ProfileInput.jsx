/* eslint-disable react/prop-types */

const ProfileInput = ({
  className,
  children,
  type = "",
  defaultValue = "",
  options = [],
}) => {
  return (
    <div className="mb-2">
      <p className="block text-sm font-medium text-gray-700 mb-1">{children}</p>
      {type === "" && (
        <input
          type="text"
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            className || ""
          }`}
        />
      )}
      {type === "dropdown" && (
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
      )}
    </div>
  );
};

export default ProfileInput;
