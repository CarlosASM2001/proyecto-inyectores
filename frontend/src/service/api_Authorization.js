import axios from "axios";

const configuredBaseUrl = (import.meta.env.VITE_API_URL || "/api")
  .trim()
  .replace(/\/$/, "");


const api = axios.create({
  baseURL: configuredBaseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
