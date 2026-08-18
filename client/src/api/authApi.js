
import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
    return axiosInstance.post("/v1/user/register", data);
};

export const loginUser = (data) => {
    return axiosInstance.post("/v1/user/login", data);
};

export const logoutUser = () => {
    return axiosInstance.post("/v1/user/logout");
};

export const getCurrentUser = () => {
    return axiosInstance.get("/v1/user/me");
};

export const verifyEmail = async (token) => {
   const res = await axiosInstance.get(`/v1/user/verify-email/${token}`);
   return res.data;
};

export const forgotPassword = (email) => {
  return axiosInstance.post("/v1/user/forgot-password", {email});
};

export const resetPassword = (token, data) => {
  return axiosInstance.post(`/v1/user/reset-password/${token}`, data);
};