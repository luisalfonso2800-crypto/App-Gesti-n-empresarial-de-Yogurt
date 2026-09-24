# INFORME DE DIAGNÓSTICO: SupplierPriceTaxCard, Estado Interno E2E e Insumos en BD

Fecha: 24 de septiembre de 2026

---

## Bloque 1 — Código Completo de `SupplierPriceTaxCard.jsx`

Archivo: [`apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceTaxCard.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceTaxCard.jsx)

```jsx
/**
 * @file SupplierPriceTaxCard.jsx
 * @module catalog/supplier-prices/components/modal-parts
 * @description Tarjetas de costo unitario proyectado reactivas (Costo Sin IVA y Con IVA).
 * @responsibility Renderizar desglose de costo unitario dual o unitario base (< 70 líneas).
 * @usedBy apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceEquivalenceFields.jsx
 */
'use client';

import React from 'react';
import styles from '../supplier-price-modal.module.css';

export default function SupplierPriceTaxCard({ formData, unidadFinal }) {
  if (!formData.tieneIva) {
    return (
      <div className={styles.costCard}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Unitario Base:</span>
          <span className={`${styles.costValue} ${styles.costValueHighlight}`}>
            {formData.costoUnitarioSinIva ? (
              `$ ${Number(formData.costoUnitarioSinIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioSinIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Precio acordado ÷ (Cantidad × Equivalencia) • Sin IVA
        </p>
      </div>
    );
  }

  return (
    <div className={styles.costGridDual}>
      <div className={styles.costCard}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Sin IVA:</span>
          <span className={styles.costValue}>
            {formData.costoUnitarioSinIva ? (
              `$ ${Number(formData.costoUnitarioSinIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioSinIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Subtotal base ÷ (Cantidad × Equivalencia)
        </p>
      </div>

      <div className={`${styles.costCard} ${styles.costCardHighlight}`}>
        <div className={styles.costHeaderRow}>
          <span className={styles.costLabel}>Costo Con IVA ({formData.porcentajeIva || 19}%):</span>
          <span className={`${styles.costValue} ${styles.costValueHighlight}`}>
            {formData.costoUnitarioConIva ? (
              `$ ${Number(formData.costoUnitarioConIva).toLocaleString('es-CO', {
                minimumFractionDigits: Number(formData.costoUnitarioConIva) % 1 !== 0 ? 2 : 0,
                maximumFractionDigits: 2
              })} / ${unidadFinal}`
            ) : `$ 0 / ${unidadFinal}`}
          </span>
        </div>
        <p className={styles.costHelperText}>
          Total fiscal ÷ (Cantidad × Equivalencia)
        </p>
      </div>
    </div>
  );
}
```

---

## Bloque 2 — Salida de Consola del Test de Diagnóstico Temporal

Comando ejecutado:
```bash
pnpm --filter web exec playwright test supplier-prices/supplier-prices-modal-calc.spec.js -g "DIAGNÓSTICO" --reporter=list
```

Salida exacta devuelta por Playwright:
```text
Running 1 test using 1 worker

[DIAG] Insumo input value: AZUCAR E2E 1790166879117
[DIAG] Proveedor input value: PROV_ORIGINAL_1790200539331
[DIAG] Presentación value: GARRAFA
[DIAG] Unidad value: L
[DIAG] Cantidad value: 20
[DIAG] Precio value: 60.000
[DIAG] Pleca text: | L
[DIAG] CostCard text: Costo Unitario Base:$ 0 / kgPrecio acordado ÷ (Cantidad × Equivalencia) • Sin IVA
  ✓  1 [chromium] › e2e\supplier-prices\supplier-prices-modal-calc.spec.js:55:7 › Precios Proveedores - Cálculos Matemáticos e IVA (C01-C08) › DIAGNÓSTICO: estado interno tras fillSupplierPriceForm (2.1s)

  1 passed (2.8s)
```

> **HALLAZGO CLAVE DEL DIAGNÓSTICO:**
> 1. En el helper, `wrapInsumo.locator('div[class*="dropdownItem"]').first().click()` siempre hace click en la **primera opción disponible** de la lista (`AZUCAR E2E 1790166879117`), cuya unidad base es **kg**, ignorando que el test pedía `insumoNombre: 'Leche'`.
> 2. Al seleccionar unidad `L` para un insumo de unidad base `kg`, la conversión de unidades no coincide o `formData.costoUnitarioSinIva` se evalúa en 0 / NaN, mostrando `$ 0 / kg`.

*(El test de diagnóstico ya fue retirado de `supplier-prices-modal-calc.spec.js` dejando el archivo en su estado original).*

---

## Bloque 3 — El insumo "Leche" en la BD / Seeds

### En `apps/api/prisma/seed-test-data.js`:
```javascript
// Línea 28:
const inLeche = await prisma.insumo.create({
  data: {
    nombre: 'Leche cruda',
    categoria: 'Materia Prima',
    subcategoria: 'Lácteos',
    marca: 'Local',
    unidadBase: 'Litros',
    stockMinimo: 100,
    activo: true
  }
});
```

### En `apps/api/prisma/seed-scada-telemetry.js`:
```javascript
// Línea 126:
{ 
  idEtapaReceta: etapa.id, 
  idInsumo: insumosMap['Leche Cruda Entera'].id, 
  cantidadRequerida: 95, 
  mermaPorcentaje: 2, 
  unidad: 'LITRO', 
  tipoInsumo: 'MATERIA_PRIMA' 
}
```

### En `apps/api/prisma/setup-e2e-order.js`:
```javascript
// Línea 61:
nombre: 'Leche Pasteurizada E2E',
unidadBase: 'Litros',
categoria: 'MATERIA_PRIMA',
stockMinimo: 10,
activo: true
```
