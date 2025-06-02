import { useState } from "react";
import AuthForm from "../features/auth/AuthForm";
import { useAuthContext } from "../contexts/AuthContext";
import NavigateOnSuccess from "../features/auth/NavigateOnSuccess";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { login, loginMutation, loginLoading, loginError,
        googleLogin, googleLoginLoading, googleLoginError, googleLoginMutation
        } = useAuthContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("Login failed");
    } else {
      console.log("Form submitted successfully", formData);
      login(formData);
    }
  };
  const handleGoogleLogin = () => {
    googleLoginMutation.mutate();
  };

  return (
    <>
      <AuthForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        validateForm={validateForm}
        formData={formData}
      >
        <AuthForm.Title title="Sign In" />
        <AuthForm.GoogleLogin onClick={handleGoogleLogin} />
        <AuthForm.OrSection />
        <AuthForm.InputField preset="email" />
        <AuthForm.InputField preset="password" />
        <AuthForm.ContinueButton textContent="Sign In" />
        <AuthForm.SignInPrompt
          title="Don't have an account ? "
          subtitle="Create Account"
          location="/signup"
        />
      </AuthForm>
      <NavigateOnSuccess mutation={loginMutation} />
    </>
  );
}
export default LoginPage;
