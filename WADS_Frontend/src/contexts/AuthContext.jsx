/* eslint-disable react/prop-types */
import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect } from "react";
import {
  login,
  register,
  googleLogin,
  logout,
  getAccessTokenFromRefresh,
} from "../api/auth";
import { validate2fa } from "../api/twoFactor";
import toast from "react-hot-toast";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [tempUid, setTempUid] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Check if the response indicates 2FA is required (only has _id)
      if (data._id && !data.accessToken) {
        setTempUid(data._id);
        setRequires2FA(true);
        toast.success("2FA verification required", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#2196F3",
            color: "#fff",
          },
        });
      } else {
        setUser(data);
        setRequires2FA(false);
        toast.success("Login successful!", {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
        });
      }
    },
    onError: (error) => {
      toast.error("Login failed!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
      console.error(`Login error: ${error.message}`);
    },
  });

  const validateMutation = useMutation({
    mutationFn: validate2fa,
    onSuccess: (data) => {
      setUser(data);
      toast.success("Login successful!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error("Login failed!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setUser(data);
      toast.success("Registration successful!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error("Registration failed!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
      console.error(`Registration error: ${error.message}`);
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: () => {
      googleLogin();
      return Promise.resolve(); // Return a resolved promise since we're redirecting
    },
    onError: (error) => console.error(`Google Login error: ${error.message}`),
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      setUser("");
      toast.success("Logout successful!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    },
    onError: (error) => {
      toast.error("Logout failed!", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#F44336",
          color: "#fff",
        },
      });
      console.error(`Error: ${error.message}`);
    },
  });

  // AUTO LOGIN
  useEffect(() => {
    const tryRefreshToken = async () => {
      try {
        const userData = await getAccessTokenFromRefresh();
        console.log("Auto login successful, setting user data:", {
          userId: userData._id,
          role: userData.role,
          hasToken: !!userData.accessToken,
        });
        setUser(userData);
      } catch (err) {
        console.error("Auto login failed:", err.message);
      }
    };

    tryRefreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tempUid,
        setTempUid,
        requires2FA,
        setRequires2FA,

        login: loginMutation.mutate,
        loginLoading: loginMutation.isLoading,
        loginError: loginMutation.error,
        loginMutation,

        register: registerMutation.mutate,
        registerLoading: registerMutation.isLoading,
        registerError: registerMutation.error,
        registerMutation,

        validate: validateMutation.mutate,
        validateLoading: validateMutation.isLoading,
        validateError: validateMutation.error,
        validateMutation,

        logoutFunc: logoutMutation.mutate,
        logoutLoading: logoutMutation.isLoading,
        logoutError: logoutMutation.error,
        logoutMutation,

        googleLogin: googleLoginMutation.mutate,
        googleLoginLoading: googleLoginMutation.isLoading,
        googleLoginError: googleLoginMutation.error,
        googleLoginMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!AuthContext) throw new Error("Context is used outside of provider");
  return context;
}

export { useAuthContext, AuthProvider };
