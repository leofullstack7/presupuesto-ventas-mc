import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
export function SaleLog({ entries, precio, unit, onAdd, onRemove }) {
  const [fecha, setFecha] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [valor, setValor] = useState("");
  const [cliente, setCliente] = useState("");

  const hasPrecio = precio != null;
  const totalQ = entries.reduce((a, s) => a + (s.cantidad || 0), 0);
  const totalValor = entries.reduce((a, s) => a + (s.valor || 0), 0);

  const submit = () => {
    if (hasPrecio) {
      if (!cantidad || Number(cantidad) <= 0) return;
      onAdd({ fecha, cantidad, cliente }, precio);
    } else {
      if (!valor || Number(valor) <= 0) return;
      onAdd({ fecha, valor, cliente }, precio);
    }
    setFecha("");
    setCantidad("");
    setValor("");
    setCliente("");
  };

  return (
    <div className="sale-log">
      <div className="sale-log-head">
        <span>Ventas registradas ({unit})</span>
        <span className="muted">
          {hasPrecio ? `${totalQ} ${unit.toLowerCase()} vendidos este mes · ` : ""}{fmtCOP(totalValor)}
        </span>
      </div>

      {entries.length > 0 && (
        <ul className="sale-log-list">
          {entries.map((s) => (
            <li key={s.id}>
              <span className="sale-fecha">{s.fecha || "Sin fecha"}</span>
              <span className="sale-cantidad">{hasPrecio ? `${s.cantidad} ${unit.toLowerCase()}` : "—"}</span>
              <span className="sale-cliente">{s.cliente || "—"}</span>
              <span className="sale-valor muted">{fmtCOP(s.valor != null ? s.valor : (hasPrecio && s.cantidad ? s.cantidad * precio : 0))}</span>
              <button className="sale-remove" onClick={() => onRemove(s.id)} title="Eliminar venta">✕</button>
            </li>
          ))}
        </ul>
      )}

      <div className="sale-log-form">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="sale-input" />
        {hasPrecio ? (
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            className="sale-input sale-input-qty"
          />
        ) : (
          <input
            type="number"
            min="1"
            step="10000"
            placeholder="Valor (COP)"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="sale-input sale-input-qty"
          />
        )}
        <input
          type="text"
          placeholder="Cliente / nota (opcional)"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="sale-input sale-input-cliente"
        />
        <button className="sale-add-btn" onClick={submit}>+ Registrar venta</button>
      </div>
    </div>
  );
}

