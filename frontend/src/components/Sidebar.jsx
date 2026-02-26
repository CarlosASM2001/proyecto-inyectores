import React from "react";
import { NavLink } from "react-router-dom";
import {
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  Wallet,
  Wrench,
  X,
  Settings,
  BadgeDollarSign
} from "lucide-react";

export default function Sidebar({ onLogout, isOpen, setIsOpen }) {
  const navItems = [
    { label: "Facturar", path: "/invoices_Bill", icon: <CreditCard size={18} />, },
    { label: "Panel General", path: "/dashboard", icon: <LayoutDashboard size={20} />,},
    { label: "Clientes", path: "/clients", icon: <Users size={20} /> },
    { label: "Inventario", path: "/products", icon: <Package size={20} /> },
    { label: "Servicios", path: "/services", icon: <Wrench size={20} /> },
    { label: "Historial Facturas", path: "/invoices", icon: <FileText size={20} />,},
    { label: "Cierre de Caja", path: "/registerClose", icon: <Wallet size={20} /> },
    { label: "Deudas", path: "/debts", icon: <HandCoins size={20} /> },
    { label: "Configuraciones", path: "/settings", icon: <Settings size={20} />},
    { label: "Pagos", path: "/payments", icon: <BadgeDollarSign size={20} />}
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
        <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto pt-2 sidebar-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "bg-workshop-red text-white border-workshop-red shadow-lg shadow-red-600/20"
                    : "text-gray-300 border-transparent hover:bg-white/5 hover:border-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-300 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-tight">
                      {item.label}
                    </span>
                    
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 flex-none border-t border-white/5 bg-workshop-dark/50">
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
