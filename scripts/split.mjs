import fs from "fs";
import path from "path";

const src = fs.readFileSync("presupuesto-manizales-comparte.jsx", "utf8");

// Extract everything between imports and RAW_DATA
const bodyStart = src.indexOf("const MONTHS");
const cssStart = src.indexOf("const CSS = `");
const body = src.slice(bodyStart, cssStart).trim();

const header = `import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { RAW_DATA } from "../data/rawData.js";
import {
  MONTHS, MONTH_SHORT, UNIT_META, UNIT_ORDER, UNIT_TICKET_LABEL, FUNNEL_STAGES,
} from "../constants/index.js";
import { fmtCOP, fmtCOPShort, fmtPct } from "../utils/format.js";
import { clone } from "../utils/clone.js";
import { storage } from "../utils/storage.js";
import { monthFromFecha } from "../utils/dates.js";
import { NumberInput } from "./inputs/NumberInput.jsx";
import { CurrencyInput } from "./inputs/CurrencyInput.jsx";
import { TopoLine } from "./layout/TopoLine.jsx";
import { GanttChart } from "./charts/GanttChart.jsx";
import { ChartTooltip, PieTooltip } from "./charts/ChartTooltips.jsx";
import { SaleLog } from "./sales/SaleLog.jsx";
import { UnitSaleLog } from "./sales/UnitSaleLog.jsx";
import { ControlDashboard } from "./dashboard/ControlDashboard.jsx";
import { ExecutivePresentation } from "./dashboard/ExecutivePresentation.jsx";
import { Sidebar } from "./layout/Sidebar.jsx";
import { PresupuestoDesktop } from "../views/desktop/PresupuestoDesktop.jsx";
import { PresupuestoMobile } from "../views/mobile/PresupuestoMobile.jsx";
import { ControlDashboardMobile } from "../views/mobile/ControlDashboardMobile.jsx";
import { MobileShell } from "./mobile/MobileShell.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import "../styles/app.css";
import "../styles/mobile.css";

`;

// Replace window.storage with storage
let transformed = body
  .replace(/window\.storage/g, "storage")
  .replace(/^const MONTHS[\s\S]*?^const UNIT_TICKET_LABEL[\s\S]*?};\s*/m, "")
  .replace(/^const fmtCOP[\s\S]*?^const clone[\s\S]*?;\s*/m, "")
  .replace(/^function NumberInput[\s\S]*?^function CurrencyInput[\s\S]*?^}\s*/m, "")
  .replace(/^function TopoLine[\s\S]*?^}\s*/m, "");

// Remove inline presupuesto view - we'll use PresupuestoDesktop/Mobile
// For now keep BudgetApp with conditional rendering added manually after export

const budgetAppMatch = transformed.match(/^export default function BudgetApp\(\) \{[\s\S]*?\n\}\s*(?=function GanttChart)/);
if (!budgetAppMatch) throw new Error("BudgetApp not found");

let budgetApp = budgetAppMatch[0];

// Add mobile hook and conditional layout - patch the return section
budgetApp = budgetApp.replace(
  "export default function BudgetApp() {",
  "export function BudgetApp() {\n  const isMobile = useIsMobile();"
);

