import { createContext, useContext, useState } from "react";
import api from "../service/api_Authorization";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // login ahora hace la petición al backend
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });

    const userData = res.data.data;
    const token = res.data.access_token;

    setUser(userData);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    const config = await api.get("/settings", { email, password });
    config.data.data.map((cg) => {
      localStorage.setItem(cg.key, cg.value);
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
