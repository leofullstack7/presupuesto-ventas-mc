import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
export function GanttChart({ data, colorFn, onRowClick, showBudgetValue = true }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.presupuesto, d.real)));
  return (
    <div className="gantt">
      {data.map((d) => {
        const pW = (d.presupuesto / max) * 100;
        const rW = (d.real / max) * 100;
        const over = d.anyReal && d.real >= d.presupuesto;
        const clickable = !!onRowClick;
        return (
          <div
            className={"gantt-row" + (clickable ? " clickable" : "")}
            key={d.key}
            onClick={clickable ? () => onRowClick(d.key) : undefined}
          >
            <div className="gantt-label">
              {colorFn && <span className="gantt-dot" style={{ background: colorFn(d.key) }} />}
              {d.label}
            </div>
            <div className="gantt-track">
              <div className="gantt-bar gantt-bar-budget" style={{ width: `${pW}%` }}>
                {showBudgetValue && <span className="gantt-bar-value budget-value">{fmtCOPShort(d.presupuesto)}</span>}
              </div>
              {d.anyReal && (
                <div
                  className={"gantt-bar gantt-bar-real" + (over ? " over" : "")}
                  style={{ width: `${Math.max(rW, 2)}%`, background: colorFn ? colorFn(d.key) : undefined }}
                >
                  <span className="gantt-bar-value real-value">{fmtCOPShort(d.real)}</span>
                </div>
              )}
            </div>
            <div className="gantt-status">
              {d.anyReal ? (
                <span className={over ? "var-pos" : "var-neg"}>
                  {over ? "✓ " : ""}{fmtPct(d.presupuesto > 0 ? d.real / d.presupuesto : 0)}
                </span>
              ) : (
                <span className="muted">sin registro</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

