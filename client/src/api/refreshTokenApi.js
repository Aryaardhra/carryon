import axios from "axios";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export const refreshToken = () => {
  return refreshClient.post("/v1/user/refresh-token");
};