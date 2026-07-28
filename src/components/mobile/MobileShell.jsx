import { useState } from "react";
import { UNIT_META, UNIT_ORDER } from "../../constants/index.js";
import { fmtCOPShort } from "../../utils/format.js";
import { BackupControls } from "../layout/BackupControls.jsx";

export function MobileShell({
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
  toast,
  onPresentation,
  children,
}) {
  const [unitsOpen, setUnitsOpen] = useState(false);

  const unitLabel = activeUnit === "ALL" ? "Todas" : UNIT_META[activeUnit].label;

  return (
    <div className="mobile-root">
      <header className="mobile-header">
        <div className="mobile-brand">
          <span className="mobile-mark">MC</span>
          <div>
            <div className="mobile-title">Presupuesto 2026</div>
            <div className="mobile-sub">{view === "tablero" ? "Tablero de control" : unitLabel}</div>
          </div>
        </div>
        <div className="mobile-header-actions">
          {view === "tablero" && (
            <button type="button" className="mobile-icon-btn" onClick={onPresentation} aria-label="Presentación">
              🖥
            </button>
          )}
          <button type="button" className="mobile-icon-btn" onClick={() => setUnitsOpen(true)} aria-label="Unidades">
            ☰
          </button>
        </div>
      </header>

      <main className="mobile-main">{children}</main>

      <nav className="mobile-bottom-nav">
        <button
          type="button"
          className={"mobile-nav-btn" + (view === "presupuesto" ? " active" : "")}
          onClick={() => setView("presupuesto")}
        >
          <span>📊</span>
          Presupuesto
        </button>
        <button
          type="button"
          className={"mobile-nav-btn" + (view === "tablero" ? " active" : "")}
          onClick={() => setView("tablero")}
        >
          <span>◫</span>
          Tablero
        </button>
        <button type="button" className="mobile-nav-btn" onClick={() => setUnitsOpen(true)}>
          <span>◆</span>
          Unidades
        </button>
      </nav>

      {unitsOpen && (
        <div className="mobile-sheet-overlay" onClick={() => setUnitsOpen(false)}>
          <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-head">
              <h2>Unidades estratégicas</h2>
              <button type="button" className="mobile-sheet-close" onClick={() => setUnitsOpen(false)}>✕</button>
            </div>
            <div className="mobile-unit-list">
              <button
                type="button"
                className={"mobile-unit-item" + (activeUnit === "ALL" ? " active" : "")}
                onClick={() => { setView("presupuesto"); setActiveUnit("ALL"); setUnitsOpen(false); }}
              >
                <span className="unit-dot all-dot" />
                <span>Todas las unidades</span>
              </button>
              {UNIT_ORDER.map((u) => {
                const meta = UNIT_META[u];
                const sum = items.filter((i) => i.unidad === u).reduce((a, i) => a + i.ingresos_total, 0);
                return (
                  <button
                    key={u}
                    type="button"
                    className={"mobile-unit-item" + (activeUnit === u ? " active" : "")}
                    onClick={() => { setView("presupuesto"); setActiveUnit(u); setUnitsOpen(false); }}
                    style={activeUnit === u ? { borderColor: meta.color } : undefined}
                  >
                    <span className="unit-dot" style={{ background: meta.color }} />
                    <span>{meta.label}</span>
                    <b>{fmtCOPShort(sum)}</b>
                  </button>
                );
              })}
            </div>
            <div className="mobile-sheet-foot">
              <BackupControls onExport={onExportBackup} onImport={onImportBackup} className="backup-controls-mobile" />
              <button type="button" className="reset-btn" onClick={resetAll} disabled={!hasEdits}>
                ↺ Restaurar cifras originales
              </button>
              <div className={"save-indicator " + saveState}>
                {saveState === "saving" && "Guardando…"}
                {saveState === "saved" && "✓ Guardado"}
                {saveState === "idle" && hasEdits && "Cambios guardados"}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast mobile-toast">{toast}</div>}
    </div>
  );
}
