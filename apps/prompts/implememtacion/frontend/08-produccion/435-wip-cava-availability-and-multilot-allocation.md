TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS):
Implementar el manejo industrial de disponibilidad de inóculos en producción: disponibilidad global agregada por FEFO, selector de asignación multi-lote/lote único, unificación del inóculo en recetas y bloqueo absoluto de listas de compras para semielaborados WIP:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a modificar.
- Modificar EXCLUSIVAMENTE los archivos indicados.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js` (unificación del ítem inóculo para recetas)
2. `apps/api/src/production/production.service.js` (cálculo de disponibilidad de WIP agregada por cava)
3. `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` (o componente de tabla BOM en modal de lanzamiento)

INSTRUCCIONES TÉCNICAS:

1. Unificación en Catálogo / BOM de Recetas (`products.repository.js`):
   - En `findIntermediates()`:
     * Si existen lotes activos con `tipoLote: 'SEMIELABORADO_WIP'`, exponer un ÚNICO ítem genérico en la categoría de inóculos:
       `nombre: "🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)"`, `tipoItem: "INOCULO_WIP"`, `unidadMedida: "g"`.
     * Eliminar la multiplicación de inóculos con nombres de productos padre específicos. La receta solo demanda inóculo láctico estándar.

2. Disponibilidad Agregada en Cava (`production.service.js`):
   - Al evaluar requerimientos de insumos de una orden:
     * Para ítems clasificados como semielaborados WIP o inóculos:
       - El `stockActual` debe ser la SUMATORIA de todos los lotes activos con saldo (`tipoLote: 'SEMIELABORADO_WIP'` y `cantidadActual > 0`), convertidos a gramos (`Litros * 1000`).
       - Si la sumatoria total cubre el requerimiento (ej. 200g + 4000g + 8000g = 12.200g >= 500g), marcar el estado como "Suficiente" (verde).
       - Ordenar los lotes disponibles bajo política FEFO (fechaVencimiento ascendente).

3. Poka-Yoke contra Compras y Selector de Lotes (`ProductionBomTable.jsx`):
   - Si el insumo es tipo 'WIP' / 'INOCULO_WIP':
     * PROHIBIDO mostrar o disparar el botón "+ Disparar Lista de Compra". Los WIPs nunca se compran a proveedores externos.
     * Si el lote más antiguo (FEFO) no cubre la totalidad del batch (ej. tiene 200g y se piden 500g):
       - Permitir al operario visualizar:
         Opción A [Default]: "Consumo FEFO Multi-lote (fad038d5: 200g + d620c865: 300g)".
         Opción B: "Seleccionar lote único con saldo completo" (dropdown con lotes >= cantidad requerida: d620c865 o 21357fa3).
   - Respetar el límite de líneas SRP (< 135 líneas por componente).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/api/src/production/production.service.js`
3. `node --check apps/web/src/app/operations/production/components/ProductionBomTable.jsx`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con 500 g requeridos y 12.2 L en cava repartidos en 3 lotes, el estado del inóculo es "Suficiente".
- No se muestra la alerta roja de insumos insuficientes ni el botón de compra para el inóculo.
- Se habilita el botón "Iniciar Fabricación Inmediata".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.