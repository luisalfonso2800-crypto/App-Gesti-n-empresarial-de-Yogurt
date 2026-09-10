> Implementa el ciclo de vida completo de Producción (Reserva, Cierre Transaccional, Kárdex Financiero, Costeo Unitario y UI Vintage de Planta):

1. CONTEXTO Y DIAGNÓSTICO:
   - Según la auditoría técnica en docs/implementation/audits/production-inventory-audit.md:
     * Al completar una orden, no se impacta `InventarioProducto` (la Cava no se entera del producto terminado).
     * Los registros en `MovimientoInventario` no guardan `stockAnterior`, `stockNuevo` ni `costoUnitario`, desalineando el Kárdex.
     * No se consolida el costo real total de insumos para asignárselo al `Lote` y calcular el costo unitario de fabricación.
     * Si hay insumos faltantes, falta un mecanismo para disparar compras directas/órdenes.

2. FASE 1: LÓGICA TRANSACCIONAL EN BACKEND (apps/api/src/production/):
   - Refactoriza el método `completeProduction` dentro de `prisma.$transaction`:
     * Consumo de Materias Primas:
       - Para cada insumo en `DetalleProduccion`:
         * Consulta el `Inventario` actual del insumo para obtener `stockAnterior`.
         * Resta `cantidadRealUtilizada`. `stockNuevo = stockAnterior - cantidadRealUtilizada`.
         * Actualiza `Inventario.cantidadActual`.
         * Crea `MovimientoInventario` con:
           `tipoMovimiento: 'SALIDA_PRODUCCION'`, `cantidad: cantidadRealUtilizada`, `stockAnterior`, `stockNuevo`, `costoUnitario: detalle.costoReal`, `operacionOrigen: orden.id`.
     * Costeo Absorbido y Producto Terminado:
       - Suma el costo real de todos los insumos consumidos: `costoTotalLote = sum(cantidadRealUtilizada * costoUnitario)`.
       - Calcula: `costoUnitarioFabricacion = costoTotalLote / cantidadProducidaReal`.
       - Crea el registro en `Lote` asignando `costoUnitario: costoUnitarioFabricacion`, `cantidadInicial: cantidadProducidaReal`, `cantidadDisponible: cantidadProducidaReal`, y fecha de caducidad.
       - Ejecuta `upsert` en `InventarioProducto` incrementando `cantidadActual` con `cantidadProducidaReal` y actualizando `costoPromedio: costoUnitarioFabricacion`.
       - Registra `MovimientoInventario` de entrada:
         `tipoMovimiento: 'ENTRADA_PRODUCCION'`, `cantidad: cantidadProducidaReal`, `costoUnitario: costoUnitarioFabricacion`, `operacionOrigen: orden.id`.
   - Implementa endpoints de soporte:
     * `POST /api/v1/production/:id/start`: Valida stock de insumos y pasa el estado a `EN_PROCESO`.
     * `POST /api/v1/production/create-purchase-order-from-shortage`: Recibe los insumos con faltantes (`faltante > 0`) y genera automáticamente una `OrdenCompra` en estado `PENDIENTE` para abastecimiento inmediato.

3. FASE 2: INTERFAZ REACTIVA Y VINTAGE DE PLANTA (apps/web/src/app/operations/production/):
   - Estética Industrial/Vintage:
     * Tarjetas de registro estilo "Bitácora de Fabricación" con tonos lino (`bg-[#FAF8F5]`), bordes grafito/arcilla (`border-stone-300`), tipografía monoespaciada para balances de masa y acabados satinados.
   - Bom Escalonado y Disponibilidad Reactiva:
     * Al modificar la cantidad a producir o conmutar variantes (Jalea, Cereal), recalcula instantáneamente requerimientos teóricos, stock disponible y estado de faltantes.
     * Si hay faltantes:
       - Banner superior ámbar/borgoña: *"Insumos insuficientes para esta escala de producción."*
       - Botón directo en la tabla: `[+ Disparar Lista de Compra por Faltantes]` que invoque el endpoint y notifique al usuario.
       - Deshabilita el inicio inmediato, permitiendo únicamente *"Guardar como Planificada / Borrador"*.
   - Tablero de Piso de Planta (Órdenes Activas y Finalización):
     * Para órdenes `EN_PROCESO`: Vista de registro de consumos reales donde el operador puede registrar ajustes de mermas antes del cierre.
     * Al presionar *"Cerrar Orden y Liquidar Lote"*:
       - Modal de liquidación que muestra el balance final: Unidades obtenidas, Costo total invertido, Costo por unidad de yogur y Lote asignado.

4. VALIDACIÓN:
   - Crear una orden con faltantes y verificar la creación asistida de la orden de compra.
   - Ejecutar una orden completa:
     * Verificar en la base de datos que `Inventario` de insumos baje y `InventarioProducto` suba.
     * Verificar que el Kárdex en `/operations/inventory` muestre las filas de `SALIDA_PRODUCCION` y `ENTRADA_PRODUCCION` con sus costos y stocks antes/después exactos.
   - Validar sintaxis:
     node --check apps/api/src/production/production.controller.js
     node --check apps/web/src/app/operations/production/page.jsx