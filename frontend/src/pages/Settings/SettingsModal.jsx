import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, Sliders } from "lucide-react";

// Diccionario para títulos (puedes importarlo de un archivo de constantes si prefieres)
const keyTranslations = {
  company_name: "Nombre de la Empresa",
  company_address: "Dirección",
  company_email: "Correo Electrónico",
  company_phone: "Teléfono de Contacto",
  default_currency: "Moneda Principal",
  iva_rate: "Tasa de IVA",
  exchange_rate_usd: "Tasa de Cambio (USD)",
  exchange_rate_ves: "Tasa de Cambio (VES)"
};

export default function SettingsModal({ onClose, onSuccess, settingData = null }) {
  const [formData, setFormData] = useState({ value: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (settingData) {
      setFormData({
        value: settingData.value || "",
        description: settingData.description || "",
      });
    }
  }, [settingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (settingData) {
        await api.put(`/settings/${settingData.key}`, formData);
      } else {
        await api.post("/settings", settingData);
      }
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        alert(err.response?.data?.message || "Error al procesar solicitud");
      }
    } finally {
      setSaving(false);
    }
  };

  const settingTitle = settingData 
    ? (keyTranslations[settingData.key] || settingData.key) 
    : "Configuración";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-workshop-red flex items-center justify-center text-white shadow-lg shadow-red-900/20">
              <Sliders size={20} />
            </div>
            <div>
                <h3 className="font-black tracking-tighter text-gray-900 uppercase leading-none">
                Editar Valor
                </h3>
                <p className="text-[10px] font-bold text-workshop-red uppercase tracking-widest mt-1">
                    {settingTitle}
                </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* VALOR */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Valor de Configuración
            </label>
            <input 
              type="text" 
              required
              className={`w-full px-4 py-3 rounded-xl border font-bold transition-all focus:ring-4 focus:ring-red-500/10 outline-none ${
                errors.value ? "border-red-500 bg-red-50" : "border-gray-200 focus:border-workshop-red"
              }`}
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              placeholder="Ingrese el nuevo valor..."
            />
            {errors.value && <p className="mt-1 text-xs font-bold text-red-500">{errors.value[0]}</p>}
          </div>

          {/* DESCRIPCIÓN (Opcional) */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Descripción / Notas
            </label>
            <textarea 
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-sm focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value})}
              placeholder="Breve descripción de este parámetro..."
            />
             {errors.description && <p className="mt-1 text-xs font-bold text-red-500">{errors.description[0]}</p>}
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
              {saving ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}