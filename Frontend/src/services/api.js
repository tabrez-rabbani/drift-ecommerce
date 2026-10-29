import axios from "axios";
import store from "../app/store";
import { logout } from "../features/auth/state/auth.slice";

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    try {
      const parsed = new URL(envUrl);
      // Only rewrite hostname if testing locally on local LAN IP (e.g. 192.168.x.x)
      if (
        (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
        typeof window !== "undefined" &&
        window.location.hostname &&
        /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(window.location.hostname)
      ) {
        parsed.hostname = window.location.hostname;
        return parsed.toString().replace(/\/$/, "");
      }
      return envUrl.replace(/\/$/, "");
    } catch {
      return envUrl.replace(/\/$/, "");
    }
  }
  if (typeof window !== "undefined" && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/get-me")
      ) {
        const message =
          error.response?.data?.message || error.message || "An unexpected error occurred.";
        return Promise.reject(new Error(message));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr);
        try {
          store.dispatch(logout());
        } catch {
          void 0;
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      const message =
        error.response?.data?.message || "Access forbidden. You do not have permission for this request.";
      return Promise.reject(new Error(message));
    }

    if (!error.response && error.message === "Network Error") {
      return Promise.reject(new Error("Network connection error. Please check your internet connection."));
    }

    const message =
      error.response?.data?.message || error.message || "An unexpected error occurred.";
    return Promise.reject(new Error(message));
  }
);

export default api;
