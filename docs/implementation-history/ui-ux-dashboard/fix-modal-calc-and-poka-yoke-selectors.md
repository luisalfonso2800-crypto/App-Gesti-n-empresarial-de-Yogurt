TAREA CONTROLADA — RESOLUCIÓN DE SELECTORES: CONTENEDOR COMBOBOX (T02) Y FALLBACK RESILIENTE DE DROPDOWN (C01)

OBJETIVO TÉCNICO:
Resolver los 2 fallos identificados en la suite de `supplier-prices`:
1. En `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`:
   - Corregir los selectores `getInsumo` y `getProveedor` para localizarlos a través del ancestro común `div[class*="comboboxWrapper"]` filtrando por el texto de la cabecera (`1. Insumo` y `2. Proveedor`).
   - Esto evita la ruptura de `label ~ div input` y el placeholder dinámico "Bloqueado (elija insumo)".
2. En `apps/web/e2e/helpers/supplier-price-form.js`:
   - Implementar selección resiliente para Insumo y Proveedor: intentar coincidencia por texto (`data.insumoNombre` / `data.proveedorNombre`); si no es visible de inmediato, seleccionar la primera opción disponible `.first()` del dropdown (`div[class*="dropdownItem"]`).

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, EXACTAMENTE 2 EDICIONES):
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- Modificar EXCLUSIVAMENTE:
  * `apps/web/e2e/helpers/supplier-price-form.js`
  * `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`
- Respetar los límites (< 95 líneas para el helper, < 140 líneas para el spec).

ACCIONES ESPECÍFICAS:

1. En `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`:
   - Redefinir `getInsumo` y `getProveedor`:
     ```javascript
     const getInsumo = (page) => page.locator('div[class*="comboboxWrapper"]')
       .filter({ hasText: /1\.\s*Insumo/i })
       .locator('input')
       .first();

     const getProveedor = (page) => page.locator('div[class*="comboboxWrapper"]')
       .filter({ hasText: /2\.\s*Proveedor/i })
       .locator('input')
       .first();
     ```

2. En `apps/web/e2e/helpers/supplier-price-form.js`:
   - En la selección de Insumo:
     ```javascript
     const inputInsumo = page.locator('div[class*="comboboxWrapper"]')
       .filter({ hasText: /1\.\s*Insumo/i })
       .locator('input')
       .first();
     await inputInsumo.waitFor({ state: 'visible', timeout: 3000 });
     await inputInsumo.click();
     if (data.insumoNombre) await inputInsumo.fill(data.insumoNombre);

     const optInsumoFilter = page.locator('div[class*="dropdownItem"]').filter({ hasText: data.insumoNombre }).first();
     const optInsumo = (await optInsumoFilter.isVisible().catch(() => false))
       ? optInsumoFilter
       : page.locator('div[class*="dropdownItem"]').first();
     await optInsumo.waitFor({ state: 'visible', timeout: 3000 });
     await optInsumo.click();
     ```
   - En la selección de Proveedor:
     ```javascript
     const inputProveedor = page.locator('div[class*="comboboxWrapper"]')
       .filter({ hasText: /2\.\s*Proveedor/i })
       .locator('input')
       .first();
     await expect(inputProveedor).toBeEnabled({ timeout: 4000 });
     await inputProveedor.click();
     if (data.proveedorNombre) await inputProveedor.fill(data.proveedorNombre);

     const optProvFilter = page.locator('div[class*="dropdownItem"]').filter({ hasText: data.proveedorNombre }).first();
     const optProv = (await optProvFilter.isVisible().catch(() => false))
       ? optProvFilter
       : page.locator('div[class*="dropdownItem"]').first();
     await optProv.waitFor({ state: 'visible', timeout: 3000 });
     await optProv.click();
     ```

VERIFICACIÓN:
1. `node --check apps/web/e2e/helpers/supplier-price-form.js`
2. `node --check apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`
3. `node apps/web/e2e/helpers/check-e2e-limits.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Ambos archivos compilan con código 0.
- Límites respetados (< 95 líneas helper, < 140 líneas spec).
- DETENTE inmediatamente tras reportar. NO ejecutes Playwright.

REPORTE FINAL REQUERIDO:
Entregar ÚNICAMENTE:
- Archivos modificados y líneas ajustadas.
- Comando para ejecución manual en modo headless.
- Estado: [COMPLETADO / BLOQUEADO].
