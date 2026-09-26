# REMEDIACIÓN FRONTEND — BLOQUE FRONT-2A-1
# RETOMAR: 5 INLINE STYLES + 4 COMPONENTES GRANDES

## ⚠️ REGLAS ANTI-BUCLE (CRÍTICAS)
1. PROHIBIDO lanzar subagentes.
2. PROHIBIDO usar Claude. Modelo: Gemini Flash (Low).
3. PROHIBIDO releer un archivo ya leído en esta sesión.
4. LÍMITE DURO: 15 lecturas de archivo.
5. LÍMITE DURO: 12 ediciones.
6. LÍMITE DURO: 30 llamadas totales.
7. COMMIT cada 3 archivos procesados (no esperar al final).
8. Al llegar a cualquier límite: DETENTE, commitea, guarda estado.
9. NO tocar archivos ya migrados en Front-2A:
   - apps/web/src/app/catalog/recipes/RecipesHeader.jsx
   - apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx
   - apps/web/src/app/catalog/recipes/components/modal-parts/SummaryStagesNarrativeList.jsx
   - apps/web/src/app/catalog/supplies/components/SuppliesHeader.jsx
   - apps/web/src/app/dashboard/components/AnalogGauge.jsx
   - apps/web/src/app/dashboard/components/LiquidSilosCanvas.jsx
   - apps/web/src/app/dashboard/components/OscilloscopeCanvas.jsx
   - apps/web/src/app/dashboard/components/SeismographChart.jsx
   - apps/web/src/app/dashboard/components/SimulationDrawer.jsx
   - apps/web/src/components/ui/SmartModal.module.css
   - apps/web/src/components/ui/inputs/CurrencySmartInput.jsx

## Contexto
Bloque Front-2A parcial: 12 inline styles migrados (commits 6c5a2c8, da5d1ff, eb9fd8b).
verify-srp.js reporta 10 infracciones pendientes.

## Tareas (commit cada 3 archivos)

### T1. Completar migración de 2 inline styles "fantasma"
Archivos que aparentemente se migraron pero verify-srp sigue marcando:
1. apps/web/src/app/commercial/goals/components/GoalCard.jsx
   → Buscar style={{ ... }} residual. Migrar a goals.module.css.
2. apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx
   → Buscar style={{ ... }} residual. Migrar a canvas-widgets.module.css.
COMMIT: "fix(frontend): complete inline style migration GoalCard + RadarSweepCanvas (HAL-F1-01)"

### T2. Migrar 3 inline styles pendientes
1. apps/web/src/components/ui/inputs/SmartSelect.jsx
2. apps/web/src/components/ui/inputs/StrictNumberInput.jsx
3. apps/web/src/context/NotificationContext.jsx
COMMIT: "refactor(frontend): migrate 3 pending inline styles to CSS Modules (HAL-F1-01)"

### T3. Modularizar ProductionCreateForm.jsx (262 líneas)
Archivo: apps/web/src/app/operations/production/components/modal-parts/ProductionCreateForm.jsx
- Extraer subcomponentes: selector receta, visualizador BOM, config fechas.
- Objetivo: < 150 líneas.
COMMIT: "refactor(frontend): split ProductionCreateForm into subcomponents (HAL-F1-01)"

### T4. Modularizar StageCardItem.jsx (287 líneas)
Archivo: apps/web/src/app/catalog/recipes/components/modal-parts/StageCardItem.jsx
- Extraer: StageCardHeader, StageCardBomTable, StageCardFooter.
- Objetivo: < 150 líneas.
COMMIT: "refactor(frontend): split StageCardItem into subcomponents (HAL-F1-01)"

### T5. Modularizar GoalFormModal.jsx (187 líneas)
Archivo: apps/web/src/app/commercial/goals/components/GoalFormModal.jsx
- Extraer campos por sección a subcomponentes.
- Objetivo: < 150 líneas.
COMMIT: "refactor(frontend): split GoalFormModal into subcomponents (HAL-F1-01)"

### T6. Modularizar ToolConverterTab.jsx (182 líneas)
Archivo: apps/web/src/components/common/tools/ToolConverterTab.jsx
- Extraer lógica de conversión a hook useUnitConverter.
- Objetivo: < 150 líneas.
COMMIT: "refactor(frontend): extract useUnitConverter hook (HAL-F1-01)"

### T7. Verificación y cierre
- node .agents/scripts/verify-srp.js → reportar conteo final.
- Crear INFORME-REMED-FRONT-2A-1.md.
- Actualizar ESTADO-REMED-FRONT.md.
- DETENERSE.

---

# REMEDIACIÓN FRONTEND — BLOQUE FRONT-2A-2
# CIERRE SRP: goals/page.jsx

## ⚠️ REGLAS ANTI-BUCLE
1. PROHIBIDO lanzar subagentes.
2. PROHIBIDO usar Claude. Modelo: Gemini Flash (Low).
3. PROHIBIDO releer un archivo ya leído en esta sesión.
4. LÍMITE DURO: 5 lecturas. LÍMITE DURO: 4 ediciones.
5. LÍMITE DURO: 12 llamadas totales.
6. Al llegar a cualquier límite: DETENTE, commitea, guarda estado.
7. NO tocar archivos ya migrados en Front-2A y Front-2A-1.

## Contexto
verify-srp.js --all reporta 1 sola infracción:
- [PAGE_OVERSIZED] apps/web/src/app/commercial/goals/page.jsx: 143 líneas (límite 120).

## Tarea única

### Modularizar goals/page.jsx (143 → < 120 líneas)
1. Leer apps/web/src/app/commercial/goals/page.jsx.
2. Identificar:
   - Estados locales (useState).
   - Handlers (useCallback, funciones).
   - Lógica derivada (useMemo).
3. Extraer a un hook `useGoalsPageData.js` en la misma carpeta.
4. El page.jsx debe quedar solo con:
   - Llamada al hook.
   - JSX de composición.
   - Objetivo: < 120 líneas.

COMMIT: "refactor(frontend): extract useGoalsPageData hook to comply with SRP (HAL-F1-01)"

### Verificación y cierre
- node .agents/scripts/verify-srp.js --all → debe reportar 0 infracciones.
- Si hay alguna residual, listarla.
- Crear INFORME-REMED-FRONT-2A-2.md.
- Actualizar ESTADO-REMED-FRONT.md.
- DETENERSE.
