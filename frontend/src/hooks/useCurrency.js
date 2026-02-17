import { useState, useEffect } from "react";

export const CURRENCIES = {
  PESOS: {
    name: "Pesos",
    symbol: "COP",
    key: "",
    rate: 1,
  },
  DOLLARS: {
    name: "Dolares",
    symbol: "$",
    key: "exchange_rate_usd",
    rate: 1,
  },
  BOLIVARES: {
    name: "Bolivares",
    symbol: "BS",
    key: "exchange_rate_ves", // Clave vinculada a la base de datos/localStorage
    rate: 1,
  },
};

export function useCurrency() {
  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES.PESOS);
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    CURRENCIES.PESOS.rate = 1;
    CURRENCIES.DOLLARS.rate = parseFloat(
      localStorage.getItem(CURRENCIES.DOLLARS.key) || 1,
    );
    CURRENCIES.BOLIVARES.rate = parseFloat(
      localStorage.getItem(CURRENCIES.BOLIVARES.key) || 1,
    );
  }, []);

  useEffect(() => {
    // 1. Si la moneda es PESOS (no tiene key), la tasa es 1:1
    if (!currentCurrency.key) {
      setExchangeRate(1);
      return;
    }

    // 2. Buscar la tasa en localStorage (cargada al iniciar sesión)
    const storedRate = localStorage.getItem(currentCurrency.key);
    const parsedRate = parseFloat(storedRate);

    // 3. Calcular el factor de conversión
    // La lógica asume que la tasa guardada es "Cuántos PESOS cuesta 1 unidad de la moneda extranjera"
    // Ejemplo USD: Si 1 USD = 4000 COP, guardamos "4000". Factor = 1/4000.
    // Ejemplo BS: Si 1 BS = 0.025 COP (o viceversa), se usa la misma lógica.
    if (!isNaN(parsedRate) && parsedRate > 0) {
      setExchangeRate(1 / parsedRate);
    } else {
      console.warn(
        `Tasa de cambio no encontrada para ${currentCurrency.name}, usando 1:1`,
      );
      setExchangeRate(1);
    }
  }, [currentCurrency]);

  const formatCurrency = (amount, decimals = 2) => {
    const validAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(validAmount);
  };

  const convertCurrency = (amount, targetCurrency = currentCurrency) => {
    const rate = targetCurrency.name === "Pesos" ? 1 : exchangeRate;
    const validAmount = parseFloat(amount) || 0;
    return validAmount * rate;
  };

  const getCurrencyValue = (amount) => {
    return convertCurrency(amount);
  };

  const changeCurrency = (currencyName) => {
    const selectedCurrency = Object.values(CURRENCIES).find(
      (c) => c.name === currencyName,
    );

    if (selectedCurrency) {
      setCurrentCurrency(selectedCurrency);
      return selectedCurrency;
    }
    return currentCurrency;
  };

  return {
    currentCurrency,
    exchangeRate,
    formatCurrency,
    convertCurrency,
    getCurrencyValue,
    changeCurrency,
    currencies: CURRENCIES,
  };
}

export default useCurrency;
