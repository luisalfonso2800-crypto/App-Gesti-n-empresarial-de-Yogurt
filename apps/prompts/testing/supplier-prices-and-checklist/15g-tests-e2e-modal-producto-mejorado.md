# TAREA CONTROLADA — FASE 5: SUITE E2E COMPLETA DEL MODAL PRODUCTO MEJORADO (T01-T30 + C01-C05)

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO TÉCNICO:
1. Crear `apps/web/e2e/products/` con 3 specs que cubran las 10 mejoras implementadas:
   - `products-modal-flow.spec.js`: T01-T15 (cascada Poka-Yoke, M6, M9).
   - `products-modal-calc.spec.js`: C01-C05 (margen real, precio sugerido).
   - `products-modal-extras.spec.js`: T16-T30 (imagen M7, semáforo M8, código M1, unidad M2, stock M5, plantilla M10).
2. Validar que el modal funciona con la nueva cascada laxa y persiste los 4 campos nuevos.
3. CERO modificaciones a producción. Solo creación de specs.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- apps/web/src/app/catalog/products/components/ProductModal.jsx (para selectores)
- apps/web/src/app/catalog/products/components/modal-parts/ProductInventoryIdentityFields.jsx (nuevo, para selectores)
- apps/web/src/app/catalog/products/components/modal-parts/ProductPricingAndMarginFields.jsx (para margen real y precio sugerido)
- apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js (patrón de referencia)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 4 LECTURAS, MÁXIMO 3 EDICIONES):
- CERO modificaciones a `apps/web/src/**`.
- CERO modificaciones a `apps/api/**`.
- Cada spec ≤ 140 líneas.
- Prohibido `waitForTimeout` fijo; usar `expect.poll` o `locator.waitFor`.
- Prohibido `window.confirm` / `window.alert`.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Usar `test.describe.serial` para mantener orden de dependencias.

ACCIONES A EJECUTAR:

1. **Crear `apps/web/e2e/products/products-modal-flow.spec.js` (T01-T15):**

```javascript
import { test, expect } from '@playwright/test';

test.describe.serial('Productos - Modal Flow y Poka-Yoke (T01-T15)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/products');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Nuevo (Registro|Producto)/i }).click();
    await expect(page.locator('form')).toBeVisible();
  });

  // T01 - Modal visible con título y campos base
  // T02 - Campos nuevos visibles: Código, Unidad Venta, Stock Mínimo, Costo Estimado
  // T03 - Botón "Guardar" deshabilitado sin Nombre
  // T04 - Botón "Guardar" deshabilitado con Nombre pero sin Presentación
  // T05 - Botón "Guardar" habilitado con Nombre + Presentación (M6 laxa)
  // T06 - Nombre se convierte a UPPERCASE en vivo (M9)
  // T07 - Descripción se convierte a UPPERCASE en vivo (M9)
  // T08 - Observaciones se convierte a UPPERCASE en vivo (M9)
  // T09 - Código auto-generado al escribir nombre (M1)
  // T10 - Código editable manualmente con sanitización (solo A-Z, 0-9, -)
  // T11 - Unidad de Venta con 5 opciones (UND, LIBRA, KILO, LITRO, DOCENA)
  // T12 - Unidad de Venta default es UND
  // T13 - Stock Mínimo default es 5
  // T14 - Stock Mínimo rechaza valores negativos
  // T15 - Placeholder de plantilla visible en descripción (M10)
});
```
