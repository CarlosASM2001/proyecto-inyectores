import { useState, useEffect, useRef } from "react";
import api from "../../service/api_Authorization";
import {
  X,
  Save,
  Wrench,
  Search,
  Package,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

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
  const [errors, setErrors] = useState(null);

  // Estados para los productos
  const [Products_Select, setProducts_Select] = useState([]);
  const [Products_List, setProducts_List] = useState([]);
  const [ProductsSearch, setProductsSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Referencia para el scroll automático
  const listEndRef = useRef(null);

  // Cargar productos del servicio cuando se edita
  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || "",
        description: serviceData.description || "",
        base_price: serviceData.base_price || "",
      });
      loadServiceProducts(serviceData.id);
    }
  }, [serviceData]);

  const loadServiceProducts = async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}/products`);
      if (response.data.data && Array.isArray(response.data.data)) {
        setProducts_Select(response.data.data);
      }
    } catch (error) {
      console.error("Error al cargar productos del servicio:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors(null);
    try {
      const requestData = {
        ...formData,
        products: Products_Select.map((p) => ({
          id: p.id,
          // Aseguramos que se envíe un número válido, de lo contrario 1
          quantity: parseInt(p.quantity) || 1,
        })),
      };

      if (serviceData) {
        await api.put(`/services/${serviceData.id}`, requestData);
      } else {
        await api.post("/services", requestData);
      }
      onSuccess();
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.message);
      else
        alert(
          "Error: " + (err.response?.data?.message || "No se pudo guardar"),
        );
    } finally {
      setSaving(false);
    }
  };

  // Lógica de Búsqueda
  const fun_ProductsSearch = async (Txt) => {
    setProductsSearch(Txt);
    if (Txt.length >= 2) {
      setIsSearching(true);
      try {
        const response = await api.post("/products/Like", { Seach: Txt });
        setProducts_List(response.data.data || []);
      } catch (error) {
        console.error(error);
        setProducts_List([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setProducts_List([]);
    }
  };

  // Agregar Producto (Previene duplicados) y hace Scroll Inteligente
  const fun_AddProduct = (product) => {
    setProducts_Select((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: (parseInt(p.quantity) || 1) + 1 }
            : p,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setProductsSearch("");
    setProducts_List([]);

    // Scroll inteligente: 'nearest' solo mueve el scroll lo mínimo necesario
    // para que el final de la lista sea visible en pantalla.
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  // Actualizar cantidad desde botones (+ / -)
  const updateQuantity = (id, delta) => {
    setProducts_Select((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const currentQty = parseInt(p.quantity) || 0;
          const newQuantity = Math.max(1, currentQty + delta);
          return { ...p, quantity: newQuantity };
        }
        return p;
      }),
    );
  };

  // Escribir directamente la cantidad (Input manual)
  const handleManualQuantityChange = (id, value) => {
    setProducts_Select((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // Permitimos cadena vacía temporalmente para que el usuario pueda borrar y reescribir
          return { ...p, quantity: value === "" ? "" : parseInt(value) };
        }
        return p;
      }),
    );
  };

  // Al perder el foco (onBlur), validamos que no quede vacío o en cero
  const handleQuantityBlur = (id, value) => {
    setProducts_Select((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const val = parseInt(value);
          return { ...p, quantity: isNaN(val) || val < 1 ? 1 : val };
        }
        return p;
      }),
    );
  };

  const removeProduct = (id) => {
    setProducts_Select((prev) => prev.filter((p) => p.id !== id));
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* HEADER FIJO */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-workshop-dark flex items-center justify-center text-white shadow-lg">
              <Wrench size={20} />
            </div>
            <div>
              <h3 className="font-black tracking-tighter text-gray-900 uppercase leading-none">
                {serviceData ? "Editar Trabajo" : "Nuevo Servicio"}
              </h3>
              <p className="text-[10px] font-bold text-workshop-red uppercase tracking-widest mt-1">
                Ficha Técnica
              </p>
              {errors && (
                <p className="mt-1 text-xs font-bold text-red-500">{errors}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-xl shadow-sm border border-gray-200 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="grow overflow-y-auto px-8 py-6">
          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-8">
            {/* 1. DATOS BÁSICOS */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                Información del Servicio
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
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
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Mano de Obra ($)
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
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Detalles de lo que incluye el servicio..."
                />
              </div>
            </div>

            {/* 2. REPUESTOS / PRODUCTOS ASOCIADOS */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2 flex items-center justify-between">
                <span>Repuestos Necesarios</span>
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-md text-[10px]">
                  Opcional
                </span>
              </h4>

              {/* Buscador de Productos */}
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  className={`${inputClass} pl-11`}
                  value={ProductsSearch}
                  onChange={(e) => fun_ProductsSearch(e.target.value)}
                  placeholder="Buscar repuestos o consumibles para agregar..."
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-workshop-red border-t-transparent rounded-full animate-spin"></div>
                )}

                {/* Dropdown de Resultados */}
                {Products_List.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {Products_List.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => fun_AddProduct(p)}
                        className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-red-50 hover:text-workshop-red transition-colors flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-workshop-red">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Stock actual: {p.actual_stock}
                          </p>
                        </div>
                        <span className="font-black">${p.price}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lista de Productos Seleccionados */}
              {Products_Select.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 mt-4">
                  {Products_Select.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm"
                    >
                      {/* Info del Producto */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                          <Package size={16} />
                        </div>
                        <div className="truncate pr-4">
                          <p className="font-black text-gray-900 text-sm truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            ${p.price} / und
                          </p>
                        </div>
                      </div>

                      {/* Controles y Eliminar */}
                      <div className="flex items-center gap-4 shrink-0">
                        {/* Selector de Cantidad Editable */}
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, -1)}
                            className="p-2 text-gray-500 hover:bg-gray-200 hover:text-workshop-red transition-colors"
                          >
                            <Minus size={14} />
                          </button>

                          {/* 
                            Clases clave añadidas:
                            - [&::-webkit-inner-spin-button]:appearance-none -> Quita flechas en Chrome/Safari/Edge
                            - [&::-webkit-outer-spin-button]:appearance-none -> Quita flechas en Chrome/Safari/Edge
                            - [-moz-appearance:textfield] -> Quita flechas en Firefox
                          */}
                          <input
                            type="number"
                            value={p.quantity}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) =>
                              handleManualQuantityChange(p.id, e.target.value)
                            }
                            onBlur={(e) =>
                              handleQuantityBlur(p.id, e.target.value)
                            }
                            className="w-10 text-center font-black text-sm text-gray-900 bg-transparent outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                            min="1"
                          />

                          <button
                            type="button"
                            onClick={() => updateQuantity(p.id, 1)}
                            className="p-2 text-gray-500 hover:bg-gray-200 hover:text-green-600 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Botón Eliminar */}
                        <button
                          type="button"
                          onClick={() => removeProduct(p.id)}
                          className="p-2 text-gray-400 hover:text-workshop-red hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Div invisible al final para el Auto-Scroll */}
                  <div ref={listEndRef} />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER FIJO */}
        <div className="shrink-0 px-8 py-5 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-600 font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            form="serviceForm"
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-workshop-dark text-white font-black text-xs uppercase tracking-widest hover:bg-workshop-red transition-all shadow-lg disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Procesando..." : "Guardar Servicio"}
          </button>
        </div>
      </div>
    </div>
  );
}
