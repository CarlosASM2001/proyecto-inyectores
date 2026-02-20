import { T_Pro, T_Ser } from "../../Misc/Definitions";
import api from "../api_Authorization";

async function Facturar(Items_General, Cliente, TotalPagar, Pagos) {
  const Producs = FormatProducts(Items_General.filter((p) => p.type == T_Pro));
  const Services = await FormatServices(
    Items_General.filter((p) => p.type == T_Ser),
  );

  const user_id = JSON.parse(localStorage.getItem("user")).id;

  const obj = {
    producs: Producs,
    services: Services,
    id_client: Cliente.id,
    totalPagar: TotalPagar,
    pagos: Pagos,
    user_id: user_id,
  };

  try {
    const resp = await api.post("invoices/to_invoice", obj);

    return {
      status: "OK",
      msg: resp.data.message,
      data: resp.data,
    };
  } catch (error) {
    console.log({
      status: "Error, Status: " + error.status,
      msg: error.response.data.message + ": " + error.response.data.error,
      data: error.response.data,
    });
    return {
      status: "Error",
      msg: error.response.data.message + ": " + error.response.data.error,
      data: error.response.data,
    };
  }
}

function FormatProducts(Producs) {
  return Producs.map((p) => ({
    id: p.id,
    quantity: p.quantity_ ?? p.quantity,
    unitary_price: p.price_ ?? p.price,
  }));
}

function FormatServices(Servs) {
  return Servs.map((sv) => {
    const serv = {
      id: sv.id,
      quantity: sv.quantity_ ?? sv.quantity,
      unitary_price: sv.base_price_ ?? sv.base_price,
      products: sv.products ? FormatProducts(sv.products) : [],
    };
    return serv;
  });
}

export default Facturar;
