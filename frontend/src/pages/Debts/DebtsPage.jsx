import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import { HandCoins, Search, Phone, User, ArrowUpRight, X, AlertCircle, DollarSign } from "lucide-react";

export default function DebtsPage() {
    const [clients, setClients] = useState([]);
    const [totalDebt, setTotalDebt] = useState({ total_debt: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchAll() {
            setLoading(true);
            try {
                const [clientsData, totalDebtData] = await Promise.all([
                    api.get("/clientsInDebt"),
                    api.get("/totalDebt"),
                ]);

                setClients(clientsData.data?.data ?? clientsData.data ?? []);
                setTotalDebt(totalDebtData.data?.data ?? totalDebtData.data ?? { total_debt: 0 });
            } catch (err) {
                setError(err?.response?.status === 401 ? "Sesión expirada" : "Error al cargar las deudas");
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && clients.length === 0) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workshop-red"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* HEADER & SUMMARY REDUCIDO */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        Deudas <span className="text-workshop-red">Activas</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium italic">Gestión de cuentas por cobrar.</p>
                </div>

                {/* Resumen Total Reducido y Estilizado */}
                <div className="bg-workshop-dark px-6 py-4 rounded-2xl shadow-lg border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-workshop-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-900/40">
                        <HandCoins size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total en Mora</p>
                        <h4 className="text-xl font-black text-white italic tracking-tighter">
                            COP <span className="text-workshop-red">{Number(totalDebt.total_debt).toLocaleString()}</span>
                        </h4>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 text-xs font-black uppercase flex items-center gap-2">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* BUSCADOR */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar cliente deudor..."
                        className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-workshop-red/20 focus:border-workshop-red font-bold text-sm"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-workshop-red">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* GRID DE TARJETAS (Mismo formato que Productos/Servicios) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredClients.map((c) => (
                    <div 
                        key={c.id} 
                        className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-workshop-red/30 transition-all duration-300 flex flex-col"
                    >
                        {/* Card Header */}
                        <div className="p-5 pb-3 flex justify-between items-start">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-workshop-red group-hover:text-white transition-all shadow-inner">
                                <User size={20} />
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="px-5 flex-grow">
                            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-base leading-tight group-hover:text-workshop-red transition-colors mb-1 truncate">
                                {c.name}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-400 text-xs italic mb-4">
                                <Phone size={12} className="text-gray-300" />
                                {c.phone || "Sin contacto"}
                            </div>
                        </div>

                        {/* Card Footer: El Monto Pendiente */}
                        <div className="p-5 pt-0">
                            <div className="bg-gray-50 rounded-2xl p-3 flex flex-col group-hover:bg-red-50 transition-colors">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Saldo Pendiente</p>
                                <div className="flex justify-between items-end">
                                    <p className="text-lg font-black text-gray-900 tracking-tighter italic">
                                        <span className="text-workshop-red text-xs mr-1">COP</span>
                                        {Number(c.total_debt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredClients.length === 0 && !loading && (
                <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
                        <HandCoins size={32} />
                    </div>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                        {searchTerm ? "No hay deudores con ese nombre" : "Cartera limpia. Sin deudas pendientes."}
                    </p>
                </div>
            )}
        </div>
    );
}