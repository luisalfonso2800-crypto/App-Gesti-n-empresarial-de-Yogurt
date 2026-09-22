# INFORME-REMEDIACION-04: BLOQUE 4 — IVA, MÁRGENES, DESCUENTOS Y DENSIDAD

> **Fecha:** 2026-09-22  
> **Rama:** `remediation/bloque-4-iva-margenes`  
> **Hallazgos cubiertos:** `HAL-F7-01` (CRÍTICO), `HAL-F7-02` (CRÍTICO), `HAL-F7-03` (CRÍTICO), `HAL-F4-04` (ALTO), `HAL-F2-03` (ALTO), `HAL-F4-06` (MEDIO), `HAL-F7-04` (MEDIO)  
> **Tests de regresión implementados:** `TEST-AUD-06`, `TEST-AUD-09`, `TEST-AUD-20`, `TEST-AUD-21`

---

## 1. Añadido de Campo Densidad en Base de Datos (T1, HAL-F2-03)
- En `apps/api/prisma/schema.prisma`, se añadió el campo:
  `densidad Decimal? @default(1.0) @map("Densidad") @db.Decimal(6, 4)` tanto al modelo `Insumo` como a `Producto`.
- Se ejecutó `pnpm --filter api run build` (regenerando cliente Prisma v7.10.0).
- Se resolvió la deuda técnica `DEUDA-BLOQUE3-01` en `BACKLOG_POST_AUDITORIA.md`.

---

## 2. Lógica de IVA y Base Gravable Dinámica (T2, HAL-F7-02)
En `apps/api/src/sales/sales.repository.js`:
- El backend evalúa si `precioIncluyeIva` es verdadero o falso (tomándolo del detalle o de la ficha del producto en BD).
- **Si `precioIncluyeIva = true`:**
  $$\text{baseGravable} = \frac{\text{baseDespuesComercial}}{1 + \text{tarifaIva}}, \quad \text{montoIva} = \text{baseDespuesComercial} - \text{baseGravable}$$
- **Si `precioIncluyeIva = false`:**
  $$\text{baseGravable} = \text{baseDespuesComercial}, \quad \text{montoIva} = \text{baseGravable} \times \text{tarifaIva}$$

---

## 3. Descuentos Comerciales vs Financieros (T4, HAL-F7-03, HAL-F7-04)
- Se actualizó el schema de Zod `createSaleDetailSchema` para soportar `tipoDescuento: z.enum(['COMERCIAL', 'FINANCIERO'])`.
- **Descuento Comercial:** Reduce directamente la base gravable antes de aplicar la tarifa de IVA según la normativa tributaria colombiana.
- **Descuento Financiero (Pronto Pago):** La base gravable se liquida sobre el precio bruto total; el descuento se descuenta posteriormente del total a pagar, sin afectar el impuesto generado.

---

## 4. Redondeo Fiscal Único Consolidado (T3, HAL-F4-06)
- Se eliminó el uso de `Math.round()` por línea en la base y el IVA.
- Los detalles preservan precisión completa con `toFixed(4)` para auditoría.
- El redondeo contable a 2 decimales se aplica exclusivamente una vez al consolidar los totales de cabecera de la factura en la base de datos (`subtotalFinal`, `baseFinal`, `ivaFinal`, `totalVentaFinal`).

---

## 5. Margen Directivo y Costo Base Proveedor (T5, T6, HAL-F7-01, HAL-F4-04)
- **`dashboard.service.js` (L562):** Se corrigió el cálculo de margen comercial en el panel gerencial. Si el precio de venta incluye IVA, se deduce primero la base imponible neta antes de calcular el margen:
  $$\text{margenPorcentaje} = \frac{\text{precioSinIva} - \text{costoUnitario}}{\text{precioSinIva}} \times 100$$
  Elimina la ilusión contable de computar el IVA como margen de utilidad.
- **`supplier-prices.service.js` (L52):** Se corrigió `costoUnidadBase`. Ahora se liquida a partir del `costoBaseSinIva` en lugar de incluir IVA descontable.

---

## 6. Batería de Tests y Resultados (T7, T9)
Archivo: `apps/api/src/sales/tests/sales-taxes-margins.spec.js`
- **`TEST-AUD-09` (`HAL-F7-02`):** Venta con `precioIncluyeIva = false` suma IVA correctamente sobre base directa; si es `true` desglosa base e IVA $\to$ ✅ **PASA**.
- **`TEST-AUD-20` (`HAL-F7-03`, `HAL-F7-04`):** Descuento comercial reduce base a $8,000 (IVA $1,520); descuento financiero mantiene base en $10,000 (IVA $1,900) $\to$ ✅ **PASA**.
- **`TEST-AUD-06` (`HAL-F4-06`):** IVA agrupado por base sin desfase de centavos frente a redondeo de cabecera $\to$ ✅ **PASA**.
- **`TEST-AUD-21` (`HAL-F7-01`):** Margen comercial liquidado sobre precio sin IVA (30% exacto para precio $11,900 con costo $7,000) $\to$ ✅ **PASA**.
- **Suite completa:** `pnpm --filter api test`
  ```text
  PASS src/common/units/tests/unit-registry.spec.js
  PASS src/sales/tests/sales-taxes-margins.spec.js
  PASS src/production/tests/production-wip.spec.js
  PASS src/app.controller.spec.js
  PASS src/purchases/tests/purchases-cpp.spec.js
  PASS src/goals/tests/goals-production.spec.js
  PASS src/sales/sales.controller.spec.js

  Test Suites: 7 passed, 7 total
  Tests:       25 passed, 25 total
  Snapshots:   0 total
  Time:        5.007 s
  ```
- **Regresiones:** **0**. Todos los tests de Bloques 1, 2, 3 y base continúan 100% en verde.

---

## 7. Estado de los Hallazgos

| ID Hallazgo | Severidad | Estado | Evidencia |
| :--- | :---: | :---: | :--- |
| `HAL-F7-01` | **CRÍTICO** | **RESUELTO** | Margen comercial calculado sobre precio sin IVA en `dashboard.service.js`; `TEST-AUD-21`. |
| `HAL-F7-02` | **CRÍTICO** | **RESUELTO** | Base e IVA dinámicos según `precioIncluyeIva`; `TEST-AUD-09`. |
| `HAL-F7-03` | **CRÍTICO** | **RESUELTO** | Descuento comercial aplicado previo a base gravable; `TEST-AUD-20`. |
| `HAL-F4-04` | **ALTO** | **RESUELTO** | Validación Zod estricta + recálculo sin depender de base externa. |
| `HAL-F2-03` | **ALTO** | **RESUELTO** | Columna `densidad` añadida en `schema.prisma` a Insumo y Producto. |
| `HAL-F4-06` | **MEDIO** | **RESUELTO** | Erradicado `Math.round` por línea; consolidación única de factura. |
| `HAL-F7-04` | **MEDIO** | **RESUELTO** | Diferenciación comercial vs financiero en ventas y `costoUnidadBase` sin IVA en proveedores. |

---
**ESTADO: BLOQUE 4 DE REMEDIACIÓN COMPLETADO AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A BLOQUE 5 SIN AUTORIZACIÓN.**
