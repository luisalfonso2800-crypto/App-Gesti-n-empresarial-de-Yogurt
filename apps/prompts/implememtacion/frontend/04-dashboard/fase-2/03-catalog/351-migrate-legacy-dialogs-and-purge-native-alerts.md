TAREA CONTROLADA — MIGRACIÓN DE MODALES LEGACY Y PURGA DE ALERTAS NATIVAS (LOTE 3)

OBJETIVO:
1. Reemplazar el contenedor `Modal.jsx` legacy en los componentes de borrado/confirmación por `SmartModal` institucional.
2. Purgar las invocaciones residuales de `window.alert()` y `window.confirm()` en `RecipeModal.jsx` / submódulos de recetas, sustituyéndolas por el flujo de confirmación estilizado.

FUENTES DE VERDAD:
- apps/web/src/components/ui/SmartModal.jsx
- docs/implementation/evidencias/EVIDENCIA_POKA_YOKE_MODALES_COMERCIAL_OPS.md
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE TOOL BUDGET (NIVEL 1):
- PROHIBIDO ejecutar `Find`, `Search` o búsquedas ciegas.
- Modificar EXCLUSIVAMENTE los archivos de diálogo de confirmación y RecipeModal.
- Límite máximo de lecturas: 1 lectura por archivo a intervenir.
- Cero estilos en línea (`style={{}}`), delegando al respectivo `.module.css`.
- Límite SRP estricto (< 150 líneas por archivo).

ACCIONES A EJECUTAR:
1. En los componentes de confirmación de eliminación (`ConfirmDeleteProductModal.jsx`, `ConfirmDeleteModal.jsx`):
   - Migrar importación de `Modal` a `SmartModal`.
   - Incorporar botón de cancelación secundario y botón de acción crítica con estado `isSubmitting`.
2. En `RecipeModal.jsx` (y sus subpartes en `modal-parts/`):
   - Localizar y remover llamadas a `alert(...)` o `confirm(...)`.
   - Asegurar que cualquier advertencia use el banner de error reactivo o estado Poka-Yoke.
3. Ejecutar verificaciones de sintaxis y arquitectura:
   - `node .agents/scripts/verify-srp.js`
   - `node --check` en los archivos tocados.

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Cero ocurrencias de `alert()` o `confirm()` nativos en modales.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Componentes migrados a SmartModal:
- Alertas nativas erradicadas:
- Resultado verify-srp.js: