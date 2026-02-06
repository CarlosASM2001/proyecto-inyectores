import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import RegisterCloseModal from "./RegisterCloseModal";
import { Trash2, Edit, Wallet, TrendingUp, Calendar, Search, Coins } from "lucide-react";

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

  console.log(thisMonthRegisters);
  const totalCOP = thisMonthRegisters.reduce((acc, rc) => acc + Number(rc.COP_amount || 0), 0);
  const totalUSD = thisMonthRegisters.reduce((acc, rc) => acc + Number(rc.USD_amount || 0), 0);
  const totalVES = thisMonthRegisters.reduce((acc, rc) => acc + Number(rc.VES_amount || 0), 0);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro de caja?")) return;
    try {
      await api.delete(`/registerClose/${id}`);
      setRegisterCloses(registerCloses.filter((rc) => rc.id !== id));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openModal = (rc = null) => {
    setSelectedRegisterClose(rc);
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="p-10 text-center font-black animate-pulse text-workshop-red tracking-widest">
      SINCRONIZANDO FLUJO DE CAJA...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS - Scrollable on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mes Actual</p>
            <h4 className="text-xl font-black text-gray-900 leading-none">{thisMonthRegisters.length} Cierres</h4>
          </div>
        </div>

        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pesos</p>
            <h4 className="text-xl font-black text-green-700 leading-none">${totalCOP.toLocaleString()}</h4>
          </div>
        </div>

        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Dólares</p>
            <h4 className="text-xl font-black text-amber-600 leading-none">${totalUSD.toLocaleString()}</h4>
          </div>
        </div>

                <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bolivares</p>
            <h4 className="text-xl font-black text-amber-600 leading-none">${totalVES.toLocaleString()}</h4>
          </div>
        </div>

      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
          Flujo de <span className="text-workshop-red">Caja</span>
        </h2>
        <button 
          onClick={() => openModal()}
          className="bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest w-full sm:w-auto shadow-lg shadow-black/10"
        >
          <Coins size={18} /> Nuevo Cierre
        </button>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {registerCloses.map((rc) => (
          <div key={rc.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <span className="font-black text-gray-900 italic">{rc.date}</span>
              <div className="flex gap-2">
                <button onClick={() => openModal(rc)} className="p-2 text-gray-400 bg-gray-50 rounded-lg"><Edit size={16}/></button>
                <button onClick={() => handleDelete(rc.id)} className="p-2 text-workshop-red bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 bg-gray-50/30">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Efectivo COP</p>
                <p className="text-lg font-black text-green-700">${Number(rc.COP_amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Efectivo USD</p>
                <p className="text-lg font-black text-amber-600">${Number(rc.USD_amount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Efectivo VES</p>
                <p className="text-lg font-black text-amber-600">${Number(rc.VES_amount).toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Notas del Cierre</p>
                <p className="text-xs text-gray-500 italic">{rc.description || "Sin observaciones adicionales."}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto COP</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto USD</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Monto VES</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-workshop-red">Observaciones</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold italic">
              {registerCloses.map((rc) => (
                <tr key={rc.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-900">{rc.date}</td>
                  <td className="px-6 py-4 text-sm text-green-700 font-black">${Number(rc.COP_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-amber-700 font-black">${Number(rc.USD_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-amber-700 font-black">${Number(rc.VES_amount).toLocaleString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-[250px] truncate">{rc.description || "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(rc)} className="p-2 text-gray-400 hover:text-workshop-dark hover:bg-gray-100 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(rc.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {registerCloses.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <Search className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No hay cierres registrados este período</p>
        </div>
      )}

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