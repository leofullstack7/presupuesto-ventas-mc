const MONTH_FROM_JS_INDEX = { 6: "Julio", 7: "Agosto", 8: "Septiembre", 9: "Octubre", 10: "Noviembre", 11: "Diciembre" };

export const monthFromFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha + "T00:00:00");
  if (isNaN(d.getTime())) return null;
  return MONTH_FROM_JS_INDEX[d.getMonth()] || null;
};
