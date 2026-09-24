# 07-flujo-completo.md

Modelo: Gemini 3.8 Flash
Effort: low

TAREA CONTROLADA — SUITE E2E DE INTEGRACIÓN: FLUJO COMPLETO PRECIOS → CARRITO → ORDEN → CHECKLIST → FUSIÓN (T56-T60)

OBJETIVO TÉCNICO:
1. Crear `apps/web/e2e/exhaustive/flow-precios-carrito-checklist.spec.js` con 5 tests de integración (T56-T60) que validen el flujo completo entre los 4 focos.
2. Validar que los 4 helpers (`fillSupplierPriceForm`, `toggleCartItem`, `markChecklistItemStatus`, `executeOrderMerge`) funcionan en cadena sobre un mismo estado persistente.
3. Validar sincronización cruzada de IDs de orden entre Precios, Carrito, Checklist y Tablero.
4. Validar proyección de cálculos en cadena: precio de cotización → subtotal del carrito → total del checklist.
5. CERO modificaciones a `apps/web/src/**`. Solo creación de spec + reutilización de los 4 helpers.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- apps/web/e2e/helpers/supplier-price-form.js (creado en Prompt 01)
- apps/web/e2e/helpers/cart-toggle.js (Prompt 01 + fix Prompt 12)
- apps/web/e2e/helpers/checklist-item.js (Prompt 01)
- apps/web/e2e/helpers/order-merge.js (Prompt 01)
- apps/web/e2e/helpers/chain-state.js (contrato de persistencia)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 5 LECTURAS, MÁXIMO 1 EDICIÓN):
- CERO modificaciones a `apps/web/src/**`.
- Prohibido `waitForTimeout` fijo; usar `expect.poll` o `locator.waitFor`.
- Prohibido `window.confirm` / `window.alert`.
- El spec debe estar por debajo de 140 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Selectores SOLO según el informe forense.
- Reutilizar los 4 helpers donde aplique.
- `test.describe.serial` obligatorio para mantener orden de dependencias.
