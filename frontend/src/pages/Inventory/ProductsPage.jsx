import { useEffect, useState, useCallback } from "react";
import api from "../../service/api_Authorization";
import ProductModal from "./ProductModal";
import {
  Trash2,
  Edit,
  PackagePlus,
  AlertTriangle,
  CheckCircle2,
  Search,
  Box,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Filter
} from "lucide-react";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "disponible", label: "Disponible" },
  { value: "bajo_stock", label: "Bajo Stock" },
  { value: "agotado", label: "Agotado" },
];

function getStatusBadge(product) {
  if (product.actual_stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[9px] font-black uppercase">
        <XCircle size={11} /> Agotado
      </span>
    );
  }
  if (product.actual_stock <= product.min_stock) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase">
        <AlertTriangle size={11} /> Bajo Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-black uppercase">
      <CheckCircle2 size={11} /> Disponible
    </span>
  );
}

function getStatusBadgeMobile(product) {
  if (product.actual_stock === 0) {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase">
        <XCircle size={12} /> Agotado
      </span>
    );
  }
  const isLow = product.actual_stock <= product.min_stock;
  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${isLow ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
    >
      {isLow ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
      Stock: {product.actual_stock}
    </span>
  );
}


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [filterStatus,setFilterStatus] = useState("");
  const [page,setPage] = useState(1);
  const [pagination,setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total:0,
    perPage: 10
  });
  const PER_PAGE = 10;

  const fetchProducts = useCallback(

    async  (currentPage = page) => {
      setLoading(true);
      try{
      const params = {page: currentPage, perPage: PER_PAGE};
      if (filterName.trim()) params.name = filterName.trim();
      if (filterStatus) params.status = filterStatus;

      const { data } = await api.get("/products", { params });

      setProducts(data.data ?? []);

      setPagination({
        currentPage: data.meta?.current_page ?? 1,
        lastPage: data.meta?.last_page ?? 1,
        total: data.meta?.total ?? 0,
        perPage: data.meta?.per_page ?? PER_PAGE,
      })

      }catch{
        setProducts([])
      }finally{
        setLoading(false)
      }
    },
    [filterName,filterStatus,page]
    
  )

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  useEffect(() => {
    setPage(1);

  }, [filterName,filterStatus]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(page)
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };


  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(pagination.lastPage, p + 1));

  const startItem = (pagination.currentPage - 1) * pagination.perPage + 1;
  const endItem = Math.min(
    pagination.currentPage * pagination.perPage,
    pagination.total,
  );

return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Control de <span className="text-workshop-red">Inventario</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
            Gestión de repuestos y stock físico.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-5 py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg uppercase text-xs tracking-widest w-full sm:w-auto"
        >
          <PackagePlus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-workshop-red focus:ring-2 focus:ring-red-500/10 outline-none transition-all"
          />
        </div>
        <div className="relative sm:w-48">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 focus:border-workshop-red focus:ring-2 focus:ring-red-500/10 outline-none transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronRight
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90"
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-12 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest text-sm">
          Cargando...
        </div>
      )}

      {/* CONTENT */}
      {!loading && products.length > 0 && (
        <>
          {/* MOBILE LIST */}
          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight text-xs leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {product.description || "Sin descripción"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal(product)}
                      className="p-1.5 text-gray-400 bg-gray-50 rounded-lg"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-workshop-red bg-red-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase italic">
                      Precio
                    </span>
                    <span className="font-black text-workshop-red text-base">
                      ${Number(product.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-0.5">
                    {getStatusBadgeMobile(product)}
                    <span className="text-[9px] text-gray-400 font-bold">
                      MÍN: {product.min_stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-black text-gray-900 uppercase text-xs tracking-tight">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          {product.description || "Sin descripción"}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-workshop-red text-sm font-black">
                        ${Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`text-xs font-black ${product.actual_stock === 0 ? "text-gray-400" : product.actual_stock <= product.min_stock ? "text-red-600" : "text-gray-900"}`}
                        >
                          {product.actual_stock}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-1">
                          / {product.min_stock}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{getStatusBadge(product)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openModal(product)}
                            className="p-1.5 text-gray-300 hover:text-workshop-dark hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-gray-300 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}
          {pagination.lastPage > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm">
              <span className="text-xs text-gray-500 font-semibold">
                {startItem}–{endItem} de {pagination.total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={goPrev}
                  disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-workshop-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 text-xs font-black text-gray-700">
                  {pagination.currentPage} / {pagination.lastPage}
                </span>
                <button
                  onClick={goNext}
                  disabled={page >= pagination.lastPage}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-workshop-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 text-gray-300 mb-3">
            <Box size={28} />
          </div>
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest">
            {filterName || filterStatus
              ? "Sin resultados para los filtros aplicados"
              : "No hay productos en inventario"}
          </p>
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          productData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts(page);
          }}
        />
      )}
    </div>
  );
}