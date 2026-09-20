TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Incluir el campo `canalVenta` en la consulta del histórico de producción en backend y añadir el filtro por canal de venta en la cabecera de la tabla de datos en frontend:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Backend (`production.repository.js`):
   - Al obtener las órdenes de producción en la consulta de histórico/completadas:
     * Asegurar que la relación con el producto traiga `canalVenta`:
       `producto: { select: { id: true, nombre: true, categoria: true, canalVenta: true } }`
     * Mapear en la orden retornada: `canalVenta: orden.producto?.canalVenta || 'SOLO_PLANTA'`.

2. Frontend (`ProductionHistoryTable.jsx`):
   - Agregar un selector desplegable al lado del buscador de texto:
     * Opciones del `<select>`:
       - `Todos los Canales`
       - `🏭 Solo Planta / Transformación`
       - `🏪 Comercial (B2B / B2C / Completo)`
       - `🔄 Mixto`
   - Filtrar el arreglo de lotes según la selección activa y el término de búsqueda de texto.
   - Opcional: Mostrar un badge sutil en una columna o bajo el nombre del producto indicando el canal (ej. "B2B", "Planta", "Comercial").
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El backend entrega el campo `canalVenta` para cada orden procesada.
- La tabla de histórico permite filtrar dinámicamente según el canal de venta seleccionado.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.