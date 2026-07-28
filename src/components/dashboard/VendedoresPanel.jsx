import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
export function VendedoresPanel({ vendedores, stages, unitMeta, unitOrder, onAdd, onRemove, onMeta, onAvance, onUnidad }) {
  const [nombre, setNombre] = useState("");
  const [unidad, setUnidad] = useState("ALL");

  const submit = () => {
    if (!nombre.trim()) return;
    onAdd(nombre, unidad);
    setNombre("");
    setUnidad("ALL");
  };

  return (
    <section className="panel vendedores-panel">
      <div className="panel-head">
        <h2>Vendedores · metas y avance por indicador</h2>
        <p>Registra cada vendedor con su meta de prospectos, citas, visitas, propuestas y ventas cerradas, y actualiza su avance real</p>
      </div>

      <div className="vendedor-add-form">
        <input
          type="text"
          className="sale-input"
          placeholder="Nombre del vendedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <select className="sale-input vendedor-select" value={unidad} onChange={(e) => setUnidad(e.target.value)}>
          <option value="ALL">Sin unidad asignada</option>
          {unitOrder.map((u) => (
            <option key={u} value={u}>{unitMeta[u].label}</option>
          ))}
        </select>
        <button className="sale-add-btn" onClick={submit}>+ Agregar vendedor</button>
      </div>

      {vendedores.length === 0 ? (
        <p className="gantt-empty">
          Aún no has registrado vendedores. Agrega uno arriba para asignarle metas y llevar su avance.
        </p>
      ) : (
        <div className="vendedores-grid">
          {vendedores.map((v) => {
            const meta = unitMeta[v.unidad];
            const color = meta ? meta.color : "#8FA398";
            const cierreMeta = v.metas.ventas || 0;
            const cierreAvance = v.avance.ventas || 0;
            const cierrePct = cierreMeta > 0 ? cierreAvance / cierreMeta : null;
            return (
              <div className="vendedor-card" key={v.id} style={{ borderColor: color }}>
                <div className="vendedor-card-head">
                  <div className="vendedor-card-title">
                    <span className="unit-dot" style={{ background: color }} />
                    {v.nombre}
                  </div>
                  <button className="sale-remove" onClick={() => onRemove(v.id)} title="Eliminar vendedor">✕</button>
                </div>

                <select
                  className="sale-input vendedor-select vendedor-select-inline"
                  value={v.unidad}
                  onChange={(e) => onUnidad(v.id, e.target.value)}
                >
                  <option value="ALL">Sin unidad asignada</option>
                  {unitOrder.map((u) => (
                    <option key={u} value={u}>{unitMeta[u].label}</option>
                  ))}
                </select>

                <div className="vendedor-table">
                  <div className="vendedor-table-head">
                    <span></span>
                    <span>Meta</span>
                    <span>Avance</span>
                    <span>%</span>
                  </div>
                  {stages.map((s) => {
                    const m = v.metas[s.key] || 0;
                    const a = v.avance[s.key] || 0;
                    const pct = m > 0 ? a / m : null;
                    return (
                      <div className="vendedor-row" key={s.key}>
                        <span className="vendedor-row-label">{s.short}</span>
                        <input
                          type="number"
                          min="0"
                          value={m === 0 ? "" : m}
                          placeholder="0"
                          onChange={(e) => onMeta(v.id, s.key, e.target.value)}
                        />
                        <input
                          type="number"
                          min="0"
                          value={a === 0 ? "" : a}
                          placeholder="0"
                          onChange={(e) => onAvance(v.id, s.key, e.target.value)}
                        />
                        <span className={pct == null ? "muted" : pct >= 1 ? "var-pos" : "var-neg"}>
                          {pct != null ? fmtPct(pct) : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="vendedor-card-foot">
                  {cierrePct != null ? (
                    <>
                      <div className="progress-track">
                        <div
                          className={"progress-fill" + (cierrePct >= 1 ? " real-fill" : "")}
                          style={{ width: `${Math.min(100, cierrePct * 100)}%`, background: cierrePct >= 1 ? undefined : color }}
                        />
                      </div>
                      <span className="kpi-note">Cumplimiento en ventas cerradas: {fmtPct(cierrePct)}</span>
                    </>
                  ) : (
                    <span className="muted">Define la meta de ventas para ver su cumplimiento</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

