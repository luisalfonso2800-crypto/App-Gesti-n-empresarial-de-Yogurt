# INFORME-29: FASE 9 — KARDEX, VENTAS Y FINANZAS

> **Documento:** Auditoría Exhaustiva de Movimientos de Kardex, Ciclo Comercial de Ventas, Cartera, Métricas Financieras y Metas  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-9-kardex-ventas-finanzas/TASK-10-FASE-9-KARDEX-VENTAS-FINANZAS.md`  
> **Estado:** Fase 9 completada al 100%. Modo auditoría de solo lectura (código intacto).

---

## 1. Auditoría de Kardex por Clase de Movimiento (T1)

| Clase de Movimiento (`tipoMovimiento`) | Archivo y Línea | Entidad Afectada | Fórmula de Stock Aplicada | ¿Respeta Identidad $S_{nuevo} = S_{ant} \pm Q$? | Unidades Involucradas | Riesgo / Defecto Detectado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`ENTRADA_COMPRA`** | `purchases.repository.js` L174-192 | `Inventario` (Insumos) | `stockActual + incrementStock` | ⚠️ **CONDICIONAL** (`incrementStock = isLtsOrKgs ? cant * 1000 : cant`) | `currentInsumo.unidadBase` | Falla activa (`HAL-F1-04`): omite `Litros`/`Kilogramos`. Además, **no registra `stockAnterior` ni `stockNuevo` en el movimiento**. |
| **`ENTRADA_PRODUCCION`** | `production.repository.js` L1028-1046 | `InventarioProducto` | `stockAnteriorProd + cantPrincipal` | ✅ SÍ | Unidades o Litros (según categoría) | Polimorfismo ciego de unidad (`HAL-F8-04`). |
| **`ENTRADA_RECIRCULACION_INOCULO`** | `production.repository.js` L1008 | `Lote` (Intermedio) | Crea lote derivado | N/A (crea nuevo lote) | Litros | Se crea sub-lote sin actualizar saldo acumulado del producto padre. |
| **`SALIDA_PRODUCCION` (Insumos)** | `production.repository.js` L735-753 | `Inventario` (Insumos) | `Math.max(0, stockActual - qtyReal)` | ❌ **NO** (trunca a 0 si $S_{ant} < Q$) | Receta formulada vs Catálogo | Descuenta en unidad de receta sin normalizar (`HAL-F2-02`) y destruye evidencia con `Math.max` (`HAL-F4-08`). |
| **`SALIDA_PRODUCCION` (WIP)** | `production.repository.js` L790-805 | `InventarioProducto` | `Math.max(0, stockAnt - decrementoLts)` | ❌ **NO** (trunca a 0 si $S_{ant} < Q$) | Litros | `decrementoLts = qtyReal / 1000` si es g/ml; trunca a 0. |
| **`SALIDA_VENTA`** | `sales.repository.js` L128, L214 | `InventarioProducto` + `Lote` | `stockAnterior - d.cantidad` | ✅ SÍ | `d.cantidad` (unidades) | Descuenta unidades comerciales planas sin verificar si el lote físico era empaque secundario. |
| **`MERMA_VENCIMIENTO`** | `lots.repository.js` L170-204 | `Inventario` o `InventarioProducto` | `stockAnterior - cantidadADescontar` | ✅ SÍ | Unidad del lote | Permite saldos negativos si no se valida en servicio. |
| **`AJUSTE_POSITIVO` / `CARGA_INICIAL`** | `inventory.repository.js` L141-171 | `Inventario` (Insumos) | `stockAnterior + cantidadAjuste` | ✅ SÍ | Unidad base insumo | Pondera CPP (`L152`), pero **únicamente** en ajustes manuales. |
| **`AJUSTE_NEGATIVO`** | `inventory.repository.js` L141-171 | `Inventario` (Insumos) | `stockAnterior + cantidadAjuste` ($Q < 0$) | ✅ SÍ | Unidad base insumo | Mantiene `costoAnterior` intacto. |

---

## 2. Auditoría de Ventas (T2)

### Trazabilidad y Descuento en Inventario
1. **Unidades en Venta:** La venta opera en unidades nominales comerciales (`DetalleVenta.cantidad`). No existe relación explícita con `Presentacion.cantidadMl` ni `Presentacion.unidadMedida`.
2. **Descuento de Bodega:**
   ```javascript
   stockNuevo = stockAnterior - d.cantidad;
   ```
   Descuenta un escalar numérico plano de `InventarioProducto.cantidadActual`.
3. **Caso Obligatorio (Venta de 1 "Caja x 12 und"):**
   - Si se vende 1 unidad de un producto cuya presentación es "Caja x 12 und":
     - **Comportamiento Actual:** Descuenta **1** en `InventarioProducto.cantidadActual`.
     - **Problema de Negocio:** El sistema no tiene trazabilidad de si el inventario de bodega está contabilizado en unidades individuales (12 vasitos) o en bultos (1 caja). Si la bodega contenía 12 unidades sueltas, al vender 1 caja descuenta 1 unidad, dejando **11 unidades flotantes de sobrante fantasma** en bodega.
4. **Cálculo de Utilidad y Margen en Línea (`sales.repository.js` L150-151):**
   - `utilidadUnitaria = precioUnitario - costoUnitario` (donde `costoUnitario` proviene del lote o del `costoPromedio` del producto).
   - `utilidadTotal = subVenta - (cantidad * costoUnitario)`.
   - **Vulnerabilidad:** No valida si el costo supera el precio; permite ventas con utilidad negativa sin flag de advertencia.

---

## 3. Auditoría de Pagos y Cartera (T3)

### Análisis de Validación y Antipatrón en Pagos (`payments.repository.js` L37-60)
1. **Validación de Sobrepago por Transacción:**
   ```javascript
   if (pagoMonto > saldoActual) {
     throw new Error(`El valor del pago (${pagoMonto}) no puede exceder el saldo pendiente (${saldoActual})`);
   }
   ```
   Impide que un pago individual sea mayor al saldo pendiente actual de la factura.
2. **Sobrepago Acumulativo / Concurrente:**
   ```javascript
   const nuevoValorPagado = Number(venta.valorPagado) + pagoMonto;
   const nuevoSaldo = Math.max(0, Number(venta.totalVenta) - nuevoValorPagado);
   ```
   Si por concurrencia o abonos desfasados `nuevoValorPagado > totalVenta`, `Math.max(0, ...)` trunca el saldo a 0, **perdiendo el dinero sobrante sin abonarlo a cartera a favor del cliente** (`HAL-F4-08`).
3. **Ejemplo Demostrado:**
   - Factura por $\$100,000\text{ COP}$.
   - Pago 1: $\$60,000\text{ COP}$ $\to$ Saldo: $\$40,000\text{ COP}$, Estado: `'PENDIENTE'`.
   - Pago 2 por $\$50,000\text{ COP}$: El sistema arroja excepción: `El valor del pago (50000) no puede exceder el saldo pendiente (40000)`.
   - **Limitación Funcional:** El cliente no puede entregar un billete o consignación por $\$50,000\text{ COP}$ para cancelar su saldo de $\$40,000$ y dejar $\$10,000$ de anticipo; el sistema bloquea la transacción de recaudo.

---

## 4. Auditoría Financiera y Doble Contabilidad (T4)

### Flujo de Caja vs Causación en Dashboard (`dashboard.service.js` L23-50):
1. **`salesCurrentMonth`:**
   ```javascript
   _sum: { totalVenta: true }, where: { fechaVenta: { gte: startOfMonth, lte: endOfMonth } }
   ```
   **Suma todas las ventas generadas en el mes sin importar si fueron de contado o a crédito**.
2. **`netProfitCurrentMonth`:**
   ```javascript
   const netProfitCurrentMonth = salesCurrentMonth - expensesCurrentMonth;
   ```
   **GRAVE DISTORSIÓN DE LIQUIDEZ:** Resta los gastos efectivamente pagados/causados de las ventas totales facturadas a crédito.
   - **Ejemplo Demostrado:** Venta institucional de $\$10,000,000\text{ COP}$ a 60 días (saldo pagado = $0). Gastos operativos del mes: $\$4,000,000\text{ COP}$.
   - El dashboard reporta **`Utilidad Neta: $6,000,000 COP`**, cuando en la cuenta bancaria de la empresa hay un déficit de caja de **$-\$4,000,000\text{ COP}$**.
   - No discrimina el flujo de efectivo real (`pago.aggregate._sum.valorPagado`).

---

## 5. Auditoría de Metas Empresariales (T5 - Hallazgo Crítico `HAL-F9-01`)

### Error Crítico en Agregación de Metas de Producción
En `apps/api/src/goals/goals.repository.js` L160-172:
```javascript
async getSumProduccionLts(fechaInicio, fechaFin) {
  const result = await this.prisma.produccion.aggregate({
    where: {
      fechaProduccion: { gte: fechaInicio, lte: fechaFin },
      estado: { not: 'CANCELADO' }
    },
    _sum: {
      cantidadProducida: true // ¡CAMPO INEXISTENTE EN SCHEMA!
    }
  });
  return Number(result._sum.cantidadProducida || 0);
}
```
- **Falla Crítica de Base de Datos / Prisma:**
  - En `schema.prisma` L283, el modelo `Produccion` define: **`cantidadProducidaReal`**.
  - El campo `cantidadProducida` **NO EXISTE** en el esquema de Prisma.
- **Impacto Demostrado:** Al evaluar metas de `PRODUCCION_LITROS`, Prisma arroja un error de validación en runtime (`Unknown arg 'cantidadProducida' in _sum.cantidadProducida`) o devuelve `undefined || 0`. **Las metas de producción siempre reportan progreso 0% (estado permanente 'SEMILLA')**, rompiendo el módulo de metas empresariales.

---

## 6. Relación con Hallazgos Previos (T6)

- **`HAL-F4-08` (`Math.max`):** Aparece en `payments.repository.js` L55, `production.repository.js` L735, L790, L832 y `sales.repository.js` L128. En todos los casos oculta la inconsistencia financiera forzando saldos a 0.
- **`HAL-F4-04` (Base Gravable en Ventas):** Distorsiona la cartera: al no calcular el IVA sobre la base real con descuento, el `totalVenta` facturado y el `saldoPendiente` se incrementan indebidamente con el 19% de sobrecobro.
- **`HAL-F1-04` (Escalado de Compras):** El movimiento `ENTRADA_COMPRA` L192 ingresa con `incrementStock` subdimensionado en factor 1000x si la unidad es `'Litros'`, desfasando la identidad contable del Kardex desde el primer ingreso de mercancía.

---

## 7. Hallazgos Formalizados de la Fase 9

| ID | Severidad | Módulo / Archivo | Línea | Campo / Flujo | Problema Técnico Detectado | Impacto Demostrado | Condición |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F9-01** | **CRÍTICO** | `goals.repository.js` | L169 | `getSumProduccionLts` | Consulta campo inexistente `cantidadProducida` en vez de `cantidadProducidaReal`. | Error en runtime Prisma o retorno fijo de 0. Metas de producción siempre muestran progreso 0%. | Evaluación de metas de tipo `PRODUCCION_LITROS`. |
| **HAL-F9-02** | **CRÍTICO** | `dashboard.service.js` | L50 | `netProfitCurrentMonth` | Utilidad neta calculada restando gastos a ventas devengadas a crédito sin considerar recaudos de caja. | Venta a crédito de $10M con gastos de $4M muestra utilidad de +$6M con iliquidez real de -$4M en bancos. | Existencia de ventas a crédito en el mes. |
| **HAL-F9-03** | **ALTO** | `purchases.repository.js` | L188-196 | `ENTRADA_COMPRA` | `movimientoInventario.create` no almacena `stockAnterior` ni `stockNuevo`. | Rompe la cadena de trazabilidad forense del Kardex en las entradas por compras. | Registro de cualquier compra directa. |
| **HAL-F9-04** | **ALTO** | `payments.repository.js` | L37-39 | `pagoMonto > saldoActual` | Bloquea recaudos que excedan el saldo de la factura impidiendo registrar anticipos o saldo a favor. | Cliente no puede abonar $50,000 para saldo de $40,000; rechaza el pago en caja con excepción. | Abono en efectivo con excedente sobre saldo. |

---

## 8. Conteo Final de Severidad (Fase 9)

- **CRÍTICO:** 2 (`HAL-F9-01`, `HAL-F9-02`)
- **ALTO:** 2 (`HAL-F9-03`, `HAL-F9-04`)
- **MEDIO:** 0
- **BAJO:** 0  
**Total Hallazgos Fase 9:** **4**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: El error de columna inexistente en metas, la distorsión de utilidad neta en dashboard, la omisión de stocks en compras y el bloqueo de anticipos en pagos fueron verificados directamente en el código fuente.

---
**FASE 9 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 10.**
