import { useEffect, useRef, useState } from "react";
import api from "../../service/api_Authorization";
import ClientSearch from "../../components/Invoices/ClientSearch";


export default function PaymentPage (){
    //Cliente del pago
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientSearchText, setClientSearchText] = useState("");

    // Handlers de cliente
    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setClientSearchText("");
    };

    const handleClientClear = () => {
        setSelectedClient(null);
        setClientSearchText("");
    };

    // Handlers de la deuda
    const handleDebtClient = () => {
        
    }

    return (

        <ClientSearch
            searchText={clientSearchText}
            onSearchTextChange={setClientSearchText}
            selectedClient={selectedClient}
            onClientSelect={handleClientSelect}
            onClear={handleClientClear}
        />
    );
}