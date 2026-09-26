# 06-listas-fusion.md

Modelo: Gemini 3.8 Flash
Effort: low

TAREA CONTROLADA — SUITE E2E FOCO D: GESTIÓN DE LISTAS, FUSIÓN Y EDICIÓN RÁPIDA (T46-T55)

OBJETIVO TÉCNICO:
1. Crear `apps/web/e2e/operations/listas-fusion.spec.js` con 10 tests funcionales (T46-T55) sobre el tablero `/operations/purchases` y la gestión de Listas Preparadas / En Ruta.
2. Validar modo fusión Poka-Yoke: botón "Confirmar Fusión" solo se habilita con ≥ 2 listas seleccionadas.
3. Validar renombrado rápido de listas (botón lápiz + modal).
4. Validar acciones de fila: `Ver Lista`, eliminar lista, fusionar seleccionadas.
5. Validar estado vacío: cuando no hay listas activas, se muestra `AssistedEmptyState`.
6. CERO modificaciones a `apps/web/src/**`. Solo creación de spec + reutilización de helpers.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- apps/web/e2e/helpers/order-merge.js (creado en Prompt 01)
- apps/web/e2e/helpers/list-management.js (creado en Prompt 11.5)
- apps/web/e2e/helpers/chain-state.js (patrón de persistencia)
- apps/web/e2e/purchases/purchases-basics.spec.js (patrón de UI existente)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 4 LECTURAS, MÁXIMO 1 EDICIÓN):
- CERO modificaciones a `apps/web/src/**`.
- Prohibido `waitForTimeout` fijo; usar `expect.poll` o `locator.waitFor`.
- Prohibido `window.confirm` / `window.alert`.
- El spec debe estar por debajo de 140 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Selectores SOLO según el informe forense.
- Reutilizar `executeOrderMerge`, `createNamedList`, `renameList`, `deleteList` de los helpers.
