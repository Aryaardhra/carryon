import axios from "axios";
import toast from "react-hot-toast";
import { refreshToken } from "./refreshTokenApi";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Network error

    if (!error.response) {
      toast.error("Network Error");
      return Promise.reject(error);
    }
    const status = error.response.status;

    // Don't refresh authentication APIs

    const requestUrl = originalRequest?.url || "";

    const isAuthRequest =
      requestUrl.includes("/v1/user/login") ||
      requestUrl.includes("/v1/user/register") ||
      requestUrl.includes("/v1/user/logout") ||
      requestUrl.includes("/v1/user/refresh-token") ||
      requestUrl.includes("/v1/user/verify-email") ||
      requestUrl.includes("/v1/user/forgot-password") ||
      requestUrl.includes("/v1/user/reset-password");

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    // Only handle 401

    if (status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If another refresh is happening

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return axiosInstance(originalRequest);
      });
    }

    // Start refreshing

    isRefreshing = true;

    try {
      await refreshToken();

      // Resolve queued requests
      processQueue();

      // Retry original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      console.error(
        "❌ Access token refresh failed:",
        refreshError
      );

      // Reject queued requests
      processQueue(refreshError);

      toast.error(
        "Session expired. Please login again."
      );

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;