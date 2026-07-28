import React, { useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";

export function ExecutivePresentation({
  slideIndex, setSlideIndex, onClose,
  companyTotals, companyMonthly, unitCompareData, unitMeta, unitOrder,
  funnelTotals, stages, vendedores, metaAnual,
}) {
  const SLIDE_COUNT = 7;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setSlideIndex((i) => Math.min(SLIDE_COUNT - 1, i + 1));
      else if (e.key === "ArrowLeft") setSlideIndex((i) => Math.max(0, i - 1));
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSlideIndex, onClose]);

  const next = () => setSlideIndex((i) => Math.min(SLIDE_COUNT - 1, i + 1));
  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));

  const rankedUnits = unitOrder
    .map((u) => unitCompareData.find((d) => d.key === u))
    .filter((d) => d && d.anyReal && d.presupuesto > 0)
    .sort((a, b) => (b.real / b.presupuesto) - (a.real / a.presupuesto));
  const bestUnit = rankedUnits[0];
  const worstUnit = rankedUnits.length > 1 ? rankedUnits[rankedUnits.length - 1] : null;

  const monthsWithReal = companyMonthly.filter((m) => m.anyReal);
  const bestMonth = monthsWithReal.length
    ? monthsWithReal.reduce((a, b) => (b.ingresosR > a.ingresosR ? b : a))
    : null;

  const rankedVendedores = vendedores
    .map((v) => ({ ...v, pct: v.metas.ventas > 0 ? v.avance.ventas / v.metas.ventas : null }))
    .filter((v) => v.pct != null)
    .sort((a, b) => b.pct - a.pct);

  const todayStr = new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const maxUnitVal = Math.max(1, ...unitCompareData.map((d) => Math.max(d.presupuesto, d.real)));
  const maxMonthVal = Math.max(1, ...companyMonthly.map((m) => Math.max(m.ingresosP, m.ingresosR)));
  const metaPct = metaAnual > 0 ? companyTotals.presupuesto / metaAnual : null;

  return (
    <div className="presentation-overlay">
      <div className="presentation-topbar no-print">
        <span className="presentation-counter">Diapositiva {slideIndex + 1} de {SLIDE_COUNT}</span>
        <div className="presentation-actions">
          <button onClick={() => window.print()}>🖨️ Imprimir</button>
          <button onClick={onClose}>✕ Cerrar</button>
        </div>
      </div>

      <div className="presentation-slide-wrap">
        {slideIndex === 0 && (
          <section className="pres-slide pres-cover">
            <p className="pres-eyebrow">Manizales Comparte · Junta directiva</p>
            <h1>Presupuesto de ventas</h1>
            <h2 className="pres-cover-sub">Segundo semestre 2026 — Julio a diciembre</h2>
            <div className="pres-cover-meta">
              <span>Presentación ejecutiva</span>
              <span>·</span>
              <span>{todayStr}</span>
            </div>
          </section>
        )}

        {slideIndex === 1 && (
          <section className="pres-slide">
            <h2 className="pres-title">Resumen ejecutivo</h2>
            <div className="pres-kpi-grid">
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Presupuesto Jul–Dic</span>
                <span className="pres-kpi-value">{fmtCOP(companyTotals.presupuesto)}</span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Ventas reales registradas</span>
                <span className="pres-kpi-value accent">
                  {companyTotals.anyReal ? fmtCOP(companyTotals.real) : "Sin registrar"}
                </span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">% de cumplimiento</span>
                <span className="pres-kpi-value">{companyTotals.pct != null ? fmtPct(companyTotals.pct) : "—"}</span>
              </div>
              <div className="pres-kpi-card">
                <span className="pres-kpi-label">Utilidad real</span>
                <span className="pres-kpi-value accent">
                  {companyTotals.anyReal ? fmtCOP(companyTotals.realUtilidad) : "Sin registrar"}
                </span>
              </div>
            </div>
            {metaPct != null && (
              <p className="pres-note">
                El presupuesto del semestre representa el <b>{fmtPct(metaPct)}</b> de la meta anual de ventas 2026
                ({fmtCOP(metaAnual)}).
              </p>
            )}
          </section>
        )}

        {slideIndex === 2 && (
          <section className="pres-slide">
            <h2 className="pres-title">Ventas por cada U.E.N.</h2>
            <div className="pres-bars">
              {unitCompareData.map((d) => (
                <div className="pres-bar-row" key={d.key}>
                  <span className="pres-bar-label">{d.label}</span>
                  <div className="pres-bar-track">
                    <div className="pres-bar-budget" style={{ width: `${(d.presupuesto / maxUnitVal) * 100}%` }} />
                    {d.anyReal && (
                      <div
                        className="pres-bar-real"
                        style={{ width: `${(d.real / maxUnitVal) * 100}%`, background: unitMeta[d.key].color }}
                      />
                    )}
                  </div>
                  <span className="pres-bar-value">
                    {d.anyReal ? fmtCOPShort(d.real) : "—"} / {fmtCOPShort(d.presupuesto)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pres-legend">
              <span><i className="pres-legend-dot budget" /> Presupuesto</span>
              <span><i className="pres-legend-dot real" /> Ventas reales</span>
            </div>
          </section>
        )}

        {slideIndex === 3 && (
          <section className="pres-slide">
            <h2 className="pres-title">Cronograma mensual — Ingresos</h2>
            <div className="pres-bars">
              {companyMonthly.map((m) => (
                <div className="pres-bar-row" key={m.key}>
                  <span className="pres-bar-label">{m.label}</span>
                  <div className="pres-bar-track">
                    <div className="pres-bar-budget" style={{ width: `${(m.ingresosP / maxMonthVal) * 100}%` }} />
                    {m.anyReal && (
                      <div className="pres-bar-real" style={{ width: `${(m.ingresosR / maxMonthVal) * 100}%` }} />
                    )}
                  </div>
                  <span className="pres-bar-value">
                    {m.anyReal ? fmtCOPShort(m.ingresosR) : "—"} / {fmtCOPShort(m.ingresosP)}
                  </span>
                </div>
              ))}
            </div>
            {bestMonth && (
              <p className="pres-note">
                <b>{bestMonth.label}</b> es el mes con mayores ingresos reales registrados hasta ahora
                ({fmtCOP(bestMonth.ingresosR)}).
              </p>
            )}
          </section>
        )}

        {slideIndex === 4 && (
          <section className="pres-slide">
            <h2 className="pres-title">Embudo comercial consolidado</h2>
            {funnelTotals[0] > 0 ? (
              <div className="pres-funnel">
                {stages.map((s, i) => (
                  <div className="pres-funnel-stage" key={s.key}>
                    <div className="pres-funnel-bar-wrap">
                      <div
                        className="pres-funnel-bar"
                        style={{ width: `${Math.max(4, (funnelTotals[i] / funnelTotals[0]) * 100)}%` }}
                      />
                    </div>
                    <div className="pres-funnel-label">
                      <span>{s.label}</span>
                      <b>{funnelTotals[i]}</b>
                    </div>
                  </div>
                ))}
                <p className="pres-note">
                  Tasa de cierre general: <b>{fmtPct(funnelTotals[stages.length - 1] / funnelTotals[0])}</b> (prospectos → ventas cerradas)
                </p>
              </div>
            ) : (
              <p className="pres-empty">Aún no se han registrado indicadores del embudo comercial.</p>
            )}
          </section>
        )}

        {slideIndex === 5 && (
          <section className="pres-slide">
            <h2 className="pres-title">Vendedores destacados</h2>
            {rankedVendedores.length ? (
              <table className="pres-table">
                <thead>
                  <tr><th>Vendedor</th><th className="num">Meta ventas</th><th className="num">Avance</th><th className="num">% cumplimiento</th></tr>
                </thead>
                <tbody>
                  {rankedVendedores.map((v) => (
                    <tr key={v.id}>
                      <td>{v.nombre}</td>
                      <td className="num">{v.metas.ventas}</td>
                      <td className="num">{v.avance.ventas}</td>
                      <td className="num"><b className={v.pct >= 1 ? "pos" : ""}>{fmtPct(v.pct)}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="pres-empty">Aún no hay vendedores con meta de ventas registrada.</p>
            )}
          </section>
        )}

        {slideIndex === 6 && (
          <section className="pres-slide">
            <h2 className="pres-title">Conclusiones y próximos pasos</h2>
            <ul className="pres-conclusions">
              {companyTotals.anyReal ? (
                <li>
                  Llevamos <b>{fmtPct(companyTotals.pct)}</b> de cumplimiento del presupuesto del semestre
                  ({fmtCOP(companyTotals.real)} de {fmtCOP(companyTotals.presupuesto)} presupuestados).
                </li>
              ) : (
                <li>Aún no se han registrado ventas reales del semestre para medir el cumplimiento.</li>
              )}
              {bestUnit && (
                <li>
                  <b>{bestUnit.label}</b> es la unidad con mejor cumplimiento
                  ({fmtPct(bestUnit.real / bestUnit.presupuesto)}).
                </li>
              )}
              {worstUnit && (
                <li>
                  <b>{worstUnit.label}</b> es la unidad con mayor oportunidad de mejora
                  ({fmtPct(worstUnit.real / worstUnit.presupuesto)} de cumplimiento) — requiere atención prioritaria.
                </li>
              )}
              {bestMonth && (
                <li><b>{bestMonth.label}</b> fue el mes de mejor desempeño en ingresos reales.</li>
              )}
              <li>Próximo paso: definir acciones comerciales concretas para las unidades y meses rezagados frente al presupuesto.</li>
            </ul>
          </section>
        )}
      </div>

      <div className="presentation-nav no-print">
        <button onClick={prev} disabled={slideIndex === 0}>← Anterior</button>
        <div className="presentation-dots">
          {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
            <button
              key={i}
              className={"pres-dot" + (i === slideIndex ? " active" : "")}
              onClick={() => setSlideIndex(i)}
              title={`Diapositiva ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} disabled={slideIndex === SLIDE_COUNT - 1}>Siguiente →</button>
      </div>
    </div>
  );
}
