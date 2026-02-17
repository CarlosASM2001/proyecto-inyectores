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
    const val = parseFloat(amount) || 0;
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      let price = 0;

      if (item.type === T_Ser) {
        price = parseFloat(item.subtotal) || 0;
      } else {
        price = parseFloat(item.price) || 0;
      }

      return total + price * quantity;
    }, 0);
  };

  const getConvertedAmount = (amount) => {
    const val = parseFloat(amount) || 0;
    const rate = parseFloat(exchangeRate) || 1;
    return val / rate;
  };

  const total = calculateTotal();
  const hasItems = items.length > 0;

  // Contadores seguros
  const productCount = items
    .filter((item) => item.type === T_Pro)
    .reduce((count, item) => count + (parseFloat(item.quantity) || 0), 0);

  const serviceCount = items
    .filter((item) => item.type === T_Ser)
    .reduce((count, item) => count + (parseFloat(item.quantity) || 0), 0);

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

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          {/* Subtotal en COP siempre visible */}
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-600">
              Subtotal (COP):
            </span>
            <span className="font-bold text-gray-900">
              COP {formatCurrency(total)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">
                Total:
              </span>
              {/* TOTAL CONVERTIDO Y SEPARADO */}
              <span className="font-black text-workshop-red text-2xl">
                {baseCurrency.symbol}{" "}
                {formatCurrency(getConvertedAmount(total))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
