export const BACKUP_VERSION = 1;

export const STATE_KEYS = [
  "overrides",
  "priceOverrides",
  "real",
  "realIngresosOverride",
  "sales",
  "unitReal",
  "unitSales",
  "kpis",
  "vendedores",
];

const EMPTY_STATE = {
  overrides: {},
  priceOverrides: {},
  real: {},
  realIngresosOverride: {},
  sales: {},
  unitReal: {},
  unitSales: {},
  kpis: {},
  vendedores: [],
};

/** @typedef {typeof EMPTY_STATE} AppStatePayload */

/**
 * @param {Partial<typeof EMPTY_STATE>} state
 */
export function buildBackupPayload(state) {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    overrides: state.overrides || {},
    priceOverrides: state.priceOverrides || {},
    real: state.real || {},
    realIngresosOverride: state.realIngresosOverride || {},
    sales: state.sales || {},
    unitReal: state.unitReal || {},
    unitSales: state.unitSales || {},
    kpis: state.kpis || {},
    vendedores: state.vendedores || [],
  };
}

/**
 * @param {unknown} raw
 * @returns {raw is Record<string, unknown>}
 */
export function isValidBackup(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  return STATE_KEYS.some((key) => key in raw);
}

/**
 * Normaliza respaldos nuevos o legacy (solo campos de estado).
 * @param {Record<string, unknown>} raw
 * @returns {typeof EMPTY_STATE}
 */
export function normalizeBackupPayload(raw) {
  return {
    overrides: (raw.overrides && typeof raw.overrides === "object" ? raw.overrides : {}) || {},
    priceOverrides: (raw.priceOverrides && typeof raw.priceOverrides === "object" ? raw.priceOverrides : {}) || {},
    real: (raw.real && typeof raw.real === "object" ? raw.real : {}) || {},
    realIngresosOverride: (raw.realIngresosOverride && typeof raw.realIngresosOverride === "object" ? raw.realIngresosOverride : {}) || {},
    sales: (raw.sales && typeof raw.sales === "object" ? raw.sales : {}) || {},
    unitReal: (raw.unitReal && typeof raw.unitReal === "object" ? raw.unitReal : {}) || {},
    unitSales: (raw.unitSales && typeof raw.unitSales === "object" ? raw.unitSales : {}) || {},
    kpis: (raw.kpis && typeof raw.kpis === "object" ? raw.kpis : {}) || {},
    vendedores: Array.isArray(raw.vendedores) ? raw.vendedores : [],
  };
}

/**
 * @param {ReturnType<typeof buildBackupPayload>} payload
 */
export function downloadBackupJson(payload) {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `presupuesto-manizales-comparte-backup-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * @param {File} file
 * @returns {Promise<typeof EMPTY_STATE>}
 */
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidBackup(parsed)) {
          reject(new Error("invalid"));
          return;
        }
        resolve(normalizeBackupPayload(parsed));
      } catch {
        reject(new Error("invalid"));
      }
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsText(file);
  });
}

export { EMPTY_STATE };
