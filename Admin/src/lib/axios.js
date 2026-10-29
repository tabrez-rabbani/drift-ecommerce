import axios from "axios";
import { API_URL } from "@/config/env";

export { API_URL };

const authApiInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

authApiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/admin-login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/get-me")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => authApiInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authApiInstance.get("/auth/refresh-token");
        processQueue(null);
        return authApiInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default authApiInstance;
