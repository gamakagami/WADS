/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

function ProtectedRoute({ children, reverse = false }) {
  const { user, registerLoading, loginLoading, requires2FA } = useAuthContext();

  if (registerLoading || loginLoading) {
    return <div>Loading...</div>; // or a spinner component
  }

  // If 2FA is required, redirect to validation page
  if (requires2FA) {
    return <Navigate to="/validate" replace />;
  }

  if (reverse && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!reverse && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
