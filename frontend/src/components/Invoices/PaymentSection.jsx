/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Currency as CurrencyIcon } from "lucide-react";

const CURRENCIES = {
  PESOS: { name: "Pesos", symbol: "COP", key: "", rate: 1 },
  DOLLARS: { name: "Dolares", symbol: "$", key: "exchange_rate_usd", rate: 1 },
  BOLIVARES: {
    name: "Bolivares",
    symbol: "BS",
    key: "exchange_rate_ves",
    rate: 1,
  },
};

export default function PaymentSection({
  total,
  paidAmount,
  onPaidAmountChange,
  currency,
  onCurrencyChange,
  exchangeRate,
  onExchangeRateChange,
  onProcessPayment,
}) {
  const [remaining, setRemaining] = useState(0);
  const [change, setChange] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchanges, setExchanges] = useState({
    [CURRENCIES.PESOS.key]: 1,
    [CURRENCIES.DOLLARS.key]: 1 / 5000,
    [CURRENCIES.BOLIVARES.key]: 1 / 0.1,
  });

  // Cargar tasas de cambio desde localStorage
  useEffect(() => {
    const newExchanges = { ...exchanges };

    Object.values(CURRENCIES).forEach((curr) => {
      if (curr.key) {
        const rate = localStorage.getItem(curr.key);
        if (rate) {
          newExchanges[curr.key] = 1 / parseFloat(rate);
        }
      }
    });

    setExchanges(newExchanges);
  }, []);

  // Actualizar tasas de cambio cuando cambia la moneda
  useEffect(() => {
    const newRate = exchanges[currency.key] || 1;
    onExchangeRateChange(newRate);
  }, [currency, exchanges, onExchangeRateChange]);

  // Calcular restante y cambio
  useEffect(() => {
    const paidInBaseCurrency = paidAmount / exchangeRate;
    const remainingAmount = Math.max(0, total - paidInBaseCurrency);
    const changeAmount = Math.max(0, paidInBaseCurrency - total);

    setRemaining(remainingAmount);
    setChange(changeAmount);
  }, [paidAmount, total, exchangeRate]);

  const handleAmountPaidChange = (value) => {
    const numValue = parseFloat(value) || 0;
    onPaidAmountChange(numValue);
  };

  const handleCurrencySelect = (currencyName) => {
    const selectedCurrency = Object.values(CURRENCIES).find(
      (c) => c.name === currencyName,
    );
    if (selectedCurrency) {
      onCurrencyChange(selectedCurrency);
    }
  };

  const handleProcessPayment = async () => {
    if (!total) {
      alert("Debes agregar al menos un producto o servicio");
      return;
    }

    if (paidAmount <= 0) {
      alert("Debes ingresar un monto a pagar");
      return;
    }

    // Verificar que el monto pagado sea suficiente si la factura está pendiente
    const paidInBaseCurrency = paidAmount / exchangeRate;
    if (paidInBaseCurrency < total) {
      if (
        !confirm(
          `El monto pagado (${formatCurrency(paidInBaseCurrency)}) es menor que el total (${formatCurrency(total)}). ¿Deseas guardar la factura con saldo pendiente?`,
        )
      ) {
        return;
      }
    }

    setIsProcessing(true);
    try {
      await onProcessPayment();
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      throw error;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getConvertedAmount = (amount) => {
    return amount * exchangeRate;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
            Sección de Pago
          </h3>
          <p className="text-sm text-gray-500">
            Gestiona el monto y la moneda de pago
          </p>
        </div>
      </div>

      {/* Grid principal */}
      <div className="space-y-6">
        {/* Grid de dos columnas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Selección de moneda */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
              <CurrencyIcon className="inline h-4 w-4 mr-2 text-gray-400" />
              Moneda
            </label>
            <select
              value={currency.name}
              onChange={(e) => handleCurrencySelect(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
            >
              {Object.values(CURRENCIES).map((curr) => (
                <option key={curr.name} value={curr.name}>
                  {curr.name} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Total a pagar */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
              <DollarSign className="inline h-4 w-4 mr-2 text-gray-400" />
              Total a pagar
            </label>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-end justify-between">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="font-black text-workshop-red text-2xl">
                  {currency.symbol} {formatCurrency(getConvertedAmount(total))}
                </span>
              </div>
              {currency.name !== "Pesos" && (
                <div className="text-sm text-gray-500 mt-1">
                  Equivalente a ${formatCurrency(total)} COP
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasa de cambio manual (opcional) */}
        {currency.name !== "Pesos" && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tasa de cambio configurada
            </div>
            <div className="text-sm text-gray-600">
              1 COP = {formatCurrency(exchangeRate)} {currency.symbol}
            </div>
          </div>
        )}

        {/* Monto pagado */}
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
            Monto pagado
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="font-black text-gray-400">
                {currency.symbol}
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              value={paidAmount}
              onChange={(e) => handleAmountPaidChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all text-xl font-black text-gray-900"
              placeholder="0.00"
              min="0"
            />
          </div>

          {/* Estado del pago */}
          <div className="grid grid-cols-2 gap-4">
            {/* Restante */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                Restante
              </div>
              <div className="font-black text-yellow-800 text-lg">
                {currency.symbol} {formatCurrency(remaining)}
              </div>
              {remaining > 0 && (
                <div className="text-xs text-yellow-600 mt-1">
                  {formatCurrency(remaining)} en {currency.name}
                </div>
              )}
            </div>

            {/* Cambio */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="text-xs font-bold text-green-600 uppercase tracking-wider">
                Cambio
              </div>
              <div className="font-black text-green-800 text-lg">
                {currency.symbol} {formatCurrency(change)}
              </div>
              {change > 0 && (
                <div className="text-xs text-green-600 mt-1">
                  Devolver al cliente
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de procesar pago */}
        <button
          onClick={handleProcessPayment}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-black uppercase text-white text-sm tracking-wider transition-all ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-workshop-dark hover:bg-workshop-red active:bg-red-700 shadow-lg hover:shadow-red-500/20"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Procesando...
            </div>
          ) : (
            "FACTURAR"
          )}
        </button>

        {/* Mensaje de estado */}
        {paidAmount > 0 && remaining > 0 && (
          <div className="p-4 bg-yellow-100 rounded-xl border border-yellow-200 text-sm text-yellow-800">
            <p className="font-bold">⚠️ Pago incompleto</p>
            <p>
              El monto pagado es menor que el total. La factura se guardará con
              saldo pendiente.
            </p>
          </div>
        )}

        {paidAmount > 0 && change > 0 && (
          <div className="p-4 bg-green-100 rounded-xl border border-green-200 text-sm text-green-800">
            <p className="font-bold">✓ Pago completo</p>
            <p>
              Se debe devolver {currency.symbol} {formatCurrency(change)} al
              cliente.
            </p>
          </div>
        )}

        {paidAmount > 0 &&
          Math.abs(total - paidAmount / exchangeRate) < 0.01 && (
            <div className="p-4 bg-blue-100 rounded-xl border border-blue-200 text-sm text-blue-800">
              <p className="font-bold">⭐ Pago exacto</p>
              <p>El monto pagado coincide exactamente con el total.</p>
            </div>
          )}
      </div>
    </div>
  );
}
