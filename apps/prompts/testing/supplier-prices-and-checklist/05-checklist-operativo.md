# 05-checklist-operativo.md

Modelo: Gemini 3.8 Flash
Effort: low

TAREA CONTROLADA — SUITE E2E FOCO C: CHECKLIST OPERATIVO Y POKA-YOKE DE PLANTA (T33-T45)

OBJETIVO TÉCNICO:
1. Crear `apps/web/e2e/operations/checklist-operativo.spec.js` con 13 tests funcionales (T33-T45) sobre el Checklist de Adquisición y Abastecimiento en `/operations/purchases/new?orderId=...`.
2. Validar Poka-Yoke severo de planta: cantidad mínima operativa (`min="1"`), motivo obligatorio al descartar, campos mandatorios en "Editar condiciones".
3. Validar flujos operativos: `Conseguido`, `No Conseguido`, `Editar condiciones`, `Mover Lista`, `Añadir Pendiente` manual.
4. Validar proyección de totales en la fila: total compra, costo por unidad, monto en letras.
5. CERO modificaciones a `apps/web/src/**`. Solo creación de spec + reutilización de helpers.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- apps/web/e2e/helpers/checklist-item.js (creado en Prompt 01)
- apps/web/e2e/helpers/chain-state.js (contrato de persistencia)
- apps/web/e2e/.test-data/purchases.json (orderId real)
- apps/web/e2e/purchases/purchases-totals.spec.js (patrón de cálculos existente)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 4 LECTURAS, MÁXIMO 1 EDICIÓN):
- CERO modificaciones a `apps/web/src/**`.
- Prohibido `waitForTimeout` fijo; usar `expect.poll` o `locator.waitFor`.
- Prohibido `window.confirm` / `window.alert`.
- El spec debe estar por debajo de 140 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Selectores SOLO según el informe forense y el helper existente.
- Reutilizar `markChecklistItemStatus` del helper donde aplique.
