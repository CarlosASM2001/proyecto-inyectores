import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ProductModal from "./ProductModal";
import {
  Trash2,
  Edit,
  PackagePlus,
  AlertTriangle,
  CheckCircle2,
  Search,
  DollarSign,
  Box,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.data ?? data ?? []);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Sesión expirada"
          : "Error al cargar inventario",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        alert("No se pudo eliminar: " + err.message);
      }
    }
  };

  const openModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <div className="p-8 text-center font-black animate-pulse text-workshop-red uppercase tracking-widest">
        Cargando Inventario...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION - Adaptativo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-4 sm:py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg uppercase text-xs tracking-widest w-full sm:w-auto"
        >
          <PackagePlus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* MOBILE LIST VIEW (Visible solo en pantallas pequeñas) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {products.map((product) => {
          const isLowStock = product.actual_stock <= product.min_stock;
          return (
            <div
              key={product.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="max-w-[70%]">
                  <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {product.description || "Sin descripción"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openModal(product)}
                    className="p-2 text-gray-400 bg-gray-50 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-workshop-red bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase italic">
                    Precio Unitario
                  </span>
                  <span className="font-black text-workshop-red text-lg">
                    ${Number(product.price).toLocaleString()}
                  </span>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase ${isLowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {isLowStock ? (
                      <AlertTriangle size={12} />
                    ) : (
                      <CheckCircle2 size={12} />
                    )}
                    Stock: {product.actual_stock}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-1 font-bold">
                    MÍNIMO REQUERIDO: {product.min_stock}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW (Oculta en móviles) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Producto
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Precio
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Stock
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Estado
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold">
              {products.map((product) => {
                const isLowStock = product.actual_stock <= product.min_stock;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors group italic"
                  >
                    <td className="px-6 py-4">
                      <div className="font-black text-gray-900 uppercase text-sm tracking-tight">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[200px]">
                        {product.description || "Sin descripción"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-workshop-red text-base">
                      ${Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-sm font-black ${isLowStock ? "text-red-600" : "text-gray-900"}`}
                      >
                        {product.actual_stock}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        / {product.min_stock} min
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase">
                          <AlertTriangle size={12} /> Bajo Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[9px] font-black uppercase">
                          <CheckCircle2 size={12} /> Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-gray-300 hover:text-workshop-dark hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-300 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 text-gray-300 mb-4">
            <Box size={32} />
          </div>
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest">
            No hay productos en inventario
          </p>
        </div>
      )}

      {isModalOpen && (
        <ProductModal
          productData={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
