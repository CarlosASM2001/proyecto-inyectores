import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ServiceModal from "./ServiceModal";
import { Trash2, Edit, Wrench, Plus, Search, DollarSign, X, ChevronRight } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtrado simple por nombre para la búsqueda local
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && services.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workshop-red"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Catálogo de <span className="text-workshop-red">Servicios</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium italic">Define tus tarifas de mano de obra y mantenimiento.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg shadow-black/10 uppercase text-xs tracking-widest w-full sm:w-auto group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Nuevo Servicio
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar servicio (ej: Limpieza de inyectores...)"
            className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-workshop-red/20 focus:border-workshop-red font-bold text-sm transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-workshop-red">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <div 
            key={service.id} 
            className="group bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-workshop-red/20 transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Card Header: Icon & Actions */}
            <div className="p-6 pb-4 flex justify-between items-start">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-workshop-red group-hover:text-white transition-all duration-300 shadow-inner">
                <Wrench size={22} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(service)} className="p-2 text-gray-400 hover:text-workshop-dark hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="px-6 flex-grow">
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg leading-tight mb-2 group-hover:text-workshop-red transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-gray-500 italic line-clamp-3 mb-4 min-h-[3rem]">
                {service.description || "Sin descripción técnica adicional."}
              </p>
            </div>

            {/* Card Footer: Price */}
            <div className="p-6 pt-0">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between group-hover:bg-red-50 transition-colors">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Precio</p>
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">
                            <span className="text-workshop-red text-sm mr-1">$</span>
                            {Number(service.base_price).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredServices.length === 0 && (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-4">
            <Wrench size={40} />
          </div>
          <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">
            {searchTerm ? "No hay servicios que coincidan" : "El catálogo está vacío"}
          </p>
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