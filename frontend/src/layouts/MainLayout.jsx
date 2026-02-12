import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, Menu, Sparkles } from "lucide-react";
import Sidebar from "../components/Sidebar";

const ROUTE_LABELS = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Resumen operativo del taller",
  },
  clients: {
    title: "Clientes",
    subtitle: "Gestion de cartera y contacto",
  },
  products: {
    title: "Inventario",
    subtitle: "Control de stock y reposicion",
  },
  services: {
    title: "Servicios",
    subtitle: "Catalogo de trabajo tecnico",
  },
  invoices: {
    title: "Facturas",
    subtitle: "Historial y estado de cobros",
  },
  invoices_Bill: {
    title: "Facturar",
    subtitle: "Genera documentos en segundos",
  },
  registerClose: {
    title: "Caja",
    subtitle: "Seguimiento de cierres diarios",
  },
  debts: {
    title: "Deudas",
    subtitle: "Pendientes y saldos por cobrar",
  },
};

const warmupLoaders = [
  () => import("../pages/Clients/ClientsPage"),
  () => import("../pages/Inventory/ProductsPage"),
  () => import("../pages/Services/ServicesPage"),
  () => import("../pages/Invoices/InvoicesPage"),
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const routeKey = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return segment || "dashboard";
  }, [location.pathname]);

  const routeMeta = ROUTE_LABELS[routeKey] ?? ROUTE_LABELS.dashboard;

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-CO", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const warmRoutes = () => {
      warmupLoaders.forEach((loadModule) => {
        void loadModule();
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(warmRoutes, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(warmRoutes, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="md:hidden flex-none bg-workshop-dark p-4 flex items-center justify-between shadow-lg z-30">
          <h1 className="text-white font-black tracking-tight italic">
            INJECT<span className="text-workshop-red">PRO</span>
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>
        </header>

        <header className="hidden md:flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/80 px-8 py-5 shadow-sm backdrop-blur">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Operacion actual
            </p>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {routeMeta.title}
            </h2>
            <p className="text-sm font-medium text-slate-500">{routeMeta.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
              <CalendarDays size={14} className="text-slate-400" />
              <span className="capitalize">{todayLabel}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-emerald-700">
              <Sparkles size={14} />
              Modo rapido
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Sesion activa
              </p>
              <p className="text-sm font-bold text-slate-800">
                {user?.name || user?.email || "Usuario"}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}