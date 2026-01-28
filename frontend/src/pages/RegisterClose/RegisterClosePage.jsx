import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import RegisterCloseModal from "./RegisterCloseModal";
import { Trash2, Edit, Wallet, TrendingUp, Calendar } from "lucide-react";

export default function RegisterClosePage() {
  const [registerCloses, setRegisterCloses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegisterClose, setSelectedRegisterClose] = useState(null);

  const fetchRegisterCloses = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/registerClose");
      setRegisterCloses(data.data ?? data ?? []);
    } catch (err) {
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegisterCloses(); }, []);

  // --- LÓGICA DE ESTADÍSTICAS ---
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthRegisters = registerCloses.filter(rc => {
    const rcDate = new Date(rc.date);
    return rcDate.getMonth() === currentMonth && rcDate.getFullYear() === currentYear;
  });

  const totalCOP = thisMonthRegisters.reduce((acc, rc) => acc + Number(rc.COP_amount || 0), 0);
  const totalUSD = thisMonthRegisters.reduce((acc, rc) => acc + Number(rc.USD_amount || 0), 0);

  if (loading) return <div className="p-10 text-center font-black animate-pulse text-workshop-red">CARGANDO FLUJO DE CAJA...</div>;

  return (
    <div className="space-y-6">
      {/* TARJETAS DE RESUMEN MENSUAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cierres este Mes</p>
            <h4 className="text-2xl font-black text-gray-900">{thisMonthRegisters.length}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pesos (COP)</p>
            <h4 className="text-2xl font-black text-gray-900">${totalCOP.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Dólares (USD)</p>
            <h4 className="text-2xl font-black text-gray-900">${totalUSD.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Cierres de Caja</h2>
        <button 
          onClick={() => { setSelectedRegisterClose(null); setIsModalOpen(true); }}
          className="bg-workshop-dark text-white font-black px-6 py-3 rounded-xl hover:bg-workshop-red transition-all flex items-center gap-2 uppercase text-xs tracking-widest"
        >
          + Nuevo Cierre
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">Fecha</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">COP</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">USD</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase italic text-workshop-red">Descripción</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {registerCloses.map((rc) => (
              <tr key={rc.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-bold">{rc.date}</td>
                <td className="px-6 py-4 text-sm text-green-700">${Number(rc.COP_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-amber-700">${Number(rc.USD_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate">{rc.description || "—"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(rc)} className="p-2 text-gray-400 hover:text-workshop-dark transition-colors"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(rc.id)} className="p-2 text-gray-400 hover:text-workshop-red transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registerCloses.length === 0 && <div className="p-10 text-center text-gray-400 font-bold uppercase text-xs">No hay registros de caja.</div>}
      </div>

      {isModalOpen && (
        <RegisterCloseModal
          registerCloseData={selectedRegisterClose}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchRegisterCloses(); }}
        />
      )}
    </div>
  );
}