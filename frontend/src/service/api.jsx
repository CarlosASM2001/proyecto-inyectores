import axios from "axios";

const api = axios.create({
  // ⚠️ CAMBIO CRUCIAL:
  // Ya no usamos 'http://127.0.0.1:8001'.
  // Dejamos la baseURL vacía o apuntando al mismo origen para que use el proxy.
  baseURL: "",

  // Seguimos necesitando credenciales para que la cookie se guarde
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default api;
