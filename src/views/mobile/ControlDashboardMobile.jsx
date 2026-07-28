import { ControlDashboard } from "../../components/dashboard/ControlDashboard.jsx";
import { FUNNEL_STAGES, UNIT_META, UNIT_ORDER } from "../../constants/index.js";

export function ControlDashboardMobile(props) {
  return (
    <div className="m-tablero">
      <p className="m-section-desc">
        Embudo comercial, cumplimiento por unidad y seguimiento de vendedores.
      </p>
      <ControlDashboard
        funnelData={props.funnelData}
        funnelTotals={props.funnelTotals}
        funnelAnyData={props.funnelAnyData}
        stages={FUNNEL_STAGES}
        unitMeta={UNIT_META}
        unitOrder={UNIT_ORDER}
        onKpiChange={props.setKpiValue}
        kpis={props.kpis}
        onReset={props.resetKpis}
        vendedores={props.vendedores}
        onAddVendedor={props.addVendedor}
        onRemoveVendedor={props.removeVendedor}
        onVendedorMeta={props.setVendedorMeta}
        onVendedorAvance={props.setVendedorAvance}
        onVendedorUnidad={props.setVendedorUnidad}
        unitCompareData={props.unitCompareData}
        onUnitClick={(u) => { props.setView("presupuesto"); props.setActiveUnit(props.activeUnit === u ? "ALL" : u); }}
        ganttData={props.ganttData}
        ganttMetric={props.ganttMetric}
        onGanttMetricChange={props.setGanttMetric}
        hasReal={props.hasReal}
        activeUnit={props.activeUnit}
      />
    </div>
  );
}
