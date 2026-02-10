import { ShoppingCart, Package, Wrench, FileText } from "lucide-react";
import CartItem from "./CartItem";
import { T_Pro, T_Ser } from "../../Misc/Definitions";

export default function CartSummary({
  items,
  onRemoveItem,
  baseCurrency,
  exchangeRate = 1,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      if (item.type === T_Ser) {
        return total + item.subtotal * item.quantity;
      } else {
        return total + item.price * item.quantity;
      }
    }, 0);
  };

  const getConvertedAmount = (amount) => {
    return amount * exchangeRate;
  };

  const total = calculateTotal();
  const hasItems = items.length > 0;
  const productCount = items
    .filter((item) => item.type === T_Pro)
    .reduce((count, item) => count + item.quantity, 0);
  const serviceCount = items
    .filter((item) => item.type === T_Ser)
    .reduce((count, item) => count + item.quantity, 0);

  if (!hasItems) {
    return (
      <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-black uppercase text-xs tracking-widest mb-2">
          Carrito vacío
        </p>
        <p className="text-gray-400 text-sm">
          Agrega productos o servicios para comenzar la factura
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen del carrito */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-workshop-red rounded-xl flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
              Resumen del Carrito
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                {productCount} Productos
              </span>
              <span className="flex items-center gap-1">
                <Wrench className="h-4 w-4" />
                {serviceCount} Servicios
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={`${item.id}-${item.type}-${item.quantity}`}
              item={item}
              onRemove={onRemoveItem}
              baseCurrency={baseCurrency}
              exchangeRate={exchangeRate}
              showCurrencySymbol={true}
            />
          ))}
        </div>
      </div>

      {/* Total general */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-600">Subtotal:</span>
            <span className="font-bold text-gray-900">
              {baseCurrency.symbol} {formatCurrency(total)}
            </span>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-200 pt-4">
            {/* Total convertido */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                Total:
              </span>
              <span className="font-black text-workshop-red text-2xl">
                {baseCurrency.symbol}{" "}
                {formatCurrency(getConvertedAmount(total))}
              </span>
            </div>

            {/* Tasa de cambio si aplica */}
            {baseCurrency.name !== "Pesos" && (
              <div className="text-right text-sm text-gray-500 mt-2">
                Tasa de cambio: 1 COP = {formatCurrency(exchangeRate)}{" "}
                {baseCurrency.symbol}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className="font-bold text-gray-700 mb-2">
              Detalles del pedido:
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <span className="font-medium">Productos únicos:</span>{" "}
                {items.filter((item) => item.type === T_Pro).length}
              </div>
              <div>
                <span className="font-medium">Servicios únicos:</span>{" "}
                {items.filter((item) => item.type === T_Ser).length}
              </div>
              <div>
                <span className="font-medium">Total items:</span> {items.length}
              </div>
              <div>
                <span className="font-medium">Unidades totales:</span>{" "}
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
