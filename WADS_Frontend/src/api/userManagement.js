const API_BASE_URL = "http://localhost:5000/api/users";

export const getUsers = async (token, currentPage) => {
  const res = await fetch(`${API_BASE_URL}?page=${currentPage}&limit=10`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed getting users");
  }
  return data;
};

export const getUsersByID = async (token, ID) => {
  const res = await fetch(`${API_BASE_URL}/${ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed getting individual user");
  }
  return data;
};

export async function updateUserByID(token, ID, data) {
  const response = await fetch(`${API_BASE_URL}/${ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return await response.json();
}

export async function getUserActivity(token, ID) {
  const res = await fetch(`${API_BASE_URL}/activity/${ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to retrieve user activity");
  }

  return data;
}

export async function deleteUserByID(token, ID) {
  const response = await fetch(`${API_BASE_URL}/${ID}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return true;
}

export async function createUsers(token, data) {
  const response = await fetch(`${API_BASE_URL}/admin-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return result;
}