> Audita el esquema de base de datos e implementa la vista avanzada de Inventario (KPIs, resolución de nombres, semáforos, valorización y kárdex de movimientos):

1. DIAGNÓSTICO Y ANÁLISIS DE BASE DE DATOS (schema.prisma y backend):
   - Actualmente la vista `/operations/inventory` muestra únicamente UUIDs en crudo en la columna "Insumo (ID)" y números sin unidad de medida base. No calcula la valorización económica ni los semáforos de reposición.
   - Audita en `apps/api/prisma/schema.prisma` los modelos involucrados:
     * `Inventario`: Verifica campos existentes (`idInsumo`, `cantidadActual`, `costoPromedio`, `ultimaActualizacion`).
     * `Insumo`: Verifica campos de metadatos (`nombre`, `categoria`, `unidadBase`, `stockMinimo`, `activo`).
     * `MovimientoInventario`: Verifica campos de trazabilidad (`idInsumo`, `tipoMovimiento`, `cantidad`, `stockAnterior`, `stockNuevo`, `costoUnitario`, `fecha`, `operacionOrigen`).
     * `PrecioProveedor`: Verifica si se debe usar como fallback para obtener el costo base más reciente si `costoPromedio` en inventario es nulo.

2. ACCIÓN EN BACKEND (apps/api/src/inventory/):
   - En el controlador/servicio de inventario (`GET /inventory`):
     * Incluye la relación con `insumo` en la consulta Prisma:
       ```javascript
       prisma.inventario.findMany({
         include: {
           insumo: true,
         },
         orderBy: { ultimaActualizacion: 'desc' }
       })
       ```
     * Asegura que cada ítem retorne:
       - Datos del insumo (`nombre`, `categoria`, `unidadBase`, `stockMinimo`).
       - `cantidadActual` y `costoPromedio`.
       - `valorTotal`: cálculo `Number(cantidadActual) * Number(costoPromedio || 0)`.
       - `estadoStock`: `'CRITICO'` (<= 0), `'BAJO'` (<= stockMinimo), u `'OPTIMO'` (> stockMinimo).
   - Asegura o implementa el endpoint para movimientos: `GET /inventory/movements?idInsumo=...` que consulte `MovimientoInventario` ordenado cronológicamente de forma descendente.

3. ACCIÓN EN FRONTEND (apps/web/src/app/operations/inventory/):
   - **Tarjetas Superiores (KPIs):**
     * *Valor Total en Bodega ($)*: Sumatoria monetaria de todo el inventario.
     * *Insumos Críticos / Agotados*: Contador de insumos con stock <= 0.
     * *Insumos Bajo Mínimo*: Contador de insumos que requieren reabastecimiento.
     * *Total Referencias*: Cantidad de insumos gestionados.
   - **Barra de Filtros y Búsqueda:**
     * Input de búsqueda por nombre de insumo.
     * Selector de categoría (Lácteos, Empaques, Frutas, Químicos/Endulzantes, etc.).
     * Selector de estado (Todos, Críticos, Stock Bajo, Óptimos).
   - **Tabla Principal de Existencias:**
     * Columnas: `Insumo` (nombre y badge de categoría), `Stock Actual` (formateado con su unidad base, ej: `5.000 Gramos`), `Stock Mínimo`, `Estado` (Badge verde/amarillo/rojo), `Costo Unit. Base`, `Valor Total ($)` y `Acciones`.
     * En `Acciones`: Botón *"Historial / Movimientos"* (abre modal o drawer con el Kárdex de `MovimientoInventario`) y botón rápido *"Comprar"* si el stock está bajo (lo añade o redirige al flujo de compra).
   - **Modal / Pestaña Kárdex de Movimientos:**
     * Visualización detallada de las entradas por compra (`ENTRADA_COMPRA`) y salidas de producción, mostrando fecha, cantidad ingresada, saldo final y compra u orden asociada.

4. VALIDACIÓN:
   - Ingresa a `/operations/inventory`: ya no deben verse UUIDs en crudo; deben figurar los nombres de los insumos, unidades de medida y semáforos de stock correctos.
   - Las tarjetas de KPI deben totalizar la valorización real del dinero inmovilizado en bodega.
   - Al filtrar por "Stock Bajo", la tabla debe mostrar únicamente los materiales que necesitan orden de compra.
   - Revisa sintaxis:
     node --check apps/web/src/app/operations/inventory/page.jsx