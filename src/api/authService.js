import api from "./apiClient";

// Local storage keys
const AUTH_KEY = "adminUser";
const TOKEN_KEY = "authToken";

let heartbeatInterval = null;

// Login function
export const login = async (email, password) => {
  const response = await api.post("/admins/login", { email, password });
  
  // Save user data and token to localStorage
  localStorage.setItem(AUTH_KEY, JSON.stringify(response.data));
  localStorage.setItem(TOKEN_KEY, response.data.token);
  
  return response.data;
};

// Logout function - Clear everything
export const logout = () => {

  stopHeartbeat();
  
  // Clear localStorage
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
  
  // Clear sessionStorage
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  
  // Clear any other auth data
  sessionStorage.clear();
  
  // Optional: Clear cookies if you're using them
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

export const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(async () => {
    try {
      await api.post("/admins/heartbeat");
    } catch (err) {
      console.warn("Heartbeat failed", err);
    }
  }, 60000); };

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getCurrentUser();
  const token = getAuthToken();
  return !!(user && token);
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permission);
};

// Check if user is Super Admin
export const isSuperAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "SUPER_ADMIN";
};

// Validate session (optional - for additional security)
export const validateSession = () => {
  const user = getCurrentUser();
  const token = getAuthToken();
  
  if (!user || !token) {
    logout();
    return false;
  }
  
  return true;
};