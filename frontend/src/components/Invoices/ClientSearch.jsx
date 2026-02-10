/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { UserCircle, X } from "lucide-react";

export default function ClientSearch({
  onClientSelect,
  selectedClient,
  onClear,
  searchText,
  onSearchTextChange,
}) {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Búsqueda con debounce
  useEffect(() => {
    if (!searchText || searchText.length < 2) {
      // Limpiar resultados cuando el texto es muy corto
      if (clients.length > 0) {
        setClients([]);
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true);

      api
        .post("/clients/Like", { Seach: searchText })
        .then((res) => {
          setClients(res.data.data || []);
        })
        .catch((err) => console.error("Error buscando clientes:", err))
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleSelect = (client) => {
    onClientSelect(client);
    setClients([]);
  };

  const handleClear = () => {
    onClear();
    setClients([]);
    onSearchTextChange("");
  };

  return (
    <div className="space-y-4">
      {/* Campo de búsqueda */}
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <UserCircle className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="clientSearch"
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
            placeholder="Buscar cliente por nombre o cédula..."
            disabled={!!selectedClient}
          />
          {selectedClient && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-workshop-red transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-workshop-red border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Buscando clientes...</span>
            </div>
          </div>
        )}

        {/* Lista de resultados */}
        {!selectedClient && searchText.length >= 2 && clients.length > 0 && (
          <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl max-h-60 overflow-y-auto">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelect(client)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="font-bold text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-500">
                  Cédula: {client.cedula}
                </div>
                {client.phone && (
                  <div className="text-sm text-gray-400">
                    Tel: {client.phone}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!selectedClient &&
          searchText.length >= 2 &&
          !isLoading &&
          clients.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <p className="text-gray-500 text-center text-sm">
                No se encontraron clientes
              </p>
            </div>
          )}
      </div>

      {/* Cliente seleccionado */}
      {selectedClient && (
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-black text-gray-900">
                {selectedClient.name}
              </div>
              <div className="text-sm text-gray-500">
                Cédula: {selectedClient.cedula}
              </div>
              {selectedClient.phone && (
                <div className="text-sm text-gray-400">
                  Tel: {selectedClient.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
