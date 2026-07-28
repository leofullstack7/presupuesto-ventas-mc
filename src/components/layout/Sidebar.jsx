import { UNIT_META, UNIT_ORDER } from "../../constants/index.js";
import { fmtCOPShort } from "../../utils/format.js";
import { BackupControls } from "./BackupControls.jsx";

export function Sidebar({
  view,
  setView,
  activeUnit,
  setActiveUnit,
  items,
  saveState,
  hasEdits,
  resetAll,
  onExportBackup,
  onImportBackup,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">MC</div>
        <div className="brand-text">
          <div className="brand-title">Manizales Comparte</div>
          <div className="brand-sub">Presupuesto 2026 · Jul–Dic</div>
        </div>
      </div>

      <button
        className={"dashboard-btn" + (view === "tablero" ? " active" : "")}
        onClick={() => setView(view === "tablero" ? "presupuesto" : "tablero")}
      >
        <span className="dashboard-btn-icon">◫</span>
        {view === "tablero" ? "← Volver al presupuesto" : "Tablero de control"}
      </button>

      <nav className="unit-nav">
        <button
          className={"unit-btn" + (activeUnit === "ALL" && view === "presupuesto" ? " active" : "")}
          onClick={() => { setView("presupuesto"); setActiveUnit("ALL"); }}
        >
          <span className="unit-dot all-dot" />
          Todas las unidades
        </button>
        {UNIT_ORDER.map((u) => {
          const meta = UNIT_META[u];
          const sum = items.filter((i) => i.unidad === u).reduce((a, i) => a + i.ingresos_total, 0);
          return (
            <button
              key={u}
              className={"unit-btn" + (activeUnit === u && view === "presupuesto" ? " active" : "")}
              onClick={() => { setView("presupuesto"); setActiveUnit(u); }}
              style={activeUnit === u ? { borderColor: meta.color } : undefined}
            >
              <span className="unit-dot" style={{ background: meta.color }} />
              <span className="unit-btn-label">{meta.label}</span>
              <span className="unit-btn-value">{fmtCOPShort(sum)}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <BackupControls onExport={onExportBackup} onImport={onImportBackup} />
        <button className="reset-btn" onClick={resetAll} disabled={!hasEdits}>
          ↺ Restaurar cifras originales
        </button>
        <div className={"save-indicator " + saveState}>
          {saveState === "saving" && "Guardando…"}
          {saveState === "saved" && "✓ Guardado"}
          {saveState === "idle" && hasEdits && "Cambios guardados localmente"}
          {saveState === "idle" && !hasEdits && "Datos del archivo original"}
        </div>
      </div>
    </aside>
  );
}
