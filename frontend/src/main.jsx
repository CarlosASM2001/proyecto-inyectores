// src/main.jsx (o donde prefieras configurar axios)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios"; // Importa Axios
import { AuthProvider } from "./context/AuthContext.jsx";

// 1. Establece la URL base del backend de Laravel
axios.defaults.baseURL = "http://127.0.0.1:8000";

// 2. Asegura que Axios envíe las cookies (esencial para Sanctum/CORS)
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
