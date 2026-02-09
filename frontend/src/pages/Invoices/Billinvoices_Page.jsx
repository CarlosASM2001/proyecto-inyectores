import { useState } from "react";
import api from "../../service/api_Authorization";
import { T_Ser } from "../../Misc/Definitions";
import Facturar from "../../service/Invoices/Facturar";

function Billinvoices_Page() {
  const formateador = new Intl.NumberFormat("es-VE", {
    style: "decimal",
    minimumFractionDigits: 2,
  });

  const TipoMoneda_Array = ["Pesos", "Dolares", "Bolivares"];
  const TipoMonedaKey_Array = ["", "exchange_rate_usd", "exchange_rate_ves"];
  const TipoMoneda_Array_Sim = ["COP", "$", "BS"];

  const [Producto_List, setProducto_List] = useState([]);
  const [ProductSelect_aux, setProductSelect_aux] = useState();
  const [Products_Invoce, setProductos_Invoce] = useState([]);
  const [ProductoService, setProductoService] = useState([]);

  const [ClientsList, setClientsList] = useState([]);
  const [ClientSelect, setClientSelect] = useState();

  const [Typing, setTyping] = useState(false);
  const [TextSearchPro, SetTextSearchPro] = useState("");
  const [TextSearchCli, SetTextSearchCli] = useState("");
  const [TextCant, SetTextCant] = useState("");
  const [TextPagado, SetTextPagado] = useState(0);
  const [Msg_Fact, SetMsg_Fact] = useState("...");

  const [PrecioTotal, SetPrecioTotal] = useState(0);
  const [Cambio, SetCambio] = useState(1);
  const [TipoMoneda_value, SetTipoMoneda_value] = useState(1);

  const [TipoMoneda, SetTipoMoneda] = useState(TipoMoneda_Array[0]);
  const [TipoMoneda_sim, SetTipoMoneda_sim] = useState(TipoMoneda_Array_Sim[0]);

  const fun_SeachPro = (Text) => {
    if (Text.length > 2 && !Typing) {
      setTyping(true);
      setProductSelect_aux(null);
      setProductoService([]);
      api.post("/products/Like", { Seach: Text }).then((res) => {
        api.post("/services/Like", { Seach: Text }).then((res1) => {
          setProducto_List((prev) => {
            const Nw = prev.map((p) => p);
            res1.data.data.map((s) => Nw.push(s));
            setTyping(false);
            return Nw;
          });
        });
        setProducto_List(res.data.data);
      });
    } else {
      setProducto_List([]);
      setProductSelect_aux(null);
    }
  };

  const fun_SeachCli = (txt) => {
    if (txt.length > 2 && !Typing) {
      setClientSelect(null);
      setTyping(true);
      setClientsList([]);
      api.post("/clients/Like", { Seach: txt }).then((resp) => {
        setClientsList(resp.data.data);
        setTyping(false);
      });
    } else {
      setClientsList([]);
      setClientSelect(null);
    }
  };

  const fun_AddProduct = (item) => {
    if (!isNaN(TextCant)) {
      item.quantity = parseFloat(TextCant);

      setProductos_Invoce((prev) => {
        const Lis = prev.map((s) => s);
        Lis.push(item);
        return Lis;
      });

      if (item.type == T_Ser) {
        item.products = ProductoService;
        SetPrecioTotal((prev) => prev + item.subtotal);
      } else {
        SetPrecioTotal((prev) => prev + item.price * item.quantity);
      }

      SetTextSearchPro("");
      SetTextCant("");
      setProductoService([]);
      setProductSelect_aux(null);
    }
  };

  const fun_SelectProduct = (Pro) => {
    if (Pro.type == T_Ser) {
      api.get("/services/" + Pro.id + "/products").then((res) => {
        const Pros_ser = res.data.data;
        let SubTotalPro = parseFloat(Pro.base_price);
        SubTotalPro += Pros_ser.reduce(
          (Sum, p) => Sum + (p.price_ ?? p.price) * (p.quantity_ ?? p.quantity),
          0,
        );
        Pro.subtotal = SubTotalPro;
        setProductoService(Pros_ser);
      });
    }
    SetTextCant(1);
    SetTextSearchPro("");
    setProducto_List([]);
    setProductSelect_aux(Pro);
  };

  const fun_SelectCli = (Cli) => {
    setClientsList([]);
    setClientSelect(Cli);
    SetTextSearchCli("");
  };

  const CambiarSimbo = (Txt) => {
    const n = TipoMoneda_Array.findIndex((t) => t == Txt);
    SetTipoMoneda(TipoMoneda_Array[n]);
    SetTipoMoneda_sim(TipoMoneda_Array_Sim[n]);
    const cm = localStorage.getItem(TipoMonedaKey_Array[n]);
    if (cm != null) {
      SetCambio(1 / cm);
      SetTipoMoneda_value(cm);
    } else {
      SetCambio(1);
      SetTipoMoneda_value(1);
    }
  };

  const fun_AddCantPro_Service = (item, cant) => {
    const c = parseFloat(cant);
    if (item.type == T_Ser) {
      if (parseFloat(cant) != null) {
        item.base_price_ = parseFloat(item.base_price) * c;

        let axPrice = 0;
        let ax_pro = ProductoService.map((p) => {
          p.price_ = p.price * c;
          p.quantity_ = p.quantity * c;
          axPrice += (p.price + p.quantity) * c;
          return p;
        });

        item.subtotal = axPrice + parseFloat(item.base_price);

        setProductoService(ax_pro);
      }
    } else {
      item.price_ = item.price * c;
    }
  };

  const fun_deleteProService = (item) => {
    if (item.type == T_Ser) {
      SetPrecioTotal((prev) => prev - item.subtotal);
    } else {
      SetPrecioTotal((prev) => prev - (item.price_ ?? item.price));
    }
    setProductos_Invoce((prev) => {
      return prev.filter((p) => p.id != item.id);
    });
  };

  const to_invoice = async () => {
    const resp = await Facturar(Products_Invoce, ClientSelect, PrecioTotal, {
      amount: parseFloat(TextPagado),
      currency: TipoMoneda,
      reference: TipoMoneda_value,
    });

    SetMsg_Fact(resp.msg);
  };

  return (
    <>
      <h1>Facturación</h1>
      <hr />
      <form>
        <div>
          <label htmlFor="ClientName">Buscar Cliente:</label>
          <input
            type="text"
            name="ClientName"
            id="ClientName"
            value={TextSearchCli}
            onChange={(e) => {
              SetTextSearchCli(e.target.value);
              fun_SeachCli(e.target.value);
            }}
          />
          {ClientSelect ? (
            <>
              <p>
                °{ClientSelect.name} : {ClientSelect.cedula}°
              </p>
            </>
          ) : (
            <>
              <ul>
                {ClientsList.map((c) => (
                  <li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        fun_SelectCli(c);
                      }}
                    >
                      {c.name} : {c.cedula}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <hr />
        <div>
          <label htmlFor="ProductName">Buscar Producto:</label>
          <input
            type="text"
            name="ProductName"
            id="ProductName"
            value={TextSearchPro}
            onChange={(e) => {
              SetTextSearchPro(e.target.value);
              fun_SeachPro(e.target.value);
            }}
          />
          {ProductSelect_aux ? (
            <>
              {ProductSelect_aux.type == T_Ser ? (
                <div>
                  <p>
                    {ProductSelect_aux.name} :{" "}
                    {formateador.format(
                      ProductSelect_aux.base_price_ ??
                        ProductSelect_aux.base_price,
                    )}
                  </p>
                  {ProductoService.length > 0 && (
                    <div>
                      <p>---</p>
                      <ul>
                        {ProductoService.length > 0 &&
                          ProductoService.map((p) => (
                            <li>
                              {p.name} |{" "}
                              {formateador.format(p.quantity_ ?? p.quantity)} |{" "}
                              {formateador.format(
                                (p.price_ ?? p.price) *
                                  (p.quantity_ ?? p.quantity) *
                                  Cambio,
                              )}
                            </li>
                          ))}
                      </ul>
                      <p>
                        Sub Total:{" "}
                        {formateador.format(ProductSelect_aux.subtotal)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p>
                  {ProductSelect_aux.name} :{" "}
                  {formateador.format(
                    ProductSelect_aux.price_ ?? ProductSelect_aux.price,
                  )}{" "}
                  : {formateador.format(ProductSelect_aux.actual_stock)}
                </p>
              )}
            </>
          ) : (
            <ul>
              {Producto_List.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fun_SelectProduct(p);
                    }}
                  >
                    {p.type == T_Ser ? (
                      <span>
                        {p.name} : {formateador.format(p.base_price)}
                      </span>
                    ) : (
                      <span>
                        {p.name} : {formateador.format(p.price)} :{" "}
                        {formateador.format(p.actual_stock)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <hr />
        <label htmlFor="Cant">Cantidad Del Producto</label>
        <input
          type="text"
          name="Cant"
          id="Cantidad"
          value={TextCant}
          onChange={(e) => {
            SetTextCant(e.target.value);
            if (ProductSelect_aux)
              fun_AddCantPro_Service(ProductSelect_aux, e.target.value);
          }}
        />
        <hr />
        <button
          onClick={(e) => {
            e.preventDefault();
            fun_AddProduct(ProductSelect_aux);
          }}
        >
          Agregar
        </button>
        <hr />
        <ul>
          {Products_Invoce.map((item) => (
            <li key={item.id + "_" + item.type}>
              {item.type == T_Ser ? (
                <div>
                  <span>
                    {item.name} : {item.quantity} :{" "}
                    {formateador.format(
                      item.base_price * item.quantity * Cambio,
                    )}{" "}
                    :{" "}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fun_deleteProService(item);
                    }}
                  >
                    Borrar
                  </button>
                  <ul>
                    {item.products.map((p1) => {
                      return (
                        <li key={p1.id + "Sp" + item.id}>
                          {p1.name} : {p1.quantity_ ?? p1.quantity} :{" "}
                          {formateador.format(
                            (p1.price_ ?? p1.price) *
                              (p1.quantity_ ?? p1.quantity) *
                              Cambio,
                          )}{" "}
                          :{" "}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <>
                  <span>
                    {item.name} : {item.quantity} :{" "}
                    {formateador.format(item.price * item.quantity * Cambio)}{" "}
                    :{" "}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fun_deleteProService(item);
                    }}
                  >
                    Borrar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
        <hr />
        <ul>
          <li>
            <select
              name="TipoMoneda"
              id="TipoMoneda"
              onChange={(e) => {
                CambiarSimbo(e.target.value);
              }}
            >
              {TipoMoneda_Array.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </li>
          <li>
            <p>
              Precio Total: {formateador.format(PrecioTotal * Cambio)}{" "}
              <span>{TipoMoneda_sim}</span>
            </p>
          </li>
          <li>
            <label htmlFor="txt_CantPag">Cantidad Pagada</label>
            <input
              type="text"
              name="txt_CantPag"
              id="txt_CantPag"
              value={TextPagado}
              onChange={(e) => {
                SetTextPagado(e.target.value);
              }}
            />
            <span>{TipoMoneda_sim}</span>
          </li>
          <li>
            <label>Restante: </label>
            <label>
              <span>
                {PrecioTotal - TextPagado / Cambio > 0
                  ? formateador.format(
                      (PrecioTotal - TextPagado / Cambio) * Cambio,
                    )
                  : "---"}{" "}
              </span>
            </label>
            <span>{TipoMoneda_sim}</span>
          </li>
        </ul>
        <button
          onClick={(e) => {
            e.preventDefault();
            to_invoice();
          }}
        >
          Facturar
        </button>
        {Msg_Fact != "" && <p>{Msg_Fact}</p>}
      </form>
    </>
  );
}

export default Billinvoices_Page;
