# INFORME-REMEDIACION-01: BLOQUE 1 — BLINDAJE DE SEGURIDAD SERVER-SIDE

> **Fecha:** 2026-09-22  
> **Rama:** `remediation/bloque-1-seguridad`  
> **Hallazgos cubiertos:** `HAL-F10-01` (CRÍTICO), `HAL-F10-02` (CRÍTICO)  
> **Tests de regresión implementados:** `TEST-AUD-14`, `TEST-AUD-15`

---

## 1. Estrategia de Validación Elegida y Justificación (T1)
Se evaluaron tres opciones para la validación server-side sin TypeScript metadata:
- **Estrategia Elegida:** **Opción A (Zod)** con schemas estrictos (`.strict()`).
- **Justificación Técnica (3 Razones):**
  1. **Compatibilidad Nativa con JavaScript ES:** A diferencia de `class-validator` (que requiere emitDecoratorMetadata y clases TypeScript para que NestJS resuelva tipos en runtime), Zod evalúa schemas puros en tiempo de ejecución sin depender de transpilación previa.
  2. **Política Strict Zero-Trust:** Permite encadenar `.strict()` fácilmente para rechazar propiedades no autorizadas (`{ hack: 123 }`) arrojando un error claro y controlable.
  3. **Aislamiento y Ergonomía de Pruebas:** Facilita la escritura de tests unitarios rápidos y limpios sin necesidad de levantar el ciclo completo de NestJS ValidationPipe en cada prueba.

---

## 2. Archivos Creados y Modificados (T2, T3, T4)

### A. Schemas Zod Creados:
- `apps/api/src/sales/schemas/create-sale.schema.js`: Valida array no vacío de detalles, tipos numéricos positivos y descarta campos financieros del cliente.
- `apps/api/src/purchases/schemas/create-purchase.schema.js`: Valida insumos, cantidades y desgloses.
- `apps/api/src/payments/schemas/create-payment.schema.js`: Valida montos y asociaciones cliente/venta.
- `apps/api/src/lots/schemas/discard-lot.schema.js`: Valida cantidad positiva y motivos en mermas.

### B. Servicios y Repositorios Modificados:
- `apps/api/src/sales/sales.service.js`: Intercepta payloads con `createSaleSchema.safeParse` y lanza `BadRequestException` (HTTP 400).
- `apps/api/src/purchases/purchases.service.js`: Intercepta con `createPurchaseSchema.safeParse`.
- `apps/api/src/payments/payments.service.js`: Intercepta con `createPaymentSchema.safeParse`.
- `apps/api/src/lots/lots.service.js`: Intercepta con `discardLotSchema.safeParse`.
- `apps/api/src/sales/sales.repository.js`: Desecha `subtotal`, `ivaTotal`, `totalVenta` y `descuentoTotal` provistos por el cliente. Recalcula de forma mandatoria:
  - `subtotalLinea = cantidad * precioUnitario`
  - `subtotalConDesc = Math.max(0, subtotalLinea - descuentoLinea)`
  - `baseLinea = subtotalConDesc`
  - `montoIva = Math.round(baseLinea * tarifaIva)`
  - `totalLinea = baseLinea + montoIva`
  - Acumulados a nivel de cabecera persistidos directamente en Prisma.

---

## 3. Tests de Regresión Implementados (T5)
Archivo: `apps/api/src/sales/sales.controller.spec.js`
- **`TEST-AUD-14` (`HAL-F10-01`):** 
  - Payload con `{ hack: 123 }` es rechazado con `BadRequestException` (HTTP 400).
  - Payload con `detalles: []` es rechazado con `BadRequestException` (HTTP 400).
  - **Resultado:** ✅ **PASA**.
- **`TEST-AUD-15` (`HAL-F10-02`):**
  - Payload con ítem de $10,000 e IVA 19% con `totalVenta: 1` enviado por el cliente es recalculado por el backend a `$11,900` (`subtotal: 10000`, `ivaTotal: 1900`, `totalVenta: 11900`).
  - **Resultado:** ✅ **PASA**.

---

## 4. Verificación de Suite Completa (T6)
- **Ejecución:** `pnpm --filter api test`
  ```text
  PASS src/app.controller.spec.js
  PASS src/sales/sales.controller.spec.js

  Test Suites: 2 passed, 2 total
  Tests:       4 passed, 4 total
  ```
- **Regresiones Detectadas:** **0**. Todos los tests previos continúan en verde.
- **Hallazgos Nuevos para Backlog:** **0** (no hubo anomalías en `BACKLOG_POST_AUDITORIA.md`).

---

## 5. Dictamen de Estado de Hallazgos

| ID Hallazgo | Severidad Original | Estado Post-Remediación | Evidencia |
| :--- | :---: | :---: | :--- |
| `HAL-F10-01` | **CRÍTICO** | **RESUELTO** | Schemas Zod `.strict()` activos en 4 módulos; `TEST-AUD-14` pasando. |
| `HAL-F10-02` | **CRÍTICO** | **RESUELTO** | Recálculo forzoso server-side en repositorio; `TEST-AUD-15` pasando. |

---
**ESTADO: BLOQUE 1 DE REMEDIACIÓN COMPLETADO AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A BLOQUE 2 SIN AUTORIZACIÓN.**
