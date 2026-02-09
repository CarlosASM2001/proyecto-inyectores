import { T_Pro, T_Ser } from "../../Misc/Definitions";
import api from "../api_Authorization";

async function Facturar(Items_General, Cliente, TotalPagar, Pagos) {
  const Producs = FormatProducts(Items_General.filter((p) => p.type == T_Pro));
  const Services = FormatServices(Items_General.filter((p) => p.type == T_Ser));

  const user_id = localStorage.getItem("user").id;

  const resp = await api.post("invoices/to_invoice", {
    producs: Producs,
    services: Services,
    id_client: Cliente.id,
    totalPagar: TotalPagar,
    pagos: Pagos,
    user_id: user_id
  });

  if (resp.status == 201) {
    return true;
  } else {
    console.log("Error al facturar, status:", resp.status, "data:", resp.data);
    return false;
  }
}

function FormatProducts(Producs) {
  return Producs.map((p) => ({
    id: p.id,
    quantity: p.quantity_ ?? p.quantity,
    unitary_price: p.price_ ?? p.price_,
  }));
}

function FormatServices(Servs) {
  return Servs.map((sv) => {
    const serv = {
      id: sv.id,
      quantity: sv.quantity_ ?? sv.quantity,
      unitary_price: sv.base_price_ ?? sv.base_price,
      products: sv.products ? [] : sv.products.map((p) => FormatProducts(p)),
    };
    return serv;
  });
}

export default Facturar;
