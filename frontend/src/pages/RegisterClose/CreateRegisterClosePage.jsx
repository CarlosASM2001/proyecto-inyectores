import { useState } from "react";
import api from "../../service/api_Authorization";
import { Calendar, ClipboardList, Save, AlertCircle } from "lucide-react";

export default function CreateRegisterClose({ onSuccess }) {
    const today = new Date().toISOString().split('T')[0];
    
    const [formData, setFormData] = useState({
        date: today,
        description: "",
    });
    
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        
        try {
            await api.post(`/createRegisterClose`, formData);
            onSuccess?.();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red outline-none transition-all bg-white";

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header del Formulario */}
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-workshop-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                            <ClipboardList size={20} />
                        </div>
                        Creación de <span className="text-workshop-red">Cierre de Caja</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 ml-13">
                        Registro administrativo de flujo diario
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Campo de Fecha */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                            <Calendar size={14} className="text-workshop-red" /> 
                            Fecha del Registro
                        </label>
                        <input 
                            type="date"
                            value={formData.date} 
                            required 
                            className={inputClass}
                            onChange={(e) => setFormData({...formData, date: e.target.value})} 
                        />
                    </div>

                    {/* Campo de Descripción */}
                    <div>
                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">
                            <ClipboardList size={14} className="text-workshop-red" /> 
                            Descripción / Observaciones
                        </label>
                        <textarea 
                            required 
                            placeholder="Ej: Cierre de turno tarde, sin novedades..."
                            className={`${inputClass} h-32 resize-none`}
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        />
                        {errors.description && (
                            <p className="text-xs text-workshop-red font-bold mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.description[0]}
                            </p>
                        )}
                    </div>

                    {errors.date && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                            <p className="font-bold text-sm uppercase tracking-tight text-workshop-red">
                                <AlertCircle size={12} /> {errors.date[0]}
                            </p>
                        </div>
                    )}

                    {/* Botón de Acción */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="w-full bg-workshop-dark text-white font-black py-4 rounded-2xl hover:bg-workshop-red transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                                    Generar Cierre de Caja
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
        </div>
    );
}