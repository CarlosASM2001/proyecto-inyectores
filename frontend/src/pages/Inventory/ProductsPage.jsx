import { useEffect, useState, useRef } from "react";
import api from "../../service/api_Authorization";
import ProductModal from "./ProductModal";
import ProductCard from "../../components/Inventory/ProductCard";
import { Plus, Search, Filter, Package } from "lucide-react";
import Pagination from "../../components/Inventory/Pagination";

const FILTER_OPTIONS = [
  { value: "", label: "Todos" },
  {
    value: "disponible",
    label: "Disponibles",
    color: "text-green-700 bg-green-50 border-green-200",
  },
  {
    value: "bajo_stock",
    label: "Bajo Stock",
    color: "text-orange-700 bg-orange-50 border-orange-200",
  },
  {
    value: "agotado",
    label: "Agotados",
    color: "text-red-700 bg-red-50 border-red-200",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Paginación y Búsqueda
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const didInitSearch = useRef(false);

  const fetchProducts = async (
    query = "",
    currentPage = 1,
    currentStatus = "",
    showMainLoader = false,
  ) => {
    if (showMainLoader) setLoading(true);
    else setSearching(true);

    try {
      const request = api.get("/products/inventory/filter", {
        params: {
          name: query.trim(),
          status: currentStatus || undefined,
          page: currentPage,
          per_page: 16,
        },
      });

      const { data } = await request;

      setProducts(data.data ?? []);
      if (data.meta) setMeta(data.meta);
      setError(null);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Sesión expirada"
          : "Error al cargar inventario",
      );
    } finally {
      if (showMainLoader) setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchProducts("", 1, "", true);
  }, []);

  useEffect(() => {
    if (!didInitSearch.current) {
      didInitSearch.current = true;
      return;
    }
    const timeout = setTimeout(() => {
      setPage(1);
      fetchProducts(searchText, 1, statusFilter, false);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchProducts(searchText, 1, newStatus, true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchProducts(searchText, newPage, statusFilter, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar este producto del inventario?")
    ) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(searchText, page, statusFilter, false);
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateStock = async (product, newStock) => {
    try {
      const payload = {
        name: product.name,
        description: product.description || "",
        price: product.price,
        min_stock: product.min_stock,
        actual_stock: newStock,
      };

      await api.put(`/products/${product.id}`, payload);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, actual_stock: newStock } : p,
        ),
      );
    } catch (err) {
      alert(
        "Error al actualizar el stock: " +
          (err.response?.data?.message || err.message),
      );
      fetchProducts(searchText, page, statusFilter, false);
    }
  };

  if (loading && products.length === 0)
    return (
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
            Inventario de <span className="text-workshop-red">Productos</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Gestiona tu stock y precios.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg shadow-red-900/10 uppercase text-xs md:text-sm tracking-tight w-full sm:w-auto"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {/* SEARCH & FILTER SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Buscar repuestos o inyectores..."
            className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-workshop-red/20 focus:border-workshop-red font-medium text-sm"
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-workshop-red border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sidebar-scrollbar">
          <Filter size={16} className="text-gray-400 shrink-0 ml-1" />
          {FILTER_OPTIONS.map((opt) => {
            const isActive = statusFilter === opt.value;
            const activeClasses = isActive
              ? opt.color || "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50";

            return (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`px-4 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider transition-colors shrink-0 ${activeClasses}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID DE TARJETAS UTILIZANDO EL COMPONENTE SEPARADO */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={openModal}
            onDelete={handleDelete}
            onUpdateStock={handleUpdateStock}
          />
        ))}
      </div>

      {/* COMPONENTE DE PAGINACIÓN */}
      {!loading && products.length > 0 && meta.last_page > 1 && (
        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          onPageChange={handlePageChange}
        />
      )}

      {/* EMPTY STATE */}
      {products.length === 0 && !loading && (
        <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
            <Package size={32} />
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-tight">
            {searchText || statusFilter
              ? "No se encontraron productos con estos filtros."
              : "El inventario está vacío."}
          </p>
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          productData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts(searchText, page, statusFilter, false);
          }}
        />
      )}
    </div>
  );
}
