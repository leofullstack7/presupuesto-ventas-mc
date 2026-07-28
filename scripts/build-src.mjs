import fs from "fs";

const src = fs.readFileSync("presupuesto-manizales-comparte.jsx", "utf8");
const bodyStart = src.indexOf("const MONTHS");
const cssStart = src.indexOf("const CSS = `");
let body = src.slice(bodyStart, cssStart);

// Remove extracted sections
body = body.replace(/^const MONTHS[\s\S]*?^const UNIT_TICKET_LABEL[\s\S]*?};\s*/m, "");
body = body.replace(/^const fmtCOP[\s\S]*?^const clone[\s\S]*?;\s*/m, "");
body = body.replace(/^function NumberInput[\s\S]*?^function CurrencyInput[\s\S]*?^}\s*/m, "");
body = body.replace(/^function TopoLine[\s\S]*?^}\s*/m, "");
body = body.replace(/window\.storage/g, "storage");

const imports = `import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { RAW_DATA } from "../data/rawData.js";
import {
  MONTHS, MONTH_SHORT, UNIT_META, UNIT_ORDER, UNIT_TICKET_LABEL, FUNNEL_STAGES,
} from "../constants/index.js";
import { fmtCOP, fmtCOPShort, fmtPct } from "../utils/format.js";
import { clone } from "../utils/clone.js";
import { storage } from "../utils/storage.js";
import { NumberInput } from "../components/inputs/NumberInput.jsx";
import { CurrencyInput } from "../components/inputs/CurrencyInput.jsx";
import { TopoLine } from "../components/layout/TopoLine.jsx";
import { GanttChart } from "../components/charts/GanttChart.jsx";
import { ChartTooltip, PieTooltip } from "../components/charts/ChartTooltips.jsx";
import { SaleLog } from "../components/sales/SaleLog.jsx";
import { UnitSaleLog } from "../components/sales/UnitSaleLog.jsx";
import { ControlDashboard } from "../components/dashboard/ControlDashboard.jsx";
import { ExecutivePresentation } from "../components/dashboard/ExecutivePresentation.jsx";
import { Sidebar } from "../components/layout/Sidebar.jsx";
import { PresupuestoDesktop } from "../views/desktop/PresupuestoDesktop.jsx";
import { PresupuestoMobile } from "../views/mobile/PresupuestoMobile.jsx";
import { ControlDashboardMobile } from "../views/mobile/ControlDashboardMobile.jsx";
import { MobileShell } from "../components/mobile/MobileShell.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import "../styles/app.css";
import "../styles/mobile.css";

`;

body = body.replace(/^export default function BudgetApp/, "export function BudgetApp");
body = body.replace(
  /  const FUNNEL_STAGES = \[[\s\S]*?\];\s*\n/,
  ""
);

// Remove embedded style and extract sidebar - patch return
body = body.replace(
  /\s*<style>\{CSS\}<\/style>\s*\n\s*<aside className="sidebar">[\s\S]*?<\/aside>\s*\n/,
  `\n      <Sidebar
        view={view}
        setView={setView}
        activeUnit={activeUnit}
        setActiveUnit={setActiveUnit}
        items={items}
        saveState={saveState}
        hasEdits={hasEdits}
        resetAll={resetAll}
      />\n`
);

