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

  console.log(obj);

  const resp = await api.post("invoices/to_invoice", obj);

  if (resp.status == 201) {
    return {
      msg: "Factura generada correctamente",
      data: resp.data,
    };
  } else {
    console.log("Error al facturar, status:", resp.status, "data:", resp.data);
    return {
      msg: "Error al generar la factura",
      data: resp.data,
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
