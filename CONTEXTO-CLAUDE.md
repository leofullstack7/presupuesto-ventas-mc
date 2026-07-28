# Contexto para Claude — Presupuesto de ventas MC

Documento de handoff: qué era la app original, qué se hizo, qué falta y qué necesitamos en DreamHost con Git.

---

## 1. Origen: la app que tú creaste

**Archivo original:** `presupuesto-manizales-comparte.jsx` (~2.766 líneas)

Era una **SPA React completa en un solo archivo** para Manizales Comparte:

- **Presupuesto de ventas Jul–Dic 2026** por unidades estratégicas (Turismo, Educación, Merch, Corporativa, Social, Proyectos, Digital).
- Edición de cantidades (Q), precios, ingresos/egresos/utilidad recalculados al vuelo.
- **Ventas reales** por línea/mes y por unidad (venta a venta).
- **Tablero de control:** embudo comercial (prospectos → ventas), KPIs por unidad, vendedores con metas/avance.
- **Presentación ejecutiva** (slides para junta directiva).
- Gráficos con **Recharts** (área, pie, gantt).
- Datos base embebidos en `RAW_DATA` (presupuesto original del Excel/JSON).
- Persistencia con **`window.storage`** (API de entorno Cursor/Canvas, **no existe en producción**).

Stack original: React hooks, CSS embebido en constante `CSS`, sin build step.

---

## 2. Qué pidió Zoryn después

1. **Dejar de vivir en un solo `.jsx`** → proyecto estructurado y desplegable.
2. **Subir a DreamHost** siguiendo el patrón del otro proyecto MC (`CONTEXT.md` = app “Manizales Es El Aula”, usuario `aula_mzl`, MySQL, PHP API).
3. **Vista móvil dedicada** (recrear UI solo para móvil; escritorio igual que antes).
4. **Ahora (nuevo):**
   - Usuario VPS **nuevo**, solo para este proyecto (no mezclar con `aula_mzl`).
   - **Base de datos propia** (separada de `manizales_aula`).
   - Despliegue con **Git** (push → sitio actualizado), **no SCP manual**.

---

## 3. Qué se hizo ya (estado actual del repo)

El monolito se reestructuró en **Vite + React**:

```
presupuesto-ventas-mc/
├── src/
│   ├── app/BudgetApp.jsx           # Toda la lógica de estado y cálculos
│   ├── components/                 # Inputs, charts, sales, dashboard, layout, mobile
│   ├── views/mobile/               # UI móvil nueva (≤768px)
│   ├── data/rawData.js             # RAW_DATA extraído del JSX original
│   ├── constants/                  # MONTHS, UNIT_META, FUNNEL_STAGES, etc.
│   ├── utils/storage.js            # localStorage + API PHP
│   └── styles/app.css + mobile.css
├── api/state.php                   # GET/POST estado → JSON en disco
├── .htaccess                       # SPA + /api/state
├── dist/                           # Salida de `npm run build` (no commitear)
├── presupuesto-manizales-comparte.jsx  # Original intacto como referencia
├── CONTEXT.md                      # Proyecto Aula (otro producto, solo referencia DreamHost)
├── DEPLOY.md                       # Despliegue inicial (SCP — reemplazar por Git)
└── DEPLOY-GIT.md                   # Guía Git + auto-deploy (nuevo)
```

**Build:** `npm install` → `npm run build` → genera `dist/` (HTML + JS + CSS).

**Persistencia hoy (fase 1):**

| Capa | Qué guarda |
|------|------------|
| `localStorage` | overrides, ventas reales, KPIs, vendedores, etc. |
| `api/state.php` | Copia JSON en `data/presupuesto-state.json` en el servidor |

**No hay MySQL todavía.** La app funciona igual que antes (datos en navegador + backup en servidor vía JSON).

**Vistas:**

- **Desktop (≥769px):** sidebar + tabla ancha + mismos flujos del JSX original.
- **Móvil (≤768px):** navegación inferior, secciones Resumen/Líneas/Ventas, tarjetas en lugar de tabla.

**Funcionalidad:** se mantuvo la del JSX (presupuesto, ventas reales, tablero, presentación, debounce de guardado, etc.).

---

## 4. Relación con el proyecto “Aula” (CONTEXT.md)

| | Manizales Es El Aula | Presupuesto ventas MC |
|--|----------------------|------------------------|
| Usuario VPS | `aula_mzl` | **Nuevo** (ej. `presupuesto_mzl`) — pendiente crear |
| Dominio | aula.manizalescomparte.com | **Por definir** (ej. presupuesto.manizalescomparte.com) |
| BD MySQL | `manizales_aula` / `aula_user` | **Nueva BD + usuario** — pendiente crear |
| Backend | PHP router + muchos endpoints | Solo `state.php` (JSON) por ahora |
| Frontend | HTML embebido en public/admin | Vite build → `dist/` |
| Deploy actual Aula | SCP manual | Queremos **Git push → deploy auto** |

El `CONTEXT.md` del repo **no describe esta app**; solo sirve como referencia de cómo operan otros proyectos MC en DreamHost.

---

## 5. Qué falta / decisiones abiertas

