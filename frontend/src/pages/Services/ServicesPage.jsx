import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ServiceModal from "./ServiceModal";
import { Trash2, Edit, Wrench, Plus } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/services");
      setServices(data.data ?? data ?? []);
    } catch (err) {
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("No se pudo eliminar: " + err.message);
    }
  };

  const openModal = (service = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-center font-black animate-pulse text-workshop-red">CARGANDO SERVICIOS...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Catálogo de <span className="text-workshop-red">Servicios</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Gestiona los trabajos y mantenimientos ofrecidos.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg uppercase text-xs tracking-widest"
        >
          <Plus size={18} />
          Nuevo Servicio
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Servicio</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Base</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:text-workshop-red transition-colors">
                        <Wrench size={16} />
                      </div>
                      <span className="font-bold text-gray-900 uppercase text-sm">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                    {service.description || "Sin descripción detallada"}
                  </td>
                  <td className="px-6 py-4 font-black text-workshop-red">
                    ${Number(service.base_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(service)} className="p-2 text-gray-400 hover:text-workshop-dark hover:bg-gray-100 rounded-lg transition-all">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {services.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-medium">No hay servicios registrados aún.</div>
        )}
      </div>

      {isModalOpen && (
        <ServiceModal
          serviceData={selectedService}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchServices();
          }}
        />
      )}
    </div>
  );
}