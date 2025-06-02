import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

function AuthenticationPage() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default AuthenticationPage;
