import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthContext();

  useEffect(() => {
    console.log("GoogleCallback component mounted");
    console.log("Location state:", location.state);
    console.log("Location hash:", location.hash);
    console.log("Location search:", location.search);

    try {
      // Try to get user data from different possible locations
      let userData = null;
      
      if (location.state?.userData) {
        console.log("Found user data in location state");
        userData = location.state.userData;
      } else if (location.hash) {
        console.log("Found user data in location hash");
        userData = JSON.parse(decodeURIComponent(location.hash.substring(1)));
      } else if (location.search) {
        console.log("Found user data in location search");
        const params = new URLSearchParams(location.search);
        const userDataStr = params.get('userData');
        if (userDataStr) {
          userData = JSON.parse(decodeURIComponent(userDataStr));
        }
      }
      
      console.log("Parsed user data:", userData);
      
      if (userData) {
        console.log("Setting user data in context");
        setUser(userData);
        console.log("Navigating to dashboard");
        navigate("/dashboard");
      } else {
        console.log("No user data found, redirecting to login");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error processing Google callback:", error);
      navigate("/login");
    }
  }, [location, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Google Login...</h1>
        <p className="text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default GoogleCallback; 