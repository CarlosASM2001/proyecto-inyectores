import { useEffect, useRef, useState } from "react";
import api from "../../service/api_Authorization";
import ClientSearch from "../../components/Invoices/ClientSearch";


export default function PaymentPage (){
    //Cliente del pago
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearchText, setClientSearchText] = useState("");

    //Deuda del cliente
    const [totalDebt, setTotalDebt] = useState(0);

    //Pago a realizar 
    const [payment, setPayment] = useState(0);
    const [readyForPayment, setReadyForPayment] = useState(false);

    // Handlers de cliente
    const handleClientSelect = (client) => {
        setSelectedClient(client);
        handleDebtClient(client);
        setClientSearchText("");
    };

    const handleClientClear = () => {
        setSelectedClient(null);
        setClientSearchText("");
    };

    // Handlers de la deuda
    const handleDebtClient = async (client) => {
        if(!client){
            console.error("El cliente no existe");
            return;
        }

        try {
            const data = await api.get(`/debtClient/${client.id}`);
            setTotalDebt((data.total_debt ?? data.data.total_debt ?? 0));
        } catch (e) {
            console.error("Error al obtener deuda", e);
        }
    }

    //Handlers del pago
    const handlePaymentClient = async (payment) => {
        
    }

    return (

        <div>
            <ClientSearch
                searchText={clientSearchText}
                onSearchTextChange={setClientSearchText}
                selectedClient={selectedClient}
                onClientSelect={handleClientSelect}
                onClear={handleClientClear}
            />

            {selectedClient && (
                <div>
                    <h3>Resumen de deudas</h3>
                    <p>Total en deuda: ${totalDebt}</p>

                    <button
                        onClick={() => setReadyForPayment(true)}                       
                    >
                        Crear pago
                    </button>

                    { readyForPayment && (
                        <div className="payment-form">
                            <form action="">
                                <input type="number" />
                                <input type="submit" />
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
        
    );
}