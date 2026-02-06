import { useState } from "react";
import api from "../../service/api_Authorization";
import { Contrast } from "lucide-react";

function Billinvoices_Page() {
  const T_Ser = "Service";
  const T_Pro = "Product";
  const TipoMoneda_Array = ["Pesos", "Dolares", "Bolivares"];
  const TipoMonedaKey_Array = ["", "exchange_rate_usd", "exchange_rate_ves"];
  const TipoMoneda_Array_Sim = ["P$", "$", "Bs"];

  const [Producto, setProducto] = useState([]);
  const [ProductoSelect, setProductoSelect] = useState();
  const [Productos_Invoce, setProductos_Invoce] = useState([]);
  const [ProductoService, setProductoService] = useState([]);
  const [Typing, setTyping] = useState(false);
  const [TextSearch, SetTextSearch] = useState("");
  const [TextCant, SetTextCant] = useState("");
  const [PrecioTotal, SetPrecioTotal] = useState(0);
  const [Cambio, SetCambio] = useState(1);
  const [TipoMoneda, SetTipoMoneda] = useState(TipoMoneda_Array[0]);
  const [TipoMoneda_sim, SetTipoMoneda_sim] = useState(TipoMoneda_Array_Sim[0]);

  const fun_Seach = (Text) => {
    if (Text.length > 3 && !Typing) {
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

  const fun_AddProduct = (Pro) => {
    if (!isNaN(TextCant)) {
      Pro.Cant = parseFloat(TextCant);

      setProductos_Invoce((prev) => {
        const Lis = prev.map((s) => s);
        Lis.push(Pro);
        return Lis;
      });

      if (Pro.type == T_Ser) Pro.products = ProductoService;

      let price = Pro.type == T_Ser ? Pro.base_price : Pro.price;

      SetPrecioTotal((prev) => prev + price * Pro.Cant);
      SetTextSearch("");
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
    SetTextSearch(Pro.name);
    setProducto([]);
    setProductoSelect(Pro);
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
        //ax.setProductoService((prev));
      }
    }
  };

  return (
    <>
      <h1>Facturación</h1>
      <hr />
      <form>
        <div>
          <label htmlFor="ProductName">Buscar Producto:</label>
          <input
            type="text"
            name="ProductName"
            id="ProductName"
            value={TextSearch}
            onChange={(e) => {
              SetTextSearch(e.target.value);
              fun_Seach(e.target.value);
            }}
          />
          <ul>
            {Producto.map((p) => (
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
            if (ProductoSelect)
              fun_AddCantPro_Service(ProductoSelect, e.target.value);
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
            fun_AddProduct(ProductoSelect);
          }}
        >
          Agregar
        </button>
        <hr />
        <ul>
          {Productos_Invoce.map((p) => (
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
