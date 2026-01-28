import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ServiceModal from "./ServiceModal";
import { Trash2, Edit, Wrench, Plus, Search, DollarSign } from "lucide-react";

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

  if (loading) return (
    <div className="p-8 text-center font-black animate-pulse text-workshop-red tracking-widest uppercase">
      Cargando Catálogo de Trabajo...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION - Adaptable */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Catálogo de <span className="text-workshop-red">Servicios</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">Mantenimientos y mano de obra.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg uppercase text-xs tracking-widest w-full sm:w-auto"
        >
          <Plus size={18} />
          Nuevo Servicio
        </button>
      </div>

      {/* MOBILE LIST VIEW (Grid de 1 columna en móvil, oculto en desktop) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {services.map((service) => (
          <div key={service.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 text-workshop-red rounded-lg">
                  <Wrench size={20} />
                </div>
                <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">{service.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openModal(service)} className="p-2 text-gray-400 bg-gray-50 rounded-lg"><Edit size={16}/></button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-workshop-red bg-red-50 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 italic line-clamp-2 bg-gray-50/50 p-2 rounded-lg">
              {service.description || "Sin descripción detallada disponible."}
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Sugerido</span>
              <span className="bg-workshop-red text-white px-3 py-1 rounded-lg font-black text-sm">
                ${Number(service.base_price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Oculta en móvil) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-black italic">
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Servicio / Mano de Obra</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Descripción Técnica</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest">Precio Base</th>
                <th className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold italic">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 text-gray-400 group-hover:text-workshop-red group-hover:bg-red-50 rounded-lg transition-all">
                        <Wrench size={16} />
                      </div>
                      <span className="text-gray-900 uppercase text-sm tracking-tighter font-black">{service.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">
                    {service.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-workshop-red text-base font-black tracking-tight">
                    ${Number(service.base_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
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
      </div>

      {services.length === 0 && (
        <div className="p-16 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
            <Search size={32} />
          </div>
          <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No hay servicios en el catálogo</p>
        </div>
      )}

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