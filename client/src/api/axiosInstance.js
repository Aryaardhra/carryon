import axios from "axios";
import toast from "react-hot-toast";
import { triggerLogout } from "../services/authServices.";
import { refreshToken } from "./authApi";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    Accept: "application/json",
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

//Request

axiosInstance.interceptors.request.use(
  (config) => config,

  (error) => Promise.reject(error),
);

//Response

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error("Network Error");

      return Promise.reject(error);
    }

    //Access Token Expired

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      //Already Refreshing

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

      isRefreshing = true;

      try {
        (await refreshToken(),
          {},
          {
            withCredentials: true,
          },
          processQueue());
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await triggerLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
