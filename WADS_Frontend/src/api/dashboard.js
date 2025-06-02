import { API_URL } from "../config";

const API_BASE_URL = `${API_URL}/api/dashboard`;
// USER DASHBOARD
/**
 * Fetch recent user tickets
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing recent user tickets
 */
export const getUserRecentTickets = async (token) => {
  const res = await fetch(`/api/dashboard/recent-user-ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch recent user tickets");
  }

  return data;
};

// AGENT DASHBOARD

/**
 * Fetch agent statistics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing agent statistics for the logged in agent
 */
export const getAgentStats = async (token) => {
  const res = await fetch(`/api/dashboard/agent-stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agent statistics");
  }

  return data;
};

/**
 * Fetch agent ticket status
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing ticket status for the logged in agent
 */
export const getAgentTicketStatus = async (token) => {
  const res = await fetch(`/api/dashboard/agent/ticket-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agent ticket status");
  }

  return data;
};

/**
 * Fetch recent tickets for an agent
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing recent tickets assigned to an agent
 */
export const getAgentRecentTickets = async (token) => {
  const res = await fetch(`/api/dashboard/recent-agent-ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch recent tickets for agent");
  }

  return data;
};

// ADMIN DASHBOARD

/**
 * Fetch overall statistics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing global tatistics
 */
export const getGlobalStats = async (token) => {
  const res = await fetch(`/api/dashboard/global-stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch global statistics");
  }

  return data;
};

/**
 * Fetch recent activity logs
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing recent activity information
 */
export const getRecentActivity = async (token) => {
  const res = await fetch(`/api/dashboard/recent-activity`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch recent activity logs");
  }

  return data;
};

/**
 * Fetch recent tickets
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing recent ticket information
 */
export const getRecentTicketsGlobal = async (token) => {
  const res = await fetch(`/api/dashboard/recent-ticket`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch global recent ticket information"
    );
  }

  return data;
};

/**
 * Fetch overall agent performance
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing overall agent performance
 */
export const getAgentPerformance = async (token) => {
  const res = await fetch(`/api/dashboard/agent-performance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch overall agent performance"
    );
  }

  return data;
};

/**
 * Fetch system response time logs
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing system response times
 */
export const getResponseTime = async (token) => {
  const res = await fetch(`/api/dashboard/response-time`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "Failed to fetch system response time logs"
    );
  }

  return data;
};

/**
 * Fetch server uptime logs
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing information about server uptime/downtime
 */
export const getServerUptime = async (token) => {
  const res = await fetch(`/api/dashboard/server-uptime`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch server uptime logs");
  }

  return data;
};