// Replace the big return JSX structure - we'll patch Sidebar and main content
budgetApp = budgetApp.replace(
  /return \(\s*\n\s*<div className="app-root">\s*\n\s*<style>\{CSS\}<\/style>\s*\n\s*<aside className="sidebar">[\s\S]*?<\/aside>\s*\n\s*<main className="main">/,
  `if (!loaded) {
    return (
      <div className="app-root loading-root">
        <div className="loading-mark">MC</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileShell
        view={view}
        setView={setView}
        activeUnit={activeUnit}
        setActiveUnit={setActiveUnit}
        items={items}
        saveState={saveState}
        hasEdits={hasEdits}
        resetAll={resetAll}
        presentationOpen={presentationOpen}
        setPresentationOpen={setPresentationOpen}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        toast={toast}
        companyTotals={companyTotals}
        companyMonthly={companyMonthly}
        unitCompareData={unitCompareData}
        funnelTotals={funnelTotals}
        metaAnual={metaAnual}
        vendedores={vendedores}
      >
        {view === "tablero" ? (
          <ControlDashboardMobile
            funnelData={funnelData}
            funnelTotals={funnelTotals}
            funnelAnyData={funnelAnyData}
            stages={FUNNEL_STAGES}
            unitMeta={UNIT_META}
            unitOrder={UNIT_ORDER}
            onKpiChange={setKpiValue}
            kpis={kpis}
            onReset={resetKpis}
            vendedores={vendedores}
            onAddVendedor={addVendedor}
            onRemoveVendedor={removeVendedor}
            onVendedorMeta={setVendedorMeta}
            onVendedorAvance={setVendedorAvance}
            onVendedorUnidad={setVendedorUnidad}
            unitCompareData={unitCompareData}
            onUnitClick={(u) => { setView("presupuesto"); setActiveUnit(activeUnit === u ? "ALL" : u); }}
            ganttData={ganttData}
            ganttMetric={ganttMetric}
            onGanttMetricChange={setGanttMetric}
            hasReal={hasReal}
            activeUnit={activeUnit}
            onPresentation={() => { setSlideIndex(0); setPresentationOpen(true); }}
          />
        ) : (
          <PresupuestoMobile
            activeUnit={activeUnit}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
            filteredItems={filteredItems}
            totals={totals}
            monthlyChartData={monthlyChartData}
            unitPieData={unitPieData}
            grandIngresos={grandIngresos}
            grandEgresos={grandEgresos}
            grandUtilidad={grandUtilidad}
            avancePct={avancePct}
            presupuestoAnual={presupuestoAnual}
            metaAnual={metaAnual}
            cumplimiento={cumplimiento}
            unitCompareData={unitCompareData}
            unitSalesCombined={unitSalesCombined}
            unitLineOptions={unitLineOptions}
            expandedUnit={expandedUnit}
            setExpandedUnit={setExpandedUnit}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            sales={sales}
            setQty={setQty}
            setPrice={setPrice}
            setPriceAllMonths={setPriceAllMonths}
            setRealQty={setRealQty}
            setRealIngresos={setRealIngresos}
            clearRealForCell={clearRealForCell}
            addSale={addSale}
            removeSale={removeSale}
            addLinkedSale={addLinkedSale}
            removeLinkedSale={removeLinkedSale}
            removeUnitSale={removeUnitSale}
            resetReal={resetReal}
            hasReal={hasReal}
            unitReal={unitReal}
          />
        )}
      </MobileShell>
    );
  }

  return (
    <div className="app-root desktop-root">
      <Sidebar
        view={view}
        setView={setView}
        activeUnit={activeUnit}
        setActiveUnit={setActiveUnit}
        items={items}
        saveState={saveState}
        hasEdits={hasEdits}
        resetAll={resetAll}
      />
      <main className="main">`
);

// Remove duplicate loading check at start of original return
budgetApp = budgetApp.replace(
  /if \(!loaded\) \{\s*return \(\s*<div className="app-root loading-root">[\s\S]*?\);\s*\}\s*\n\s*return/,
  "return"
);

// Replace presupuesto desktop section with PresupuestoDesktop component
budgetApp = budgetApp.replace(
  /\{view === "tablero" \? \(\s*<ControlDashboard[\s\S]*?\) : \(\s*<>\s*<section className="kpi-row">[\s\S]*?<\/section>\s*\)\}/,
  `{view === "tablero" ? (
          <ControlDashboard
            funnelData={funnelData}
            funnelTotals={funnelTotals}
            funnelAnyData={funnelAnyData}
            stages={FUNNEL_STAGES}
            unitMeta={UNIT_META}
            unitOrder={UNIT_ORDER}
            onKpiChange={setKpiValue}
            kpis={kpis}
            onReset={resetKpis}
            vendedores={vendedores}
            onAddVendedor={addVendedor}
            onRemoveVendedor={removeVendedor}
            onVendedorMeta={setVendedorMeta}
            onVendedorAvance={setVendedorAvance}
            onVendedorUnidad={setVendedorUnidad}
            unitCompareData={unitCompareData}
            onUnitClick={(u) => { setView("presupuesto"); setActiveUnit(activeUnit === u ? "ALL" : u); }}
            ganttData={ganttData}
            ganttMetric={ganttMetric}
            onGanttMetricChange={setGanttMetric}
            hasReal={hasReal}
            activeUnit={activeUnit}
          />
        ) : (
          <PresupuestoDesktop
            activeUnit={activeUnit}
            setActiveUnit={setActiveUnit}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
            filteredItems={filteredItems}
            totals={totals}
            monthlyChartData={monthlyChartData}
            unitPieData={unitPieData}
            grandIngresos={grandIngresos}
            grandEgresos={grandEgresos}
            grandUtilidad={grandUtilidad}
            avancePct={avancePct}
            presupuestoAnual={presupuestoAnual}
            metaAnual={metaAnual}
            cumplimiento={cumplimiento}
            unitCompareData={unitCompareData}
            unitSalesCombined={unitSalesCombined}
            unitLineOptions={unitLineOptions}
            expandedUnit={expandedUnit}
            setExpandedUnit={setExpandedUnit}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            sales={sales}
            setQty={setQty}
            setPrice={setPrice}
            setPriceAllMonths={setPriceAllMonths}
            setRealQty={setRealQty}
            setRealIngresos={setRealIngresos}
            clearRealForCell={clearRealForCell}
            addSale={addSale}
            removeSale={removeSale}
            addLinkedSale={addLinkedSale}
            removeLinkedSale={removeLinkedSale}
            removeUnitSale={removeUnitSale}
            resetReal={resetReal}
            hasReal={hasReal}
            unitReal={unitReal}
          />
        )}`
);

// Extract helper components
const components = {
  GanttChart: transformed.match(/^function GanttChart[\s\S]*?\n\}\s*(?=function ChartTooltip)/)?.[0],
  ChartTooltip: transformed.match(/^function ChartTooltip[\s\S]*?\n\}\s*(?=function PieTooltip)/)?.[0],
  PieTooltip: transformed.match(/^function PieTooltip[\s\S]*?\n\}\s*(?=function SaleLog)/)?.[0],
  SaleLog: transformed.match(/^function SaleLog[\s\S]*?\n\}\s*(?=const MONTH_FROM_JS_INDEX)/)?.[0],
  UnitSaleLog: transformed.match(/^function UnitSaleLog[\s\S]*?\n\}\s*(?=function ControlDashboard)/)?.[0],
  ControlDashboard: transformed.match(/^function ControlDashboard[\s\S]*?\n\}\s*(?=function VendedoresPanel)/)?.[0],
  VendedoresPanel: transformed.match(/^function VendedoresPanel[\s\S]*?\n\}\s*(?=function ExecutivePresentation)/)?.[0],
  ExecutivePresentation: transformed.match(/^function ExecutivePresentation[\s\S]*?\n\}\s*(?=const CSS)/)?.[0],
};

