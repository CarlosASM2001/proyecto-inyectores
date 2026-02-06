import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// Using Lucide-React for the icons
import { Mail, Lock, LogIn, Wrench, Car } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response ? "Credenciales incorrectas" : "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 font-sans">
      {/* Main Card */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl w-full max-w-lg transition-all duration-300">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-4">
            <Wrench className="w-12 h-12 text-black" strokeWidth={2.5} />
            <Car className="w-12 h-12 text-black" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-center text-gray-900 leading-tight">
            Servicio de Inyectores
            <br />
            El Profe BT.
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-800 uppercase ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
              <input
                type="email"
                required
                className="w-full bg-gray-100 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-800 uppercase ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-900" />
              <input
                type="password"
                required
                className="w-full bg-gray-100 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D93D31] hover:bg-[#b52d24] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 shadow-md active:scale-[0.98]"
          >
            {loading ? "CARGANDO..." : "Iniciar Sesión"}
            {!loading && <LogIn className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
