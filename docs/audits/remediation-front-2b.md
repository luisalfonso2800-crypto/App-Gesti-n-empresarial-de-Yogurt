TAREA:
Remediación Frontend — Bloque Front-2B: Visibilidad Financiera y Campos Nuevos (Modo Ahorro Extremo de Cuota)

OBJETIVO:
Implementar quirúrgicamente los 5 hallazgos funcionales (HAL-F7-01, HAL-F6-01, HAL-F6-02, HAL-F8-01, HAL-F5-01) con el menor número de lecturas, ediciones y consumo de tokens posible.

REGLAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS):
1. PROHIBIDO lanzar subagentes. Modelo: Gemini Flash (Low).
2. PROHIBIDO ejecutar búsquedas de texto globales o recursivas (`grep`, `find`, `Get-ChildItem`, `dir /s`).
3. PROHIBIDO ejecutar `pnpm build`, `pnpm dev` o `pnpm lint` (la validación de compilación la hace el humano externamente).
4. LÍMITES DUROS: Máximo 8 lecturas de archivo, máximo 6 ediciones, máximo 15 llamadas totales a herramientas.
5. Ir DIRECTO a las rutas y líneas indicadas sin explorar carpetas.
6. Mantener SRP (< 130 líneas por componente o archivo modificado).

---

### TAREAS EXACTAS (DIRECTO A ARCHIVOS):

#### T1. HAL-F7-01: Dashboard Flujo de Caja
- **Archivo:** `apps/web/src/app/dashboard/components/DashboardOperationalView.jsx`
- **Acción:**
  - En el KPI strip (~L518-536), añadir la tarjeta "CAJA LÍQUIDA REAL" consumiendo `financial?.flujoCajaReal`.
  - Renombrar la tarjeta "UTILIDAD NETA" a "UTILIDAD DEVENGADA".
  - Usar las clases CSS Modules existentes sin inline styles.

#### T2. HAL-F6-01: Campo Densidad en Insumos
- **Archivo:** `apps/web/src/app/catalog/supplies/components/SupplyFormModal.jsx` (o `SupplyModal.jsx`)
- **Acción:**
  - Agregar input numérico `densidad`: default `1.0`, min `0.5`, max `2.5`, step `0.01`.
  - Label: "Densidad (g/ml)" con texto helper: "Ej: Leche 1.03, Miel 1.42, Agua 1.0".
  - Asegurar que viaje en el payload de guardado.

#### T3. HAL-F6-02: Badge de Anticipo en Cartera
- **Archivo:** `apps/web/src/app/commercial/payments/components/ReceivableClientRow.jsx`
- **Acción:**
  - Si `saldoPendiente < 0`, mostrar badge verde con texto `ANTICIPO: $XX.XXX` (usando `Math.abs(saldoPendiente)`).
  - Conservar la lógica previa para saldos >= 0.

#### T4. HAL-F8-01: formatUnitCost para Micro-Costos
- **Archivo:** `apps/web/src/lib/formatters.js`
- **Acción:**
  - Exportar función pura:
    ```javascript
    export function formatUnitCost(value) {
      const num = Number(value) || 0;
      return num < 100 ? `$${num.toFixed(4)}` : `$${num.toFixed(2)}`;
    }
    ```
  - NOTA: No buscar recursivamente en el proyecto. Solo exportar la función lista para su uso.

#### T5. HAL-F5-01: Eliminar Fallback 'kg' en Compras
- **Archivo:** `apps/web/src/app/operations/purchases/hooks/useFormPhaseData.js` (~L152)
- **Acción:**
  - Reemplazar `supply?.unidadBase || supply?.unidadMedida || 'kg'` por `supply?.unidadBase || supply?.unidadMedida || ''`.
  - No forzar 'kg' por defecto si el insumo no tiene unidad.

---

### VERIFICACIÓN Y CIERRE:
1. Validar reglas de arquitectura:
   `node .agents/scripts/verify-srp.js` (debe permanecer en 0 infracciones).
2. Generar reporte breve (máximo 400 palabras) en:
   `apps/prompts/implememtacion/frontend/remediacion/INFORME-REMED-FRONT-2B.md`
3. Actualizar checklist en:
   `apps/prompts/implememtacion/frontend/remediacion/ESTADO-REMED-FRONT.md` marcando Front-2B como completado.
4. Generar UN SOLO commit atómico con todo el bloque resuelto:
   `git commit -m "fix(frontend): bloque 2b visibilidad financiera y campos (HAL-F7-01, F6-01, F6-02, F8-01, F5-01)"`
5. NO HACER GIT PUSH.

DETENCIÓN:
Al completar los archivos y el commit único, DETENTE inmediatamente.