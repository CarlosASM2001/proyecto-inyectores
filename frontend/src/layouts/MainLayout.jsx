import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    // h-screen asegura que el layout no crezca más que la pantalla
    <div className="flex h-screen bg-gray-50 overflow-hidden"> 
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Contenedor derecho: Debe tener su propio scroll */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"> 
        
        {/* Header Móvil */}
        <header className="md:hidden flex-none bg-workshop-dark p-4 flex items-center justify-between shadow-lg z-30">
          <h1 className="text-white font-black tracking-tighter italic">
            INJECT<span className="text-workshop-red">PRO</span>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>
        
        {/* Área de contenido con scroll independiente */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}