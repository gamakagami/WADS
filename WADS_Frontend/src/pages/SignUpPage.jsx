import { useState } from "react";
import AuthForm from "../features/auth/AuthForm";
import getTimezone from "../utils/getTimezone";
import { useAuthContext } from "../contexts/AuthContext";
import NavigateOnSuccess from "../features/auth/NavigateOnSuccess";

const timezone = getTimezone();

function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    timezone,
  });
  const [errors, setErrors] = useState({});
  const { register, registerMutation, registerLoading, registerError } =
    useAuthContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(formData);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("Registration failed");
    } else {
      register(formData);
    }
  };
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <>
      <AuthForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        validateForm={validateForm}
        formData={formData}
        errors={errors}
      >
        <AuthForm.Title title="Sign Up" />
        <AuthForm.GoogleLogin onClick={handleGoogleLogin} />
        <AuthForm.OrSection />
        <AuthForm.FlexContainer>
          <AuthForm.InputField preset="firstName" />
          <AuthForm.InputField preset="lastName" />
        </AuthForm.FlexContainer>
        <AuthForm.InputField preset="email" />
        <AuthForm.InputField preset="phoneNumber" />
        <AuthForm.InputField preset="password" />
        <AuthForm.InputField preset="confirmPassword" />
        <AuthForm.ContinueButton textContent="Create Account" />
        <AuthForm.SignInPrompt
          title="Already have an account? "
          subtitle="Sign in"
          location="/login"
        />
      </AuthForm>
      <NavigateOnSuccess mutation={registerMutation} />
    </>
  );
}

export default SignUpPage;
