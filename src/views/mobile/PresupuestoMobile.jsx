import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { MONTHS, MONTH_SHORT, UNIT_META } from "../../constants/index.js";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
import { NumberInput } from "../../components/inputs/NumberInput.jsx";
import { CurrencyInput } from "../../components/inputs/CurrencyInput.jsx";
import { ChartTooltip, PieTooltip } from "../../components/charts/ChartTooltips.jsx";
import { SaleLog } from "../../components/sales/SaleLog.jsx";
import { UnitSaleLog } from "../../components/sales/UnitSaleLog.jsx";

export function PresupuestoMobile({
  activeUnit,
  setActiveUnit,
  activeMonth,
  setActiveMonth,
  filteredItems,
  totals,
  monthlyChartData,
  unitPieData,
  grandIngresos,
  grandEgresos,
  grandUtilidad,
  avancePct,
  presupuestoAnual,
  metaAnual,
  cumplimiento,
  unitCompareData,
  unitSalesCombined,
  unitLineOptions,
  expandedUnit,
  setExpandedUnit,
  expandedRow,
  setExpandedRow,
  sales,
  setQty,
  setPrice,
  setPriceAllMonths,
  setRealQty,
  setRealIngresos,
  clearRealForCell,
  addSale,
  removeSale,
  addLinkedSale,
  removeLinkedSale,
  removeUnitSale,
  resetReal,
  hasReal,
}) {
  const [section, setSection] = useState("resumen");

  return (
    <div className="m-presupuesto">
      <div className="m-segmented">
        <button type="button" className={section === "resumen" ? "active" : ""} onClick={() => setSection("resumen")}>Resumen</button>
        <button type="button" className={section === "lineas" ? "active" : ""} onClick={() => setSection("lineas")}>Líneas</button>
        <button type="button" className={section === "ventas" ? "active" : ""} onClick={() => setSection("ventas")}>Ventas reales</button>
      </div>

      {section === "resumen" && (
        <>
          <div className="m-kpi-scroll">
            <div className="m-kpi-card">
              <span className="m-kpi-label">Ingresos Jul–Dic</span>
              <span className="m-kpi-value">{fmtCOPShort(grandIngresos)}</span>
              <span className="m-kpi-note">Meta 2026: {fmtCOPShort(metaAnual)}</span>
            </div>
            <div className="m-kpi-card">
              <span className="m-kpi-label">Utilidad</span>
              <span className="m-kpi-value accent">{fmtCOPShort(grandUtilidad)}</span>
              <span className="m-kpi-note">{fmtPct(grandUtilidad / (grandIngresos || 1))} margen</span>
            </div>
            <div className="m-kpi-card">
              <span className="m-kpi-label">Avance anual</span>
              <span className="m-kpi-value">{fmtPct(avancePct)}</span>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, avancePct * 100)}%` }} /></div>
            </div>
            <div className="m-kpi-card">
              <span className="m-kpi-label">Cumplimiento real</span>
              <span className="m-kpi-value">{cumplimiento.pct != null ? fmtPct(cumplimiento.pct) : "—"}</span>
              {cumplimiento.pct != null && (
                <span className="m-kpi-note">{fmtCOPShort(cumplimiento.realSum)} / {fmtCOPShort(cumplimiento.presSum)}</span>
              )}
            </div>
          </div>

          <div className="m-panel">
            <h3>Evolución mensual</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyChartData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#2A3E32" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="mes" stroke="#8FA398" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8FA398" tick={{ fontSize: 9 }} tickFormatter={fmtCOPShort} axisLine={false} tickLine={false} width={42} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Ingresos" stroke="#D9A441" fill="#D9A44133" strokeWidth={2} />
                <Area type="monotone" dataKey="Real" stroke="#F2EDE1" fill="transparent" strokeWidth={2} strokeDasharray="4 3" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="m-panel">
            <h3>Por unidad</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={unitPieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={2} stroke="none" onClick={(d) => setActiveUnit(d.unit)}>
                  {unitPieData.map((d) => (
                    <Cell key={d.unit} fill={UNIT_META[d.unit].color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip total={grandIngresos} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="m-pie-tags">
              {unitPieData.slice(0, 4).map((d) => (
                <button key={d.unit} type="button" className="m-pie-tag" onClick={() => setActiveUnit(d.unit)}>
                  <i style={{ background: UNIT_META[d.unit].color }} />
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {section === "lineas" && (
        <>
          <div className="m-month-pills">
            <button type="button" className={activeMonth === "TOTAL" ? "active" : ""} onClick={() => setActiveMonth("TOTAL")}>Jul–Dic</button>
            {MONTHS.map((m) => (
              <button key={m} type="button" className={activeMonth === m ? "active" : ""} onClick={() => setActiveMonth(m)}>{MONTH_SHORT[m]}</button>
            ))}
          </div>

          <div className="m-line-cards">
            {filteredItems.map((item) => {
              const cell = activeMonth === "TOTAL" ? null : item.meses[activeMonth];
              const q = activeMonth === "TOTAL" ? MONTHS.reduce((a, m) => a + (item.meses[m].q || 0), 0) : cell.q;
              const precio = activeMonth === "TOTAL" ? item.meses[MONTHS[0]].precio : cell.precio;
              const ingresos = activeMonth === "TOTAL" ? item.ingresos_total : cell.ingresos;
              const egresos = activeMonth === "TOTAL" ? item.egresos_total : cell.egresos;
              const utilidad = activeMonth === "TOTAL" ? item.utilidad_total : cell.utilidad;
              const qtyEditable = activeMonth !== "TOTAL";
              const edited = activeMonth !== "TOTAL" && cell.edited;
              const realQ = activeMonth === "TOTAL" ? (item.real_ingresos_total > 0 ? MONTHS.reduce((a, m) => a + (item.meses[m].real_q || 0), 0) : null) : cell.real_q;
              const realIngresos = activeMonth === "TOTAL" ? item.real_ingresos_total : (cell.has_real ? cell.real_ingresos : null);
              const realEgresos = activeMonth === "TOTAL" ? item.real_egresos_total : (cell.has_real ? cell.real_egresos : null);
              const realUtilidad = activeMonth === "TOTAL" ? item.real_utilidad_total : (cell.has_real ? cell.real_utilidad : null);
              const hasRealHere = activeMonth === "TOTAL" ? item.real_registrado : cell.has_real;
              const salesKey = activeMonth !== "TOTAL" ? `${item.idx}|${activeMonth}` : null;
              const saleLog = salesKey ? (sales[salesKey] || []) : [];
              const hasSaleLog = saleLog.length > 0;
              const isExpanded = expandedRow === item.idx && activeMonth !== "TOTAL";

              return (
                <article key={item.idx} className={"m-line-card" + (edited ? " edited" : "")}>
                  <div className="m-line-card-head">
                    <span className="unit-tag" style={{ color: UNIT_META[item.unidad].color, borderColor: UNIT_META[item.unidad].color }}>
                      {UNIT_META[item.unidad].label}
                    </span>
                    <span className="m-line-um">{item.um}</span>
                  </div>
                  <div className="m-line-title">{item.referencia}</div>
                  <div className="m-line-sub">{item.linea}</div>

                  <div className="m-field-grid">
                    <label>
                      <span>Cantidad</span>
                      {qtyEditable ? (
                        <NumberInput className="qty-input" value={q} onChange={(v) => setQty(item.idx, activeMonth, v)} />
                      ) : (
                        <strong>{q}</strong>
                      )}
                    </label>
                    <label>
                      <span>Precio</span>
                      <CurrencyInput
                        className="qty-input"
                        placeholder="—"
                        value={precio}
                        onChange={(digits) => activeMonth === "TOTAL" ? setPriceAllMonths(item.idx, digits) : setPrice(item.idx, activeMonth, digits)}
                      />
                    </label>
                  </div>

                  <div className="m-metrics-row">
                    <div><small>Ingresos</small><b>{fmtCOPShort(ingresos)}</b></div>
                    <div><small>Egresos</small><b>{fmtCOPShort(egresos)}</b></div>
                    <div><small>Utilidad</small><b className="accent">{fmtCOPShort(utilidad)}</b></div>
                  </div>

                  {activeMonth !== "TOTAL" && (
                    <>
                      <div className="m-real-block">
                        <div className="m-real-head">Ventas reales · {MONTH_SHORT[activeMonth]}</div>
                        <div className="m-field-grid">
                          <label>
                            <span>Q real</span>
                            {hasSaleLog ? (
                              <strong>{realQ ?? "—"}</strong>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                className="qty-input"
                                placeholder="—"
                                value={realQ ?? ""}
                                onChange={(e) => setRealQty(item.idx, activeMonth, e.target.value)}
                              />
                            )}
                          </label>
                          <label>
                            <span>Ingresos reales</span>
                            {hasSaleLog ? (
                              <strong>{realIngresos != null ? fmtCOPShort(realIngresos) : "—"}</strong>
                            ) : (
                              <input
                                type="number"
                                min="0"
                                className="qty-input"
                                placeholder="—"
                                value={realIngresos ?? ""}
                                onChange={(e) => setRealIngresos(item.idx, activeMonth, e.target.value)}
                              />
                            )}
                          </label>
                        </div>
                        {(realEgresos != null || realUtilidad != null) && (
                          <div className="m-metrics-row compact">
                            <div><small>Egr. real</small><b>{fmtCOPShort(realEgresos)}</b></div>
                            <div><small>Util. real</small><b className="accent">{fmtCOPShort(realUtilidad)}</b></div>
                          </div>
                        )}
                        <div className="m-line-actions">
                          <button type="button" className="m-text-btn" onClick={() => setExpandedRow(isExpanded ? null : item.idx)}>
                            {isExpanded ? "▾ Ocultar ventas" : "▸ Venta a venta"}
                          </button>
                          {hasRealHere && (
                            <button type="button" className="m-text-btn danger" onClick={() => clearRealForCell(item.idx, activeMonth)}>Eliminar real</button>
                          )}
                        </div>
                        {isExpanded && (
                          <SaleLog
                            entries={saleLog}
                            precio={cell.precio}
                            unit={item.um}
                            onAdd={(entry) => addSale(item.idx, activeMonth, entry, cell.precio)}
                            onRemove={(saleId) => removeSale(item.idx, activeMonth, saleId)}
                          />
                        )}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>

          <div className="m-totals-bar">
            <span>Totales</span>
            <b>{fmtCOPShort(totals.ingresos)}</b>
            <b className="accent">{fmtCOPShort(totals.utilidad)}</b>
            {totals.anyReal && <b>{fmtCOPShort(totals.realIngresos)} real</b>}
          </div>
        </>
      )}

      {section === "ventas" && (
        <>
          <p className="m-section-desc">Registra ventas por unidad estratégica. Se reflejan en cumplimiento y tablero.</p>
          <div className="m-unit-cards">
            {unitCompareData.map((d) => {
              const pct = d.presupuesto > 0 ? d.real / d.presupuesto : null;
              const log = unitSalesCombined[d.key] || [];
              const isOpen = expandedUnit === d.key;
              return (
                <div key={d.key} className="m-unit-card" style={{ borderLeftColor: UNIT_META[d.key].color }}>
                  <div className="m-unit-card-top">
                    <span className="unit-dot" style={{ background: UNIT_META[d.key].color }} />
                    <strong>{d.label}</strong>
                  </div>
                  <div className="m-unit-stats">
                    <div><small>Presupuesto</small><span>{fmtCOPShort(d.presupuesto)}</span></div>
                    <div><small>Real</small><span className="accent">{d.anyReal ? fmtCOPShort(d.real) : "—"}</span></div>
                    {pct != null && <div><small>Cumpl.</small><span>{fmtPct(pct)}</span></div>}
                  </div>
                  <button type="button" className="m-text-btn" onClick={() => setExpandedUnit(isOpen ? null : d.key)}>
                    {isOpen ? "▾ Cerrar" : `▸ Registrar (${log.length})`}
                  </button>
                  {isOpen && (
                    <UnitSaleLog
                      entries={log}
                      lineOptions={unitLineOptions[d.key] || []}
                      unit={d.key}
                      onAddLinea={(idx, mes, entry) => addLinkedSale(idx, mes, entry)}
                      onRemove={(entry) =>
                        entry.tipo === "linea"
                          ? removeLinkedSale(entry.idx, entry.mes, entry.id)
                          : removeUnitSale(d.key, entry.id)
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
          {hasReal && (
            <button type="button" className="reset-btn m-reset-btn" onClick={resetReal}>
              ↺ Borrar ventas reales
            </button>
          )}
        </>
      )}
    </div>
  );
}
