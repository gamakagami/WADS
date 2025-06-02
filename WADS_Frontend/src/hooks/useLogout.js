import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function useLogout() {
  const { user, logoutFunc, setUser } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const performLogout = async () => {
    try {
      // Clear cache first to prevent any background queries
      queryClient.clear();

      if (user && user.accessToken) {
        // Call logout mutation without awaiting it
        logoutFunc(user.accessToken);
      }
      setUser("");
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Use replace instead of push for navigation
      navigate("/home", { replace: true });
    }
  };

  return performLogout;
}

export default useLogout;
