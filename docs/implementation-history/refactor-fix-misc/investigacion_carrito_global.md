# INFORME DE INVESTIGACIÓN: ESTADO DEL CARRITO, HELPER Y CATÁLOGO REAL

Fecha: 24 de septiembre de 2026

---

## Bloque A — Helper `apps/web/e2e/helpers/cart-toggle.js` Completo

```javascript
/**
 * Gestiona la adición/remoción de insumos desde la tabla comparativa hacia el carrito y retorna el contador.
 * @param {import('@playwright/test').Page} page
 * @param {string} insumoNombre
 * @returns {Promise<number>} Nuevo valor entero del badge del carrito
 */
export async function toggleCartItem(page, insumoNombre) {
  const row = page.locator('tr').filter({ hasText: insumoNombre }).first();
  await row.waitFor({ state: 'visible', timeout: 4000 });

  const badge = page.locator('button[aria-label="Abrir carrito de compras"] span[class*="cartBadge"]');
  const initialText = await badge.innerText().catch(() => '0');
  const initialCount = parseInt(initialText, 10) || 0;

  const btnCart = row.locator('button').filter({ hasText: /(Comprar|En lista|Quitar)/i })
    .or(row.locator('button[title*="orden"], button[title*="lista"]'))
    .first();
  await btnCart.waitFor({ state: 'visible', timeout: 4000 });
  const previousText = (await btnCart.innerText().catch(() => '')).trim();

  await btnCart.click();

  // Esperar cambio de estado textual del botón
  await page.waitForFunction(
    ({ rowLocator, prev }) => {
      const btn = document.querySelector(rowLocator)?.querySelector('button');
      return btn && btn.textContent && !btn.textContent.includes(prev);
    },
    { rowLocator: `tr:has-text("${insumoNombre}")`, prev: previousText },
    { timeout: 3000 }
  ).catch(() => {});

  const newText = await badge.innerText().catch(() => '0');
  return parseInt(newText, 10) || (previousText.includes('Comprar') ? initialCount + 1 : Math.max(0, initialCount - 1));
}
```

### Detalle del Filtro y Lectura del Badge:
- **Construcción del filtro:**  
  `page.locator('tr').filter({ hasText: insumoNombre }).first()`  
  Busca un elemento `<tr>` que contenga en su texto el string recibido en `insumoNombre`.
- **Lectura del badge:**  
  `page.locator('button[aria-label="Abrir carrito de compras"] span[class*="cartBadge"]')`  
  Obtiene el `innerText()` y aplica `parseInt(text, 10)`.

---

## Bloque B — Spec `apps/web/e2e/supplier-prices/carrito-global.spec.js` Completo

```javascript
import { test, expect } from '@playwright/test';
import { toggleCartItem } from '../helpers/cart-toggle.js';
import {
  openCartHeader,
  readCartBadge,
  switchActiveList,
  readCartItem,
  hasDuplicateWarning
} from '../helpers/cart-header.js';
import { loadChainState } from '../helpers/chain-state.js';

test.describe.serial('Carrito Global - Header y Multi-Lista (T26-T32)', () => {
  let purchasesState;

  test.beforeAll(() => {
    purchasesState = loadChainState('purchases');
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog/supplier-prices');
    await page.waitForLoadState('networkidle');
  });

  test('T26: Botón del carrito del header visible con badge en 0 o valor actual', async ({ page }) => {
    const btnCart = page.locator('button[aria-label="Abrir carrito de compras"], button:has(span[class*="cartBadge"])').first();
    await expect(btnCart).toBeVisible({ timeout: 4000 });
    const badgeCount = await readCartBadge(page);
    expect(badgeCount).toBeGreaterThanOrEqual(0);
  });

  test('T27: Click en el botón abre el dropdown con las opciones de listas', async ({ page }) => {
    await openCartHeader(page);
    const dropdown = page.locator('div[class*="cartDropdown"], div[class*="cartFlyout"]').first();
    await expect(dropdown).toBeVisible({ timeout: 3000 });
  });

  test('T28: Agregar ítem desde la tabla de precios actualiza el badge del header', async ({ page }) => {
    const initialBadge = await readCartBadge(page);
    const targetRow = page.locator('tbody tr').first();
    await expect(targetRow).toBeVisible({ timeout: 4000 });
    const insumoNombre = (await targetRow.locator('td').first().innerText()).trim();

    const newBadge = await toggleCartItem(page, insumoNombre);
    expect(newBadge).toBeGreaterThanOrEqual(initialBadge);
  });

  test('T29: El ítem agregado aparece dentro del dropdown con su nombre y subtotal', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 4000 });
    const insumoNombre = (await firstRow.locator('td').first().innerText()).trim();

    await openCartHeader(page);
    const itemData = await readCartItem(page, insumoNombre);
    expect(itemData.nombre).toBeTruthy();
    expect(itemData.subtotal).toBeDefined();
  });

  test('T30: Cambio de lista activa conmuta los ítems o el contexto de la orden', async ({ page }) => {
    await openCartHeader(page);
    const selectList = page.locator('select[name="activeList"], select[aria-label*="lista" i], select[class*="listSelector"]').first();
    if (await selectList.isVisible({ timeout: 2000 }).catch(() => false)) {
      const optionsCount = await selectList.locator('option').count();
      if (optionsCount > 1) {
        const targetOptionText = await selectList.locator('option').nth(1).innerText();
        await switchActiveList(page, targetOptionText.trim());
        await expect(selectList).toHaveValue(await selectList.locator('option').nth(1).getAttribute('value'));
      }
    } else {
      expect(true).toBeTruthy();
    }
  });

  test('T31: Detección y verificación de advertencia de duplicado o ítems ya presentes', async ({ page }) => {
    const duplicateDetected = await hasDuplicateWarning(page);
    expect(typeof duplicateDetected).toBe('boolean');
  });

  test('T32: Poka-Yoke: Botón de checkout/compras deshabilitado cuando la lista no tiene ítems', async ({ page }) => {
    await openCartHeader(page);
    const btnCheckout = page.locator('button').filter({ hasText: /(Ir a Fase de Compra|Continuar compra|Finalizar orden|Checkout)/i }).first();
    if (await btnCheckout.isVisible({ timeout: 2000 }).catch(() => false)) {
      const badgeCount = await readCartBadge(page);
      if (badgeCount === 0) {
        await expect(btnCheckout).toBeDisabled();
      } else {
        await expect(btnCheckout).toBeEnabled();
      }
    }
  });
});
```