### 5.1 Infraestructura DreamHost (pendiente)

- [ ] Crear **usuario shell** dedicado en el VPS (ej. `presupuesto_mzl`).
- [ ] Crear **dominio/subdominio** apuntando a `/home/presupuesto_mzl/DOMINIO/`.
- [ ] Crear **base MySQL** + usuario (ej. `presupuesto_mc` / `presupuesto_user` en `mysql.manizalescomparte.com`).
- [ ] Instalar **Node.js** en ese usuario (nvm) para `npm run build` en el servidor, **o** build en CI y desplegar solo `dist/` (ver DEPLOY-GIT.md).

### 5.2 Base de datos — expectativa vs realidad

**Hoy:** persistencia en `data/presupuesto-state.json` (un blob JSON con todo el estado editable).

**Deseado:** BD propia, probablemente para:

- Estado compartido entre dispositivos/usuarios.
- Backups y auditoría.
- Posible login/admin en el futuro.

**Trabajo futuro en código:**

- `api/config.php` (credenciales, `.gitignore`).
- Migrar `storage.js` / `state.php` a tablas MySQL (ej. `app_state` o normalizar: overrides, sales, kpis, vendedores).
- Schema SQL inicial.

Si Claude retoma el backend, puede tomar como referencia la estructura del JSON que guarda `BudgetApp` (ver sección 6).

### 5.3 Git + deploy automático (pendiente configurar)

**Objetivo:** `git push origin main` → sitio en producción actualizado.

Opciones documentadas en `DEPLOY-GIT.md`:

1. **Bare repo en VPS** + hook `post-receive` → `scripts/deploy.sh` (build + publicar).
2. **GitHub Actions** → SSH al VPS y ejecutar `deploy.sh` (sigue siendo “git-driven”, no SCP manual local).

**Repo Git:** aún **no inicializado** en la carpeta local; falta crear remoto (GitHub/GitLab) y primer push.

---

## 6. Formato del estado persistido (importante para migrar a MySQL)

Clave: `presupuesto:state`  
JSON guardado (campos principales):

```json
{
  "overrides": { "0|Julio": 15, "...": "idx|mes → cantidad presupuestada" },
  "priceOverrides": { "0|Julio": 100000 },
  "real": { "0|Octubre": 5 },
  "realIngresosOverride": { "0|Octubre": 1500000 },
  "unitReal": { "TURISMO": 5000000 },
  "unitSales": { "TURISMO": [{ "id", "fecha", "valor", "cliente", "rentaPct" }] },
  "sales": { "0|Octubre": [{ "id", "fecha", "cantidad", "valor", "cliente", "nota", "rentaPct" }] },
  "kpis": { "TURISMO": { "prospectos", "citas", "visitas", "propuestas", "ventas" } },
  "vendedores": [{ "id", "nombre", "unidad", "metas": {...}, "avance": {...} }]
}
```

Los **datos base del presupuesto** (`RAW_DATA`) siguen en código (`src/data/rawData.js`), no en BD.

---

## 7. Stack técnico actual

| Pieza | Versión / nota |
|-------|----------------|
| React | 18 |
| Vite | 6 |
| Recharts | 2.x |
| PHP servidor | 8.2 (DreamHost) |
| Apache | mod_rewrite (.htaccess) |

---

## 8. Comandos útiles para quien retome

```bash
# Desarrollo
npm install
npm run dev

# Producción local
npm run build   # → dist/

# En servidor (tras setup Git)
~/repos/presupuesto.git/hooks/post-receive   # o ./scripts/deploy.sh
```

---

## 9. Checklist para Claude / equipo

**Si vas a seguir desarrollo frontend:**

- [ ] Leer `src/app/BudgetApp.jsx` (lógica central; antes era todo el JSX).
- [ ] Cambios de UI desktop → componentes en `src/components/` y vista en `BudgetApp`.
- [ ] Cambios móvil → `src/views/mobile/` + `src/styles/mobile.css`.
- [ ] Datos estáticos 2026 → `src/data/rawData.js`.

**Si vas a montar infra + Git + MySQL:**

- [ ] Crear usuario VPS + dominio + BD (panel DreamHost).
- [ ] Inicializar repo Git + remoto.
- [ ] Seguir `DEPLOY-GIT.md` (hook o GitHub Actions).
- [ ] Decidir: ¿seguir con JSON un tiempo o migrar ya a MySQL?
- [ ] Si MySQL: diseñar schema a partir del JSON de la sección 6.

**Si vas a comparar con original:**

- Diff mental: `presupuesto-manizales-comparte.jsx` vs módulos en `src/`.
- `window.storage` → `src/utils/storage.js` (localStorage + fetch a `/api/state.php`).

---

## 10. Contacto / convenciones

- Desarrollador: **Zoryn**
- Idioma UI: español (Colombia, `es-CO`, COP).
- Commits: preferir mensajes claros en español o inglés según el repo.
- **No commitear:** `node_modules/`, `dist/`, `data/presupuesto-state.json`, credenciales `api/config.php`.

---

*Última actualización: julio 2026 — post-reestructuración Vite + vista móvil; pre-deploy Git en VPS dedicado.*
