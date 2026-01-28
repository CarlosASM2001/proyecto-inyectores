import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import InvoiceModal from "./InvoiceModal";
import { Trash2, Edit, FileText, Plus, Eye, Download, Clock, CheckCircle } from "lucide-react";

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
  const pendingCount = invoices.filter(inv => inv.status?.toLowerCase() != 'pagada').length;

  const openModal = (invoice = null) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  }

  const handleDelete = async (id) => {
    if(window.confirm("Estas seguro de eliminar la factura?")){
      try{
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter((i) => i.id !== id));
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  }

  if (loading) return <div className="p-8 text-center font-black animate-pulse text-workshop-red">CARGANDO FACTURACIÓN...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER & SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Facturado</p>
            <h4 className="text-2xl font-black text-gray-900">${totalInvoiced.toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendientes</p>
            <h4 className="text-2xl font-black text-gray-900">{pendingCount} Facturas</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pagadas</p>
            <h4 className="text-2xl font-black text-gray-900">{invoices.length - pendingCount} Facturas</h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Facturas</h2>
        <button onClick={() => { setSelectedInvoice(null); openModal(); }}
          className="bg-workshop-red text-white font-black px-6 py-3 rounded-xl hover:bg-red-700 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
          <Plus size={18} /> Nueva Factura
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-900">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-bold uppercase">{clients.find(c => c.id === inv.client_id)?.name || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      inv.status?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">${Number(inv.total_value).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setSelectedInvoice(inv) ; openModal(inv); }} className="p-2 text-gray-400 hover:text-workshop-dark"><Edit size={16}/></button>
                      {/* <button className="p-2 text-gray-400 hover:text-blue-500"><Download size={16}/></button> */}
                      <button onClick={() => { handleDelete() }} className="p-2 text-gray-400 hover:text-workshop-red"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <InvoiceModal invoiceData={selectedInvoice} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}
    </div>
  );
}