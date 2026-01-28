import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ProductModal from "./ProductModal";
import { Trash2, Edit, PackagePlus, AlertTriangle, CheckCircle2 } from "lucide-react";

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
      setProducts(data.data);
    } catch (err) {
      setError(err.response?.status === 401 ? "Sesión expirada" : "Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

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

  if (loading) return <div className="p-8 text-center font-black animate-pulse text-workshop-red">CARGANDO INVENTARIO...</div>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Control de <span className="text-workshop-red">Inventario</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Monitorea y gestiona tus repuestos y productos.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-workshop-dark text-white font-black px-6 py-3 rounded-xl hover:bg-workshop-red transition-all shadow-lg uppercase text-xs tracking-widest"
        >
          <PackagePlus size={18} />
          Nuevo Producto
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const isLowStock = product.actual_stock <= product.min_stock;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 uppercase text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description || "Sin descripción"}</div>
                    </td>
                    <td className="px-6 py-4 font-black text-workshop-red">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${isLowStock ? "text-red-600" : "text-gray-900"}`}>
                        {product.actual_stock}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">/ {product.min_stock} min</span>
                    </td>
                    <td className="px-6 py-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-tighter">
                          <AlertTriangle size={12} /> Bajo Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-tighter">
                          <CheckCircle2 size={12} /> Disponible
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openModal(product)} className="p-2 text-gray-400 hover:text-workshop-dark hover:bg-gray-100 rounded-lg transition-all">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-all">
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