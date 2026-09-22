TAREA:
Implementación de Presentación/Contenido Comercial en Insumos con Migración Segura de Datos Históricos y Propagación a Compras y Recetas

OBJETIVO:
Incorporar el campo `contenidoReferencial` en `Insumo` sin romper datos existentes (compras históricas, inventario y recetas), ejecutando un script de migración previo que infiera y pueble este valor en la base de datos, para luego reflejarlo en los modales de insumos, precarga de compras directas y cálculo unitario de recetas.

ARCHIVOS A INTERVENIR (RUTAS DIRECTAS, SIN BÚSQUEDAS RECURSIVAS):
1. `apps/api/prisma/schema.prisma`
2. `apps/api/scripts/migrateSupplyPresentations.js` (nuevo script de migración)
3. `apps/api/src/supplies/` (controlador/repositorio para recibir y devolver el campo)
4. `apps/web/src/app/catalog/supplies/components/SupplyModal.jsx` (modal de insumo)
5. `apps/web/src/app/operations/purchases/` (autocompletado al seleccionar insumo)
6. `apps/web/src/app/catalog/recipes/components/recipeHelpers.js` (cálculo de BOM)

INSTRUCCIONES TÉCNICAS:

PASO 1: MODELO PRISMA Y GENERACIÓN SEGURA
1. En `apps/api/prisma/schema.prisma`, en el modelo `Insumo`, agregar:
   `contenidoReferencial Decimal @default(1)`
2. Ejecutar `npx prisma db push` o la migración correspondiente desde la carpeta `apps/api` para aplicar el cambio a PostgreSQL sin perder datos existentes.

PASO 2: SCRIPT DE MIGRACIÓN Y SANEAMIENTO HISTÓRICO
1. Crear `apps/api/scripts/migrateSupplyPresentations.js`:
   - Conectarse con Prisma Client.
   - Consultar todos los registros de la tabla `Insumo` junto con sus compras históricas (`DetalleCompra` si existe relación) o tipo de unidad.
   - Actualizar cada insumo con su contenido comercial real:
     * Si `unidadBase` es 'g' o 'ml':
       - Insumos a granel conocidos (AZUCAR, FRESA CONGELADA, MORA CONGELADA, CEREZA, LECHE ENTERA, etc.): actualizar `contenidoReferencial = 1000` (representando 1 Kilo = 1000g o 1 Litro = 1000ml).
     * Si `unidadBase` es 'und':
       - Materiales de empaque (ENVASES, STIKERS, CINTAS, TAPAS): actualizar `contenidoReferencial = 1`.
   - Registrar en consola el detalle de cada insumo actualizado.
2. Ejecutar el script:
   `node apps/api/scripts/migrateSupplyPresentations.js`

PASO 3: MODAL DE INSUMOS (`SupplyModal.jsx`)
1. Agregar el campo "Contenido por Empaque / Presentación" (`contenidoReferencial`):
   - Tipo numérico (`min="0.01"`, `step="any"`).
   - Renderizar la etiqueta con la unidad canónica seleccionada (ej. si elige 'g', mostrar `1000 g`).
   - Mostrar un indicador en vivo: "Costo por unidad base: $X / [unidadBase]".
2. Asegurar que al guardar o editar se envíe `contenidoReferencial` en el payload.

PASO 4: FORMULARIO DE NUEVA COMPRA DIRECTA (`purchases/new`)
1. Al seleccionar un insumo del catálogo en la fila de compra:
   - Autocompletar:
     * `Marca`: insumo.marca || ''
     * `Empaque`: insumo.tipoEmpaque || insumo.empaque || 'UNIDAD'
     * `Contenido por unidad`: insumo.contenidoReferencial || (insumo.unidadBase === 'und' ? 1 : 1000)
     * `Precio Unitario`: insumo.costoReferencial || 0
   - Con esto, al seleccionar Fresa Congelada, precargará 1 empaque de 1000 g a $6.990 automáticamente.

PASO 5: CÁLCULO EN RECETAS (`recipeHelpers.js`)
1. En `calculateRecipeCosts`:
   - Para cada ingrediente del BOM:
     * Obtener el costo unitario base real:
       ```javascript
       const contenido = parseFloat(insumoRecord?.contenidoReferencial) || (['g', 'ml'].includes(insumoRecord?.unidadBase) ? 1000 : 1);
       const costoUnitarioBase = (parseFloat(insumoRecord?.costoReferencial || 0)) / contenido;
       ```
     * Multiplicar: `costoIngrediente = det.cantidad * costoUnitarioBase * factorConversion;`
     * (Ejemplo: 1000 g * ($6.990 / 1000) * 1 = 1000 * 6.99 = $6.990).
2. Proteger contra valores nulos o divisiones por cero (`contenido > 0`).

REGLAS ESTRICTAS:
- NO usar búsquedas recursivas globales (`Get-ChildItem -Recurse`, `dir /s`).
- NO ejecutar `pnpm --filter web build` desde la herramienta (se compilará manualmente).
- Validar SRP con `node .agents/scripts/verify-srp.js` (componentes < 130 líneas).

VERIFICACIÓN:
1. Confirmar ejecución limpia del script de migración.
2. `node .agents/scripts/verify-srp.js` con 0 infracciones.

DETENCIÓN:
Al terminar la migración y actualizar los componentes con SRP en regla, DETENTE inmediatamente.