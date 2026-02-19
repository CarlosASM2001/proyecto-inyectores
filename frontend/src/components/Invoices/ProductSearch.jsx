/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import api from "../../service/api_Authorization";
import { Package, PlusCircle, MinusCircle, X } from "lucide-react";
import { T_Ser, T_Pro } from "../../Misc/Definitions";

export default function ProductSearch({
  onProductSelect,
  selectedProduct,
  onQuantityChange,
  quantity,
  onClear,
  searchText,
  setSearchText,
}) {
  //const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Búsqueda con debounce
  useEffect(() => {
    if (!searchText || searchText.length < 2) {
      setProducts([]);
      setServices([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true);

      Promise.all([
        api.post("/products/Like", { Seach: searchText }),
        api.post("/services/Like", { Seach: searchText }),
      ])
        .then(([productRes, serviceRes]) => {
          setProducts(productRes.data.data || []);
          setServices(serviceRes.data.data || []);
        })
        .catch((err) => {
          console.error("Error buscando productos/servicios:", err);
          setProducts([]);
          setServices([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleSelect = async (item, type) => {
    const product = { ...item, type };

    if (type === T_Ser) {
      // Cargar productos del servicio
      try {
        const response = await api.get(`/services/${item.id}/products`);
        product.products = response.data.data || [];

        // Calcular subtotal del servicio
        let subtotal = parseFloat(product.base_price);
        subtotal += product.products.reduce((sum, p) => {
          return sum + p.price * (p.quantity || 1);
        }, 0);
        product.subtotal = subtotal;
      } catch (err) {
        console.error("Error cargando productos del servicio:", err);
        product.products = [];
        product.subtotal = parseFloat(product.base_price);
      }
    }

    onProductSelect(product);
  };

  const handleQuantityChange = (newQuantity) => {
    const numQuantity = parseFloat(newQuantity);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      onQuantityChange(numQuantity);
    }
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    onQuantityChange(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
    }
  };

  const handleClear = () => {
    setSearchText("");
    onClear();
  };

  // Si hay producto seleccionado, mostrar detalles
  if (selectedProduct) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Package
                  className={`h-5 w-5 ${selectedProduct.type === T_Ser ? "text-blue-500" : "text-green-500"}`}
                />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedProduct.type === T_Ser
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {selectedProduct.type === T_Ser ? "Servicio" : "Producto"}
                </span>
              </div>
              <div className="font-bold text-gray-900 text-lg">
                {selectedProduct.name}
              </div>
              {selectedProduct.type === T_Ser ? (
                <div className="text-lg font-black text-gray-900 mt-2">
                  Precio base: ${selectedProduct.base_price}
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-lg font-black text-gray-900">
                    Precio: ${selectedProduct.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock: {selectedProduct.actual_stock}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-workshop-red transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Detalles del servicio si aplica */}
          {selectedProduct.type === T_Ser &&
            selectedProduct.products &&
            selectedProduct.products.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-bold text-gray-700 mb-2">
                  Componentes del servicio:
                </div>
                <div className="space-y-2">
                  {selectedProduct.products.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="flex justify-between text-sm py-1"
                    >
                      <span className="text-gray-700">{product.name}</span>
                      <span className="font-bold text-gray-900">
                        {product.quantity} × ${product.price} = $
                        {(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-black text-workshop-red border-t border-gray-200 pt-2">
                    <span>Subtotal:</span>
                    <span>${selectedProduct.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Control de cantidad */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <label className="text-sm font-bold text-gray-700">Cantidad:</label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MinusCircle className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onFocus={(e) => {
                e.currentTarget.select();
              }}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-16 text-center font-black text-lg text-gray-900 border-none outline-none"
              min="1"
              step="0.1"
            />
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="productSearch"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-workshop-red focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
            placeholder="Buscar productos o servicios..."
          />
        </div>

        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 z-10">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-workshop-red border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Buscando productos y servicios...</span>
            </div>
          </div>
        )}

        {/* Resultados de búsqueda */}
        {searchText.length >= 2 &&
          (products.length > 0 || services.length > 0) && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl max-h-80 overflow-y-auto">
              {/* Servicios */}
              {services.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    Servicios
                  </div>
                  {services.slice(0, 10).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelect(service, T_Ser)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors rounded-lg mb-1 border-l-4 border-blue-500 border-l-4"
                    >
                      <div className="font-bold text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Precio base: ${service.base_price}
                      </div>
                    </button>
                  ))}
                  {services.length > 10 && (
                    <div className="text-xs text-gray-400 text-center mt-2">
                      +{services.length - 10} más
                    </div>
                  )}
                </div>
              )}

              {/* Productos */}
              {services.length > 0 && products.length > 0 && (
                <div className="border-t border-gray-200 mt-2"></div>
              )}

              {products.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">
                    Productos
                  </div>
                  {products.slice(0, 10).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product, T_Pro)}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 transition-colors rounded-lg mb-1 border-l-4 border-green-500 border-l-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Stock: {product.actual_stock}
                          </div>
                        </div>
                        <div className="font-black text-workshop-red text-lg">
                          ${product.price}
                        </div>
                      </div>
                    </button>
                  ))}
                  {products.length > 10 && (
                    <div className="text-xs text-gray-400 text-center mt-2">
                      +{products.length - 10} más
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Sin resultados */}
        {searchText.length >= 2 &&
          !isLoading &&
          products.length === 0 &&
          services.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-sm p-4 z-10">
              <p className="text-gray-500 text-center text-sm">
                No se encontraron productos ni servicios
              </p>
            </div>
          )}
      </div>

      {/* Cantidad (visible antes de seleccionar) */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
        <label className="text-sm font-bold text-gray-700">
          Cantidad inicial:
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MinusCircle className="h-3 w-3" />
          </button>
          <span className="font-black text-gray-900 w-8 text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <PlusCircle className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
