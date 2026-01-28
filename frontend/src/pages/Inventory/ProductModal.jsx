import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, Package } from "lucide-react";

export default function ProductModal({ onClose, onSuccess, productData = null }) {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", actual_stock: "", min_stock: ""
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productData) setFormData({ ...productData });
  }, [productData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (productData) await api.put(`/products/${productData.id}`, formData);
      else await api.post("/products", formData);
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else alert(err.response?.data?.message || "Error al procesar");
    } finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-workshop-dark flex items-center justify-center text-white">
              <Package size={20} />
            </div>
            <h3 className="font-black tracking-tighter text-gray-900 uppercase">
              {productData ? "Editar Inyector" : "Nuevo Inyector"}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* NAME */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre del Producto</label>
            <input 
              type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={inputClass} placeholder="Ej. Bosch 0445..."
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-500">{errors.name[0]}</p>}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
            <textarea 
              rows="2" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={inputClass} placeholder="Compatibilidad, marca, etc..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* PRICE */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio ($)</label>
              <input 
                type="number" step="0.01" required value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value})}
                className={inputClass}
              />
            </div>
            {/* ACTUAL STOCK */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Existencia</label>
              <input 
                type="number" required value={formData.actual_stock}
                onChange={(e) => setFormData({ ...formData, actual_stock: e.target.value})}
                className={inputClass}
              />
            </div>
            {/* MIN STOCK */}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mínimo</label>
              <input 
                type="number" required value={formData.min_stock}
                onChange={(e) => setFormData({ ...formData, min_stock: e.target.value})}
                className={inputClass}
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-workshop-red text-white font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50">
              <Save size={18} />
              {saving ? "PROCESANDO..." : "GUARDAR CAMBIOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}