/* eslint-disable react/prop-types */
import { createContext, useContext } from "react";
import { AlertCircle, User, Mail, Lock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
const AuthFormContext = createContext();

function AuthForm({
  children,
  handleChange,
  handleSubmit,
  validateForm,
  formData,
  errors,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-2 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 ">
        <AuthFormContext.Provider
          value={{ handleSubmit, handleChange, validateForm, formData, errors }}
        >
          {children}
        </AuthFormContext.Provider>
      </div>
    </div>
  );
}

function SignInPrompt({ title, subtitle, location }) {
  return (
    <NavLink to={location}>
      <p className="text-center mt-4 text-sm text-gray-600">
        {title}
        <span href="#" className="text-blue-600 hover:underline">
          {subtitle}
        </span>
      </p>
    </NavLink>
  );
}

function OrSection() {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="border-t border-gray-300 flex-grow mr-3"></div>
      <span className="text-xs text-gray-500 font-medium">OR</span>
      <div className="border-t border-gray-300 flex-grow ml-3"></div>
    </div>
  );
}
function GoogleLogin({ onClick }) {
  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
function ContinueButton({ textContent }) {
  const { handleSubmit } = useContext(AuthFormContext);
  return (
    <button
      onClick={handleSubmit}
      className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2 mt-4"
    >
      {textContent}
    </button>
  );
}
function Title({ title }) {
  return (
    <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
      {title}
    </h1>
  );
}

function InputField({ preset }) {
  const { formData, handleChange, errors } = useContext(AuthFormContext);

  const presetConfigs = {
    firstName: {
      icon: <User size={16} />,
      type: "text",
      name: "firstName",
      placeholder: "First Name",
      autoComplete: "given-name",
    },
    lastName: {
      icon: <User size={16} />,
      type: "text",
      name: "lastName",
      placeholder: "Last Name",
      autoComplete: "family-name",
    },
    email: {
      icon: <Mail size={16} />,
      type: "email",
      name: "email",
      placeholder: "Email Address",
      autoComplete: "email",
    },
    phoneNumber: {
      icon: <FaPhoneAlt size={16} />,
      type: "tel",
      name: "phoneNumber",
      placeholder: "Phone Number",
      autoComplete: "phoneNumber",
    },
    password: {
      icon: <Lock size={16} />,
      type: "password",
      name: "password",
      placeholder: "Password",
      autoComplete: "new-password",
    },
    confirmPassword: {
      icon: <Lock size={16} />,
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm Password",
      autoComplete: "new-password",
    },
  };

  const config = presetConfigs[preset];

  if (!config) {
    console.error(`Preset "${preset}" not found in InputField`);
    return null;
  }

  const error = errors?.[config.name];
  const value = formData?.[config.name] || "";

  return (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          {config.icon}
        </div>
        <input
          type={config.type}
          name={config.name}
          placeholder={config.placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={config.autoComplete}
          className={`w-full py-1.5 pl-10 pr-3 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>
      {error && (
        <div className="flex items-center text-red-500 text-xs mt-0.5">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}

function FlexContainer({ children }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  );
}

AuthForm.Title = Title;
AuthForm.SignInPrompt = SignInPrompt;
AuthForm.OrSection = OrSection;
AuthForm.GoogleLogin = GoogleLogin;
AuthForm.ContinueButton = ContinueButton;
AuthForm.InputField = InputField;
AuthForm.FlexContainer = FlexContainer;

export default AuthForm;
