const API_BASE_URL = "http://localhost:5000/api/messages";

/**
 * Get all rooms for the current user
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} User's rooms
 */
export const getUserRooms = async (token) => {
  const res = await fetch(`${API_BASE_URL}/user/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch rooms");
  }

  return data;
};

/**
 * Get the agents room (public chat)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} Agents room data
 */
export const getAgentsRoom = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agents-room`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agents room");
  }

  return data;
};

/**
 * Get messages for a specific room
 * @param {string} token - Authentication token
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} Room messages
 */
export const getRoomMessages = async (token, roomId) => {
  const res = await fetch(`${API_BASE_URL}/room/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch messages");
  }

  return data;
};

/**
 * Create a new room with another user
 * @param {string} token - Authentication token
 * @param {Object} roomData - Room data with otherUserEmail
 * @returns {Promise<Object>} Created room data
 */
export const createRoom = async (token, roomData) => {
  const res = await fetch(`${API_BASE_URL}/create-room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roomData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create room");
  }

  return data;
};