body = body.replace(
  /export function BudgetApp\(\) \{/,
  `export function BudgetApp() {
  const isMobile = useIsMobile();`
);

// Insert mobile branch before desktop return's loading check stays
const loadingBlock = `  if (!loaded) {
    return (
      <div className="app-root loading-root">
        <div className="loading-mark">MC</div>
      </div>
    );
  }

  const mobileProps = {
    view, setView, activeUnit, setActiveUnit, items, saveState, hasEdits, resetAll,
    presentationOpen, setPresentationOpen, slideIndex, setSlideIndex, toast,
    companyTotals, companyMonthly, unitCompareData, funnelTotals, metaAnual, vendedores,
    funnelData, funnelAnyData, kpis, setKpiValue, resetKpis, addVendedor, removeVendedor,
    setVendedorMeta, setVendedorAvance, setVendedorUnidad, ganttData, ganttMetric, setGanttMetric,
    hasReal, activeMonth, setActiveMonth, filteredItems, totals, monthlyChartData, unitPieData,
    grandIngresos, grandEgresos, grandUtilidad, avancePct, presupuestoAnual, cumplimiento,
    unitSalesCombined, unitLineOptions, expandedUnit, setExpandedUnit, expandedRow, setExpandedRow,
    sales, setQty, setPrice, setPriceAllMonths, setRealQty, setRealIngresos, clearRealForCell,
    addSale, removeSale, addLinkedSale, removeLinkedSale, removeUnitSale, resetReal, unitReal,
  };

  if (isMobile) {
    return <MobileApp {...mobileProps} />;
  }

`;

body = body.replace(
  /  if \(!loaded\) \{\s*return \(\s*<div className="app-root loading-root">[\s\S]*?\);\s*\}\s*\n\s*return \(\s*\n\s*<div className="app-root">/,
  loadingBlock + `  return (
    <div className="app-root desktop-root">`
);

// Replace presupuesto desktop content with component - find the section from kpi-row to before footer in presupuesto branch
// Instead wrap: replace tablero/presupuesto conditional content
body = body.replace(
  /\{view === "tablero" \? \(\s*\n\s*<ControlDashboard/,
  `{view === "tablero" ? (
          <ControlDashboard`
);

// Remove trailing component definitions from BudgetApp file
const cutAt = body.indexOf("\nfunction GanttChart");
if (cutAt > 0) body = body.slice(0, cutAt);

fs.mkdirSync("src/app", { recursive: true });
fs.writeFileSync("src/app/BudgetApp.jsx", imports + body);

// Extract components to separate files from original
const compBlock = src.slice(bodyStart, cssStart);
const extract = (name, nextName) => {
  const re = new RegExp(`^function ${name}[\\s\\S]*?(?=^function ${nextName}|^const MONTH_FROM|^const CSS)`, "m");
  return compBlock.match(re)?.[0] || null;
};

const gantt = extract("GanttChart", "ChartTooltip");
const chartTt = extract("ChartTooltip", "PieTooltip");
const pieTt = extract("PieTooltip", "SaleLog");
const saleLog = extract("SaleLog", "UnitSaleLog");
const unitSaleLog = extract("UnitSaleLog", "ControlDashboard");
const controlDash = extract("ControlDashboard", "VendedoresPanel");
const vendedores = extract("VendedoresPanel", "ExecutivePresentation");
const execPres = extract("ExecutivePresentation", "const CSS");

const compHeader = `import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
`;

const dirs = ["src/components/inputs","src/components/layout","src/components/charts","src/components/sales","src/components/dashboard","src/components/mobile","src/views/desktop","src/views/mobile"];
dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

fs.writeFileSync("src/components/inputs/NumberInput.jsx", `import { useState, useEffect } from "react";\n` + compBlock.match(/^function NumberInput[\s\S]*?^}\s*(?=function CurrencyInput)/m)[0].replace("function NumberInput", "export function NumberInput"));
fs.writeFileSync("src/components/inputs/CurrencyInput.jsx", `import { useState, useEffect } from "react";\nimport { fmtCOP } from "../../utils/format.js";\n` + compBlock.match(/^function CurrencyInput[\s\S]*?^}\s*(?=function TopoLine)/m)[0].replace("function CurrencyInput", "export function CurrencyInput"));
fs.writeFileSync("src/components/layout/TopoLine.jsx", compBlock.match(/^function TopoLine[\s\S]*?^}\s*(?=export default)/m)[0].replace("function TopoLine", "export function TopoLine"));

fs.writeFileSync("src/components/charts/GanttChart.jsx", compHeader + gantt.replace("function GanttChart", "export function GanttChart"));
fs.writeFileSync("src/components/charts/ChartTooltips.jsx", compHeader + chartTt.replace("function ChartTooltip", "export function ChartTooltip") + "\n" + pieTt.replace("function PieTooltip", "export function PieTooltip"));
fs.writeFileSync("src/components/sales/SaleLog.jsx", compHeader + saleLog.replace("function SaleLog", "export function SaleLog"));
fs.writeFileSync("src/components/sales/UnitSaleLog.jsx", compHeader + `import { UNIT_TICKET_LABEL } from "../../constants/index.js";\nimport { monthFromFecha } from "../../utils/dates.js";\n` + unitSaleLog.replace(/^const MONTH_FROM_JS_INDEX[\s\S]*?^const monthFromFecha[\s\S]*?;\s*/m, "").replace("function UnitSaleLog", "export function UnitSaleLog"));
fs.writeFileSync("src/components/dashboard/ControlDashboard.jsx", compHeader + `import { GanttChart } from "../charts/GanttChart.jsx";\nimport { VendedoresPanel } from "./VendedoresPanel.jsx";\n` + controlDash.replace("function ControlDashboard", "export function ControlDashboard"));
fs.writeFileSync("src/components/dashboard/VendedoresPanel.jsx", compHeader + vendedores.replace("function VendedoresPanel", "export function VendedoresPanel"));
fs.writeFileSync("src/components/dashboard/ExecutivePresentation.jsx", compHeader + execPres.replace("function ExecutivePresentation", "export function ExecutivePresentation"));

console.log("Generated BudgetApp and components");
