const API_BASE_URL = "http://localhost:5000/api/analytics";

/**
 * Fetch global statistics (tickets, users, feedback)
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing global statistics
 */
export const getGlobalStats = async (token) => {
  const res = await fetch(`${API_BASE_URL}/performance`, {
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

// USER DASHBOARD
/**
 * Fetch performance metrics (tickets, users, feedback)
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing performance metrics
 */
export const getPerformanceMetrics = async (token) => {
  const res = await fetch(`${API_BASE_URL}/performance`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch performance metrics");
  }

  return data;
};

// AGENT DASHBOARD

/**
 * Fetch all agent metrics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing all agents' statistics
 */
export const getAgentMetrics = async (token) => {
  const res = await fetch(`${API_BASE_URL}/agents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agent metrics");
  }

  return data;
};

/**
 * Fetch customer satisfaction metrics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing customer satisfaction data
 */
export const getCustomerSatisfaction = async (token) => {
  const res = await fetch(`${API_BASE_URL}/satisfaction`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch customer satisfaction");
  }

  return data;
};

/**
 * Fetch detailed metrics for a specific agent
 * @param {string} token - The authentication token
 * @param {string} agentId - ID of the agent to fetch details for
 * @returns {Promise<Object>} The response JSON containing agent details
 */
export const getAgentPerformance = async (token, agentId) => {
  const res = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch agent details");
  }

  return data;
};

// ADMIN DASHBOARD

/**
 * Fetch server response time metrics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing response time data
 */
export const getResponseTime = async (token) => {
  const res = await fetch(`${API_BASE_URL}/performance/response-time`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch response time");
  }

  return data;
};

/**
 * Fetch recent activity logs
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing recent activity
 */
export const getRecentActivity = async (token) => {
  const res = await fetch(`${API_BASE_URL}/activity`, {
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
 * Fetch server uptime metrics
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} The response JSON containing server uptime data
 */
export const getServerUptime = async (token) => {
  const res = await fetch(`${API_BASE_URL}/performance/uptime`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch server uptime");
  }

  return data;
};

/**
 * Fetch feedback data in table format
 * @param {string} token - The authentication token
 * @param {object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} The response JSON containing paginated feedback data
 */
export const getFeedbackTable = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/feedback?${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch feedback table");
  }

  return data;
};