import axios from "axios";
import { getAuthToken, logout } from "./authService";

const api = axios.create({
  baseURL: "http://localhost:8094/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔐 Response Interceptor - Handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If 401 Unauthorized, logout and redirect
    if (error.response && error.response.status === 401) {
      console.error("❌ Unauthorized! Logging out...");
      logout();
      window.location.href = "/login";
    }
    
    // If 403 Forbidden (no permission)
    if (error.response && error.response.status === 403) {
      console.error("❌ Access Denied! Insufficient permissions.");
      alert("You don't have permission to perform this action.");
    }

    return Promise.reject(error);
  }
);

export default api;