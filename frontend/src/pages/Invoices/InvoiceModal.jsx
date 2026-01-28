import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, FileText } from "lucide-react";

export default function InvoiceModal({ onClose, onSuccess, invoiceData = null }) {
  const [formData, setFormData] = useState([]);

  const [clients, setClients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadClients = async () => {
      try {
        const { data } = await api.get("/clients");
        setClients(data.data ?? data ?? []);
      } catch (err) { console.error(err); }
    };
    loadClients();
    if (invoiceData) setFormData({ ...invoiceData });
  }, [invoiceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (invoiceData) await api.put(`/invoices/${invoiceData.id}`, formData);
      else await api.post("/invoices", formData);
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3 font-black uppercase tracking-tighter">
            <FileText className="text-workshop-red" /> {invoiceData ? "Editar Factura" : "Nueva Factura"}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Fecha</label>
              <input type="date" required className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Total ($)</label>
              <input type="number" step="0.01" required className={inputClass} value={formData.total_value} onChange={e => setFormData({...formData, total_value: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Cliente</label>
            <select required className={inputClass} value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})}>
              <option value="">Seleccionar Cliente...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name || c.full_name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Tipo</label>
              <select className={inputClass} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="Service">Servicio</option>
                <option value="Product">Producto</option>
                <option value="Mixed">Mixto</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Estado</label>
              <select className={inputClass} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Paid">Pagada</option>
                <option value="Pending">Pendiente</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-workshop-dark text-white font-black py-4 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg">
            <Save size={18} /> {saving ? "Procesando..." : "Registrar Factura"}
          </button>
        </form>
      </div>
    </div>
  );
}