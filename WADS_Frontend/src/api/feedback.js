import { API_URL } from "../config";

const API_BASE_URL = `${API_URL}/api/feedback`;
export const getAgentFeedbackSummary = async (token, agentId) => {
  const res = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agent feedback summary");
  }

  return data;
};

export const getFeedbackForTicket = async (token, ticketId) => {
  const res = await fetch(`/api/feedback/tickets/${ticketId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch ticket feedback");
  }

  return data;
};

export const submitFeedback = async (token, ticketId, rating) => {
  const res = await fetch(`/api/feedback/tickets/${ticketId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rating }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to submit feedback");
  }

  return data;
};
