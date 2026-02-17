import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export default function CartItem({
  item,
  onRemove,
  baseCurrency,
  exchangeRate = 1,
  showCurrencySymbol = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount) => {
    const val = parseFloat(amount) || 0; // Validación de seguridad
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Convertir asegurando números
  const getConvertedAmount = (amount) => {
    const val = parseFloat(amount) || 0;
    const rate = parseFloat(exchangeRate) || 1;
    return val * rate;
  };

  // Cálculos seguros
  const price = parseFloat(item.price_) || 0;
  const quantity = parseFloat(item.quantity_) || 0;
  const totalItemPrice = price * quantity;

  const handleRemove = () => {
    if (window.confirm(`¿Eliminar ${item.name} del carrito?`)) {
      onRemove(item);
    }
  };

  const toggleExpanded = () => {
    if (item.type === "Service" && item.products && item.products.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  item.type === "Service"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.type === "Service" ? "Servicio" : "Producto"}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                × {quantity}
              </span>
            </div>

            <div className="font-black text-gray-900 text-lg mb-2">
              {item.name}
            </div>

            <div className="flex flex-col items-start gap-1">
              <div className="font-black text-workshop-red text-xl">
                {showCurrencySymbol && baseCurrency.symbol}{" "}
                {formatCurrency(getConvertedAmount(totalItemPrice))}
              </div>

              {baseCurrency.name !== "Pesos" && (
                <div className="text-xs font-bold text-gray-400">
                  Ref: COP ${formatCurrency(totalItemPrice)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.type === "Service" && item.products?.length > 0 && (
              <button
                onClick={toggleExpanded}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                {isExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            )}
            <button
              onClick={handleRemove}
              className="p-2 rounded-lg text-workshop-red hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          Precio unitario: {showCurrencySymbol && baseCurrency.symbol}{" "}
          {formatCurrency(getConvertedAmount(price))}
        </div>
      </div>

      {isExpanded && item.products && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Componentes del servicio ({item.products.length}):
            </div>
            {item.products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border"
              >
                <div>
                  <div className="font-bold text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.quantity} × ${product.price}
                  </div>
                </div>
                <div className="font-black text-gray-900">
                  $
                  {(
                    parseFloat(product.price) * parseFloat(product.quantity)
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
