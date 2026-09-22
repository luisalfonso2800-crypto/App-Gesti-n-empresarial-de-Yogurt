# BLOQUE 5 DE REMEDIACIÓN — KARDEX, VENTAS Y FINANZAS

## Contexto
Auditoría forense completada (INFORME-36).
Bloques 1, 2, 3 y 4 completados.
Hallazgos a corregir en este bloque:
- HAL-F9-02 (CRÍTICO): Utilidad neta devengada sin recaudar computada
  como liquidez.
- HAL-F9-03 (ALTO): Ausencia de stockAnterior/stockNuevo en Kardex.
- HAL-F9-04 (ALTO): Bloqueo de cobros mayores al saldo sin anticipo.
- HAL-F4-08 (ALTO): Antipatrón Math.max(0, ...) oculta saldos negativos.
- HAL-F8-02 (ALTO): Omite validación de rango en merma (0 ≤ m < 100).
- HAL-F8-04 (ALTO): Polimorfismo sin unidad en cantidadProducidaReal.

Causa raíz común: falta de trazabilidad y control en flujos
financieros/Kardex.

## Alcance
- apps/api/src/dashboard/dashboard.service.js (HAL-F9-02)
- apps/api/src/purchases/purchases.repository.js (HAL-F9-03)
- apps/api/src/production/production.repository.js (HAL-F9-03,
  HAL-F8-02, HAL-F8-04)
- apps/api/src/sales/sales.repository.js (HAL-F9-03, HAL-F4-08)
- apps/api/src/payments/payments.repository.js (HAL-F9-04, HAL-F4-08)
- apps/api/prisma/schema.prisma (HAL-F9-04, HAL-F8-04)

## Reglas de ejecución
- Cada fix cita su hallazgo origen.
- Cada fix incluye su test de regresión (TEST-AUD-13, TEST-AUD-22,
  TEST-AUD-EMERG-03).
- Un commit atómico por hallazgo.
- Rama: remediation/bloque-5-kardex-finanzas.
- NO modificar fixes de Bloques 1-4.
- Si aparece hallazgo nuevo, va a BACKLOG_POST_AUDITORIA.md.
- DETENERSE al terminar. No avanzar a Bloque 6.

## Tareas

### T1. Corregir HAL-F9-02 (utilidad neta ficticia)
En dashboard.service.js L23-50:
- Actual: netProfitCurrentMonth = salesCurrentMonth - expensesCurrentMonth
  donde salesCurrentMonth suma todas las ventas del mes sin importar
  si fueron de contado o a crédito.
- Fix: distinguir dos métricas:
  - `utilidadDevengada`: ventas facturadas - gastos causados.
  - `utilidadRealizada`: pagos recibidos - gastos pagados.
- El dashboard debe mostrar AMBAS, con labels claros.
- Si el schema permite, añadir campo `tipoMetrica` o similar.

### T2. Corregir HAL-F9-03 (Kardex sin stockAnterior/stockNuevo)
En todos los flujos que crean movimientos de inventario:
- purchases.repository.js
- sales.repository.js
- production.repository.js
- inventory.repository.js
Añadir a cada create de movimiento:
- `stockAnterior`: valor antes del movimiento.
- `stockNuevo`: valor después del movimiento.
- `unidadMovimiento`: unidad en que se registra.
Si el schema no tiene estos campos, añadirlos con migración:
stockAnterior Decimal
stockNuevo Decimal
unidadMovimiento String

text
Backfill: para movimientos históricos, dejar null y documentar
como deuda técnica.

### T3. Corregir HAL-F9-04 (bloqueo de anticipos)
En payments.repository.js L37-39:
- Actual: si pagoMonto > saldoActual, lanzar error.
- Fix: permitir sobrepago y crear saldoAFavor.
- Añadir campo `saldoAFavor` en Venta o crear modelo
  `CreditoCliente` con saldo acumulado.
- Decidir modelo y documentar.
- Si se decide no permitir anticipos por política de negocio,
  documentarlo explícitamente y cerrar el hallazgo como
  "FUERA DE ALCANCE".

### T4. Corregir HAL-F4-08 (Math.max antipatrón)
Buscar todas las ocurrencias de Math.max(0, ...):
- production.repository.js L735, L790, L832
- sales.repository.js L128
- payments.repository.js L55
- inventory.repository.js
Reemplazar por manejo explícito:
- En inventario: permitir negativo temporal O lanzar
  StockInsuficienteException.
- En pagos: calcular saldoAFavor en lugar de truncar.
- En producción: validar stock suficiente antes de descontar.
Decisión de diseño por módulo, documentar.

### T5. Corregir HAL-F8-02 (validación de merma)
En production.repository.js L168-169:
- Actual: merma = Number(det.mermaPorcentaje) || 0; sin validar rango.
- Fix: validar 0 ≤ merma < 100.
- Rechazar con BadRequestException si merma negativa o ≥ 100.
- Añadir al schema Zod de recetas.

### T6. Corregir HAL-F8-04 (polimorfismo cantidadProducidaReal)
En schema.prisma (Produccion):
- Añadir campo `unidadCantidadProducida String` (Litros, UNIDAD, kg,
  etc.).
- Migración: rellenar con valor inferido según categoría del producto.
En production.repository.js:
- Al crear Produccion, asignar explícitamente la unidad.
- Al leer, usar la unidad almacenada en lugar de inferir por categoría.

### T7. Tests de regresión
TEST-AUD-13: Movimiento de Kardex persiste stockAnterior/stockNuevo.
TEST-AUD-22: Pago mayor al saldo genera saldoAFavor.
TEST-AUD-EMERG-03: Dashboard muestra utilidad devengada vs realizada.

### T8. Smoke test
- Crear venta a crédito → verificar dashboard muestra dos métricas.
- Registrar pago parcial → verificar Kardex con stockAnterior/Nuevo.
- Registrar pago mayor al saldo → verificar saldoAFavor.
- Crear producción con merma 150% → verificar rechazo.
- Crear producción con producto intermedio → verificar unidad
  guardada explícitamente.
- Intentar descontar stock mayor al disponible → verificar
  comportamiento (no truncar silenciosamente).

### T9. Verificación y cierre
- Correr suite completa (25 + ~3 = ~28 tests).
- Confirmar 0 regresiones.
- Documentar en INFORME-REMEDIACION-05.md.

## Formato de entrega
- INFORME-REMEDIACION-05.md con T1-T9.
- Máximo 2000 palabras.
- DETENERSE. No avanzar a Bloque 6.

## Criterios de aceptación
1. HAL-F9-02, HAL-F9-03, HAL-F9-04, HAL-F4-08, HAL-F8-02,
   HAL-F8-04 marcados como RESUELTOS o fuera de alcance justificado.
2. Dashboard muestra utilidad devengada y realizada.
3. Kardex tiene stockAnterior/stockNuevo por movimiento.
4. Pagos permiten anticipos con saldoAFavor.
5. Math.max(0,...) eliminado de flujos financieros.
6. Merma validada 0-100.
7. Producción tiene unidadCantidadProducida explícita.
8. 0 regresiones.
9. Smoke test funcional documentado.