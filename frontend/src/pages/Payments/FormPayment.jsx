import { useEffect, useState } from 'react';
import { Save, Calendar, Info, Banknote } from 'lucide-react';

export default function FormPayment({ totalDebtCOP, clientId, onSubmitPayment }) {
    const rateUSD = parseFloat(localStorage.getItem('exchange_rate_usd')) || 1;
    const rateVES = parseFloat(localStorage.getItem('exchange_rate_ves')) || 1;

    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("COP");
    const [reference, setReference] = useState(0);
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if(currency === "USD") setReference(rateUSD);
        else if (currency === "VES") setReference(rateVES);
        else setReference(1);
    }, [currency, rateUSD, rateVES]);

    const calculateDisplayedDebt = () => {
        if (currency === "USD") return (totalDebtCOP / rateUSD).toFixed(2);
        if (currency === "VES") return (totalDebtCOP * rateVES).toFixed(2);
        return totalDebtCOP.toLocaleString();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const paymentData = {
            date,
            amount: parseFloat(amount),
            currency,
            reference: parseFloat(reference), 
            description,
            client_id: clientId
        };
        onSubmitPayment(paymentData);
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red outline-none transition-all text-sm";
    const labelClass = "block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between mb-2">
                <span className={labelClass + " mb-0"}>Saldo en {currency}</span>
                <span className="font-black text-workshop-dark text-lg italic">
                    {calculateDisplayedDebt()}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}><Calendar size={10} className="inline mr-1"/> Fecha</label>
                    <input type="date" required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>Moneda</label>
                    <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="COP">COP - Pesos</option>
                        <option value="USD">USD - Dólar</option>
                        <option value="VES">VES - Bolívar</option>
                    </select>
                </div>
            </div>

            <div>
                <label className={labelClass}><Banknote size={10} className="inline mr-1"/> Monto a Abonar ({currency})</label>
                <input 
                    type="number" step="0.01" required placeholder="0.00"
                    className={inputClass + " text-lg text-workshop-red"} 
                    value={amount} onChange={(e) => setAmount(e.target.value)} 
                />
            </div>

            <div>
                <label className={labelClass}><Info size={10} className="inline mr-1"/> Concepto / Descripción</label>
                <input 
                    type="text" required placeholder="Ej: Pago parcial servicio motor"
                    className={inputClass} 
                    value={description} onChange={(e) => setDescription(e.target.value)} 
                />
            </div>

            <div className="pt-2">
                <button 
                    type="submit" 
                    className="w-full bg-workshop-dark text-white font-black py-4 rounded-xl hover:bg-workshop-red transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg active:scale-95"
                >
                    <Save size={18} /> Procesar Abono
                </button>
                <p className="text-center mt-3 text-[12px] font-bold text-gray-400 uppercase tracking-tighter">
                    Tasa de cambio del sistema: <span className="text-workshop-dark">{parseFloat(reference)}</span>
                </p>
            </div>
        </form>
    );
}