import { useState } from "react";
import {
  AlertTriangle,
  User,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
export default function DebtConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  client,
  total,
  amountPaid,
  currency,
  exchangeRate,
  isProcessing = false,
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const formatCurrency = (amount, symbol = "") => {
    const val = parseFloat(amount) || 0;
    return `${new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val)} ${symbol}`;
  };

  const amountPaidInCOP = amountPaid * (parseFloat(exchangeRate) || 1);
  const debtAmount = Math.max(0, total - amountPaidInCOP);
  const totalInSelectedCurrency = total / (parseFloat(exchangeRate) || 1);
  const shouldShowWarning = amountPaidInCOP == 0;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    setIsConfirmed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${shouldShowWarning ? "bg-red-50" : "bg-yellow-50"}`}
            >
              <AlertTriangle
                className={`h-5 w-5 ${shouldShowWarning ? "text-red-500" : "text-yellow-500"}`}
              />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              {shouldShowWarning ? "Confirmar Deuda" : "Advertencia de Pago"}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-bold text-gray-700 uppercase text-sm">
                Cliente
              </span>
            </div>
            <div className="pl-8">
              <p className="font-black text-lg text-gray-900">{client.name}</p>
              {client.phone && (
                <p className="text-sm text-gray-600 mt-1">
                  Tel: {client.phone}
                </p>
              )}
            </div>
          </div>
          {/* Payment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-bold text-gray-700 uppercase text-sm">
                Resumen de Pago
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Total de la Factura:
                </span>
                <span className="font-black text-gray-900">
                  {formatCurrency(totalInSelectedCurrency, currency.symbol)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monto Pagado:</span>
                <span
                  className={`font-bold ${amountPaid <= 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(amountPaid, currency.symbol)}
                </span>
              </div>
              <>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-red-600 uppercase">
                    Deuda Pendiente:
                  </span>
                  <span className="font-black text-red-600 text-lg text-right">
                    {formatCurrency(
                      debtAmount / (parseFloat(exchangeRate) || 1),
                      currency.symbol,
                    )}
                    {currency.symbol != "COP" && (
                      <>
                        <p className="font-normal text-black text-xs text-right">
                          ({formatCurrency(debtAmount, "COP")})
                        </p>
                      </>
                    )}
                  </span>
                </div>
              </>
            </div>
          </div>
          {/* Warning Message */}
          <div
            className={`p-4 rounded-xl border-l-4 space-y-2 ${shouldShowWarning ? "bg-red-50 border-red-400 text-red-800" : "bg-yellow-50 border-yellow-400 text-yellow-800"}`}
          >
            <div className="flex items-center gap-2">
              {amountPaid <= 0 ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="font-bold text-sm uppercase tracking-wider">
                {amountPaid <= 0 ? "Sin Pago" : "Pago Insuficiente"}
              </span>
            </div>
            <p className="text-sm ml-7">
              {amountPaid <= 0
                ? "¿Estás seguro de crear esta factura sin ningún pago? Esto generará una deuda completa que deberá ser cobrada posteriormente."
                : "¿Estás seguro de crear esta factura con un pago insuficiente? La diferencia se registrará como deuda pendiente."}
            </p>
          </div>
          {/* Dual Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="debt-confirmation"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 text-workshop-red border-gray-300 rounded focus:ring-workshop-red"
            />
            <label
              htmlFor="debt-confirmation"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Confirmo que el cliente acepta la creación de esta deuda y
              entiendo que deberá ser cobrada posteriormente.
            </label>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors uppercase text-sm tracking-wider"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || isProcessing}
            className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase text-sm tracking-wider transition-all ${!isConfirmed || isProcessing ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-workshop-red hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/20"}`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Procesando...
              </div>
            ) : (
              <>
                <CheckCircle className="inline mr-2 h-4 w-4" />
                Confirmar Factura
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
