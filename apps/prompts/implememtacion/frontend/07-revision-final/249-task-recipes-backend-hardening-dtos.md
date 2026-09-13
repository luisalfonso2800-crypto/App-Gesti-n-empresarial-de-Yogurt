TAREA:
Endurecimiento de DTOs, validaciones transaccionales y regla de empaque obligatorio en el módulo de Recetas (apps/api).

OBJETIVO:
Implementar en `apps/api/src/recipes/` las guardas de integridad estructural identificadas en la auditoría técnica:
1. Rechazar cantidades menores o iguales a cero en los detalles de receta (`@Min(0.0001)`).
2. Validar obligatoriedad mutuamente excluyente: cada detalle debe contener estrictamente `idInsumo` O `idProductoIntermedio`, nunca ambos ni ninguno.
3. Regla de negocio Poka-Yoke: si el producto asociado a la receta tiene presentación comercial (no es "A GRANEL" / "TANQUE_GRANEL"), exigir al menos un insumo con `tipoInsumo === 'EMPAQUE_BASE'` o clasificado como material de empaque.
4. Validar concordancia de unidades de medida contra la unidad base del insumo o presentación del producto intermedio.

FUENTES DE VERDAD:
- `docs/diagnosticos/AUDITORIA_SISTEMA_INTEGRAL_RECETAS.md`
- `apps/api/prisma/schema.prisma`
- `apps/api/src/recipes/dto/create-recipe.dto.js`
- `apps/api/src/recipes/dto/update-recipe.dto.js`
- `apps/api/src/recipes/recipes.service.js`
- `AGENTS.md` (Reglas 0, 2, 7, 13.1, 13.2)

ARCHIVOS A MODIFICAR:
- `apps/api/src/recipes/dto/create-recipe.dto.js`
- `apps/api/src/recipes/dto/update-recipe.dto.js`
- `apps/api/src/recipes/recipes.service.js`

INSTRUCCIONES:

1. ENDURECIMIENTO DE DTOS (`create-recipe.dto.js` y `update-recipe.dto.js`):
   - En `CreateRecipeDetailDto`:
     * Modificar `@Min(0)` por `@Min(0.0001, { message: 'La cantidad requerida debe ser estrictamente mayor a 0' })` en `cantidadRequerida`.
     * Validar que la cadena `unidad` no esté vacía (`@IsNotEmpty()`).
     * Mantener `mermaPorcentaje` con `@Min(0)` y `@Max(100)`.

2. VALIDACIONES DE NEGOCIO EN SERVICIO (`recipes.service.js`):
   - En los métodos `create` y `update`:
     * **Exclusividad de Insumo vs WIP:** Verificar para cada detalle que exista `(idInsumo && !idProductoIntermedio) || (!idInsumo && idProductoIntermedio)`. Si se envían ambos o ninguno, arrojar `BadRequestException('Cada detalle de receta debe especificar un insumo comprado o un producto intermedio de planta, no ambos')`.
     * **Regla de Empaque Obligatorio en Productos Comerciales:**
       - Consultar el producto destino (`idProducto`) incluyendo su presentación (`include: { presentacion: true }`).
       - Evaluar si es comercial (`presentacion.tipoEnvase !== 'TANQUE_GRANEL' && !presentacion.nombre.toUpperCase().includes('GRANEL')`).
       - Si es comercial: validar que al menos un detalle de la receta tenga `tipoInsumo === 'EMPAQUE_BASE'` o que el insumo asociado pertenezca a la categoría de material de empaque. Si no contiene empaque, rechazar con `BadRequestException('Toda receta de producto comercial requiere al menos un insumo de empaque primario (vaso, botella o tapa)')`.
     * **Validación de Unidades Dimensionales:**
       - Comprobar que la unidad requerida en el detalle coincida con la unidad base configurada en el insumo (`Insumo.unidadBase`) o con la unidad de medida del producto semielaborado. Si no coincide, rechazar con mensaje descriptivo de planta.

3. PRESERVACIÓN DE COMPILACIÓN:
   - Prohibido usar TypeScript.
   - Mantener intactas las firmas de los endpoints en `recipes.controller.js`.

VERIFICACIÓN:
1. `pnpm --filter api exec node -e "require('@babel/register'); require('./src/recipes/dto/create-recipe.dto.js'); console.log('DTO OK');"`
2. `pnpm --filter api exec node -e "require('@babel/register'); require('./src/recipes/recipes.service.js'); console.log('Service OK');"`
3. `node --check apps/api/src/recipes/recipes.service.js`

CRITERIO DE FINALIZACIÓN:
- La API rechaza detalles con cantidad 0 o negativa.
- La API bloquea la creación de recetas comerciales que no incluyan envase/empaque.
- Se previene el envío simultáneo o vacío de insumo y producto intermedio.
- Verificación sintáctica exitosa con código de salida 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Reporte conciso indicando:
- Archivos modificados:
- Reglas de validación incorporadas:
- Resultado de comprobaciones técnicas:
- Estado: