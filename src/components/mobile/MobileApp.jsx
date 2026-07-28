import { MobileShell } from "./MobileShell.jsx";
import { PresupuestoMobile } from "../../views/mobile/PresupuestoMobile.jsx";
import { ControlDashboardMobile } from "../../views/mobile/ControlDashboardMobile.jsx";
import { ExecutivePresentation } from "../dashboard/ExecutivePresentation.jsx";
import { FUNNEL_STAGES, UNIT_META, UNIT_ORDER } from "../../constants/index.js";

export function MobileApp(props) {
  const {
    view, setView, activeUnit, setActiveUnit, saveState, hasEdits, resetAll,
    onExportBackup, onImportBackup,
    presentationOpen, setPresentationOpen, slideIndex, setSlideIndex, toast,
    companyTotals, companyMonthly, unitCompareData, funnelTotals, metaAnual, vendedores,
  } = props;

  return (
    <MobileShell
      view={view}
      setView={setView}
      activeUnit={activeUnit}
      setActiveUnit={setActiveUnit}
      items={props.items}
      saveState={saveState}
      hasEdits={hasEdits}
      resetAll={resetAll}
      onExportBackup={onExportBackup}
      onImportBackup={onImportBackup}
      toast={toast}
      onPresentation={() => { setSlideIndex(0); setPresentationOpen(true); }}
    >
      {view === "tablero" ? (
        <ControlDashboardMobile {...props} onPresentation={() => { setSlideIndex(0); setPresentationOpen(true); }} />
      ) : (
        <PresupuestoMobile {...props} />
      )}

      {presentationOpen && (
        <ExecutivePresentation
          slideIndex={slideIndex}
          setSlideIndex={setSlideIndex}
          onClose={() => setPresentationOpen(false)}
          companyTotals={companyTotals}
          companyMonthly={companyMonthly}
          unitCompareData={unitCompareData}
          unitMeta={UNIT_META}
          unitOrder={UNIT_ORDER}
          funnelTotals={funnelTotals}
          stages={FUNNEL_STAGES}
          vendedores={vendedores}
          metaAnual={metaAnual}
        />
      )}
    </MobileShell>
  );
}
