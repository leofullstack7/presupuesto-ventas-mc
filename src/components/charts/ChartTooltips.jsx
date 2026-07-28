import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="ct-row">
          <i style={{ background: p.stroke }} />
          <span>{p.dataKey}</span>
          <b>{fmtCOP(p.value)}</b>
        </div>
      ))}
    </div>
  );
}


export function PieTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{d.name}</div>
      <div className="ct-row">
        <b>{fmtCOP(d.value)}</b>
        <span className="muted"> · {fmtPct(d.value / (total || 1))}</span>
      </div>
    </div>
  );
}

