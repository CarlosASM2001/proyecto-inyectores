import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ClientModal from "./ClientModal";
import { Trash2, Edit, UserPlus, Search } from "lucide-react";

export default function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/clients");
      setClients(data.data);
    } catch (err) {
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      try {
        await api.delete(`/clients/${id}`);
        setClients(clients.filter((c) => c.id !== id));
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

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Catálogo de <span className="text-workshop-red">Clientes</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium">Gestiona la base de datos de tus clientes activos.</p>
        </div>
        
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-red text-white font-black px-6 py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 uppercase text-sm tracking-tight"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cédula</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{client.phone}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{client.cedula}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(client)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {clients.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search size={32} />
            </div>
            <p className="text-gray-500 font-bold">No se encontraron clientes registrados.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ClientModal
          clientData={selectedClient}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchClients();
          }}
        />
      )}
    </div>
  );
}