TAREA DE INVESTIGACIÓN INTEGRAL (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 TOOL CALLS DE SOLO LECTURA):
Auditar exhaustivamente la cadena de custodia de unidades de medida y costos entre los módulos de Recetas, Producción e Inventario, para entender cómo se entrelazan y dónde se produce la distorsión de escala.

PROHIBICIONES ESTRICTAS:
- NO modificar ningún archivo (cero edits/writes).
- NO ejecutar búsquedas recursivas ciegas.
- NO leer archivos CSS ni suites de tests.

ARCHIVOS EXACTOS A INSPECCIONAR (SOLO LECTURA):
1. `apps/api/src/recipes/recipes.service.js` (o repository de recetas):
   - ¿Qué campos se persisten al crear/actualizar una receta y sus ingredientes?
   - ¿Cómo se almacena la cantidad de cada ingrediente y su unidad (`unidadMedida`, `unidadBase`, factores de conversión)?
   - ¿Cómo calcula la receta el costo proyectado o costo de referencia del batch?

2. `apps/api/src/production/production.service.js` (y/o `production.repository.js`):
   - Al planificar o liquidar una orden de producción: ¿cómo lee los ingredientes de la receta para descontar de inventario?
   - ¿Qué datos y unidades transfiere a la tabla `Inventario` (insumos) y `InventarioProducto` / `Lote` al liquidar?
   - ¿Cómo calcula el `costoUnitarioReal` o `costoPromedio` que inyecta en el inventario?

3. `apps/api/prisma/schema.prisma` (secciones específicas):
   - Inspeccionar los modelos: `Receta`, `IngredienteReceta`, `OrdenProduccion`, `Inventario` e `Insumo`.
   - Comprobar qué campos existen para magnitudes físicas (`unidadBase`, `unidadMedida`, `factorConversion`, etc.).

SALIDA REQUERIDA (REPORTE CONCISO):
Detenerse inmediatamente tras leer y generar un informe con:
1. **Flujo de Datos Receta -> Producción -> Inventario:** Mapa paso a paso de cómo viajan los valores numéricos y sus unidades.
2. **Origen de la Desconexión de Unidades:** ¿Dónde se pierde la correspondencia entre la unidad de la receta (ej. g, ml) y la unidad con la que se costea o descuenta en inventario?
3. **Recomendación Arquitectural Limpia:** Cómo unificar el modelo sin recurrir a números mágicos ni parches provisionales.

DETENCIÓN:
Al redactar el informe comparativo, DETENTE de inmediato.
