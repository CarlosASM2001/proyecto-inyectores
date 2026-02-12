import { useEffect, useMemo, useState } from "react";
import api from "../../service/api_Authorization";
import { HandCoins, Phone, Search } from "lucide-react";

const defaultDebtSummary = { total_debt: 0 };

function formatMoney(value) {
  return Number(value ?? 0).toLocaleString("es-CO");
}

export default function DebtsPage() {
  const [clients, setClients] = useState([]);
  const [totalDebt, setTotalDebt] = useState(defaultDebtSummary);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const [clientsData, totalDebtData] = await Promise.all([
          api.get("/clientsInDebt"),
          api.get("/totalDebt"),
        ]);

        setClients(clientsData.data?.data ?? clientsData.data ?? []);
        setTotalDebt(totalDebtData.data?.data ?? totalDebtData.data ?? defaultDebtSummary);
      } catch (err) {
        setError(err?.response?.status === 401 ? "Sesion expirada" : "Error al cargar las deudas");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  const sortedClients = useMemo(
    () =>
      [...clients].sort((a, b) => Number(b.total_debt || 0) - Number(a.total_debt || 0)),
    [clients],
  );

  if (loading) {
    return (
      <div className="p-8 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest">
        Cargando deudas activas...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Deudas <span className="text-workshop-red">Activas</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
            Resumen de cartera pendiente por cliente.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1">
        <div className="min-w-[280px] snap-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
            <HandCoins size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
              Total en Deuda
            </p>
            <h4 className="text-xl font-black text-gray-900 italic">
              COP <span className="text-workshop-red">{formatMoney(totalDebt.total_debt)}</span>
            </h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {sortedClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3"
          >
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Cliente
              </p>
              <h4 className="text-xl font-black text-gray-900 italic">{client.name}</h4>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Monto en mora
                </p>
                <h4 className="text-lg font-black text-workshop-red italic">
                  COP {formatMoney(client.total_debt)}
                </h4>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-600">
                <Phone size={14} />
                {client.phone || "Sin telefono"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-[12px] font-black text-gray-400 uppercase tracking-widest">
                Cliente
              </th>
              <th className="px-5 py-3 text-[12px] font-black text-gray-400 uppercase tracking-widest">
                Deuda
              </th>
              <th className="px-5 py-3 text-[12px] font-black text-gray-400 uppercase tracking-widest">
                Numero de telefono
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-bold italic">
            {sortedClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 text-sm text-gray-900 uppercase tracking-tighter font-black">
                  {client.name}
                </td>
                <td className="px-5 py-4 text-sm text-workshop-red uppercase font-black">
                  COP {formatMoney(client.total_debt)}
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{client.phone || "Sin telefono"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedClients.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <Search className="mx-auto text-gray-300 mb-3" size={36} />
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest">
            No hay clientes con deudas pendientes
          </p>
        </div>
      )}
    </div>
  );
}
