# Auditoría Técnica: Módulo de Producción y Ciclo de Inventario

**Fecha de Auditoría:** Septiembre 2026
**Objetivo:** Diagnóstico de la conexión transaccional entre Órdenes de Producción (BOM), Inventario de Materias Primas, Generación de Lotes y Producto Terminado.

---

## A. DIAGNÓSTICO DEL FLUJO DE PRODUCCIÓN ACTUAL

### Modelos y Estructura en `schema.prisma`
- **`Receta` y `DetalleReceta`:** Soportan el BOM (Bill of Materials) organizando insumos por etapas de fabricación, con variables de `mermaPorcentaje`, rendimientos teóricos y agrupaciones (insumos base vs. opcionales).
- **`Produccion`:** Registra la orden de trabajo. Permite programar `cantidadPlanificada` y almacenar `cantidadProducidaReal`. Su estado alterna fundamentalmente entre `PLANIFICADA` y `COMPLETADA`.
- **`DetalleProduccion`:** Guarda el snapshot del consumo de la receta con `cantidadTeorica`, `cantidadRealUtilizada` y calcula la `diferencia` (merma real). 

### Mecánica Transaccional Actual (`production.repository.js`)
1. **Creación (Borrador / Planificada):** El método `getRecipeBom` calcula en vivo los insumos requeridos frente al stock actual. El método `createWithTransaction` genera la orden de Producción en estado `PLANIFICADA`, copiando el BOM teórico. **No se realiza bloqueo ni reserva de stock de insumos en esta etapa.**
2. **Finalización:** El método `completeProduction` registra las cantidades reales consumidas, y:
   - Descuenta el inventario físico (`Inventario.cantidadActual`).
   - Inserta un `MovimientoInventario` de tipo `SALIDA`.
   - Genera automáticamente un registro en la tabla `Lote` asociando la fecha de vencimiento y las unidades producidas.

---

## B. BRECHAS TÉCNICAS (GAPS) IDENTIFICADAS

A pesar de tener una base sólida, el flujo actual presenta deudas técnicas para un entorno industrial:

1. **Desconexión con el Nuevo Trazado de Inventario:**
   - La inserción en `MovimientoInventario` no está guardando los nuevos campos financieros ni contables (`stockAnterior`, `stockNuevo`, `costoUnitario`). Esto romperá el Kárdex financiero recién implementado.
2. **Carencia de Inventario de Producto Terminado:**
   - Al finalizar la producción, se crea un `Lote` correctamente, pero **NO se incrementa el saldo en `InventarioProducto`** (el modelo agregado en la Fase 1). El sistema sabe que existe un lote de Yogur, pero la bodega comercial (Cava) no recibe el impacto de la entrada.
3. **Pérdida de Valorización y Costeo de Producción:**
   - Si bien cada `DetalleProduccion` guarda su `costoReal`, el backend no consolida este costo para dividirlo entre las unidades finales producidas. El `InventarioProducto` y el `Lote` carecen del costo de fabricación asignado, lo que impide calcular el margen de ganancia real durante las Ventas.
4. **Reserva de Stock Inexistente:**
   - El estado `PLANIFICADA` no reserva el inventario. Se podría planificar la misma leche para tres órdenes distintas, permitiendo sobregiro de stock en el piso de producción hasta que la primera se complete.

---

## C. ARQUITECTURA PROPUESTA PARA UN FLUJO INDUSTRIAL COMPLETO

Para sellar el ciclo productivo ERP, sugerimos el siguiente rediseño de estados:

1. **`BORRADOR / PLANIFICADA`**
   - El sistema calcula el BOM. Si hay `faltante > 0`, se permite guardar en borrador pero **no se puede iniciar**.
   - **Mejora:** Disparador automático que conecte con el módulo de Compras para solicitar abastecimiento de los insumos en rojo.
2. **`EN_PROCESO`**
   - El jefe de planta arranca la orden. En este momento, el backend bloquea o "reserva" (en un campo `cantidadReservada` de `Inventario`) la cantidad teórica de insumos.
3. **`FINALIZADA`**
   - Se reportan las mermas (lo real vs. lo teórico).
   - **Materia Prima:** Se efectúa la salida contable de `Inventario` y se libera la reserva. Se inyecta un `MovimientoInventario` (`SALIDA_PRODUCCION`) con los campos `stockAnterior` y `stockNuevo` resueltos.
   - **Costo Absorbido:** Se suman los costos reales de todos los insumos consumidos. El Total Costo / Cantidad Producida = **Costo Unitario de Fabricación**.
   - **Producto Terminado:** 
     1. Se crea el `Lote` (PEPS).
     2. Se hace un `UPSERT` sobre `InventarioProducto` sumando las unidades.
     3. Se inserta un `MovimientoInventario` (`ENTRADA_PRODUCCION`) hacia el ID del producto, grabando su costo unitario de fabricación.

---

## D. RECOMENDACIONES DE ENDPOINTS Y TRANSACCIONES A ACTUALIZAR

Para lograr esto de forma segura y desacoplada, el `production.controller.js` y su repositorio deben ser refactorizados en los siguientes métodos:

- `POST /api/v1/production/:id/start`: Cambia el estado a `EN_PROCESO` y realiza las validaciones lógicas de reserva de materia prima.
- `POST /api/v1/production/:id/complete`: El método `completeProduction` debe expandir su bloque `$transaction` para incluir obligatoriamente el `upsert` en `InventarioProducto` y calcular matemáticamente el costo unitario prorrateado antes de grabar los `MovimientoInventario`.
- `GET /api/v1/production/:id/costing`: Un nuevo endpoint analítico que devuelva a la gerencia el desglose de cuánto costó exactamente este lote, las mermas generadas y el margen proyectado.
