TAREA CONTROLADA — SUITE E2E FOCO A+B: TABLA COMPARATIVA, FILTROS, BADGES Y BARRA FLOTANTE (T16-T25)

OBJETIVO TÉCNICO:
Crear `apps/web/e2e/supplier-prices/supplier-prices-tabla.spec.js` con 10 tests funcionales (T16-T25) sobre la tabla comparativa de cotizaciones en `/catalog/supplier-prices`:
1. Validar carga y estructura de columnas en `PricesComparisonTable.jsx`.
2. Validar filtros (Insumo, Proveedor, Estado, Orden y Búsqueda predictiva).
3. Validar badges semánticos ("Más Económico", "Habitual", "Stock Bajo Mínimo", "Cotización antigua").
4. Validar toggling de compra y reactividad del badge del carrito en Header mediante `toggleCartItem`.
5. Validar renderizado de la barra flotante inferior (`.bottomPurchaseBar`) con conteo de insumos y presupuesto acumulado.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, EXACTAMENTE 1 CREACIÓN):
- PROHIBIDO modificar o tocar código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- CERO `waitForTimeout` fijos; usar `expect.poll`, `toBeVisible()`, `toHaveCount()` o `waitFor`.
- Prohibido `window.confirm` / `window.alert`.
- LÍMITES ESTRICTOS: Exactamente 1 archivo `.spec.js`, ≤ 140 líneas y ≤ 10 tests.
- Reutilizar `toggleCartItem` desde `../helpers/cart-toggle.js`.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- apps/web/e2e/helpers/cart-toggle.js
- apps/prompts/testing/INFORME-AUDITORIA-PRECIOS-CHECKLIST-LISTAS.md

ACCIONES A EJECUTAR:

1. Crear `apps/web/e2e/supplier-prices/supplier-prices-tabla.spec.js` (< 135 líneas):
   - Importar `{ test, expect }` de `@playwright/test` y `{ toggleCartItem }` de `../helpers/cart-toggle.js`.
   - Estructurar con `test.describe.serial('Precios Proveedores - Tabla Comparativa y Carrito (T16-T25)', ...)`:
     * `beforeEach`: Navegar a `/catalog/supplier-prices` y esperar que la tabla o grilla sea visible (`table, div[class*="table"]`).
     * T16: Tabla renderiza al menos una fila de cotización con insumo, proveedor, empaque y costo base.
     * T17: Filtro por Insumo reduce el listado a las cotizaciones correspondientes.
     * T18: Filtro por Proveedor filtra las filas por el proveedor seleccionado.
     * T19: Filtro por Estado (Activo / Inactivo / Todos) aplica la condición sin romper la UI.
     * T20: Filtro u ordenación por costo reorganiza las filas comparativas.
     * T21: Input de búsqueda filtra reactivamente según el texto ingresado.
     * T22: Badges semánticos ("Más Económico" o "Habitual") son visibles o evaluados con soft assertions si no aplican a la fila actual.
     * T23: Subtexto de stock en bodega proyecta el estado del inventario (ej. "Stock:" o badge "Bajo Mínimo").
     * T24: Al pulsar "Comprar" en una fila, el botón pasa a "En lista" y el badge del carrito en el Header suma +1.
     * T25: Al pulsar nuevamente para quitar, el badge del carrito decrementa en -1 y el botón revierte su estado.

VERIFICACIÓN OBLIGATORIA:
1. `node --check apps/web/e2e/supplier-prices/supplier-prices-tabla.spec.js`
2. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Archivo creado con 10 tests atómicos y declarativos (T16-T25).
- Menor a 140 líneas.
- `check-e2e-limits.js` no reporta infracciones en `apps/web/e2e/supplier-prices/`.
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivo creado y número total de líneas.
- Lista de tests implementados (T16 a T25).
- Salida del comando check-e2e-limits.js para este archivo.
- Comando en una sola línea para que el operador humano ejecute la prueba.
- Estado: [COMPLETADO / BLOQUEADO].