### Qué nombre pasa T28 al helper:
En **T28** (línea 41), el test **no tiene un nombre hardcodeado**. Lee dinámicamente la primera celda de la primera fila renderizada:
```javascript
const targetRow = page.locator('tbody tr').first();
const insumoNombre = (await targetRow.locator('td').first().innerText()).trim();
await toggleCartItem(page, insumoNombre);
```
Como en `PriceRow.jsx`, la primera celda (`td`) contiene el bloque con `insumoTitle` (`item.insumo.nombre`) y el subtexto de stock (`Stock: 0 kg Bajo Mínimo`), el valor que obtiene `innerText()` incluye todo ese bloque concatenado.

---

## Bloque C — Catálogo Real de la Tabla en `/catalog/supplier-prices`

Se consultó la API activa `GET http://localhost:4000/api/v1/supplier-prices` (6 cotizaciones registradas):

```json
[
  {
    "id": "574aff09-3356-4a00-b14d-a34a1e5ddf1c",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "UNIDAD x 1 kg",
    "precioCompra": "1500"
  },
  {
    "id": "372350c6-539c-4bd5-a653-56ba01c4de00",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "BOLSA",
    "precioCompra": "15000"
  },
  {
    "id": "0b2631bc-27b1-4823-84a0-c66416f9856c",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "BOLSA",
    "precioCompra": "15000"
  },
  {
    "id": "064726bd-fdbd-44ea-8ad8-64eaf32e1bc9",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "BOLSA",
    "precioCompra": "15000"
  },
  {
    "id": "5485d40b-e65d-45d5-802f-4bbb2f0e69c1",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "BOLSA",
    "precioCompra": "15000"
  },
  {
    "id": "f287ee44-991e-4d7a-9ec5-14195da3256c",
    "insumo": "AZUCAR E2E 1790166879117",
    "proveedor": "PROV_ORIGINAL_1790200539331",
    "presentacionCompra": "BOLSA",
    "precioCompra": "15000"
  }
]
```

> **Estructura DOM de la fila en producción:**
> En [`PriceRow.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/parts/PriceRow.jsx#L52-L60), la primera columna renderiza:
> ```html
> <td>
>   <div class="insumoCell">
>     <strong class="insumoTitle">AZUCAR E2E 1790166879117</strong>
>     <div class="stockSubtext">
>       <span>Stock: 0 kg</span>
>       <span>Bajo Mínimo</span>
>     </div>
>   </div>
> </td>
> ```
> Y el botón de acción en la última columna (`PriceRowActions.jsx`):
> ```html
> <button type="button" class="btnCart" title="Añadir a orden">
>   <svg ...></svg>
>   <span>Comprar</span>
> </button>
> ```
> Y al seleccionar un ítem se activa la barra inferior flotante [`CartSidebar.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/CartSidebar.jsx).

---

## Bloque D — Contenido de `apps/web/e2e/.test-data/purchases.json`

```json
{
  "comprasCreadas": {
    "MASTER_COMPRA_LECHE": {
      "id": "4cf0b038-db63-4e2e-86eb-f7ac38e75b14",
      "cantidadEmpaques": 5,
      "total": 16000,
      "insumo": "LECHE ENTERA",
      "timestamp": "2026-09-24T17:56:36.219Z"
    }
  }
}
```

### Conclusión para T28 y el Chain-State:
- `purchases.json` tiene guardada una orden de compra para `"LECHE ENTERA"`.
- Sin embargo, en la tabla de cotizaciones (`/catalog/supplier-prices`), los 6 registros existentes son de **`AZUCAR E2E 1790166879117`**.
- Para que `toggleCartItem` funcione con total fiabilidad:
  1. Si se extrae el texto del DOM, se debe seleccionar específicamente `targetRow.locator('strong[class*="insumoTitle"]').innerText()` en lugar de todo el `td` (que trae el subtexto de stock y confunde el selector).
  2. O alternativamente, usar el insumo real que existe en la tabla (`AZUCAR E2E`).
