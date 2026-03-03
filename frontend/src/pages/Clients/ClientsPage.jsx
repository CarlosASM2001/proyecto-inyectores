import { useEffect, useRef, useState } from "react";
import api from "../../service/api_Authorization";
import ClientModal from "./ClientModal";
import { Trash2, Edit, UserPlus, Search, Phone, CreditCard, X, User, ExternalLink } from "lucide-react";

export default function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const didInitSearch = useRef(false);
  const lastRequestId = useRef(0);

  const fetchClients = async (query = "", showMainLoader = false) => {
    const requestId = ++lastRequestId.current;
    if (showMainLoader) setLoading(true);
    else setSearching(true);

    try {
      const trimmedQuery = query.trim();
      const request = trimmedQuery
        ? api.get("/clients/search", { params: { search: trimmedQuery, limit: 200 } })
        : api.get("/clients");

      const { data } = await request;
      if (requestId !== lastRequestId.current) return;

      setClients(data.data ?? data ?? []);
      setError(null);
    } catch (err) {
      if (requestId !== lastRequestId.current) return;
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar clientes");
    } finally {
      if (requestId === lastRequestId.current) {
        if (showMainLoader) setLoading(false);
        setSearching(false);
      }
    }
  };

  useEffect(() => { fetchClients("", true); }, []);

  useEffect(() => {
    if (!didInitSearch.current) {
      didInitSearch.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      fetchClients(searchText, false);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await api.delete(`/clients/${id}`);
        setClients((prevClientes) => prevClientes.filter((c) => c.id !== id));
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  const openModal = (client = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  if (loading && clients.length === 0) return (
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
            Catálogo de <span className="text-workshop-red">Clientes</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium italic">Base de datos de contactos y facturación.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg shadow-black/10 uppercase text-xs md:text-sm tracking-widest w-full sm:w-auto group"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-bold text-red-600 flex items-center gap-2 uppercase tracking-tighter">
          <X size={16} /> {error}
        </div>
      )}

      {/* SEARCH SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por nombre, teléfono o cédula..."
            className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-workshop-red/20 focus:border-workshop-red font-bold text-sm transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searching && <div className="w-4 h-4 border-2 border-workshop-red border-t-transparent rounded-full animate-spin" />}
            {searchText && (
              <button onClick={() => setSearchText("")} className="text-gray-400 hover:text-workshop-red p-1">
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CLIENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clients.map((client) => (
          <div 
            key={client.id} 
            className="bg-white group rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-workshop-red/30 transition-all p-5 flex flex-col justify-between"
          >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-workshop-red group-hover:text-white transition-colors">
                        <User size={20} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(client)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg leading-tight mb-4 break-words group-hover:text-workshop-red transition-colors">
                    {client.name}
                </h3>

                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                            <Phone size={12} className="text-workshop-red" />
                        </div>
                        <span className="text-xs font-bold italic tracking-tight">{client.phone || "Sin Teléfono"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                            <CreditCard size={12} className="text-workshop-red" />
                        </div>
                        <span className="text-xs font-bold italic tracking-tight">{client.cedula || "S/N Cédula"}</span>
                    </div>
                </div>
            </div>

          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {clients.length === 0 && !searching && (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-4">
            <User size={40} />
          </div>
          <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">
            {searchText ? "No se encontraron coincidencias" : "No hay clientes en el catálogo"}
          </p>
          {searchText && (
            <button onClick={() => setSearchText("")} className="mt-4 text-workshop-red font-bold text-sm underline underline-offset-4">
                Limpiar búsqueda
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <ClientModal
          clientData={selectedClient}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClients(searchText, false);
          }}
        />
      )}
    </div>
  );
}