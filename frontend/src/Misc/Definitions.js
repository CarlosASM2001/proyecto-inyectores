export const T_Ser = "Service";
export const T_Pro = "Product";

const copCurrencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCOP(value) {
  const amount = Number(value ?? 0);
  return copCurrencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