for (const [name, code] of Object.entries(components)) {
  if (!code) throw new Error(`Component ${name} not found`);
}

// Remove FUNNEL_STAGES from budgetApp if duplicated
budgetApp = budgetApp.replace(
  /  const FUNNEL_STAGES = \[[\s\S]*?\];\s*\n\s*const funnelData/,
  "  const funnelData"
);

const dirs = [
  "src/app",
  "src/components/inputs",
  "src/components/layout",
  "src/components/charts",
  "src/components/sales",
  "src/components/dashboard",
  "src/components/mobile",
  "src/views/desktop",
  "src/views/mobile",
  "src/hooks",
  "src/utils",
  "src/constants",
];
dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

fs.writeFileSync("src/app/BudgetApp.jsx", header + budgetApp + "\n");

// Write component files with proper imports
const compImports = `import React, { useState, useEffect } from "react";
import { fmtCOP, fmtCOPShort, fmtPct } from "../../utils/format.js";
`;

const saleImports = compImports + `import { UNIT_TICKET_LABEL } from "../../constants/index.js";
import { monthFromFecha } from "../../utils/dates.js";
`;

const dashboardImports = compImports + `import { GanttChart } from "../charts/GanttChart.jsx";
`;

fs.writeFileSync("src/components/charts/GanttChart.jsx", compImports + components.GanttChart.replace(/^function GanttChart/, "export function GanttChart"));
fs.writeFileSync("src/components/charts/ChartTooltips.jsx", compImports + components.ChartTooltip.replace(/^function ChartTooltip/, "export function ChartTooltip") + "\n" + components.PieTooltip.replace(/^function PieTooltip/, "export function PieTooltip"));
fs.writeFileSync("src/components/sales/SaleLog.jsx", saleImports + components.SaleLog.replace(/^function SaleLog/, "export function SaleLog"));
fs.writeFileSync("src/components/sales/UnitSaleLog.jsx", saleImports + components.UnitSaleLog.replace(/^function UnitSaleLog/, "export function UnitSaleLog").replace(/^const MONTH_FROM_JS_INDEX[\s\S]*?^const monthFromFecha[\s\S]*?;\s*/m, ""));

fs.writeFileSync("src/components/dashboard/ControlDashboard.jsx", dashboardImports + components.ControlDashboard.replace(/^function ControlDashboard/, "export function ControlDashboard"));
fs.writeFileSync("src/components/dashboard/VendedoresPanel.jsx", compImports + `import { UNIT_ORDER } from "../../constants/index.js";\n` + components.VendedoresPanel.replace(/^function VendedoresPanel/, "export function VendedoresPanel"));

// Fix ControlDashboard to import VendedoresPanel
let controlDash = fs.readFileSync("src/components/dashboard/ControlDashboard.jsx", "utf8");
controlDash = controlDash.replace(
  "import { GanttChart } from \"../charts/GanttChart.jsx\";\n",
  "import { GanttChart } from \"../charts/GanttChart.jsx\";\nimport { VendedoresPanel } from \"./VendedoresPanel.jsx\";\n"
);
fs.writeFileSync("src/components/dashboard/ControlDashboard.jsx", controlDash);

fs.writeFileSync("src/components/dashboard/ExecutivePresentation.jsx", compImports + `import { UNIT_ORDER } from "../../constants/index.js";\n` + components.ExecutivePresentation.replace(/^function ExecutivePresentation/, "export function ExecutivePresentation"));

console.log("Split complete");
