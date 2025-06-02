const API_BASE_URL = "http://localhost:5000/api/notifications";

/**
 * Get all notifications by user ID
 * @param {Object} Notification - The Notification data
 * @returns {Promise<Object>} The response JSON containing all the notifications
 */

export const getNotifications = async (token) => {
  const res = await fetch(`${API_BASE_URL}/users/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed getting notifications");
  }
  return data;
};

/**
 * Get all notifications for admin
 * @param {Object} Notification - The Notification data
 * @returns {Promise<Object>} The response JSON containing all notifications in the webapp
 */

export const getAdminNotifications = async (token) => {
  const res = await fetch(`${API_BASE_URL}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed getting global notifications");
  }
  return data;
};
