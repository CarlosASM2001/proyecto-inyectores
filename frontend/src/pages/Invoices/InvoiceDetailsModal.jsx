import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import {
  X,
  Printer,
  User,
  Calendar,
  CreditCard,
  Package,
  Wrench,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function InvoiceDetailsModal({ invoiceId, onClose }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/invoices/${invoiceId}`);
        setInvoice(data.data ?? data);
      } catch (error) {
        console.error("Error al cargar la factura", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-workshop-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black text-gray-500 uppercase tracking-widest text-xs">
            Cargando Factura...
          </p>
        </div>
      </div>
    );
  }

  if (!invoice) return null;

  const isPaid =
    invoice.status?.toLowerCase() === "pagada" ||
    invoice.status?.toLowerCase() === "paid";
  const invoiceNumber = `#INV-${invoice.id.toString().padStart(5, "0")}`;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
      {/* CARD MODAL */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full">
        {/* HEADER */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-start print:hidden">
          <div>
            <h3 className="text-2xl font-black tracking-tighter text-gray-900 uppercase leading-none">
              {invoiceNumber}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Detalles de la Factura
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-500 hover:text-workshop-dark hover:bg-gray-200 rounded-xl transition-all"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* CONTENIDO (Imprimible) */}
        <div className="grow overflow-y-auto p-8 print:p-0">
          {/* Banner Estado y Fecha */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl ${isPaid ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
              >
                {isPaid ? <CheckCircle size={28} /> : <Clock size={28} />}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Estado
                </p>
                <p
                  className={`text-xl font-black uppercase tracking-tighter ${isPaid ? "text-green-600" : "text-orange-600"}`}
                >
                  {invoice.status}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1">
                <Calendar size={12} /> Fecha de Emisión
              </p>
              <p className="font-bold text-gray-900">{invoice.date}</p>
            </div>
          </div>

          {/* Tarjeta de Cliente */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <User size={14} /> Facturado A:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-black text-gray-900 text-lg uppercase leading-tight">
                  {invoice.client?.name || "Cliente General"}
                </p>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  C.I: {invoice.client?.cedula || "N/A"}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-600 font-medium">
                  Telf: {invoice.client?.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de Items */}
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
            Detalle de Conceptos
          </h4>

          <div className="space-y-3 mb-8">
            {/* SERVICIOS */}
            {invoice.services &&
              invoice.services.map((serv, idx) => (
                <div
                  key={`serv-${idx}`}
                  className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{serv.name}</p>
                      <p className="text-xs text-gray-500">
                        {serv.quantity}x $
                        {Number(serv.unitary_price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900">
                    ${Number(serv.subtotal).toLocaleString()}
                  </p>
                </div>
              ))}

            {/* PRODUCTOS */}
            {invoice.products &&
              invoice.products.map((prod, idx) => {
                // Si tiene service_id != -1, significa que es un repuesto usado dentro de un servicio (si quieres mostrarlo diferente)
                const isPart = prod.service_id && prod.service_id !== -1;
                return (
                  <div
                    key={`prod-${idx}`}
                    className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl shadow-sm ml-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${isPart ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-600"}`}
                      >
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {prod.name}{" "}
                          {isPart && (
                            <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 ml-2 uppercase">
                              Repuesto
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {prod.quantity}x $
                          {Number(prod.unitary_price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">
                      ${Number(prod.subtotal).toLocaleString()}
                    </p>
                  </div>
                );
              })}

            {!invoice.services?.length && !invoice.products?.length && (
              <p className="text-sm text-gray-400 italic text-center py-4">
                No se encontraron items. (Actualiza el backend como se indica).
              </p>
            )}
          </div>

          {/* TOTALES */}
          <div className="flex justify-end pt-4 border-t-2 border-dashed border-gray-200">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between items-center text-xl">
                <span className="font-black text-gray-900 uppercase tracking-tighter">
                  Total a Pagar
                </span>
                <span className="font-black text-workshop-red">
                  ${Number(invoice.total_value).toLocaleString()}
                </span>
              </div>

              {/* Si hay pagos, mostrarlos */}
              {invoice.payments && invoice.payments.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <CreditCard size={12} /> Pagos Registrados
                  </p>
                  {invoice.payments.map((pay, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm mb-1 text-gray-600"
                    >
                      <span>
                        {pay.currency} (Tasa: {pay.reference})
                      </span>
                      <span className="font-bold text-green-600">
                        ${Number(pay.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER FIJO */}
        <div className="shrink-0 px-8 py-5 bg-gray-50 border-t border-gray-200 print:hidden">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-workshop-dark text-white font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
