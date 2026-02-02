import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, DollarSign } from "lucide-react";

export default function RegisterCloseModal({ onClose, onSuccess, registerCloseData = null }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    COP_amount: "",
    USD_amount: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [_errors, setErrors] = useState({});

  useEffect(() => {
    if (registerCloseData) {
      setFormData({
        date: registerCloseData.date || "",
        COP_amount: registerCloseData.COP_amount ?? "",
        USD_amount: registerCloseData.USD_amount ?? "",
        description: registerCloseData.description || "",
      });
    }
  }, [registerCloseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, COP_amount: Number(formData.COP_amount), USD_amount: Number(formData.USD_amount) };
      if (registerCloseData?.id) await api.put(`/registerClose/${registerCloseData.id}`, payload);
      else await api.post(`/registerClose`, payload);
      onSuccess?.();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red outline-none transition-all";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
          <h3 className="font-black uppercase tracking-tighter flex items-center gap-2">
            <DollarSign className="text-workshop-red" size={20}/> {registerCloseData ? "Editar Cierre" : "Nuevo Cierre"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Fecha de Cierre</label>
            <input type="date" required className={inputClass} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Efectivo COP</label>
              <input type="number" required className={inputClass} placeholder="0" value={formData.COP_amount} onChange={(e) => setFormData({ ...formData, COP_amount: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Efectivo USD</label>
              <input type="number" required className={inputClass} placeholder="0" value={formData.USD_amount} onChange={(e) => setFormData({ ...formData, USD_amount: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Notas / Observaciones</label>
            <textarea className={`${inputClass} h-24 resize-none`} placeholder="Ej: Faltante de 5k por cambio..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-workshop-dark text-white font-black py-4 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
            <Save size={18} /> {saving ? "Guardando..." : "Confirmar Cierre de Caja"}
          </button>
        </form>
      </div>
    </div>
  );
}