import { useState } from "react";
import api from "../../service/api_Authorization";
import useCurrency from "../../hooks/useCurrency";
import { T_Pro, T_Ser } from "../../Misc/Definitions";
import Facturar from "../../service/Invoices/Facturar";
import ClientSearch from "../../components/Invoices/ClientSearch";
import ProductSearch from "../../components/Invoices/ProductSearch";
import CartSummary from "../../components/Invoices/CartSummary";
import PaymentSection from "../../components/Invoices/PaymentSection";
import { FileText, UserCircle, Package, CheckCircle } from "lucide-react";
import { CURRENCIES } from "../../hooks/useCurrency";

export default function Billinvoices_Page() {
  // Estado del cliente
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientSearchText, setClientSearchText] = useState("");

  // Estado de productos
  const [ProductSearchText, setProductSearchText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Estado del carrito
  const [cartItems, setCartItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Estado de pago
  const [amountPaid, setAmountPaid] = useState(0);
  const [paidCurrency, setPaidCurrency] = useState(CURRENCIES.PESOS);
  const [paymentExchangeRate, setPaymentExchangeRate] = useState(1);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Hook de moneda
  const {
    currentCurrency,
    exchangeRate,
    formatCurrency,
    changeCurrency,
    convertCurrency,
  } = useCurrency();

  // Calcular total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.type === T_Ser) {
        return total + item.subtotal * item.quantity;
      } else {
        return total + item.price * item.quantity;
      }
    }, 0);
  };

  const total = calculateTotal();

  // Handlers de cliente
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setClientSearchText("");
  };

  const handleClientClear = () => {
    setSelectedClient(null);
    setClientSearchText("");
  };

  // Handlers de productos
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
  };

  const handleProductClear = () => {
    setSelectedProduct(null);
    setProductQuantity(1);
  };

  const handleQuantityChange = (quantity) => {
    setProductQuantity(Math.max(1, quantity));
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    setIsAdding(true);
    try {
      let itemToAdd = { ...selectedProduct, quantity: productQuantity };

      // Si es un servicio, cargar sus productos asociados
      if (selectedProduct.type === T_Ser) {
        try {
          const response = await api.get(
            `/services/${selectedProduct.id}/products`,
          );
          const products = response.data.data || [];
          let subtotal = parseFloat(selectedProduct.base_price);
          subtotal += products.reduce((sum, p) => {
            return sum + p.price * (p.quantity || 1);
          }, 0);

          itemToAdd = {
            ...itemToAdd,
            products: products,
            subtotal: subtotal,
            base_price_: selectedProduct.base_price * productQuantity,
            price: selectedProduct.base_price * productQuantity,
          };

          // Actualizar productos del servicio con cantidad
          if (products.length > 0) {
            itemToAdd.products = products.map((p) => ({
              ...p,
              quantity_: p.quantity * productQuantity,
              price_: p.price * productQuantity,
            }));
          }
        } catch (error) {
          console.error("Error obteniendo productos del servicio:", error);
          itemToAdd.subtotal = selectedProduct.base_price * productQuantity;
          itemToAdd.price = selectedProduct.base_price * productQuantity;
          itemToAdd.products = [];
        }
      } else {
        // Para productos, simplemente multiplicar el precio
        itemToAdd.price_ = selectedProduct.price;
        itemToAdd.quantity_ = productQuantity;
      }

      // Agregar al carrito
      setCartItems((prev) => [...prev, itemToAdd]);

      // Limpiar selección
      setSelectedProduct(null);
      setProductQuantity(1);
      setProductSearchText("");

      // Notificar éxito
      showNotification(
        "success",
        `${selectedProduct.type === T_Ser ? "Servicio" : "Producto"} agregado al carrito`,
      );
    } catch (error) {
      console.error("Error agregando al carrito:", error);
      showNotification("error", "Error al agregar al carrito");
    } finally {
      setIsAdding(false);
    }
  };

  // Handler para eliminar del carrito
  const handleRemoveFromCart = (itemToRemove) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === itemToRemove.id && item.type === itemToRemove.type),
      ),
    );
    showNotification("info", "Item removido del carrito");
  };

  // Handler de pago
  const handleProcessPayment = async () => {
    if (!selectedClient) {
      showNotification("error", "Debes seleccionar un cliente primero");
      return;
    }

    if (cartItems.length === 0) {
      showNotification(
        "error",
        "Debes agregar al menos un producto o servicio",
      );
      return;
    }

    if (amountPaid <= 0 || isNaN(amountPaid)) {
      showNotification("error", "Debes ingresar un monto de pago válido");
      return;
    }

    setIsProcessing(true);
    try {
      const totalInCOP = calculateTotal();
      const amountPaidInCOP = amountPaid / paymentExchangeRate;

      const paymentInfo = {
        amount: amountPaidInCOP,
        currency: paidCurrency.name,
        reference: paymentExchangeRate.toFixed(4),
      };

      const result = await Facturar(
        cartItems,
        selectedClient,
        totalInCOP,
        paymentInfo,
      );

      if (result.msg.includes("correctamente")) {
        showNotification("success", "¡Factura generada exitosamente!");

        // Limpiar formulario
        setCartItems([]);
        setSelectedClient(null);
        setProductSearchText("");
        setClientSearchText("");
        setAmountPaid(0);

        // Retrasar notificación para mejor UX
        setTimeout(() => {
          setPaymentMessage(result.msg);
        }, 1000);

        setTimeout(() => {
          setPaymentMessage("");
        }, 5000);
      } else {
        showNotification("error", result.msg);
      }
    } catch (error) {
      console.error("Error al facturar:", error);
      showNotification("error", "Error al procesar la factura");
    } finally {
      setIsProcessing(false);
    }
  };

  // Notificaciones
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      3000,
    );
  };

  // Handlers de cambio de moneda
  const handlePaymentCurrencyChange = (currencyName) => {
    const selectedCurrency = changeCurrency(currencyName);
    setPaidCurrency(selectedCurrency);
  };

  const handlePaymentExchangeRateChange = (rate) => {
    setPaymentExchangeRate(rate);
  };

  const handleAmountPaidChange = (amount) => {
    setAmountPaid(parseFloat(amount) || 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      {/* Encabezado */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 uppercase mb-2">
          <FileText className="inline mr-3 h-8 w-8 text-workshop-red" />
          Facturación
        </h1>
      </div>

      {/* Notificaciones */}
      {notification.show && (
        <div
          className={`rounded-xl p-4 border-l-4 ${
            notification.type === "success"
              ? "bg-green-50 border-green-400 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 border-red-400 text-red-800"
                : "bg-blue-50 border-blue-400 text-blue-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Grid principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Selección de cliente y productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sección de cliente */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
                  Cliente
                </h2>
                <p className="text-sm text-gray-500">
                  Selecciona al cliente que recibirá la factura
                </p>
              </div>
            </div>

            <ClientSearch
              searchText={clientSearchText}
              onSearchTextChange={setClientSearchText}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
              onClear={handleClientClear}
            />
          </div>

          {/* Sección de productos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
                  Productos y Servicios
                </h2>
                <p className="text-sm text-gray-500">
                  Busca productos o servicios para agregar al carrito
                </p>
              </div>
            </div>

            <ProductSearch
              selectedProduct={selectedProduct}
              quantity={productQuantity}
              onProductSelect={handleProductSelect}
              onQuantityChange={handleQuantityChange}
              onClear={handleProductClear}
              searchText={ProductSearchText}
              setSearchText={setProductSearchText}
            />

            {/* Botón agregar al carrito */}
            {selectedProduct && (
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedProduct}
                  className={`w-full py-4 px-6 rounded-xl font-black uppercase text-sm tracking-wider transition-all ${
                    isAdding || !selectedProduct
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-workshop-dark hover:bg-workshop-red active:bg-red-700 shadow-lg hover:shadow-red-500/20 text-white"
                  }`}
                >
                  {isAdding ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Agregando...
                    </div>
                  ) : (
                    "AGREGAR AL CARRITO"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Resumen y pago */}
        <div className="space-y-6 lg:sticky lg:top-8">
          {/* Resumen del carrito */}
          <CartSummary
            items={cartItems}
            onRemoveItem={handleRemoveFromCart}
            baseCurrency={paidCurrency}
            exchangeRate={paymentExchangeRate}
          />

          {/* Sección de pago */}
          <PaymentSection
            total={total}
            paidAmount={amountPaid}
            onPaidAmountChange={handleAmountPaidChange}
            currency={paidCurrency}
            onCurrencyChange={handlePaymentCurrencyChange}
            exchangeRate={paymentExchangeRate}
            onExchangeRateChange={handlePaymentExchangeRateChange}
            onProcessPayment={handleProcessPayment}
          />

          {/* Mensaje de facturación */}
          {paymentMessage && (
            <div
              className={`rounded-xl p-4 ${
                paymentMessage.includes("correctamente")
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{paymentMessage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
