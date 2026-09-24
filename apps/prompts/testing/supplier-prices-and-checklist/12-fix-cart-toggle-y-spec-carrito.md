# 12-fix-cart-toggle-y-spec-carrito.md

Modelo: Gemini 3.8 Flash
Effort: low

TAREA CONTROLADA — FIX QUIRÚRGICO: EXTRACCIÓN LIMPIA DEL NOMBRE DE INSUMO Y FILTRO ROBUSTO

OBJETIVO TÉCNICO:
1. Corregir `apps/web/e2e/helpers/cart-toggle.js` para que el filtro `hasText` use SOLO el nombre limpio del insumo, no el `innerText` concatenado con subtexto de stock.
2. Corregir `apps/web/e2e/supplier-prices/carrito-global.spec.js` T28 y T29 para que extraigan el nombre del insumo desde `<strong class*="insumoTitle">`, no desde el `td` completo.
3. Resolver el `TimeoutError` persistente en T28 causado por el filtro `hasText: 'AZUCAR E2E 1790166879117\nStock: 0 kg\nBajo Mínimo'` (con `\n` literales que nunca matchean).
4. CERO modificaciones a producción (`apps/web/src/**`).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- apps/web/e2e/helpers/cart-toggle.js
- apps/web/e2e/supplier-prices/carrito-global.spec.js

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO modificaciones a `apps/web/src/**`.
- Prohibido `waitForTimeout` fijo.
- Prohibido `window.confirm` / `window.alert`.
- Cada archivo debe mantenerse dentro de sus límites: helper ≤ 100 líneas, spec ≤ 140 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
