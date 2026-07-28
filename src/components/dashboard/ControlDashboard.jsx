import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
import { GanttChart } from "../charts/GanttChart.jsx";
import { VendedoresPanel } from "./VendedoresPanel.jsx";
export function ControlDashboard({
  funnelData, funnelTotals, funnelAnyData, stages, unitMeta, unitOrder, onKpiChange, kpis, onReset,
  vendedores, onAddVendedor, onRemoveVendedor, onVendedorMeta, onVendedorAvance, onVendedorUnidad,
  unitCompareData, onUnitClick, ganttData, ganttMetric, onGanttMetricChange, hasReal, activeUnit,
}) {
  const [printingId, setPrintingId] = useState(null);

  useEffect(() => {
    const clearPrinting = () => setPrintingId(null);
    window.addEventListener("afterprint", clearPrinting);
    return () => window.removeEventListener("afterprint", clearPrinting);
  }, []);

  const handlePrint = (id) => {
    setPrintingId(id);
    setTimeout(() => window.print(), 60);
  };

  return (
    <>
      <section className={"panel unit-gantt-panel" + (printingId === "uen-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Ventas por cada U.E.N.</h2>
            <p>Presupuesto vs. ventas reales registradas, por unidad estratégica de negocio</p>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("uen-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>
        <GanttChart
          data={unitCompareData}
          colorFn={(u) => unitMeta[u].color}
          onRowClick={onUnitClick}
          showBudgetValue={false}
        />
      </section>

      <section className={"panel gantt-panel" + (printingId === "cronograma-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Presupuesto vs. real — cronograma Jul–Dic{activeUnit !== "ALL" ? ` · ${unitMeta[activeUnit].label}` : ""}</h2>
            <p>Cada fila es un mes: la franja tenue es lo presupuestado, la franja de color es lo realmente vendido</p>
          </div>
          <div className="month-tabs no-print">
            <button className={ganttMetric === "ingresos" ? "active" : ""} onClick={() => onGanttMetricChange("ingresos")}>Ingresos</button>
            <button className={ganttMetric === "utilidad" ? "active" : ""} onClick={() => onGanttMetricChange("utilidad")}>Utilidad</button>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("cronograma-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>
        <GanttChart data={ganttData} />
        {!hasReal && (
          <p className="gantt-empty">
            Aún no has registrado ventas reales. Ve a "Presupuesto de ventas" y diligencia la
            columna <b>Q real</b> o <b>Ingresos reales</b> de cualquier línea para verla comparada aquí.
          </p>
        )}
      </section>

      <section className="panel kpi-registro-panel">
        <div className="panel-head">
          <h2>Caja de registro de KPI</h2>
          <p>Diligencia, por unidad estratégica, los indicadores del embudo comercial del mes</p>
        </div>

        <div className="kpi-registro-grid">
          {unitOrder.map((u) => {
            const meta = unitMeta[u];
            const k = kpis[u] || {};
            return (
              <div key={u} className="kpi-registro-card" style={{ borderColor: meta.color }}>
                <div className="kpi-registro-title">
                  <span className="unit-dot" style={{ background: meta.color }} />
                  {meta.label}
                </div>
                {stages.map((s) => (
                  <label key={s.key} className="kpi-registro-field">
                    {s.short}
                    <input
                      type="number"
                      min="0"
                      value={k[s.key] === undefined ? "" : k[s.key]}
                      placeholder="0"
                      onChange={(e) => onKpiChange(u, s.key, e.target.value)}
                    />
                  </label>
                ))}
              </div>
            );
          })}
        </div>

        <div className="sidebar-footer gantt-reset">
          <button className="reset-btn" onClick={onReset}>
            ↺ Reiniciar tablero de control
          </button>
        </div>
      </section>

      <section className={"panel seguimiento-panel" + (printingId === "seguimiento-chart" ? " print-active" : "")}>
        <div className="panel-head table-head">
          <div>
            <h2>Caja de seguimiento y avance</h2>
            <p>Conversión entre etapas del embudo, consolidado de todas las unidades estratégicas</p>
          </div>
          <button className="print-btn no-print" onClick={() => handlePrint("seguimiento-chart")} title="Imprimir este gráfico">
            🖨️ Imprimir
          </button>
        </div>

        {!funnelAnyData ? (
          <p className="gantt-empty">
            Aún no registras indicadores. Diligencia la caja de registro de KPI arriba para ver
            aquí el embudo y las tasas de conversión.
          </p>
        ) : (
          <>
            <div className="funnel-total">
              {stages.map((s, i) => (
                <div className="funnel-total-stage" key={s.key}>
                  <div className="funnel-total-bar-wrap">
                    <div
                      className="funnel-total-bar"
                      style={{ width: `${funnelTotals[0] > 0 ? Math.max(4, (funnelTotals[i] / funnelTotals[0]) * 100) : 0}%` }}
                    />
                  </div>
                  <div className="funnel-total-label">
                    <span>{s.label}</span>
                    <b>{funnelTotals[i]}</b>
                  </div>
                  {i > 0 && (
                    <span className="funnel-conv">
                      {funnelTotals[i - 1] > 0 ? fmtPct(funnelTotals[i] / funnelTotals[i - 1]) : "—"} vs. etapa anterior
                    </span>
                  )}
                </div>
              ))}
              <div className="funnel-total-close">
                Tasa de cierre general: <b>{funnelTotals[0] > 0 ? fmtPct(funnelTotals[stages.length - 1] / funnelTotals[0]) : "—"}</b>
                {" "}(prospectos → ventas cerradas)
              </div>
            </div>

            <div className="unit-funnel-grid">
              {funnelData.filter((d) => d.vals.some((v) => v > 0)).map((d) => (
                <div className="unit-funnel-card" key={d.unit} style={{ borderColor: d.color }}>
                  <div className="kpi-registro-title">
                    <span className="unit-dot" style={{ background: d.color }} />
                    {d.label}
                  </div>
                  {stages.map((s, i) => (
                    <div className="unit-funnel-row" key={s.key}>
                      <span className="unit-funnel-stage">{s.short}</span>
                      <div className="unit-funnel-track">
                        <div
                          className="unit-funnel-bar"
                          style={{
                            width: `${d.vals[0] > 0 ? Math.max(3, (d.vals[i] / d.vals[0]) * 100) : 0}%`,
                            background: d.color,
                          }}
                        />
                      </div>
                      <span className="unit-funnel-value">{d.vals[i]}</span>
                    </div>
                  ))}
                  <div className="unit-funnel-close muted">
                    Cierre: {d.vals[0] > 0 ? fmtPct(d.vals[stages.length - 1] / d.vals[0]) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <VendedoresPanel
        vendedores={vendedores}
        stages={stages}
        unitMeta={unitMeta}
        unitOrder={unitOrder}
        onAdd={onAddVendedor}
        onRemove={onRemoveVendedor}
        onMeta={onVendedorMeta}
        onAvance={onVendedorAvance}
        onUnidad={onVendedorUnidad}
      />
    </>
  );
}

