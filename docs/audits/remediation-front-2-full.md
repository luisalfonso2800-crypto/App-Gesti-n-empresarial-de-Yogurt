TAREA:
Remediación Frontend — Bloque Front-2: SRP, CSS Modules y Visibilidad Financiera

OBJETIVO:
Resolver en una sola sesión controlada las 22 infracciones de SRP/CSS Modules (HAL-F1-01) y los 5 hallazgos de visibilidad y completitud funcional (HAL-F7-01, HAL-F6-01, HAL-F6-02, HAL-F8-01, HAL-F5-01).

REGLAS ESTRICTAS ANTI-BUCLE Y AHORRO DE QUOTA:
1. PROHIBIDO lanzar subagentes o usar modelos pesados. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO el uso de búsquedas recursivas (`Get-ChildItem -Recurse`, `dir /s`, `find .`).
3. PROHIBIDO ejecutar `pnpm build` o empaquetados pesados de Next.js.
4. LÍMITE OPERATIVO: Máximo 35 lecturas de archivo y 25 ediciones en total.
5. Trabajar en orden secuencial estricto: FASE 1 y luego FASE 2. No saltar entre fases.
6. Cero estilos en línea nuevos (`style={{`). Usar CSS Modules.
7. Al terminar cada fase, realizar verificación local con: `node .agents/scripts/verify-srp.js`.

---

### FASE 1: SRP Y CSS MODULES (HAL-F1-01 — 22 INFRACCIONES)

#### 1.1 Componentes Sobredimensionados (Objetivo: < 150 líneas)
Extraer subcomponentes funcionales adyacentes o derivar lógica a hooks:
- `apps/web/src/app/operations/production/components/modal-parts/ProductionCreateForm.jsx` (262 → < 150)
- `apps/web/src/app/catalog/recipes/components/modal-parts/StageCardItem.jsx` (287 → < 150)
- `apps/web/src/app/dashboard/components/SimulationDrawer.jsx` (196 → < 150)
- `apps/web/src/app/commercial/goals/components/GoalFormModal.jsx` (187 → < 150)
- `apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx` (182 → < 150)
- `apps/web/src/components/common/tools/ToolConverterTab.jsx` (182 → < 150)

#### 1.2 Página Sobredimensionada (Objetivo: < 120 líneas)
- `apps/web/src/app/commercial/goals/page.jsx` (143 → < 120): Extraer handlers y lógica de carga a un hook dedicado (`useGoalsPageData.js`).

#### 1.3 Erradicación de Inline Styles (15 Archivos)
Migrar atributos `style={{ ... }}` a sus respectivos archivos `*.module.css`:
- `RecipeOperationalSummaryModal.jsx`
- `SummaryStagesNarrativeList.jsx`
- `RecipesHeader.jsx`
- `SuppliesHeader.jsx`
- `GoalCard.jsx`
- `SimulationDrawer.jsx`
- `CurrencySmartInput.jsx`
- `SmartSelect.jsx`
- `StrictNumberInput.jsx`
- `NotificationContext.jsx`
- **Excepción legítima de Canvas:** En `AnalogGauge.jsx`, `LiquidSilosCanvas.jsx`, `OscilloscopeCanvas.jsx`, `RadarSweepCanvas.jsx` y `SeismographChart.jsx`, se permiten inline styles ÚNICAMENTE para coordenadas o dimensiones dinámicas calculadas en runtime sobre `<canvas>`. Migrar el resto a CSS Modules.

*Checkpoint Fase 1:* Confirmar con `node .agents/scripts/verify-srp.js` que las infracciones llegaron a 0.

---

### FASE 2: VISIBILIDAD FINANCIERA Y CAMPOS NUEVOS (5 HALLAZGOS)

#### 2.1 HAL-F7-01: Dashboard con Flujo de Caja Real
- **Archivo:** `apps/web/src/app/dashboard/components/DashboardOperationalView.jsx`
- **Acción:**
  - Agregar tarjeta "CAJA LÍQUIDA REAL" en el KPI strip superior enlazada a `financial?.flujoCajaReal`.
  - Renombrar la tarjeta "UTILIDAD NETA" por "UTILIDAD DEVENGADA (Sin IVA)".

#### 2.2 HAL-F6-01: Campo Densidad en Insumos
- **Archivo:** `apps/web/src/app/catalog/supplies/components/SupplyModal.jsx` (o `SupplyFormModal.jsx`)
- **Acción:**
  - Incorporar input numérico `densidad` con: default `1.0`, min `0.5`, max `2.5`, step `0.01`.
  - Label: "Densidad (g/ml)" con helper: "Ej: Leche 1.03, Miel 1.42, Agua 1.0".

#### 2.3 HAL-F6-02: Badge de Anticipo en Clientes
- **Archivo:** `apps/web/src/app/commercial/payments/components/ReceivableClientRow.jsx`
- **Acción:**
  - Detectar si `saldoPendiente < 0`.
  - Si es menor a 0, renderizar badge verde con texto: `ANTICIPO: $XX.XXX` (en valor absoluto) en lugar de mostrar cifra negativa (`-$XX.XXX`).

#### 2.4 HAL-F8-01: Formateo de Micro-Costos Unitarios
- **Archivo:** `apps/web/src/lib/formatters.js`
- **Acción:**
  - Exportar función `formatUnitCost(value)`:
    * Si `value < 100`: formatear con 4 decimales (ej. `$18.4523`).
    * Si `value >= 100`: formatear con 2 decimales habituales.

#### 2.5 HAL-F5-01: Erradicar Fallback Hardcodeado 'kg' en Compras
- **Archivo:** `apps/web/src/app/operations/purchases/hooks/useFormPhaseData.js` (Línea ~L152)
- **Acción:**
  - Eliminar la asignación por defecto `|| 'kg'`. Si el insumo no define unidad, dejar el estado vacío para obligar la selección canónica.

---

### DOCUMENTACIÓN Y CIERRE:
1. Validar arquitectura limpia:
   `node .agents/scripts/verify-srp.js` (0 infracciones).
2. Generar el informe final consolidado en:
   `apps/prompts/implememtacion/frontend/remediacion/INFORME-REMED-FRONT-2.md`
3. Actualizar `apps/prompts/implememtacion/frontend/remediacion/ESTADO-REMED-FRONT.md` marcando Front-2 como COMPLETADO.
4. Generar el commit local atómico:
   `git commit -m "fix(frontend): bloque 2 srp, css modules y visibilidad financiera (HAL-F1-01, F7-01, F6-01, F6-02, F8-01, F5-01)"`
5. NO HACER GIT PUSH.

DETENCIÓN:
Al completar los archivos, verificar SRP en 0 y registrar el commit local, DETENTE inmediatamente.