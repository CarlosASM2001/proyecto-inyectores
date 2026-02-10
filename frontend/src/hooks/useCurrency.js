import { useState, useEffect } from "react";

export const CURRENCIES = {
  PESOS: { name: "Pesos", symbol: "COP", key: "", rate: 1 },
  DOLLARS: { name: "Dolares", symbol: "$", key: "exchange_rate_usd", rate: 1 },
  BOLIVARES: {
    name: "Bolivares",
    symbol: "BS",
    key: "exchange_rate_ves",
    rate: 1,
  },
};

export function useCurrency() {
  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES.PESOS);
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    // Cargar tasa de cambio desde localStorage si existe
    if (currentCurrency.key) {
      const storedRate = localStorage.getItem(currentCurrency.key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExchangeRate(storedRate ? 1 / parseFloat(storedRate) : 1);
    } else {
      setExchangeRate(1);
    }
  }, [currentCurrency]);

  const formatCurrency = (amount, decimals = 2) => {
    return new Intl.NumberFormat("es-VE", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const convertCurrency = (amount, targetCurrency = currentCurrency) => {
    const rate = targetCurrency.name === "Pesos" ? 1 : exchangeRate;
    return amount * rate;
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
