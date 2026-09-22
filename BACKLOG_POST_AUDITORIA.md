# BACKLOG POST-AUDITORÍA

Hallazgos nuevos detectados durante la fase de remediación.
NO forman parte del informe de auditoría (39 hallazgos cerrados).
Se revisarán al finalizar los 7 bloques de remediación.

## Formato de entrada

### [BLOQUE-N] HAL-FX-YY (o título descriptivo)
- **Detectado en:** archivo:línea
- **Descripción:** ...
- **Severidad estimada:** CRÍTICO / ALTO / MEDIO / BAJO
- **Bloque donde se detectó:** Bloque N
- **Acción sugerida:** ...

---

## Hallazgos registrados

### [BLOQUE-1] DEUDA-BLOQUE1-01: Asunción de precioIncluyeIva y redondeo por línea en recálculo de ventas
- **Detectado en:** `apps/api/src/sales/sales.repository.js`: L148-158
- **Descripción:** El recálculo forzoso server-side del Bloque 1 asumía tarifa estándar y redondeo por línea.
- **Severidad estimada:** ALTO
- **Estado:** **RESUELTO EN BLOQUE 4** (Soporta `precioIncluyeIva` dinámico, distingue descuentos comerciales/financieros y aplica redondeo global de factura).

### [BLOQUE-3] DEUDA-BLOQUE3-01: Ausencia de columna de densidad en modelo Insumo y Producto
- **Detectado en:** `apps/api/src/common/units/unit-registry.js`: L160-170
- **Descripción:** Ausencia de campo `densidad` en base de datos.
- **Severidad estimada:** MEDIO
- **Estado:** **RESUELTO EN BLOQUE 4** (Añadido `densidad Decimal? @default(1.0) @db.Decimal(6,4)` a Insumo y Producto en `schema.prisma` y regenerado cliente Prisma).

### [BLOQUE-5] DEUDA-BLOQUE5-01: `utilidadTotal` en DetalleVenta incluye IVA
- **Detectado en:** `apps/api/src/sales/sales.repository.js`: L194
- **Descripción:** `utilidadTotal = totalLinea - (cantidadNum * costoUnit)` — `totalLinea` incluye IVA, inflando la utilidad registrada por línea.
- **Severidad estimada:** ALTO
- **Estado:** PENDIENTE

### [BLOQUE-5] DEUDA-BLOQUE5-02: No se valida correspondencia Cliente-Venta en pagos
- **Detectado en:** `apps/api/src/payments/payments.repository.js`: L24-73
- **Descripción:** Un operador puede registrar un pago a nombre del Cliente A pero abonar a la factura del Cliente B.
- **Severidad estimada:** MEDIO
- **Estado:** PENDIENTE

### [BLOQUE-5] DEUDA-BLOQUE5-03: KPI `totalCobrado` no respeta filtros de fecha/cliente
- **Detectado en:** `apps/api/src/payments/payments.repository.js`: L168-171
- **Descripción:** `totalCobrado` calcula suma histórica global de todos los pagos, ignorando filtros activos.
- **Severidad estimada:** BAJO
- **Estado:** PENDIENTE
