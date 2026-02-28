import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api_Authorization";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import {
  Trash2,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  Search,
  Eye,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, cliRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/clients"),
      ]);
      // Ordenamos para que las más recientes salgan primero
      const sortedInvoices = (invRes.data.data ?? invRes.data ?? []).sort(
        (a, b) => b.id - a.id,
      );

      setInvoices(sortedInvoices);
      setClients(cliRes.data.data ?? cliRes.data ?? []);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Sesión expirada"
          : "Error al cargar datos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + Number(inv.total_value),
    0,
  );
  const pendingInvoices = invoices.filter(
    (inv) =>
      inv.status?.toLowerCase() !== "pagada" &&
      inv.status?.toLowerCase() !== "paid",
  );

  const openDetails = (id) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de eliminar esta factura? Esto podría afectar la contabilidad.",
      )
    ) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter((i) => i.id !== id));
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-workshop-red border-t-transparent rounded-full animate-spin mb-4"></div>
        Generando Reporte de Facturación...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Total Facturado
            </p>
            <h4 className="text-xl font-black text-gray-900 italic">
              ${totalInvoiced.toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Pendientes
            </p>
            <h4 className="text-xl font-black text-gray-900 italic">
              {pendingInvoices.length} Facturas
            </h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Pagadas
            </p>
            <h4 className="text-xl font-black text-gray-900 italic">
              {invoices.length - pendingInvoices.length} Facturas
            </h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Historial de <span className="text-workshop-red">Facturas</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
            Registro de todas las transacciones realizadas.
          </p>
        </div>

        {/* BOTON CAMBIADO: REDIRIGE A FACTURACIÓN */}
        <button
          onClick={() => navigate("/invoices_Bill")}
          className="bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest w-full sm:w-auto shadow-xl"
        >
          <Plus size={18} /> Ir a Facturar
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {/* MOBILE LIST */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {invoices.map((inv) => {
          const isPaid =
            inv.status?.toLowerCase() === "paid" ||
            inv.status?.toLowerCase() === "pagada";
          const clientName =
            clients.find((c) => c.id === inv.client_id)?.name ||
            "Cliente General";
          const invNumber = `#INV-${inv.id.toString().padStart(4, "0")}`;

          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                      {invNumber} • {inv.date}
                    </span>
                    <h3 className="font-black text-gray-900 uppercase tracking-tight italic">
                      {clientName}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                      isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      Total
                    </span>
                    <span className="text-xl font-black text-workshop-red tracking-tighter">
                      ${Number(inv.total_value).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetails(inv.id)}
                      className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-3 text-workshop-red bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-black italic">
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Nº Factura
                </th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Fecha
                </th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Cliente
                </th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  Total
                </th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {invoices.map((inv) => {
                const isPaid =
                  inv.status?.toLowerCase() === "paid" ||
                  inv.status?.toLowerCase() === "pagada";
                const invNumber = `#INV-${inv.id.toString().padStart(5, "0")}`;

                return (
                  <tr
                    key={inv.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-black">
                      {invNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {inv.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 uppercase tracking-tighter font-black italic">
                      {clients.find((c) => c.id === inv.client_id)?.name ||
                        "Cliente General"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-workshop-red italic text-lg tracking-tight">
                      ${Number(inv.total_value).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openDetails(inv.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Ver Detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {invoices.length === 0 && !loading && (
        <div className="p-20 text-center bg-white rounded-3xl border border-gray-200">
          <Search className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
            No hay facturas en el historial
          </p>
        </div>
      )}

      {isModalOpen && (
        <InvoiceDetailsModal
          invoiceId={selectedInvoiceId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
