import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BanknoteArrowDown,
  Calculator,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Search,
  Users,
  Wrench,
  X,
} from "lucide-react";

const navItems = [
  {
    name: "Facturar",
    path: "/invoices_Bill",
    icon: ReceiptText,
    subtitle: "Emision rapida",
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    subtitle: "Resumen general",
  },
  { name: "Clientes", path: "/clients", icon: Users, subtitle: "Agenda comercial" },
  { name: "Inventario", path: "/products", icon: Package, subtitle: "Stock y repuestos" },
  { name: "Servicios", path: "/services", icon: Wrench, subtitle: "Mano de obra" },
  {
    name: "Facturas",
    path: "/invoices",
    icon: FileText,
    subtitle: "Historial y estado",
  },
  {
    name: "Cierres",
    path: "/registerClose",
    icon: Calculator,
    subtitle: "Control de caja",
  },
  {
    name: "Deudas",
    path: "/debts",
    icon: BanknoteArrowDown,
    subtitle: "Cobros pendientes",
  },
];

export default function Sidebar({ user, onLogout, isOpen, setIsOpen }) {
  const [quickSearch, setQuickSearch] = useState("");

  const filteredItems = useMemo(() => {
    const cleaned = quickSearch.trim().toLowerCase();
    if (!cleaned) return navItems;
    return navItems.filter(
      (item) =>
        item.name.toLowerCase().includes(cleaned) ||
        item.subtitle.toLowerCase().includes(cleaned),
    );
  }, [quickSearch]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-workshop-dark 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:h-full md:flex-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col border-r border-white/10 shadow-2xl
      `}
      >
        <div className="p-6 flex-none border-b border-white/10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-white italic">
              INJECT<span className="text-workshop-red">PRO</span>
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
              aria-label="Cerrar menu"
            >
              <X size={24} />
            </button>
          </div>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Navegacion inteligente
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Search size={15} className="text-white/40" />
            <input
              type="text"
              value={quickSearch}
              onChange={(event) => setQuickSearch(event.target.value)}
              placeholder="Buscar modulo..."
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4 custom-scrollbar">
          {filteredItems.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-3 py-4 text-center">
              <p className="text-xs font-bold text-white/50">Sin resultados para esa busqueda.</p>
            </div>
          )}

          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-workshop-red text-white shadow-lg shadow-red-800/30"
                      : "text-gray-300 hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-white/20">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black uppercase tracking-wide">
                    {item.name}
                  </span>
                  <span className="block truncate text-[11px] font-medium text-white/60">
                    {item.subtitle}
                  </span>
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 bg-black/20 p-4">
          <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Usuario conectado
            </p>
            <p className="mt-1 truncate text-sm font-bold text-white">
              {user?.name || user?.email || "Equipo taller"}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-black text-workshop-red border border-workshop-red/30 rounded-xl hover:bg-workshop-red hover:text-white transition-all duration-300"
          >
            <LogOut size={16} />
            <span>CERRAR SESION</span>
          </button>
        </div>
      </aside>
    </>
  );
}
