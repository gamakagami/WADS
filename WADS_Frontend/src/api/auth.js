import { API_URL } from "../config";

const API_BASE_URL = `${API_URL}/api/users`;
/**
 * Register a new user
 * @param {Object} userData - The user registration data
 * @returns {Promise<Object>} The response JSON containing token and user info
 */
export const register = async (userData) => {
  const res = await fetch(`/api/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

/**
 * Log in a user
 * @param {Object} credentials - The login credentials (email, password)
 * @returns {Promise<Object>} The response JSON containing token and user info
 */
export const login = async (credentials) => {
  const res = await fetch(`/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

/**
 * Initiate Google OAuth2 login flow
 * @returns {void}
 */
export const googleLogin = () => {
  // Include frontend callback URL in state parameter
  const frontendCallbackUrl = "http://localhost:5173/auth/google/callback";
  window.location.href = `${API_BASE_URL}/auth/google?state=${encodeURIComponent(
    frontendCallbackUrl
  )}`;
};

export const getAccessTokenFromRefresh = async () => {
  const res = await fetch(`http://localhost:5000/api/auth/refresh`, {
    method: "POST",
    credentials: "include", // include cookie with refresh token
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Unable to refresh session");
  }

  return data;
};

export const logout = async (token) => {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Unable to logout session");
  }

  return data;
};
