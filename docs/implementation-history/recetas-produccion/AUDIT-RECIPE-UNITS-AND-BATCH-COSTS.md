TAREA:
Auditoría Técnica Integral y Reporte Forense: Gestión de Unidades de Medida, Conversiones y Cálculo de Costos de Batch/Recetas

OBJETIVO:
Generar un informe exhaustivo sobre cómo el sistema gestiona las unidades de medida y el costeo de lotes (batch) en toda la cadena (Prisma/DB -> Backend API -> Frontend Recetas/Helpers), identificando por qué el costo del batch se dispara (multiplicaciones x1000 indebidas, ambigüedades entre g/Kg o ml/Lt, y discrepancias entre insumos y WIPs).

ALCANCE DE LA INVESTIGACIÓN (SOLO LECTURA / INSPECCIÓN):
1. Modelo de Datos y Semilla (Prisma DB):
   - `prisma/schema.prisma`: revisar campos `unidadBase`, `costoReferencial`, `costoPromedio` en `Insumo`, `Inventario`, `PrecioProveedor` y `Receta`.
   - `prisma/seed-test-data.js` o semillas activas: constatar cómo están guardados los costos e insumos de prueba (ej. Fresa, Leche, Azúcar). ¿El valor numérico guardado en `costoReferencial` es por gramo/mililitro o por kilo/litro?
2. Backend API:
   - `apps/api/src/recipes/`: revisar cómo el servicio/repositorio de recetas calcula o entrega los costos de insumos y bases intermedias (WIP).
   - Verificar si el backend devuelve un costo ya normalizado o el costo bruto registrado en catálogo.
3. Frontend (`apps/web/src/app/catalog/recipes/`):
   - `recipeHelpers.js` (o hooks afines de cálculo `useRecipeEconomics.js`, `calculateRecipeCosts`): inspeccionar la fórmula matemática exacta que se está ejecutando línea por línea.
   - Analizar cómo interactúan las unidades declaradas en la cabecera de la receta (`unidad`: 'g', 'kg', 'ml', 'lt', 'und') con las unidades de los insumos del BOM y las subrecetas WIP.

ESTRUCTURA DEL INFORME A ENTREGAR:
El informe debe redactarse en Markdown y detallar con precisión matemática:
1. **Matriz de Almacenamiento Canónico:** ¿En qué unidad reside el costo en la base de datos para cada tipo de insumo? ($/g, $/kg, $/ml, $/lt).
2. **Diagnóstico del Desfase (Caso Real):** Desglosar matemáticamente por qué al ingresar `1.000 g` de un insumo como Fresa Congelada el costo total arroja `$6.990.000` en lugar de `$6.990`.
3. **Flujo de Conversión WIP (Bases Intermedias):** Cómo se calcula el costo cuando una receta consume otra sub-receta anterior.
4. **Veredicto y Fórmulas Canónicas Recomendadas:** La especificación unificada que debe adoptarse para que nunca más vuelva a desfasarse el cálculo sin importar la combinación de unidades.

REGLAS:
- NO MODIFICAR CÓDIGO NI ARCHIVOS en esta tarea.
- Es una tarea EXCLUSIVA de inspección, diagnóstico y generación del reporte técnico en consola o en archivo Markdown.

DETENCIÓN:
Al generar el informe completo y claro, DETENTE inmediatamente.