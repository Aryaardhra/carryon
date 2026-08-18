import axios from "axios";

const logoutClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

export const logoutUser = () => {
  return logoutClient.post("/v1/user/logout");
};