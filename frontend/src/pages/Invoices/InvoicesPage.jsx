import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import InvoiceModal from "./InvoiceModal";
import { Trash2, Edit, FileText, Plus, Clock, CheckCircle, Search, User, DollarSign } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, cliRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/clients")
      ]);
      setInvoices(invRes.data.data ?? invRes.data ?? []);
      setClients(cliRes.data.data ?? cliRes.data ?? []);
    } catch (err) {
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total_value), 0);
  const pendingInvoices = invoices.filter(inv => inv.status?.toLowerCase() !== 'pagada' && inv.status?.toLowerCase() !== 'paid');

  const openModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar la factura?")) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter((i) => i.id !== id));
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  if (loading) return (
    <div className="p-8 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest">
      Generando Reporte de Facturación...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS - Scroll horizontal en móvil, grid en escritorio */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Facturado</p>
            <h4 className="text-xl font-black text-gray-900 italic">${totalInvoiced.toLocaleString()}</h4>
          </div>
        </div>

        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-workshop-red shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Pendientes</p>
            <h4 className="text-xl font-black text-gray-900 italic">{pendingInvoices.length} Facturas</h4>
          </div>
        </div>

        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Pagadas</p>
            <h4 className="text-xl font-black text-gray-900 italic">{invoices.length - pendingInvoices.length} Facturas</h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
          Historial de <span className="text-workshop-red">Facturas</span>
        </h2>
        <button 
          onClick={() => openModal()}
          className="bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest w-full sm:w-auto shadow-xl"
        >
          <Plus size={18} /> Nueva Factura
        </button>
      </div>

      {/* MOBILE LIST (Cards) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {invoices.map((inv) => {
          const isPaid = inv.status?.toLowerCase() === 'paid' || inv.status?.toLowerCase() === 'pagada';
          const clientName = clients.find(c => c.id === inv.client_id)?.name || "Cliente Desconocido";
          
          return (
            <div key={inv.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">{inv.date}</span>
                    <h3 className="font-black text-gray-900 uppercase tracking-tight italic">{clientName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
                
                <div className="flex items-end justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total a Pagar</span>
                    <span className="text-xl font-black text-workshop-red tracking-tighter">
                      ${Number(inv.total_value).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(inv)} className="p-3 text-gray-400 bg-gray-50 rounded-xl"><Edit size={18}/></button>
                    <button onClick={() => handleDelete(inv.id)} className="p-3 text-workshop-red bg-red-50 rounded-xl"><Trash2 size={18}/></button>
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
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold italic">
              {invoices.map((inv) => {
                const isPaid = inv.status?.toLowerCase() === 'paid' || inv.status?.toLowerCase() === 'pagada';
                return (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500">{inv.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 uppercase tracking-tighter">
                      {clients.find(c => c.id === inv.client_id)?.name || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 italic text-lg">
                      ${Number(inv.total_value).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(inv)} className="p-2 text-gray-400 hover:text-workshop-dark hover:bg-gray-100 rounded-lg"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(inv.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {invoices.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <Search className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No se encontraron facturas registradas</p>
        </div>
      )}

      {isModalOpen && <InvoiceModal invoiceData={selectedInvoice} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}
    </div>
  );
}