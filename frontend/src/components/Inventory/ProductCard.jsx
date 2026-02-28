import { Package, AlertTriangle, Edit, Trash2 } from "lucide-react";
import StockControl from "./StockControl";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onUpdateStock,
}) {
  const isAgotado = product.actual_stock === 0;
  const isLowStock =
    product.actual_stock > 0 && product.actual_stock <= product.min_stock;

  let statusColor = "bg-green-500";
  let alertBadge = null;

  if (isAgotado) {
    statusColor = "bg-red-600";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-1 rounded-md">
        <AlertTriangle size={12} /> Agotado
      </span>
    );
  } else if (isLowStock) {
    statusColor = "bg-orange-500";
    alertBadge = (
      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
        <AlertTriangle size={12} /> Bajo Stock
      </span>
    );
  }

  const borderColor = isAgotado
    ? "border-red-200"
    : isLowStock
      ? "border-orange-200"
      : "border-gray-200";
  const iconColors = isAgotado
    ? "bg-red-50 text-red-600"
    : isLowStock
      ? "bg-orange-50 text-orange-600"
      : "bg-green-50 text-green-600";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 flex flex-col overflow-hidden relative group hover:shadow-md ${borderColor}`}
    >
      {/* Barra superior de estado */}
      <div className={`h-1.5 w-full ${statusColor}`}></div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Header Tarjeta */}
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg ${iconColors}`}>
            <Package size={20} />
          </div>
          {alertBadge}
        </div>

        {/* Info Producto */}
        <h3 className="font-black text-gray-900 leading-tight text-lg mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 italic line-clamp-2 mb-4 flex-1">
          {product.description || "Sin descripción."}
        </p>

        {/* Precios y Límites */}
        <div className="grid grid-cols-2 gap-2 mb-2 border-t border-b border-gray-50 py-1">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Precio
            </p>
            <p className="font-black text-workshop-red">
              {Number(product.price).toLocaleString()} {" COP"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Stock Mín.
            </p>
            <p className="font-bold text-gray-700">{product.min_stock} uds</p>
          </div>
        </div>

        {/* Acciones Rápidas (Editar/Eliminar) */}
        <div className="absolute top-5 right-5 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 bg-white shadow border border-gray-200 text-gray-500 hover:text-blue-600 rounded-md transition-colors"
            title="Editar producto"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 bg-white shadow border border-gray-200 text-gray-500 hover:text-workshop-red rounded-md transition-colors"
            title="Eliminar producto"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Modificador de Stock */}
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Stock Disponible
          </p>
          <StockControl product={product} onUpdateStock={onUpdateStock} />
        </div>
      </div>
    </div>
  );
}
