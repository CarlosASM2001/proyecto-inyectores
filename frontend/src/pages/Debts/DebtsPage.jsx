import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../service/api_Authorization";
import { HandCoins } from "lucide-react";

export default function DebtsPage() {
    const [clients, setClients] = useState([]);
    const [totalDebt, setTotalDebt] = useState([]);
    const [error, setError] = useState("");
    
    useEffect( () => {
        async function fetchAll() {
            try{
                const [clientsData, totalDebtData] = await Promise.all([
                    api.get("/clientsInDebt"),
                    api.get("/totalDebt"),
                ]);

                setClients(clientsData.data?.data ?? ClientsData.data ?? []);
                setTotalDebt(totalDebtData.data?.data ?? totalDebtData.data ?? []);
            } catch (err) {
                setError(err?.response?.status=== 401 ? "Sesion expirada" : "Error al cargar las deudas");
            }
        }

        fetchAll();
    } , []);


    return(
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        Deudas <span className="text-workshop-red">Activas</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
                        Resumen de las deudas activas.
                    </p>
                </div>
                {error && (
                <div className="text-xs font-black uppercase tracking-widest text-workshop-red">
                    {error}
                </div>
                )}
            </div>

            <div className="grid grid-cols1">
                <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
                        <HandCoins size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total en Deuda</p>
                        <h4 className="text-xl font-black text-gray-900 italic">COP <span className="text-workshop-red">{totalDebt.total_debt}</span></h4>
                    </div>
                </div>
            </div>
            {/*MOBILE VIEW*/}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {clients.map((c)=> (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Nombre del Cliente</p>
                                    <h4 className="text-xl font-black text-gray-900 italic">{c.name}</h4>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Monto en mora</p>
                                    <h4 className="text-xl font-black text-workshop-red italic">COP {c.total_debt}</h4>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Numero de telefono</p>
                                    <h4 className="text-xl font-black text-gray-900 italic">{c.phone}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/*DESKTOP VIEW*/}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-5 py-3 text-[15px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                            <th className="px-5 py-3 text-[15px] font-black text-gray-400 uppercase tracking-widest">Deuda</th>
                            <th className="px-5 py-3 text-[15px] font-black text-gray-400 uppercase tracking-widest">Numero de teléfono</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-bold italic">
                        {clients.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-4 text-sm text-gray-900 uppercase tracking-tighter font-black">{c.name}</td>
                                <td className="px-5 py-4 text-sm text-workshop-red uppercase font-black">COP {c.total_debt}</td>
                                <td className="px-5 py-4 text-sm text-gray-500">{c.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
        
        
    );
    
}

