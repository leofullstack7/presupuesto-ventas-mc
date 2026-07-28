import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
import { UNIT_TICKET_LABEL } from "../../constants/index.js";
import { monthFromFecha } from "../../utils/dates.js";
export function UnitSaleLog({ entries, lineOptions, unit, onAddLinea, onRemove }) {
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [valor, setValor] = useState("");
  const [rentaPct, setRentaPct] = useState("");
  const [cliente, setCliente] = useState("");
  const [lineaIdx, setLineaIdx] = useState("");

  const total = entries.reduce((a, s) => a + s.valor, 0);
  const totalRenta = entries.reduce((a, s) => {
    if (s.rentaPct == null) return a;
    const ut = Math.round(s.valor * (s.rentaPct / 100));
    return { utilidad: a.utilidad + ut, egresos: a.egresos + (s.valor - ut), any: true };
  }, { utilidad: 0, egresos: 0, any: false });
  const mes = monthFromFecha(fecha);
  const canSubmit = lineaIdx !== "" && !!mes && valor && Number(valor) > 0;

  const submit = () => {
    if (!canSubmit) return;
    onAddLinea(Number(lineaIdx), mes, { fecha, cantidad, valor, cliente, rentaPct });
    setFecha("");
    setCantidad("");
    setValor("");
    setRentaPct("");
    setCliente("");
    setLineaIdx("");
  };

  return (
    <div className="sale-log unit-sale-log" onClick={(e) => e.stopPropagation()}>
      <div className="sale-log-head">
        <span>Ventas registradas</span>
        <span className="muted">{entries.length} venta{entries.length !== 1 ? "s" : ""} · {fmtCOP(total)}</span>
      </div>
      {totalRenta.any && (
        <div className="unit-sale-renta-summary">
          <span>Egresos reales: <b>{fmtCOP(totalRenta.egresos)}</b></span>
          <span>Utilidad real: <b>{fmtCOP(totalRenta.utilidad)}</b></span>
        </div>
      )}

      {entries.length > 0 && (
        <ul className="unit-sale-log-list">
          {entries.map((s) => (
            <li key={s.combinedKey} className="unit-sale-entry">
              <div className="unit-sale-entry-top">
                <span className="sale-fecha">{s.fecha || "Sin fecha"}</span>
                {s.cantidad > 0 && <span className="sale-cantidad-tag">{s.cantidad} {UNIT_TICKET_LABEL[unit] || "tickets"}</span>}
                <span className="sale-valor">{fmtCOP(s.valor)}</span>
                <button className="sale-remove" onClick={() => onRemove(s)} title="Eliminar venta">🗑</button>
              </div>
              <div className="unit-sale-entry-bottom">
                <span className="sale-linea">
                  {s.tipo === "linea" ? s.referencia : <span className="muted">General</span>}
                </span>
                <span className="sale-cliente">{s.cliente || "—"}</span>
                {s.rentaPct != null && <span className="renta-tag">{s.rentaPct}%</span>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="sale-log-form unit-sale-log-form">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="sale-input" />
        <select
          className="sale-input vendedor-select unit-sale-linea-select"
          value={lineaIdx}
          onChange={(e) => setLineaIdx(e.target.value)}
        >
          <option value="" disabled>Selecciona línea/referencia</option>
          {lineOptions.map((o) => (
            <option key={o.idx} value={o.idx}>{o.label}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="1"
          placeholder={`Q ${UNIT_TICKET_LABEL[unit] || "tickets"}`}
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="sale-input sale-input-cantidad"
          title="Cantidad de tickets/unidades de esta venta: se refleja en Q real del detalle por línea"
        />
        <input
          type="number"
          min="1"
          step="10000"
          placeholder="Valor (COP)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="sale-input sale-input-qty"
        />
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          placeholder="% renta"
          value={rentaPct}
          onChange={(e) => setRentaPct(e.target.value)}
          className="sale-input sale-input-renta"
          title="% de renta de esta venta: calcula egresos y utilidad reales"
        />
        <input
          type="text"
          placeholder="Cliente / nota (opcional)"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="sale-input sale-input-cliente"
        />
        <button className="sale-add-btn" onClick={submit} disabled={!canSubmit}>+ Registrar venta</button>
      </div>
      {fecha && !mes && <p className="unit-sale-hint">Elige una fecha entre julio y diciembre de 2026.</p>}
    </div>
  );
}

