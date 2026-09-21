TAREA (INVESTIGACIÓN Y DEFINICIÓN ARQUITECTURAL - LECTURA EXCLUSIVA):
Auditar la relación del Inóculo Interno con los módulos de Inventario, Productos, Insumos y Recetas:
1. Inspeccionar cómo `recipe.repository.js` y `production.repository.js` resuelven los insumos del BOM cuando una fórmula requiere un cultivo base que puede ser comprado o producido internamente.
2. Inspeccionar cómo `inventory.repository.js` lista las existencias: determinar por qué el sub-lote hijo (`SEMIELABORADO_WIP`) no se visualiza en la bitácora de inventario (o si debe existir una sub-pestaña "Semielaborados / Cepas").
3. Analizar cómo debe descontarse el lote de inóculo al producir la siguiente tanda de yogurt sin obligar a registrar compras externas.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA EXCLUSIVA: PROHIBIDO EDITAR CÓDIGO.
- Lee puntualmente los archivos indicados abajo.

ARCHIVOS A INSPECCIONAR:
1. `apps/api/prisma/schema.prisma` (modelos Receta, DetalleReceta, Insumo, Producto, Lote, MovimientoInventario).
2. `apps/api/src/recipes/recipes.repository.js` (o servicio de BOM y cálculo de necesidades).
3. `apps/api/src/inventory/inventory.repository.js` (consultas de inventario y movimientos).
4. `apps/api/src/production/production.repository.js` (descuento de insumos al iniciar/liquidar).

PREGUNTAS DE AUDITORÍA A CONTESTAR:
1. ¿El modelo `DetalleReceta` permite vincular tanto un `idInsumo` (comercial) como un `idProducto` / `idLote` (inóculo interno)?
2. ¿Cómo debe representarse el stock de inóculos en la Bitácora de Inventario para que el operador sepa cuántos litros de cepa viva tiene disponibles?
3. ¿Cómo vincula la próxima orden de producción el lote de inóculo específico que se va a sembrar para transferir la trazabilidad padre-hijo?

DETENCIÓN:
Entrega un dictamen técnico con la propuesta de integración modular y DETENTE inmediatamente.