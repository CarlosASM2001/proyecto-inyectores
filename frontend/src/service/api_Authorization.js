import axios from "axios";
import DesAuth from "./Auth/DesAuth";

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

// Manejar respuestas exitosas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    //console.log("❌ Error interceptor:", error);

    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.log("🔒 Detectado error 401 - desautenticando...");
        DesAuth();
      } else if (status === 403) {
        console.log("🔒 Detectado error 403 - acceso prohibido");
      } else if (status >= 500) {
        console.log("💥 Error del servidor:", error.response.data);
      }
    }

    // Re-lanzar el error para que pueda ser manejado por el código que hizo la petición
    return Promise.reject(error);
  },
);

export default api;
