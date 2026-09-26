# Auditoría Estructural: Flujo de Liquidación a Cava y Despacho en Ventas

> **Documento:** Auditoría técnica estática de ciclo transaccional Producción ➔ Cava ➔ Ventas  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/api/src/production/`, `apps/api/src/sales/`, y `apps/web/src/app/commercial/sales/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Contrato de Liquidación de Producción (`PATCH /api/v1/production/:id/complete`)

### 1.1 Payload JSON Requerido
La llamada a la API requiere el cuerpo procesado en `ProductionRepository.completeProduction`:
```json
{
  "cantidadProducidaReal": 10,
  "fechaVencimiento": "2026-10-16T00:00:00.000Z",
  "detalles": [
    {
      "id": "<UUID_DETALLE_PRODUCCION>",
      "cantidadRealUtilizada": 10
    }
  ],
  "reservaInoculo": null
}
```
*Si se trata de un semielaborado WIP y se activa reserva de cultivo:*
- `reservaInoculo`: `{ "activo": true, "cantidad": 2, "fechaVencimiento": "..." }`.

### 1.2 Efecto en el Lote Padre WIP (En Tanque)
1. El backend detecta el insumo o producto intermedio en `detalles`.
2. Para cada `idProductoIntermedio`:
   - Si se envía `desgloseLotes` o `asignacionInoculo`, descuenta directamente de los lotes especificados.
   - De lo contrario, aplica **descuento automático FEFO** (`fechaVencimiento: 'asc'`, `fechaProduccion: 'asc'`) sobre los lotes activos (`tipoLote: 'SEMIELABORADO_WIP'` o asociados a `idProductoIntermedio`).
   - El saldo del lote padre disminuye (`nuevaCant = cantidadDisponible - aDescontar`). Si llega a 0, su estado pasa a `'AGOTADO'`.
   - Se preserva el identificador `idLotePadreDetectado` para vincular la genealogía.

### 1.3 Generación del Nuevo Lote Comercial en Cava
- **Tipo de Lote:** Si el producto objetivo es de categoría `INTERMEDIO_WIP`, genera `tipoLote: 'SEMIELABORADO_WIP'`. Si es un producto comercial regular, genera `tipoLote: 'PRODUCTO_TERMINADO'`.
- **Estado Inicial:** `'DISPONIBLE'`.
- **Campos Clave Asignados:**
  - `idProduccion`: ID de la orden liquidada.
  - `idProducto`: ID del producto terminado.
  - `idLotePadre`: ID del lote padre WIP consumido (trazabilidad y linaje generacional F0..F4).
  - `cantidadInicial` y `cantidadDisponible`: `cantidadProducidaReal` (menos la fracción de inóculo si hubo reserva).
  - `costoUnitario`: Liquidado dinámicamente dividiendo `costoTotalLote / qtyProducida`.

---

## 2. Impacto en Inventario / Cava

### 2.1 Actualización de `InventarioProducto`
- Se ejecuta un `upsert` sobre la tabla `InventarioProducto` para el `idProducto`:
  - `cantidadActual`: Se incrementa con `cantPrincipal` (`cantidadActual + qtyProducida`).
  - `costoPromedio`: Se recalcula de forma ponderada con el costo unitario de fabricación.
- Las consultas a `/inventory/cava` o `/products` leen directamente de `InventarioProducto` y `Lote` (`where: { estado: 'DISPONIBLE', cantidadDisponible: { gt: 0 } }`).

### 2.2 Movimiento en Kárdex (`MovimientoInventario`)
Se generan dos tipos de movimientos dentro de la misma transacción atómica:
1. **Salida de Insumos / WIP:**
   - `tipoMovimiento`: `'SALIDA_PRODUCCION'`.
   - `motivo`: `"Consumo real en orden de producción <ID>"` o `"Consumo base intermedio en orden <ID>"`.
   - `operacionOrigen`: ID de la orden de producción.
2. **Entrada de Producto Terminado a Cava:**
   - `tipoMovimiento`: `'ENTRADA_PRODUCCION'`.
   - `idProducto`: ID del producto final.
   - `idLote`: ID del nuevo lote creado en Cava.
   - `cantidad`: `cantPrincipal`.
   - `costoUnitario`: Costo unitario de fabricación.
   - `motivo`: `"Entrada a Cava por finalización de orden de producción <ID>"`.

---

## 3. Mecanismo de Selección de Stock en Ventas

### 3.1 Endpoint y Consulta de Lotes Disponibles
- El controlador `SalesController` (`POST /api/v1/sales`) delega en `SalesService.create` y valida el payload mediante Zod (`createSaleSchema`).
- Para listar productos y lotes en la UI de ventas (`/commercial/sales`), el frontend consulta:
  - `GET /api/v1/products`: Catálogo con stock agregado en `InventarioProducto`.
  - `GET /api/v1/inventory/lots?idProducto=...`: Lotes disponibles con fecha de vencimiento y saldo FEFO.

### 3.2 Barreras Poka-Yoke en Ventas
1. **Bloqueo Backend de Stock Insuficiente:**
   - `SalesRepository` verifica en transacción atómica que cada detalle cumpla:
     `lote.cantidadDisponible >= cantidadVendida`.
   - Si el stock es insuficiente, lanza `BadRequestException("Stock insuficiente para el lote ...")`.
2. **Deducción de Inventario en Venta:**
   - Decrementa `cantidadDisponible` en la tabla `Lote`.
   - Si el saldo queda en 0, actualiza `estado: 'AGOTADO'`.
   - Genera movimiento Kárdex `tipoMovimiento: 'SALIDA_VENTA'` asociado a la venta.

---

## 4. Resumen de Selectores para Pruebas E2E

### 4.1 Liquidación en Producción (`/operations/production`)
- **Botón Disparador:**
  `button:has-text("Finalizar"), button:has-text("Liquidar")` en la tarjeta de orden (`ProductionOrderCard`).
- **Modal:**
  `div[role="dialog"]` o `SmartModal` con título `Finalizar y Liquidar: ...`.
- **Input Volumen Real:**
  `input[type="number"].inputTableQty` (placeholder `Ej: 6` o `0.0`).
- **Input Fecha Vencimiento:**
  `input[type="date"].expiryDateInput`.
- **Botón Confirmar Liquidación:**
  `button:has-text("Confirmar Liquidación")` (`.btnMannaPrimary`).

### 4.2 Registro de Venta Comercial (`/commercial/sales`)
- **Botón Disparador:**
  `button:has-text("+ Nueva Venta")` o `button:has-text("Registrar Venta")`.
- **Selector de Cliente:**
  `select[name="idCliente"]` o selector searchable de clientes.
- **Selector de Producto / Lote:**
  Selector que lista los lotes en Cava (`PRODUCTO_TERMINADO`) generados por la producción.
- **Botón de Guardado:**
  `button:has-text("Completar Venta")` o `button:has-text("Emitir Factura / Remisión")`.
