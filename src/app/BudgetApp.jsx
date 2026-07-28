import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
import { MobileApp } from "../components/mobile/MobileApp.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { buildBackupPayload, downloadBackupJson, readBackupFile } from "../utils/backup.js";
import "../styles/app.css";
import "../styles/mobile.css";

export function BudgetApp() {
  const isMobile = useIsMobile();
  const [overrides, setOverrides] = useState({}); // key: `${idx}|${month}` -> qty presupuestado
  const [priceOverrides, setPriceOverrides] = useState({}); // key: `${idx}|${month}` -> precio editado
  const [real, setReal] = useState({}); // key: `${idx}|${month}` -> qty real vendida
  const [realIngresosOverride, setRealIngresosOverride] = useState({}); // key: `${idx}|${month}` -> ingresos reales (COP) directos
  const [unitReal, setUnitReal] = useState({}); // key: unidad -> ventas reales totales Jul-Dic (COP)
  const [unitSales, setUnitSales] = useState({}); // key: unidad -> [{id, fecha, valor, cliente, nota}]
  const [sales, setSales] = useState({}); // key: `${idx}|${month}` -> [{id, fecha, cantidad, cliente, nota}]
  const [kpis, setKpis] = useState({}); // key: unidad -> { prospectos, citas, visitas, propuestas, ventas }
  const [vendedores, setVendedores] = useState([]); // [{id, nombre, unidad, metas:{...}, avance:{...}}]
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("presupuesto"); // presupuesto | tablero
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeUnit, setActiveUnit] = useState("ALL");
  const [activeMonth, setActiveMonth] = useState(MONTHS[0]);
  const [ganttMetric, setGanttMetric] = useState("ingresos"); // ingresos | utilidad
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved
  const [toast, setToast] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null); // idx of row con venta-a-venta abierto
  const [expandedUnit, setExpandedUnit] = useState(null); // unidad con venta-a-venta abierta

  // load persisted state
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("presupuesto:state", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setOverrides(parsed.overrides || {});
          setReal(parsed.real || {});
          setRealIngresosOverride(parsed.realIngresosOverride || {});
          setUnitReal(parsed.unitReal || {});
          setPriceOverrides(parsed.priceOverrides || {});
          setSales(parsed.sales || {});
          setUnitSales(parsed.unitSales || {});
          setKpis(parsed.kpis || {});
          setVendedores(parsed.vendedores || []);
        }
      } catch (e) {
        // no saved data yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistTimeoutRef = useRef(null);
  const persistSeqRef = useRef(0);
  const pendingPayloadRef = useRef(null);

  const flushPersist = useCallback(() => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = null;
    }
    const payload = pendingPayloadRef.current;
    if (!payload) return;
    pendingPayloadRef.current = null;
    try {
      storage.set("presupuesto:state", JSON.stringify(payload), false);
    } catch (e) {
      // ignorar: mejor esfuerzo al cerrar/refrescar
    }
  }, []);

  // guarda inmediatamente cualquier cambio pendiente si se refresca, cierra o cambia de pestaña
  useEffect(() => {
    window.addEventListener("beforeunload", flushPersist);
    document.addEventListener("visibilitychange", flushPersist);
    return () => {
      window.removeEventListener("beforeunload", flushPersist);
      document.removeEventListener("visibilitychange", flushPersist);
      flushPersist();
    };
  }, [flushPersist]);

  const persist = useCallback((patch = {}) => {
    setSaveState("saving");
    const payload = {
      overrides: patch.overrides !== undefined ? patch.overrides : overrides,
      real: patch.real !== undefined ? patch.real : real,
      realIngresosOverride: patch.realIngresosOverride !== undefined ? patch.realIngresosOverride : realIngresosOverride,
      unitReal: patch.unitReal !== undefined ? patch.unitReal : unitReal,
      priceOverrides: patch.priceOverrides !== undefined ? patch.priceOverrides : priceOverrides,
      sales: patch.sales !== undefined ? patch.sales : sales,
      unitSales: patch.unitSales !== undefined ? patch.unitSales : unitSales,
      kpis: patch.kpis !== undefined ? patch.kpis : kpis,
      vendedores: patch.vendedores !== undefined ? patch.vendedores : vendedores,
    };
    pendingPayloadRef.current = payload;
    // debounce: si llegan varios cambios seguidos (ej. escribiendo rápido), solo se guarda
    // el último, para que una escritura anterior no sobreescriba por llegar tarde al storage
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    const seq = ++persistSeqRef.current;
    persistTimeoutRef.current = setTimeout(() => {
      persistTimeoutRef.current = null;
      pendingPayloadRef.current = null;
      (async () => {
        try {
          await storage.set("presupuesto:state", JSON.stringify(payload), false);
          // si mientras se guardaba llegó un cambio más nuevo, no toques el estado de "guardado"
          if (seq === persistSeqRef.current) {
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 1200);
          }
        } catch (e) {
          setSaveState("idle");
        }
      })();
    }, 450);
  }, [overrides, real, realIngresosOverride, unitReal, priceOverrides, sales, unitSales, kpis, vendedores]);

  const persistNow = useCallback(async (payload) => {
    if (persistTimeoutRef.current) {
      clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = null;
    }
    pendingPayloadRef.current = null;
    setSaveState("saving");
    try {
      await storage.set("presupuesto:state", JSON.stringify(payload), false);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    } catch {
      setSaveState("idle");
    }
  }, []);

  const getCurrentPayload = useCallback(() => ({
    overrides,
    real,
    realIngresosOverride,
    unitReal,
    priceOverrides,
    sales,
    unitSales,
    kpis,
    vendedores,
  }), [overrides, real, realIngresosOverride, unitReal, priceOverrides, sales, unitSales, kpis, vendedores]);

  const exportBackup = useCallback(() => {
    const backup = buildBackupPayload(getCurrentPayload());
    downloadBackupJson(backup);
    setToast("Respaldo descargado");
    setTimeout(() => setToast(null), 2200);
  }, [getCurrentPayload]);

  const importBackup = useCallback(async (file) => {
    try {
      const restored = await readBackupFile(file);
      // TODO: con multi-usuario en producción, pedir confirmación o hacer merge en lugar de sobrescritura total
      setOverrides(restored.overrides);
      setPriceOverrides(restored.priceOverrides);
      setReal(restored.real);
      setRealIngresosOverride(restored.realIngresosOverride);
      setSales(restored.sales);
      setUnitReal(restored.unitReal);
      setUnitSales(restored.unitSales);
      setKpis(restored.kpis);
      setVendedores(restored.vendedores);
      setExpandedRow(null);
      setExpandedUnit(null);
      await persistNow(restored);
      setToast("Respaldo importado correctamente");
      setTimeout(() => setToast(null), 2200);
    } catch {
      setToast("El archivo no es un respaldo válido");
      setTimeout(() => setToast(null), 2800);
    }
  }, [persistNow]);

  const setQty = (idx, month, value) => {
    const q = Math.max(0, Math.round(Number(value) || 0));
    setOverrides((prev) => {
      const next = { ...prev, [`${idx}|${month}`]: q };
      persist({ overrides: next });
      return next;
    });
  };

  // distribuye el TOTAL ingresado entre los 6 meses lo más parejo posible (usado desde "Jul–Dic")
  const setPrice = (idx, month, value) => {
    const key = `${idx}|${month}`;
    setPriceOverrides((prev) => {
      const next = { ...prev };
      if (value === "") delete next[key];
      else next[key] = Math.max(0, Number(value) || 0);
      persist({ priceOverrides: next });
      return next;
    });
  };

  // aplica el mismo precio a los 6 meses (usado desde la pestaña "Jul–Dic")
  const setPriceAllMonths = (idx, value) => {
    setPriceOverrides((prev) => {
      const next = { ...prev };
      const v = value === "" ? undefined : Math.max(0, Number(value) || 0);
      MONTHS.forEach((m) => {
        const key = `${idx}|${m}`;
        if (v === undefined) delete next[key]; else next[key] = v;
      });
      persist({ priceOverrides: next });
      return next;
    });
  };

  const setRealQty = (idx, month, value) => {
    const raw = value === "" ? undefined : Math.max(0, Math.round(Number(value) || 0));
    setReal((prev) => {
      const next = { ...prev };
      if (raw === undefined) delete next[`${idx}|${month}`];
      else next[`${idx}|${month}`] = raw;
      persist({ real: next });
      return next;
    });
    // al registrar por cantidad, el valor directo de ingresos reales deja de ser la fuente
    if (raw !== undefined) {
      const key = `${idx}|${month}`;
      setRealIngresosOverride((prev) => {
        if (prev[key] === undefined) return prev;
        const next = { ...prev };
        delete next[key];
        persist({ realIngresosOverride: next });
        return next;
      });
    }
  };

  const setRealIngresos = (idx, month, value) => {
    const key = `${idx}|${month}`;
    const raw = value === "" ? undefined : Math.max(0, Math.round(Number(value) || 0));
    setRealIngresosOverride((prev) => {
      const next = { ...prev };
      if (raw === undefined) delete next[key];
      else next[key] = raw;
      persist({ realIngresosOverride: next });
      return next;
    });
    // al registrar el valor directamente, la cantidad manual deja de ser la fuente
    if (raw !== undefined) {
      setReal((prev) => {
        if (prev[key] === undefined) return prev;
        const next = { ...prev };
        delete next[key];
        persist({ real: next });
        return next;
      });
    }
  };

  // --- Venta a venta: registro individual de cada venta por unidad estratégica ---
  const addUnitSale = (unit, entry) => {
    setUnitSales((prev) => {
      const list = prev[unit] ? [...prev[unit]] : [];
      list.push({
        id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fecha: entry.fecha || "",
        valor: Math.max(0, Math.round(Number(entry.valor) || 0)),
        cliente: entry.cliente || "",
        rentaPct: entry.rentaPct === "" || entry.rentaPct == null ? null : Math.min(100, Math.max(0, Number(entry.rentaPct))),
      });
      const next = { ...prev, [unit]: list };
      const sumV = list.reduce((a, s) => a + s.valor, 0);
      setUnitReal((prevUR) => {
        const nextUR = { ...prevUR, [unit]: sumV };
        persist({ unitReal: nextUR, unitSales: next });
        return nextUR;
      });
      return next;
    });
  };

  const removeUnitSale = (unit, saleId) => {
    setUnitSales((prev) => {
      const list = (prev[unit] || []).filter((s) => s.id !== saleId);
      const next = { ...prev };
      if (list.length) next[unit] = list;
      else delete next[unit];
      const sumV = list.reduce((a, s) => a + s.valor, 0);
      setUnitReal((prevUR) => {
        const nextUR = { ...prevUR };
        if (list.length) nextUR[unit] = sumV;
        else delete nextUR[unit];
        persist({ unitReal: nextUR, unitSales: next });
        return nextUR;
      });
      return next;
    });
  };

  // --- Venta a venta: registro individual de cada venta de una línea/mes ---
  // precio != null: se registra cantidad (el valor se calcula cantidad × precio)
  // precio == null: se registra el valor (ingresos) directamente, p. ej. patrocinios sin precio unitario
  const effectivePrecio = (idx, month) => {
    const key = `${idx}|${month}`;
    if (priceOverrides[key] !== undefined) return priceOverrides[key];
    const raw = RAW_DATA.items[idx];
    return raw ? raw.meses[month].precio : null;
  };

  const saleValor = (s, precioFallback) =>
    s.valor != null ? s.valor : (s.cantidad && precioFallback != null ? s.cantidad * precioFallback : 0);

  const addSale = (idx, month, entry, precio) => {
    const key = `${idx}|${month}`;
    const precioFallback = effectivePrecio(idx, month);
    setSales((prev) => {
      const list = prev[key] ? [...prev[key]] : [];
      const hasCantidad = entry.cantidad !== undefined && entry.cantidad !== "";
      const hasValor = entry.valor !== undefined && entry.valor !== "";
      const cantidad = hasCantidad ? Math.max(0, Math.round(Number(entry.cantidad) || 0)) : 0;
      let valor;
      if (hasValor) {
        valor = Math.max(0, Math.round(Number(entry.valor) || 0));
      } else if (precio != null && hasCantidad) {
        valor = cantidad * precio;
      } else {
        valor = 0;
      }
      list.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fecha: entry.fecha || "",
        cantidad,
        valor,
        cliente: entry.cliente || "",
        nota: entry.nota || "",
        rentaPct: entry.rentaPct === "" || entry.rentaPct == null ? null : Math.min(100, Math.max(0, Number(entry.rentaPct))),
      });
      const next = { ...prev, [key]: list };
      const sumQ = list.reduce((a, s) => a + (s.cantidad || 0), 0);
      const sumValor = list.reduce((a, s) => a + saleValor(s, precioFallback), 0);
      setReal((prevReal) => {
        const nextReal = { ...prevReal };
        if (sumQ > 0) nextReal[key] = sumQ; else delete nextReal[key];
        setRealIngresosOverride((prevRIO) => {
          const nextRIO = { ...prevRIO, [key]: sumValor };
          persist({ real: nextReal, realIngresosOverride: nextRIO, sales: next });
          return nextRIO;
        });
        return nextReal;
      });
      return next;
    });
  };

  const removeSale = (idx, month, saleId) => {
    const key = `${idx}|${month}`;
    const precioFallback = effectivePrecio(idx, month);
    setSales((prev) => {
      const list = (prev[key] || []).filter((s) => s.id !== saleId);
      const next = { ...prev };
      if (list.length) next[key] = list;
      else delete next[key];
      const sumQ = list.reduce((a, s) => a + (s.cantidad || 0), 0);
      const sumValor = list.reduce((a, s) => a + saleValor(s, precioFallback), 0);
      setReal((prevReal) => {
        const nextReal = { ...prevReal };
        if (sumQ > 0) nextReal[key] = sumQ; else delete nextReal[key];
        setRealIngresosOverride((prevRIO) => {
          const nextRIO = { ...prevRIO };
          if (list.length) nextRIO[key] = sumValor; else delete nextRIO[key];
          persist({ real: nextReal, realIngresosOverride: nextRIO, sales: next });
          return nextRIO;
        });
        return nextReal;
      });
      return next;
    });
  };


  // registrar/eliminar una venta desde "Ventas reales por unidad estratégica" anexándola a una línea/referencia:
  // reutiliza el mismo registro venta a venta del detalle por línea (valor directo en COP)
  const addLinkedSale = (idx, mes, entry) => addSale(idx, mes, entry, null);
  const removeLinkedSale = (idx, mes, saleId) => removeSale(idx, mes, saleId);

  // elimina por completo el registro de venta real (cantidad, ingresos y log venta a venta) de una línea/mes
  const clearRealForCell = (idx, month) => {
    const key = `${idx}|${month}`;
    const nextSales = { ...sales };
    delete nextSales[key];
    const nextReal = { ...real };
    delete nextReal[key];
    const nextRIO = { ...realIngresosOverride };
    delete nextRIO[key];
    setSales(nextSales);
    setReal(nextReal);
    setRealIngresosOverride(nextRIO);
    persist({ sales: nextSales, real: nextReal, realIngresosOverride: nextRIO });
  };

  // --- KPIs de tablero de control por unidad estratégica ---
  const setKpiValue = (unit, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setKpis((prev) => {
      const next = { ...prev, [unit]: { ...(prev[unit] || {}), [field]: v } };
      persist({ kpis: next });
      return next;
    });
  };

  const resetKpis = () => {
    setKpis({});
    persist({ kpis: {} });
    setToast("Tablero de control reiniciado");
    setTimeout(() => setToast(null), 2200);
  };

  // --- Vendedores: metas por indicador y avance individual ---
  const addVendedor = (nombre, unidad) => {
    const nuevo = {
      id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      nombre: nombre.trim() || "Sin nombre",
      unidad: unidad || "ALL",
      metas: { prospectos: 0, citas: 0, visitas: 0, propuestas: 0, ventas: 0 },
      avance: { prospectos: 0, citas: 0, visitas: 0, propuestas: 0, ventas: 0 },
    };
    setVendedores((prev) => {
      const next = [...prev, nuevo];
      persist({ vendedores: next });
      return next;
    });
  };

  const removeVendedor = (id) => {
    setVendedores((prev) => {
      const next = prev.filter((v) => v.id !== id);
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorMeta = (id, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, metas: { ...vd.metas, [field]: v } } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorAvance = (id, field, value) => {
    const v = Math.max(0, Math.round(Number(value) || 0));
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, avance: { ...vd.avance, [field]: v } } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const setVendedorUnidad = (id, unidad) => {
    setVendedores((prev) => {
      const next = prev.map((vd) => (vd.id === id ? { ...vd, unidad } : vd));
      persist({ vendedores: next });
      return next;
    });
  };

  const resetAll = () => {
    setOverrides({});
    persist({ overrides: {} });
    setToast("Cantidades restauradas al presupuesto original");
    setTimeout(() => setToast(null), 2200);
  };

  const resetReal = () => {
    setReal({});
    setRealIngresosOverride({});
    setUnitReal({});
    setSales({});
    setUnitSales({});
    persist({ real: {}, realIngresosOverride: {}, unitReal: {}, sales: {}, unitSales: {} });
    setToast("Registro de ventas reales borrado");
    setTimeout(() => setToast(null), 2200);
  };

  // build working items with overrides + real sales applied
  const items = useMemo(() => {
    return RAW_DATA.items.map((raw, idx) => {
      const item = clone(raw);
      let ingresos_total = 0, egresos_total = 0, utilidad_total = 0;
      let real_ingresos_total = 0, real_egresos_total = 0, real_utilidad_total = 0, real_registrado = false;
      MONTHS.forEach((m) => {
        const key = `${idx}|${m}`;
        const cell = item.meses[m];
        const qOverride = overrides[key];
        const priceOverride = priceOverrides[key];
        const effQ = qOverride !== undefined ? qOverride : cell.q;
        const effPrecio = priceOverride !== undefined ? priceOverride : cell.precio;
        if (qOverride !== undefined || priceOverride !== undefined) {
          let ingresos = cell.ingresos, egresos = cell.egresos, utilidad = cell.utilidad;
          if (effPrecio != null) {
            ingresos = effQ * effPrecio;
            egresos = Math.round(ingresos * (1 - item.margen));
            utilidad = ingresos - egresos;
          }
          item.meses[m] = {
            ...cell,
            q: effQ,
            precio: effPrecio,
            ingresos,
            egresos,
            utilidad,
            edited: effQ !== cell.q || effPrecio !== cell.precio,
          };
        }
        // real sales for this cell: valor directo de ingresos tiene prioridad sobre cantidad × precio
        const realQ = real[key];
        const realIngresosOv = realIngresosOverride[key];
        let realIngresos = 0, realEgresos = 0, realUtilidad = 0, hasReal = false;
        if (realIngresosOv !== undefined) {
          hasReal = true;
          realIngresos = realIngresosOv;
        } else if (realQ !== undefined && item.meses[m].precio != null) {
          hasReal = true;
          realIngresos = realQ * item.meses[m].precio;
        }
        if (hasReal) {
          realEgresos = Math.round(realIngresos * (1 - item.margen));
          realUtilidad = realIngresos - realEgresos;
        }
        item.meses[m] = { ...item.meses[m], real_q: realQ, real_ingresos: realIngresos, real_egresos: realEgresos, real_utilidad: realUtilidad, has_real: hasReal };
        ingresos_total += item.meses[m].ingresos || 0;
        egresos_total += item.meses[m].egresos || 0;
        utilidad_total += item.meses[m].utilidad || 0;
        if (hasReal) {
          real_registrado = true;
          real_ingresos_total += realIngresos;
          real_egresos_total += realEgresos;
          real_utilidad_total += realUtilidad;
        }
      });
      item.ingresos_total = ingresos_total;
      item.egresos_total = egresos_total;
      item.utilidad_total = utilidad_total;
      item.real_ingresos_total = real_ingresos_total;
      item.real_egresos_total = real_egresos_total;
      item.real_utilidad_total = real_utilidad_total;
      item.real_registrado = real_registrado;
      item.idx = idx;
      return item;
    });
  }, [overrides, priceOverrides, real, realIngresosOverride]);

  const hasEdits = Object.keys(overrides).length > 0;
  const hasReal = Object.keys(real).length > 0;

  const filteredItems = useMemo(
    () => (activeUnit === "ALL" ? items : items.filter((i) => i.unidad === activeUnit)),
    [items, activeUnit]
  );

  const totals = useMemo(() => {
    const acc = { ingresos: 0, egresos: 0, utilidad: 0, realIngresos: 0, realEgresos: 0, realUtilidad: 0, anyReal: false };
    filteredItems.forEach((i) => {
      if (activeMonth === "TOTAL") {
        acc.ingresos += i.ingresos_total;
        acc.egresos += i.egresos_total;
        acc.utilidad += i.utilidad_total;
        acc.realIngresos += i.real_ingresos_total;
        acc.realEgresos += i.real_egresos_total;
        acc.realUtilidad += i.real_utilidad_total;
        if (i.real_registrado) acc.anyReal = true;
      } else {
        const cell = i.meses[activeMonth];
        acc.ingresos += cell.ingresos || 0;
        acc.egresos += cell.egresos || 0;
        acc.utilidad += cell.utilidad || 0;
        if (cell.has_real) {
          acc.realIngresos += cell.real_ingresos || 0;
          acc.realEgresos += cell.real_egresos || 0;
          acc.realUtilidad += cell.real_utilidad || 0;
          acc.anyReal = true;
        }
      }
    });
    return acc;
  }, [filteredItems, activeMonth]);

  const monthlyChartData = useMemo(() => {
    return MONTHS.map((m) => {
      let ingresos = 0, egresos = 0, utilidad = 0, realIngresos = 0, anyReal = false;
      filteredItems.forEach((i) => {
        ingresos += i.meses[m].ingresos || 0;
        egresos += i.meses[m].egresos || 0;
        utilidad += i.meses[m].utilidad || 0;
        if (i.meses[m].has_real) { anyReal = true; realIngresos += i.meses[m].real_ingresos || 0; }
      });
      return { mes: MONTH_SHORT[m], mesFull: m, Ingresos: ingresos, Egresos: egresos, Utilidad: utilidad, Real: anyReal ? realIngresos : null };
    });
  }, [filteredItems]);

  // real vs presupuesto comparables (only over cells where real sales were registered)
  const ganttData = useMemo(() => {
    return MONTHS.map((m) => {
      let presupuesto = 0, realVal = 0, anyReal = false;
      filteredItems.forEach((i) => {
        const cell = i.meses[m];
        const pVal = ganttMetric === "ingresos" ? cell.ingresos : cell.utilidad;
        presupuesto += pVal || 0;
        if (cell.has_real) {
          anyReal = true;
          realVal += (ganttMetric === "ingresos" ? cell.real_ingresos : cell.real_utilidad) || 0;
        }
      });
      return { key: m, label: m, presupuesto, real: realVal, anyReal };
    });
  }, [filteredItems, ganttMetric]);

  // datos de toda la compañía (sin filtro de unidad activa), para la presentación ejecutiva
  const companyMonthly = useMemo(() => {
    return MONTHS.map((m) => {
      let ingresosP = 0, ingresosR = 0, utilidadP = 0, utilidadR = 0, anyReal = false;
      items.forEach((i) => {
        const cell = i.meses[m];
        ingresosP += cell.ingresos || 0;
        utilidadP += cell.utilidad || 0;
        if (cell.has_real) {
          anyReal = true;
          ingresosR += cell.real_ingresos || 0;
          utilidadR += cell.real_utilidad || 0;
        }
      });
      return { key: m, label: m, ingresosP, ingresosR, utilidadP, utilidadR, anyReal };
    });
  }, [items]);

  const companyTotals = useMemo(() => {
    let presupuesto = 0, real = 0, presupuestoUtilidad = 0, realUtilidad = 0, anyReal = false;
    items.forEach((i) => {
      presupuesto += i.ingresos_total;
      presupuestoUtilidad += i.utilidad_total;
      if (i.real_registrado) {
        anyReal = true;
        real += i.real_ingresos_total;
        realUtilidad += i.real_utilidad_total;
      }
    });
    return {
      presupuesto, real, presupuestoUtilidad, realUtilidad, anyReal,
      pct: presupuesto > 0 ? real / presupuesto : null,
    };
  }, [items]);

  // presupuesto de ingresos Jul-Dic por unidad (sin filtrar por activeUnit)
  const unitBudgetTotals = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => (map[u] = 0));
    items.forEach((i) => { map[i.unidad] = (map[i.unidad] || 0) + i.ingresos_total; });
    return map;
  }, [items]);

  // ventas reales agregadas desde el detalle por línea, por unidad
  const unitItemRealTotals = useMemo(() => {
    const sum = {}, any = {};
    UNIT_ORDER.forEach((u) => { sum[u] = 0; any[u] = false; });
    items.forEach((i) => {
      if (i.real_registrado) { sum[i.unidad] += i.real_ingresos_total; any[i.unidad] = true; }
    });
    return { sum, any };
  }, [items]);

  // valor efectivo por unidad: se suma lo registrado sin línea específica (genérico)
  // más lo registrado línea por línea en el detalle (incluye lo anexado desde esta misma sección)
  const unitCompareData = useMemo(() => {
    // egresos/utilidad reales a partir del % de renta registrado en cada venta (si se diligenció)
    const rentaAgg = {};
    UNIT_ORDER.forEach((u) => { rentaAgg[u] = { egresos: 0, utilidad: 0, any: false }; });
    const applyRenta = (unit, s) => {
      if (s.rentaPct == null || !rentaAgg[unit]) return;
      const ut = Math.round(s.valor * (s.rentaPct / 100));
      rentaAgg[unit].utilidad += ut;
      rentaAgg[unit].egresos += (s.valor - ut);
      rentaAgg[unit].any = true;
    };
    Object.entries(unitSales).forEach(([u, list]) => (list || []).forEach((s) => applyRenta(u, s)));
    items.forEach((item) => {
      MONTHS.forEach((m) => {
        const list = sales[`${item.idx}|${m}`];
        if (list) list.forEach((s) => applyRenta(item.unidad, s));
      });
    });

    return UNIT_ORDER.map((u) => {
      const presupuesto = unitBudgetTotals[u] || 0;
      const generico = unitReal[u] || 0;
      const detalle = unitItemRealTotals.sum[u] || 0;
      const fromDetail = unitItemRealTotals.any[u];
      const anyReal = unitReal[u] !== undefined || fromDetail;
      const real = generico + detalle;
      let source = null;
      if (unitReal[u] !== undefined && fromDetail) source = "mixto";
      else if (unitReal[u] !== undefined) source = "manual";
      else if (fromDetail) source = "detalle";
      const renta = rentaAgg[u];
      return {
        key: u, label: UNIT_META[u].label, presupuesto, real: real || 0, anyReal,
        generico, detalle, source,
        realEgresos: renta.any ? renta.egresos : null,
        realUtilidad: renta.any ? renta.utilidad : null,
      };
    });
  }, [unitBudgetTotals, unitReal, unitItemRealTotals, unitSales, sales, items]);

  // líneas/referencias disponibles por unidad, para anexarlas al registrar una venta
  const unitLineOptions = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => { map[u] = []; });
    items.forEach((i) => { map[i.unidad].push({ idx: i.idx, label: i.referencia, linea: i.linea }); });
    return map;
  }, [items]);

  // registro combinado (genérico + por línea) para mostrar en "Ventas reales por unidad estratégica"
  const unitSalesCombined = useMemo(() => {
    const map = {};
    UNIT_ORDER.forEach((u) => { map[u] = []; });
    Object.entries(unitSales).forEach(([u, list]) => {
      (list || []).forEach((s) => {
        if (map[u]) map[u].push({ ...s, tipo: "generic", combinedKey: `g-${s.id}` });
      });
    });
    items.forEach((item) => {
      MONTHS.forEach((m) => {
        const list = sales[`${item.idx}|${m}`];
        if (list && list.length) {
          list.forEach((s) => {
            map[item.unidad].push({
              ...s,
              tipo: "linea",
              idx: item.idx,
              mes: m,
              referencia: item.referencia,
              combinedKey: `l-${s.id}`,
            });
          });
        }
      });
    });
    UNIT_ORDER.forEach((u) => {
      map[u].sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
    });
    return map;
  }, [unitSales, sales, items]);

  const cumplimiento = useMemo(() => {
    const rows = activeUnit === "ALL" ? unitCompareData : unitCompareData.filter((d) => d.key === activeUnit);
    let realSum = 0, presSum = 0;
    rows.forEach((d) => { if (d.anyReal) { realSum += d.real; presSum += d.presupuesto; } });
    return { realSum, presSum, pct: presSum > 0 ? realSum / presSum : null };
  }, [unitCompareData, activeUnit]);

  const unitPieData = useMemo(() => {
    return UNIT_ORDER.map((u) => {
      const sum = items.filter((i) => i.unidad === u).reduce((a, i) => a + i.ingresos_total, 0);
      return { name: UNIT_META[u].label, value: sum, unit: u };
    }).filter((d) => d.value > 0);
  }, [items]);

  // --- Datos del tablero de control (embudo comercial por unidad estratégica) ---
  const funnelData = useMemo(() => {
    return UNIT_ORDER.map((u) => {
      const k = kpis[u] || {};
      const vals = FUNNEL_STAGES.map((s) => k[s.key] || 0);
      return { unit: u, label: UNIT_META[u].label, color: UNIT_META[u].color, vals };
    });
  }, [kpis]);

  const funnelTotals = useMemo(() => {
    return FUNNEL_STAGES.map((s, i) => funnelData.reduce((a, d) => a + d.vals[i], 0));
  }, [funnelData]);

  const funnelAnyData = funnelTotals.some((v) => v > 0);

  const metaAnual = RAW_DATA.meta_ventas_2026;
  const presupuestoAnual = RAW_DATA.anual.presupuesto;
  const avanceSemestre = presupuestoAnual ? totals_all_ingresos(items) / presupuestoAnual : 0;

  function totals_all_ingresos(list) {
    return list.reduce((a, i) => a + i.ingresos_total, 0);
  }

  const grandIngresos = useMemo(() => items.reduce((a, i) => a + i.ingresos_total, 0), [items]);
  const grandEgresos = useMemo(() => items.reduce((a, i) => a + i.egresos_total, 0), [items]);
  const grandUtilidad = useMemo(() => items.reduce((a, i) => a + i.utilidad_total, 0), [items]);
  const avancePct = presupuestoAnual ? grandIngresos / presupuestoAnual : 0;

  if (!loaded) {
    return (
      <div className="app-root loading-root">
        <div className="loading-mark">MC</div>
      </div>
    );
  }

  const mobileProps = {
    view, setView, activeUnit, setActiveUnit, items, saveState, hasEdits, resetAll,
    onExportBackup: exportBackup, onImportBackup: importBackup,
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
        onExportBackup={exportBackup}
        onImportBackup={importBackup}
      />
      <main className="main">
        <header className="page-header">
          <div className="topo-wrap"><TopoLine /></div>
          <div className="header-content">
            {view === "presupuesto" ? (
              <>
                <p className="eyebrow">Segundo semestre · Julio a diciembre 2026</p>
                <h1>Presupuesto de ventas</h1>
                <p className="header-desc">
                  Cada cifra de esta cordillera es una decisión: cuántos tickets, membresías o
                  paquetes se venden cada mes. Ajusta la cantidad (Q) de cualquier línea y observa
                  cómo se recalculan ingresos, egresos y utilidad al instante.
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">Gestión comercial · Embudo por unidad estratégica</p>
                <div className="tablero-title-row">
                  <h1>Tablero de control</h1>
                  <button className="presentation-btn" onClick={() => { setSlideIndex(0); setPresentationOpen(true); }}>
                    🖥️ Presentación
                  </button>
                </div>
                <p className="header-desc">
                  Registra prospectos, citas, visitas, propuestas y ventas cerradas de cada unidad
                  estratégica. La caja de seguimiento calcula automáticamente las tasas de
                  conversión entre etapas.
                </p>
              </>
            )}
          </div>
        </header>

        {view === "tablero" ? (
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
        <>
        <section className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Ingresos · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandIngresos)}</span>
            <span className="kpi-note gold">Meta de ventas 2026: {fmtCOPShort(metaAnual)}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Egresos · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandEgresos)}</span>
            <span className="kpi-note clay">{fmtPct(grandEgresos / (grandIngresos || 1))} de los ingresos</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Utilidad bruta · Jul–Dic</span>
            <span className="kpi-value">{fmtCOP(grandUtilidad)}</span>
            <span className="kpi-note teal">Margen {fmtPct(grandUtilidad / (grandIngresos || 1))}</span>
          </div>
          <div className="kpi-card progress-card">
            <span className="kpi-label">Avance vs. presupuesto anual</span>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(100, avancePct * 100)}%` }} />
            </div>
            <span className="kpi-note">{fmtPct(avancePct)} de {fmtCOPShort(presupuestoAnual)}</span>
          </div>
          <div className="kpi-card progress-card">
            <span className="kpi-label">Cumplimiento ventas reales</span>
            {cumplimiento.pct != null ? (
              <>
                <div className="progress-track">
                  <div
                    className="progress-fill real-fill"
                    style={{ width: `${Math.min(100, cumplimiento.pct * 100)}%` }}
                  />
                </div>
                <span className="kpi-note">{fmtPct(cumplimiento.pct)} · {fmtCOPShort(cumplimiento.realSum)} de {fmtCOPShort(cumplimiento.presSum)} registrado</span>
              </>
            ) : (
              <span className="kpi-note muted">Aún no registras ventas reales</span>
            )}
          </div>
        </section>

        <section className="chart-grid">
          <div className="panel chart-panel">
            <div className="panel-head">
              <h2>Evolución mensual{activeUnit !== "ALL" ? ` — ${UNIT_META[activeUnit].label}` : ""}</h2>
              <p>Ingresos, egresos y utilidad bruta por mes</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D9A441" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#D9A441" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B5583A" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#B5583A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#2A3E32" strokeDasharray="3 6" vertical={false} />
                <XAxis dataKey="mes" stroke="#8FA398" tick={{ fontFamily: "IBM Plex Mono", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#8FA398" tick={{ fontFamily: "IBM Plex Mono", fontSize: 11 }} tickFormatter={fmtCOPShort} axisLine={false} tickLine={false} width={54} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="Ingresos" stroke="#D9A441" fill="url(#gIngresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="Egresos" stroke="#B5583A" fill="url(#gEgresos)" strokeWidth={2} />
                <Area type="monotone" dataKey="Utilidad" stroke="#4FA391" fill="transparent" strokeWidth={2.5} strokeDasharray="0" />
                <Area type="monotone" dataKey="Real" stroke="#F2EDE1" fill="transparent" strokeWidth={2} strokeDasharray="4 3" connectNulls dot={{ r: 3, fill: "#F2EDE1", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="legend-row">
              <span><i style={{ background: "#D9A441" }} />Ingresos</span>
              <span><i style={{ background: "#B5583A" }} />Egresos</span>
              <span><i style={{ background: "#4FA391" }} />Utilidad bruta</span>
              <span><i className="dashed" />Ventas reales</span>
            </div>
          </div>

          <div className="panel pie-panel">
            <div className="panel-head">
              <h2>Ingresos por unidad</h2>
              <p>Distribución Jul–Dic</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={unitPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                  onClick={(d) => setActiveUnit(d.unit)}
                  cursor="pointer"
                >
                  {unitPieData.map((d) => (
                    <Cell key={d.unit} fill={UNIT_META[d.unit].color} opacity={activeUnit === "ALL" || activeUnit === d.unit ? 1 : 0.35} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip total={grandIngresos} />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="pie-legend">
              {unitPieData.map((d) => (
                <li key={d.unit} onClick={() => setActiveUnit(d.unit)} className={activeUnit === d.unit ? "active" : ""}>
                  <i style={{ background: UNIT_META[d.unit].color }} />
                  <span>{d.name}</span>
                  <b>{fmtPct(d.value / (grandIngresos || 1))}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel unit-real-panel">
          <div className="panel-head">
            <h2>Ventas reales por unidad estratégica</h2>
            <p>Registra cada venta de forma independiente: se acumula automáticamente y se refleja en el gráfico de abajo</p>
          </div>

          <div className="unit-cards-grid">
            {unitCompareData.map((d) => {
              const pct = d.presupuesto > 0 ? d.real / d.presupuesto : null;
              const over = d.anyReal && pct != null && pct >= 1;
              const log = unitSalesCombined[d.key] || [];
              const isOpen = expandedUnit === d.key;
              return (
                <div
                  key={d.key}
                  className={"unit-card" + (activeUnit === d.key ? " active" : "")}
                  style={{ borderColor: activeUnit === d.key ? UNIT_META[d.key].color : undefined }}
                >
                  <div className="unit-card-head" onClick={() => setActiveUnit(activeUnit === d.key ? "ALL" : d.key)}>
                    <span className="unit-dot" style={{ background: UNIT_META[d.key].color }} />
                    <span className="unit-card-title">{d.label}</span>
                  </div>
                  <div className="unit-card-budget">Presupuesto: <b>{fmtCOP(d.presupuesto)}</b></div>
                  <div className="unit-card-real-total">
                    Ventas reales registradas
                    <b>{d.anyReal ? fmtCOP(d.real) : "Sin registrar"}</b>
                  </div>
                  {d.realEgresos != null && (
                    <div className="unit-card-renta-row">
                      <span>Egresos reales <b>{fmtCOP(d.realEgresos)}</b></span>
                      <span>Utilidad real <b className="accent">{fmtCOP(d.realUtilidad)}</b></span>
                    </div>
                  )}
                  <button
                    className={"unit-log-toggle" + (isOpen ? " open" : "") + (log.length ? " has-log" : "")}
                    onClick={(e) => { e.stopPropagation(); setExpandedUnit(isOpen ? null : d.key); }}
                  >
                    {isOpen ? "▾ Ocultar ventas" : `▸ Registrar / ver ventas${log.length ? ` (${log.length})` : ""}`}
                  </button>
                  {isOpen && (
                    <UnitSaleLog
                      entries={log}
                      lineOptions={unitLineOptions[d.key] || []}
                      unit={d.key}
                      onAddLinea={(idx, mes, entry) => addLinkedSale(idx, mes, entry)}
                      onRemove={(entry) =>
                        entry.tipo === "linea"
                          ? removeLinkedSale(entry.idx, entry.mes, entry.id)
                          : removeUnitSale(d.key, entry.id)
                      }
                    />
                  )}
                  <div className="unit-card-foot">
                    {pct != null ? (
                      <span className={over ? "var-pos" : "var-neg"}>
                        {over ? "✓ " : ""}{fmtPct(pct)} cumplido
                      </span>
                    ) : (
                      <span className="muted">Sin ventas registradas</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {(Object.keys(unitReal).length > 0 || hasReal) && (
            <div className="sidebar-footer gantt-reset">
              <button className="reset-btn" onClick={resetReal}>
                ↺ Borrar ventas reales registradas
              </button>
            </div>
          )}
        </section>

        <section className="panel table-panel">
          <div className="panel-head table-head">
            <div>
              <h2>Detalle por línea{activeUnit !== "ALL" ? ` — ${UNIT_META[activeUnit].label}` : ""}</h2>
              <p>Edita la cantidad (Q) de cualquier mes para recalcular la fila</p>
            </div>
            <div className="month-tabs">
              <button className={activeMonth === "TOTAL" ? "active" : ""} onClick={() => setActiveMonth("TOTAL")}>Jul–Dic</button>
              {MONTHS.map((m) => (
                <button key={m} className={activeMonth === m ? "active" : ""} onClick={() => setActiveMonth(m)}>
                  {MONTH_SHORT[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className="col-expand"></th>
                  <th className="col-unit">Unidad</th>
                  <th className="col-line">Línea / referencia</th>
                  <th className="col-um">U .MEDIDA</th>
                  <th className="num col-qpresup">Cantidad</th>
                  <th className="num col-precio">Precio</th>
                  <th className="num">Ingresos</th>
                  <th className="num">Egresos</th>
                  <th className="num">Utilidad</th>
                  <th className="num col-real col-qreal">Q real</th>
                  <th className="num col-real">Ingresos reales</th>
                  <th className="num col-real">Egresos reales</th>
                  <th className="num col-real">Utilidad real</th>
                  <th className="col-delete"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const cell = activeMonth === "TOTAL" ? null : item.meses[activeMonth];
                  const q = activeMonth === "TOTAL" ? MONTHS.reduce((a, m) => a + (item.meses[m].q || 0), 0) : cell.q;
                  const precio = activeMonth === "TOTAL" ? item.meses[MONTHS[0]].precio : cell.precio;
                  const ingresos = activeMonth === "TOTAL" ? item.ingresos_total : cell.ingresos;
                  const egresos = activeMonth === "TOTAL" ? item.egresos_total : cell.egresos;
                  const utilidad = activeMonth === "TOTAL" ? item.utilidad_total : cell.utilidad;
                  const editable = true;
                  const qtyEditable = activeMonth !== "TOTAL";
                  const edited = activeMonth !== "TOTAL" && cell.edited;

                  const realQEditable = activeMonth !== "TOTAL" && !!cell;
                  const realQ = activeMonth === "TOTAL" ? item.real_ingresos_total > 0 ? MONTHS.reduce((a, m) => a + (item.meses[m].real_q || 0), 0) : null : cell.real_q;
                  const realIngresos = activeMonth === "TOTAL" ? item.real_ingresos_total : (cell.has_real ? cell.real_ingresos : null);
                  const realEgresos = activeMonth === "TOTAL" ? item.real_egresos_total : (cell.has_real ? cell.real_egresos : null);
                  const realUtilidad = activeMonth === "TOTAL" ? item.real_utilidad_total : (cell.has_real ? cell.real_utilidad : null);
                  const hasRealHere = activeMonth === "TOTAL" ? item.real_registrado : cell.has_real;

                  const salesKey = activeMonth !== "TOTAL" ? `${item.idx}|${activeMonth}` : null;
                  const saleLog = salesKey ? (sales[salesKey] || []) : [];
                  const hasSaleLog = saleLog.length > 0;
                  const canExpand = activeMonth !== "TOTAL" && !!cell;
                  const isExpanded = expandedRow === item.idx && canExpand;
                  const realIngresosEditable = activeMonth !== "TOTAL" && !!cell;

                  return (
                    <React.Fragment key={item.idx}>
                    <tr className={edited ? "edited-row" : ""}>
                      <td className="col-expand">
                        {canExpand && (
                          <button
                            className={"expand-toggle" + (isExpanded ? " open" : "") + (hasSaleLog ? " has-log" : "")}
                            onClick={() => setExpandedRow(isExpanded ? null : item.idx)}
                            title="Registrar venta a venta"
                          >
                            {isExpanded ? "▾" : "▸"}
                          </button>
                        )}
                      </td>
                      <td className="col-unit">
                        <span className="unit-tag" style={{ color: UNIT_META[item.unidad].color, borderColor: UNIT_META[item.unidad].color }}>
                          {UNIT_META[item.unidad].label}
                        </span>
                      </td>
                      <td className="col-line">
                        <div className="line-name">{item.linea}</div>
                        <div className="ref-name">{item.referencia}</div>
                      </td>
                      <td className="muted col-um">{item.um}</td>
                      <td className="num">
                        {qtyEditable ? (
                          <NumberInput
                            className="qty-input qpresup-input"
                            value={q}
                            onChange={(value) => setQty(item.idx, activeMonth, value)}
                          />
                        ) : (
                          <span className="muted">{q}</span>
                        )}
                      </td>
                      <td className="num">
                        {editable ? (
                          <CurrencyInput
                            className="qty-input price-input"
                            placeholder="—"
                            value={precio}
                            onChange={(digits) => activeMonth === "TOTAL" ? setPriceAllMonths(item.idx, digits) : setPrice(item.idx, activeMonth, digits)}
                          />
                        ) : (
                          <span className="muted">{precio != null ? fmtCOP(precio) : "—"}</span>
                        )}
                      </td>
                      <td className="num">{fmtCOP(ingresos)}</td>
                      <td className="num muted">{fmtCOP(egresos)}</td>
                      <td className="num accent">{fmtCOP(utilidad)}</td>
                      <td className="num col-real col-qreal">
                        {realQEditable ? (
                          hasSaleLog ? (
                            <span className="muted real-locked" title="Calculado desde el registro venta a venta">
                              {realQ}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              placeholder="—"
                              className="qty-input real-input qreal-input"
                              value={realQ === undefined || realQ === null ? "" : realQ}
                              onChange={(e) => setRealQty(item.idx, activeMonth, e.target.value)}
                            />
                          )
                        ) : (
                          <span className="muted">{realQ != null ? realQ : "—"}</span>
                        )}
                      </td>
                      <td className="num col-real">
                        {hasSaleLog ? (
                          <span className="muted real-locked" title="Calculado desde el registro venta a venta">
                            {fmtCOP(realIngresos)}
                          </span>
                        ) : realIngresosEditable ? (
                          <input
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="—"
                            className="qty-input real-input real-ingresos-input"
                            value={realIngresos === undefined || realIngresos === null ? "" : realIngresos}
                            onChange={(e) => setRealIngresos(item.idx, activeMonth, e.target.value)}
                          />
                        ) : (
                          <span className="muted">{realIngresos != null ? fmtCOP(realIngresos) : "—"}</span>
                        )}
                      </td>
                      <td className="num col-real muted">{realEgresos != null ? fmtCOP(realEgresos) : "—"}</td>
                      <td className="num col-real accent">{realUtilidad != null ? fmtCOP(realUtilidad) : "—"}</td>
                      <td className="col-delete">
                        {activeMonth !== "TOTAL" && hasRealHere && (
                          <button
                            className="delete-real-btn"
                            onClick={() => clearRealForCell(item.idx, activeMonth)}
                            title="Eliminar registro de venta real de este mes"
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="sale-log-row">
                        <td></td>
                        <td colSpan={13}>
                          <SaleLog
                            entries={saleLog}
                            precio={cell.precio}
                            unit={item.um}
                            onAdd={(entry) => addSale(item.idx, activeMonth, entry, cell.precio)}
                            onRemove={(saleId) => removeSale(item.idx, activeMonth, saleId)}
                          />
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6}>Total {activeUnit === "ALL" ? "general" : UNIT_META[activeUnit].label}</td>
                  <td className="num">{fmtCOP(totals.ingresos)}</td>
                  <td className="num">{fmtCOP(totals.egresos)}</td>
                  <td className="num accent">{fmtCOP(totals.utilidad)}</td>
                  <td className="num col-real">—</td>
                  <td className="num col-real">{fmtCOP(totals.realIngresos)}</td>
                  <td className="num col-real muted">{fmtCOP(totals.realEgresos)}</td>
                  <td className="num col-real accent">{fmtCOP(totals.realUtilidad)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
        </>
        )}

        <footer className="app-footer">
          {view === "presupuesto"
            ? "Datos base: Presupuesto_manizales_comparte (Jul–Dic 2026). Los cambios de cantidad se guardan solo en este navegador."
            : "El tablero de control se guarda solo en este navegador, igual que el presupuesto."}
        </footer>
      </main>

      {toast && <div className="toast">{toast}</div>}

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
    </div>
  );
}
