import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, Wrench,
  FileText, LogOut, UserCircle, Calculator,
  X, BanknoteArrowDown
} from "lucide-react";

export default function Sidebar({ onLogout, isOpen, setIsOpen }) {
  const navItems = [
    {
      name: "Facturar",
      path: "/invoices_Bill",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { name: "Inventario", path: "/products", icon: <Package size={20} /> },
    { name: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    {
      name: "Historial Facturas",
      path: "/invoices",
      icon: <FileText size={20} />,
    },
    { name: "Cierres", path: "/registerClose", icon: <Calculator size={20} /> },
    { name: "Deudas", path: "/debts", icon: <BanknoteArrowDown size={20} /> },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        /* Móvil: Flota sobre el contenido */
        fixed inset-y-0 left-0 z-50 w-64 bg-workshop-dark 
        transform transition-transform duration-300 ease-in-out
        
        /* Escritorio: Fija y siempre visible */
        md:relative md:translate-x-0 md:flex md:h-full md:flex-none
        
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col border-r border-white/10 shadow-2xl
      `}
      >
        {/* Logo Section */}
        <div className="p-8 flex-none flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter text-white italic">
            INJECT<span className="text-workshop-red">PRO</span>
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 text-white/50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation - Con scroll interno si hay muchos items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-workshop-red text-white font-black shadow-lg shadow-red-600/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white font-medium"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="text-sm uppercase tracking-wide">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 flex-none border-t border-white/5 bg-workshop-dark/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            {/* ... (tu código de perfil de usuario) ... */}
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black text-workshop-red border border-workshop-red/20 rounded-xl hover:bg-workshop-red hover:text-white transition-all duration-300"
          >
            <LogOut size={16} />
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>
    </>
  );
}
