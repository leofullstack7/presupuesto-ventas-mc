export const fmtCOP = (n) => {
  const v = Math.round(n || 0);
  return "$" + v.toLocaleString("es-CO");
};

export const fmtCOPShort = (n) => {
  const v = n || 0;
  if (Math.abs(v) >= 1e6) return "$" + (v / 1e6).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "M";
  if (Math.abs(v) >= 1e3) return "$" + (v / 1e3).toLocaleString("es-CO", { maximumFractionDigits: 0 }) + "K";
  return "$" + v.toLocaleString("es-CO");
};

export const fmtPct = (n) => (n * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "%";
