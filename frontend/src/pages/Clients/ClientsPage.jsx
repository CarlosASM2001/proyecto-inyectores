import { useEffect,useRef, useState } from "react";
import api from "../../service/api_Authorization";
import ClientModal from "./ClientModal";
import { Trash2, Edit, UserPlus, Search, Phone, CreditCard, X } from "lucide-react";

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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workshop-red"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-bold text-red-600">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION - Adaptable stack en móvil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Catálogo de <span className="text-workshop-red">Clientes</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium">Gestiona tu base de datos activa.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-red text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 uppercase text-xs md:text-sm tracking-tight w-full sm:w-auto"
        >
          <UserPlus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* SEARCH & FILTER SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar por nombre, teléfono o cédula..."
            className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-workshop-red/20 focus:border-workshop-red font-medium text-sm"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => setSearchText("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-workshop-red hover:bg-red-50 transition-all"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

      </div>

      {/* MOBILE LIST VIEW (Visible solo en < md) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-black text-gray-900 uppercase tracking-tight text-lg">{client.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => openModal(client)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit size={16} /></button>
                <button onClick={() => handleDelete(client.id)} className="p-2 text-workshop-red bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500 italic">
                <Phone size={14} /> {client.phone}
              </div>
              <div className="flex items-center gap-2 text-gray-500 italic">
                <CreditCard size={14} /> {client.cedula}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (Oculta en móviles) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cédula</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 italic">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900 uppercase tracking-tighter">{client.name}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{client.phone}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{client.cedula}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(client)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(client.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY STATE */}
      {clients.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <Search size={32} />
          </div>
          <p className="text-gray-500 font-bold">
            {searchText ? "No se encontraron coincidencias para tu búsqueda." : "No hay clientes registrados."}
          </p>
        </div>
      )}

      {isModalOpen && (
        <ClientModal
          clientData={selectedClient}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClients(searchText,false);
          }}
        />
      )}
    </div>
  );
}