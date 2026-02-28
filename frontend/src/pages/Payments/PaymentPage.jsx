import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import ClientSearch from "../../components/Invoices/ClientSearch";
import FormPayment from "./FormPayment";
import { UserCircle, DollarSign, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function PaymentPage() {
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearchText, setClientSearchText] = useState("");
    const [totalDebt, setTotalDebt] = useState(null);
    const [readyForPayment, setReadyForPayment] = useState(false);
    const [change, setChange] = useState(null);
    const [error, setError] = useState("");

    const handleClientSelect = (client) => {
        setError("");
        setChange(null);
        setSelectedClient(client);
        handleDebtClient(client);
        setClientSearchText("");
    };

    const handleClientClear = () => {
        setError("");
        setChange(null);
        setSelectedClient(null);
        setClientSearchText("");
        setTotalDebt(null);
    };

    const handleDebtClient = async (client) => {
        if (!client) return;
        try {
            const data = await api.get(`/debtClient/${client.id}`);
            setTotalDebt((data.total_debt ?? data.data?.total_debt ?? 0));
        } catch (e) {
            if(e.response && e.response.status === 404){
                setTotalDebt(null);
                setError("El cliente no tiene deuda!")
            }else {
                setError("Hubo un problema al cargar la deuda del cliente.");
            }
        }
    }

    const handlePaymentClient = async (paymentData) => {
        setError("");
        try {
            const response = await api.post('/paymentClient', paymentData);
            const changeAmount = response.data?.change ?? response.data.change  ?? 0;

            setChange((changeAmount));
            setReadyForPayment(false);
            
        } catch (e) {
            const errorMsg = e.response?.data?.message || "No se pudo registrar el pago.";
            setError(errorMsg);
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        Gestión de <span className="text-workshop-red">Pagos</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">Gestiona tu base de datos activa.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">

                {/* Alerta de Error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3 text-red-800">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm uppercase tracking-tight">{error}</span>
                        </div>
                        <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 font-black">X</button>
                    </div>
                )}

                <div className="flex flex-col gap-8">
                    
                    {/* Fila 1: Búsqueda de Cliente */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <UserCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 uppercase tracking-tighter text-xl leading-none">Cliente</h2>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Busca al deudor</p>
                            </div>
                        </div>

                        <ClientSearch
                            searchText={clientSearchText}
                            onSearchTextChange={setClientSearchText}
                            selectedClient={selectedClient}
                            onClientSelect={handleClientSelect}
                            onClear={handleClientClear}
                        />
                    </div>

                    {/* Fila 2: Resumen de Deuda (Solo visible si hay cliente seleccionado) */}
                    {selectedClient && (totalDebt !== null) && (
                        <div className="bg-white rounded-3xl p-8 text-white shadow-xl animate-in fade-in slide-in-from-bottom-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Deuda Actual Total</p>
                            <h2 className="text-4xl font-black italic tracking-tighter mb-6 text-black">
                                ${totalDebt.toLocaleString()} <span className="text-sm font-black text-workshop-red ml-1">COP</span>
                            </h2>
                            
                            {!readyForPayment && change === null && (
                                <button 
                                    onClick={() => setReadyForPayment(true)}
                                    className="w-full bg-workshop-red hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95"
                                >
                                    REGISTRAR NUEVO ABONO
                                </button>
                            )}
                        </div>
                    )}

                    {/* Fila 3: Formulario de Pago Dinámico */}
                    {readyForPayment && selectedClient && (
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-lg animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase tracking-tighter text-lg text-workshop-dark">Detalles del Pago</h3>
                                <button 
                                    onClick={() => setReadyForPayment(false)}
                                    className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 hover:text-workshop-red transition-colors"
                                >
                                    <ArrowLeft size={14} /> Cancelar
                                </button>
                            </div>
                            <FormPayment 
                                totalDebtCOP={totalDebt} 
                                clientId={selectedClient.id}
                                onSubmitPayment={handlePaymentClient}
                            />
                        </div>
                    )}

                    {/* Fila 4: Tarjeta de Cambio / Éxito */}
                    {change !== null && (
                        <div className="bg-green-50 border border-green-200 rounded-3xl p-8 animate-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center gap-3 mb-4 text-green-700">
                                <CheckCircle size={28} />
                                <h4 className="font-black uppercase tracking-tighter text-xl leading-none">¡Pago Exitoso!</h4>
                            </div>
                            <div className="space-y-1 mb-6">
                                <p className="text-[10px] font-black text-green-600/60 uppercase tracking-widest">Vuelto</p>
                                <p className="text-3xl font-black italic text-green-800">${change.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => { 
                                            setChange(null)
                                            handleClientClear();
                                            }
                                        }
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest transition-all"
                            >
                                ENTENDIDO
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}