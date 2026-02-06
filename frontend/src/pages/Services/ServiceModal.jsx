import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { X, Save, Wrench } from "lucide-react";
import ProductoService_Componet from "../../components/ProductoService_Componet";

export default function ServiceModal({
  onClose,
  onSuccess,
  serviceData = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [Products_Select, setProducts_Select] = useState([]);
  const [Products_List, setProducts_List] = useState([]);
  const [ProductsSearch, setProductsSearch] = useState("");
  const [Typing, setTyping] = useState(false);

  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        base_price: serviceData.base_price || "",
      });
    }
  }, [serviceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (serviceData) await api.put(`/services/${serviceData.id}`, formData);
      else await api.post("/services", formData);
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors);
      else
        alert(
          "Error: " + (err.response?.data?.message || "No se pudo guardar"),
        );
    } finally {
      setSaving(false);
    }
  };

  const fun_ProductsSearch = async (Txt) => {
    setProductsSearch(Txt);
    if (Txt.length > 2 && !Typing) {
      setTyping(true);
      setProducts_List([]);
      const Prods = await BuscarProducto(Txt);
      setProducts_List(Prods);
      setTyping(false);
    } else if (Txt.length == 0) {
      setProducts_List([]);
    }
  };

  const fun_AddProducts = async (Pro) => {
    let ax_p = Products_Select.map((p) => p);
    Pro.Cant = 1;
    ax_p.push(Pro);
    setProducts_Select(ax_p);
    setProductsSearch("");
    setProducts_List([]);
  };

  const BorrarProducto = (Pro) => {
    setProducts_Select((Prev) => Prev.filter((p) => p.id != Pro.id));
  };

  const Producto_UpdaCant = (Pro, Cant) => {
    let ind = Products_Select.findIndex((p) => p.id == Pro.id);
    Products_Select[ind].Cant = Cant;
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-workshop-dark flex items-center justify-center text-white">
              <Wrench size={20} />
            </div>
            <h3 className="font-black tracking-tighter text-gray-900 uppercase">
              {serviceData ? "Editar Trabajo" : "Nuevo Servicio"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Nombre del Servicio
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder="Ej. Calibración Electrónica"
            />
            {errors.name && (
              <p className="mt-1 text-xs font-bold text-red-500">
                {errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Descripción
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClass}
              placeholder="Detalles de lo que incluye el servicio..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Precio Base ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label>Productos Usados</label>
            <input
              className={inputClass}
              value={ProductsSearch}
              onChange={(e) => {
                fun_ProductsSearch(e.target.value);
              }}
            />
            <ul>
              {Products_List.map((p) => (
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fun_AddProducts(p);
                    }}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
            <hr />
            {Products_Select.length > 0 && (
              <ul>
                {Products_Select.map((p) => (
                  <li>
                    <ProductoService_Componet
                      Producto={p}
                      BorrarProducto={BorrarProducto}
                      Producto_UpdaCant={Producto_UpdaCant}
                    ></ProductoService_Componet>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log(Products_Select);
              }}
            >
              OOO
            </button>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-workshop-dark text-white font-black text-xs uppercase tracking-widest hover:bg-workshop-red transition-all shadow-lg disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "..." : "GUARDAR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

async function BuscarProducto(txt) {
  let Productos = await api.post("/products/Like", { Seach: txt });
  if (Productos.data.data) {
    return Productos.data.data;
  } else {
    return [];
  }
}
