const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export function getAuthToken() {
  return localStorage.getItem("kuEventsToken");
}

export function saveAuthSession(token, user) {
  if (token) localStorage.setItem("kuEventsToken", token);
  if (user) localStorage.setItem("kuEventsUser", JSON.stringify(user));
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function normalizeFrontendRole(role) {
  const normalizedRole = String(role || "").toUpperCase();
  if (normalizedRole === "EXTERNAL_PARTICIPANT") return "external";
  return normalizedRole.toLowerCase();
}

export function normalizeBackendRole(role) {
  const normalizedRole = String(role || "").trim().toLowerCase();
  if (normalizedRole === "external") return "EXTERNAL_PARTICIPANT";
  return normalizedRole.toUpperCase();
}

export function toFrontendUser(user) {
  if (!user) return null;

  return {
    ...user,
    role: normalizeFrontendRole(user.role),
  };
}
