import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api_Authorization";
import { Users, FileText, AlertTriangle, Package  } from "lucide-react";

function formatMoney(value) {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString("es-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function InvoiceStatusPill({ status }) {
  const normalized = String(status ?? "").toLowerCase();
  const isPaid = normalized === "pagada";
  const isPending = normalized === "pendiente";

  const klass = isPaid
    ? "bg-green-100 text-green-700"
    : isPending
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${klass}`}>
      {status ?? "—"}
    </span>
  );
}

const defaultSummary = {
  newCustomers: 0,
  monthlyInvoices: 0,
  totalDebts: 0,
  lowStockCount: 0,
  latestCustomers: [],
  recentInvoices: [],
  topDebts: [],
  lowStockList: [],
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get("/dashboard");
        const payload = data?.data ?? data ?? {};

        if (!mounted) return;
        const normalizedPayload = {
          ...payload,
          latestCustomers: normalizeList(payload.latestCustomers),
          recentInvoices: normalizeList(payload.recentInvoices),
          topDebts: normalizeList(payload.topDebts),
          lowStockList: normalizeList(payload.lowStockList),
        };
        setSummary({ ...defaultSummary, ...normalizedPayload });
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.status === 401 ? "Sesión expirada" : "Error al cargar el dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
        <div className="p-8 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest">
            Cargando Dashboard...
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Workshop <span className="text-workshop-red">Dashboard</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
            Resumen operativo del mes en curso.
          </p>
        </div>
        {error && (
          <div className="text-xs font-black uppercase tracking-widest text-workshop-red">
            {error}
          </div>
        )}
      </div>

      {/* KPI Cuadros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Nuevos clientes
              </p>
              <h4 className="text-2xl font-black text-gray-900 italic leading-none">
                {summary.newCustomers}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Facturas del mes
              </p>
              <h4 className="text-2xl font-black text-gray-900 italic leading-none">
                {summary.monthlyInvoices}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-workshop-red shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Deudas totales
              </p>
              <h4 className="text-xl font-black text-workshop-red italic leading-none">
                {formatMoney(summary.totalDebts)}
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
              <Package size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Bajo stock
              </p>
              <h4 className="text-2xl font-black text-gray-900 italic leading-none">
                {summary.lowStockCount}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Top Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ultimos Clientes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Últimos Clientes</h3>
            <Link to="/clients" className="text-[10px] font-black text-workshop-red uppercase tracking-widest">
              Ver todo
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Registro</th>
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cédula</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold italic">
                {summary.latestCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-900 uppercase tracking-tighter font-black">
                      {c.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{c.created_at ?? "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c.cedula ?? "—"}</td>
                  </tr>
                ))}
                {summary.latestCustomers.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-sm text-gray-400 italic" colSpan={3}>
                      No hay clientes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facturas recientes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Facturas Recientes</h3>
            <Link to="/invoices" className="text-[10px] font-black text-workshop-red uppercase tracking-widest">
              Ver todo
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Factura</th>
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-bold italic">
                {summary.recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-900 font-black uppercase tracking-tighter">
                      {`#FACT-${String(inv.id ?? "").padStart(4, "0")}`}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-900 font-black">
                      {formatMoney(inv.total_value)}
                    </td>
                    <td className="px-5 py-4">
                      <InvoiceStatusPill status={inv.status} />
                    </td>
                  </tr>
                ))}
                {summary.recentInvoices.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-sm text-gray-400 italic" colSpan={3}>
                      No hay facturas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deudas - Facturas */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Deudas</h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Top pendientes
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {summary.topDebts.map((d) => {
              const clientName = d.client_name ?? "Cliente";
              return (
                <div key={d.id} className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-black text-gray-900 uppercase tracking-tighter italic">
                      {clientName}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium italic">
                      Fecha: {d.created_at ?? "—"}
                    </div>
                  </div>
                  <div className="font-black text-workshop-red italic">
                    {formatMoney(d.pending_balance)}
                  </div>
                </div>
              );
            })}
            {summary.topDebts.length === 0 && (
              <div className="p-6 text-sm text-gray-400 italic">No hay deudas registradas.</div>
            )}
          </div>
        </div>

        {/* Inventario Bajo */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Bajo Stock</h3>
            <Link to="/products" className="text-[10px] font-black text-workshop-red uppercase tracking-widest">
              Ver todo
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {summary.lowStockList.map((p) => (
              <div key={p.id} className="p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-black text-gray-900 uppercase tracking-tighter italic truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium italic">
                    MÍNIMO: {p.min_stock ?? 0} UNITS
                  </div>
                </div>
                <div className="shrink-0 font-black text-workshop-red italic">
                  Quedan {Number(p.actual_stock ?? 0)}
                </div>
              </div>
            ))}
            {summary.lowStockList.length === 0 && (
              <div className="p-6 text-sm text-gray-400 italic">No hay productos en bajo stock.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}