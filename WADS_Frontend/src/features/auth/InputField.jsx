import { AlertCircle } from "lucide-react";

/* eslint-disable react/prop-types */
function InputField({ icon, type, name, placeholder, value, onChange, error }) {
  return (
    <div className="mb-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-2 pl-10 pr-3 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      {error && (
        <div className="mt-0.5 flex items-center text-red-500 text-xs">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}

export default InputField;
