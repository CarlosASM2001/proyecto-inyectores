import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, User } from "lucide-react";

export default function ClientModal({ onClose, onSuccess, clientData = null }) {
  const [formData, setFormData] = useState({ name: "", phone: "", cedula: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (clientData) {
      setFormData({
        name: clientData.name || "",
        phone: clientData.phone || "",
        cedula: clientData.cedula || "",
      });
    }
  }, [clientData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (clientData) {
        await api.put(`/clients/${clientData.id}`, formData);
      } else {
        await api.post("/clients", formData);
      }
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors); // Fixed typo from 'errros'
      } else {
        alert(err.response?.data?.message || "Error al procesar solicitud");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-workshop-red flex items-center justify-center text-white shadow-lg shadow-red-900/20">
              <User size={20} />
            </div>
            <h3 className="font-black tracking-tighter text-gray-900 uppercase">
              {clientData ? "Editar Cliente" : "Nuevo Cliente"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* NOMBRE */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
            <input 
              type="text" 
              required
              className={`w-full px-4 py-3 rounded-xl border font-bold transition-all focus:ring-4 focus:ring-red-500/10 outline-none ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-workshop-red"
              }`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej. Carlos Ramirez"
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* TELEFONO */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Teléfono</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value})}
              />
            </div>
            {/* CEDULA */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Cédula</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value})}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-workshop-red text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}