TAREA CONTROLADA — CAMPO NATIVO UNIDAD_MEDIDA EN TABLA PRESENTACIONES (ELIMINACIÓN DE HACK EN OBSERVACIONES)

OBJETIVO TÉCNICO:
1. Eliminar por completo el parche de guardar `[UNIDAD_MEDIDA:XX]` en el campo de texto libre `Observaciones`.
2. Crear la columna formal nativa `unidadMedida String @default("ml") @map("Unidad_Medida")` en el modelo `Presentacion` de `schema.prisma`.
3. Sincronizar PostgreSQL con `prisma db push` y regenerar el cliente Prisma.
4. Adaptar DTOs/repositorio en backend y conectar frontend (`PresentationModal.jsx` y formularios de recetas) para leer y escribir el campo formalmente.

FUENTES DE VERDAD:
- apps/api/prisma/schema.prisma
- apps/api/src/presentations/ (dto, servicio y repositorio)
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/recipes/components/RecipeModal.jsx (o RecipeHeaderSection.jsx)
- apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar SRP (< 145 líneas por archivo; desacoplar subcomponentes si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. PERSISTENCIA Y MODELO (apps/api):
   - En `apps/api/prisma/schema.prisma`, dentro del modelo `Presentacion`:
     * Agregar formalmente:
       `unidadMedida String @default("ml") @map("Unidad_Medida")`
   - Ejecutar en consola:
     * `pnpm --filter api exec prisma db push`
     * `pnpm --filter api exec prisma generate`
   - En DTOs de presentaciones (`create-presentation.dto.js` / `update-presentation.dto.js`):
     * Declarar `unidadMedida` como opcional o string validado (valores: 'ml', 'L', 'g', 'kg', 'und').
   - En `presentations.repository.js`:
     * Asegurar que `unidadMedida` se reciba en el data del `create` y `update`.

2. LIMPIEZA EN PRESENTATIONS FRONTEND (`PresentationModal.jsx`):
   - Eliminar cualquier parser o concatenador que meta `[UNIDAD_MEDIDA:...]` en `formData.observaciones`.
   - El campo `Observaciones` debe almacenar exclusivamente el texto genuino del usuario.
   - Enviar y recibir `unidadMedida` como propiedad de primer nivel en el objeto JSON de la presentación.

3. SINCRONIZACIÓN EN RECETAS (`RecipeModal.jsx` / `useRecipeForm.js`):
   - Al seleccionar un producto en la receta, obtener la presentación asociada:
     * Leer directamente `producto.presentacion?.unidadMedida`.
     * Preseleccionar dicho valor en el selector editable de `unidadRendimiento` de la receta (ej. si la presentación es 'kg', precarga 'Kilogramos'; si es 'L', 'Litros').
   - Mantener el selector desbloqueado para que el usuario pueda rectificar si lo necesita.

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/api/src/presentations/presentations.repository.js`
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node .agents/scripts/verify-srp.js`
   - `pnpm --filter api build`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La tabla `Presentaciones` en PostgreSQL cuenta con la columna física `Unidad_Medida`.
- El campo `Observaciones` queda limpio de etiquetas técnicas serializadas.
- 0 infracciones en `verify-srp.js` y builds limpios.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Columna agregada en schema.prisma: Presentacion.unidadMedida
- Comandos ejecutados: prisma db push, prisma generate
- Archivos limpiados: [lista]
- Resultado verify-srp.js y builds: