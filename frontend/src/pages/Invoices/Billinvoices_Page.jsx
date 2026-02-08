import { useState } from "react";
import api from "../../service/api_Authorization";

function Billinvoices_Page() {
  const T_Ser = "Service";
  const T_Pro = "Product";
  const TipoMoneda_Array = ["Pesos", "Dolares", "Bolivares"];
  const TipoMonedaKey_Array = ["", "exchange_rate_usd", "exchange_rate_ves"];
  const TipoMoneda_Array_Sim = ["P$", "$", "Bs"];

  const [Producto_List, setProducto] = useState([]);
  const [ProductSelect_aux, setProductoSelect] = useState();
  const [Products_Invoce, setProductos_Invoce] = useState([]);
  const [ProductoService, setProductoService] = useState([]);

  const [ClientsList, setClientsList] = useState([]);
  const [ClientSelect, setClientSelect] = useState();

  const [Typing, setTyping] = useState(false);
  const [TextSearchPro, SetTextSearchPro] = useState("");
  const [TextSearchCli, SetTextSearchCli] = useState("");
  const [TextCant, SetTextCant] = useState("");

  const [Cambio, SetCambio] = useState(1);
  const [PrecioTotal, SetPrecioTotal] = useState(0);

  const [TipoMoneda, SetTipoMoneda] = useState(TipoMoneda_Array[0]);
  const [TipoMoneda_sim, SetTipoMoneda_sim] = useState(TipoMoneda_Array_Sim[0]);

  const fun_SeachPro = (Text) => {
    if (Text.length > 2 && !Typing) {
      setTyping(true);
      setProductoService([]);
      api.post("/products/Like", { Seach: Text }).then((res) => {
        api.post("/services/Like", { Seach: Text }).then((res1) => {
          setProducto((prev) => {
            const Nw = prev.map((p) => p);
            res1.data.data.map((s) => Nw.push(s));
            setTyping(false);
            return Nw;
          });
        });
        setProducto(res.data.data);
      });
    } else {
      setProducto([]);
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
    }
  };

  const fun_AddProduct = (item) => {
    if (!isNaN(TextCant)) {
      item.Cant = parseFloat(TextCant);

      setProductos_Invoce((prev) => {
        const Lis = prev.map((s) => s);
        Lis.push(item);
        return Lis;
      });

      if (item.type == T_Ser) item.products = ProductoService;

      let price = item.type == T_Ser ? item.base_price : item.price;

      SetPrecioTotal((prev) => prev + price * item.Cant);
      SetTextSearchPro("");
      SetTextCant("");
      setProductoService([]);
      setProductoSelect(null);
    }
  };

  const fun_SelectProduct = (Pro) => {
    if (Pro.type == T_Ser) {
      api.get("/services/" + Pro.id + "/products").then((res) => {
        setProductoService(res.data.data);
      });
    }
    SetTextCant(1);
    SetTextSearchPro(Pro.name);
    setProducto([]);
    setProductoSelect(Pro);
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
    } else {
      SetCambio(1);
    }
  };

  const fun_AddCantPro_Service = (Pro, cant) => {
    if (Pro.type == T_Ser) {
      if (parseFloat(cant) != null) {
        console.log(cant);
        const c = parseFloat(cant);

        let ax_pro = ProductoService.map((p) => {
          p.price_ = p.price * c;
          p.quantity_ = p.quantity * c;
          return p;
        });

        setProductoService(ax_pro);
      }
    }
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
                      {p.name} : {p.base_price}
                    </span>
                  ) : (
                    <span>
                      {p.name} : {p.price} : {p.actual_stock}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
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
        <ul>
          {ProductoService.length > 0 &&
            ProductoService.map((p) => (
              <li>
                {p.name} | {p.quantity_ ?? p.quantity} |{" "}
                {(p.price_ ?? p.price) * Cambio}
              </li>
            ))}
        </ul>
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
          {Products_Invoce.map((p) => (
            <li key={p.id + "H" + p.type}>
              {p.type == T_Ser ? (
                <span>
                  {p.name} : {p.Cant} : {p.base_price * p.Cant} :{" "}
                </span>
              ) : (
                <span>
                  {p.name} : {p.Cant} : {p.price * p.Cant} :{" "}
                </span>
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
              Precio Total: {PrecioTotal * Cambio} <span>{TipoMoneda_sim}</span>
            </p>
          </li>
        </ul>
        <button>Facturar</button>
      </form>
    </>
  );
}

export default Billinvoices_Page;
