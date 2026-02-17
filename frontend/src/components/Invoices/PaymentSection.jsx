import { CreditCard, RefreshCw } from "lucide-react";
import { CURRENCIES } from "../../hooks/useCurrency";

export default function PaymentSection({
  total,
  paidAmount,
  onPaidAmountChange,
  currency,
  onCurrencyChange,
  exchangeRate,
  onProcessPayment,
}) {
  const formatCurrency = (amount) => {
    const val = parseFloat(amount) || 0;
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Calcular total convertido con la tasa automática
  // Si exchangeRate es 1 (COP), simplemente toma el total.
  // Si exchangeRate es diferente (ej. 0.00025 para USD), multiplica.
  const totalInSelectedCurrency = total / (parseFloat(exchangeRate) || 1);

  // Calcular cambio (vuelto)
  const change = (parseFloat(paidAmount) || 0) - totalInSelectedCurrency;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6 sticky top-6">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <CreditCard className="text-workshop-red" size={24} />
        <h3 className="font-black text-gray-900 uppercase tracking-tight">
          Detalles del Pago
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Selector de Moneda */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Moneda de Pago
          </label>
          <div className="relative">
            <select
              value={currency.name}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-workshop-red focus:border-workshop-red block w-full p-3 font-bold outline-none cursor-pointer"
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.name} value={curr.name}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <RefreshCw size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* CAJA DE TOTAL A PAGAR */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center text-center space-y-2">
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Total a Pagar
        </span>
        <div className="flex items-baseline justify-center gap-2 flex-wrap">
          {/* Símbolo de la moneda */}
          <span className="text-2xl font-black text-gray-500">
            {currency.symbol}
          </span>
          {/* Monto Grande */}
          <span className="text-4xl font-black text-workshop-red tracking-tight">
            {formatCurrency(totalInSelectedCurrency)}
          </span>
        </div>

        {/* Solo mostrar equivalencia si no son pesos */}
        {currency.name !== "Pesos" && (
          <span className="text-xs font-medium text-gray-400">
            (Equivalente a COP {formatCurrency(total)})
          </span>
        )}
      </div>

      {/* Input Monto Recibido DINÁMICO */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Monto Recibido
        </label>
        <div className="relative">
          {/* Símbolo dinámico dentro del input */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500 font-bold text-lg">
              {currency.symbol}
            </span>
          </div>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => onPaidAmountChange(e.target.value)}
            // Padding izquierdo grande para acomodar simbolos largos como 'COP'
            className="w-full pl-14 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-red-50 focus:border-workshop-red outline-none font-black text-xl text-gray-900 placeholder-gray-300"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Visualización del Cambio/Vuelto */}
      {(parseFloat(paidAmount) || 0) > 0 && (
        <div
          className={`p-4 rounded-xl border flex justify-between items-center ${
            change >= -0.01
              ? "bg-green-50 border-green-100 text-green-700"
              : "bg-red-50 border-red-100 text-red-700"
          }`}
        >
          <span className="text-xs font-black uppercase tracking-widest">
            {change >= -0.01 ? "Cambio / Vuelto" : "Faltante"}
          </span>
          <span className="text-lg font-black">
            {currency.symbol} {formatCurrency(Math.abs(change))}
          </span>
        </div>
      )}

      <button
        onClick={onProcessPayment}
        className="w-full bg-workshop-dark text-white font-black py-4 rounded-xl hover:bg-workshop-red transition-all shadow-lg hover:shadow-red-900/20 active:scale-[0.98] uppercase text-sm tracking-widest flex items-center justify-center gap-2"
      >
        <CreditCard size={18} />
        Confirmar Factura
      </button>
    </div>
  );
}
