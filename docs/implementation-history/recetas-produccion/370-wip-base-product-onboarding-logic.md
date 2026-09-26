TAREA CONTROLADA — SOPORTE FULL-STACK PARA FORMATO A GRANEL (WIP), FLEXIBILIZACIÓN DE ENVASES Y GUÍA EN ONBOARDING

OBJETIVO TÉCNICO:
1. Backend (Prisma y DTOs): Permitir que el formato a granel (`tipoEnvase: 'BALDE'` o `TANQUE_GRANEL`) no exija obligatoriamente `cantidadOz` ni `cantidadMl` (hacerlos opcionales o con valor por defecto 0/1000 ml).
2. Presentaciones UI (`PresentationModal.jsx`): Si se selecciona "BALDE (Granel / Mayorista)", ocultar los campos de OZ y ML, eliminando su obligatoriedad y mostrando un banner orientador de formato industrial a granel.
3. Productos UI (`ProductModal.jsx`): Incorporar un selector superior en el modal: [🥛 Producto Comercial Envasado] vs [🏭 Base Intermedia / Tanque (WIP)]. Si es Base Intermedia, auto-asignar presentación "A GRANEL", canal "USO_INTERNO", ocultar campos comerciales y mostrar la tarjeta de costeo operativo.
4. Onboarding UI: Clarificar en el Paso 4 del widget del Header y del Dashboard la secuencia (1° Base a Granel si se fabrica en planta, 2° Producto Comercial).

FUENTES DE VERDAD:
- apps/api/prisma/schema.prisma
- apps/api/src/presentations/ (dto, servicio o repositorio)
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/components/dashboard/OnboardingHeroCard.jsx
- apps/web/src/components/shell/parts/OnboardingWizardWidget.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Respetar SRP (< 145 líneas por archivo; desacoplar subcomponentes si excede).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN BACKEND (apps/api):
   - En `apps/api/prisma/schema.prisma`:
     * En el modelo `Presentacion`, verificar que `cantidadOz` y `cantidadMl` permitan valores nulos o tengan `@default(0)`:
       `cantidadOz Decimal? @default(0) @map("Cantidad_Oz")`
       `cantidadMl Decimal? @default(0) @map("Cantidad_Ml")`
     * Si se modificó el esquema, ejecutar:
       `pnpm --filter api exec prisma db push`
       `pnpm --filter api exec prisma generate`
   - En los DTOs de presentaciones (`create-presentation.dto.js` / `update-presentation.dto.js`):
     * Aplicar `@IsOptional()` en `cantidadOz` y `cantidadMl` o admitir valor 0 cuando `tipoEnvase` sea `BALDE` o `TANQUE_GRANEL`.
   - En el servicio de presentaciones:
     * Si se crea una presentación tipo granel sin volumen, guardar por defecto `cantidadMl = 1000` y `cantidadOz = 33.81` (o 0 según corresponda) de forma transparente.

2. EN `PresentationModal.jsx`:
   - Evaluar si `tipoEnvase === 'BALDE'` o `'TANQUE_GRANEL'`:
     * Si es a granel:
       - Ocultar los inputs de `CANTIDAD (OZ)` y `CANTIDAD (ML)` y quitar sus asteriscos rojos.
       - En su lugar, mostrar un banner didáctico Poka-Yoke:
         "💡 Formato a Granel / Tanque: La capacidad total dependerá de los litros o kilos producidos en cada bache. No requiere un volumen unitario fijo."
       - Al despachar el formulario (`handleSubmit`), si es granel y los campos están vacíos, enviar internamente `cantidadMl: 1000, cantidadOz: 33.8` para satisfacer el backend.
     * Si NO es a granel (botellas, vasos, etc.):
       - Mantener los inputs obligatorios de OZ y ML con sus cálculos de conversión automáticos.

3. EN `ProductModal.jsx`:
   - Añadir en el encabezado del formulario un selector tipo toggle o pestañas:
     * `[🥛 Producto Comercial Envasado]` (Default)
     * `[🏭 Base Intermedia / Tanque (WIP)]`
   - Si se conmuta a `Base Intermedia / Tanque`:
     * Preseleccionar la presentación "A GRANEL".
     * Preseleccionar `canalVenta = 'USO_INTERNO'`.
     * Preseleccionar categoría técnica (ej: `BASES_LACTEAS` o `INSUMO_BASE_WIP`).
     * Ocultar Precio de Venta, Margen Comercial y proyección financiera.
     * Mostrar la tarjeta explicativa: "Esta base láctea o jalea se elaborará en marmita/tanque y servirá como ingrediente para tus productos envasados."
     * Fijar en el payload `precioVenta: 0, margenObjetivo: 0`.
   - Si se conmuta a `Producto Comercial Envasado`:
     * Restaurar los campos comerciales normales de venta al público.

4. EN ONBOARDING (Header y Dashboard):
   - En `OnboardingWizardWidget.jsx` y `OnboardingHeroCard.jsx`:
     * En el detalle del Paso 4 ("Ficha Comercial y Receta Técnica"), redactar la guía:
       "Secuencia recomendada: Si elaboras tu propio yogurt desde la leche cruda, registra primero la Base a Granel. Si compras la base ya hecha, pasa directo al Producto Comercial."

5. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node .agents/scripts/verify-srp.js`
   - `pnpm --filter api build`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Se puede crear la presentación a granel sin ingresar obligatoriamente mililitros ni onzas.
- El modal de producto permite elegir entre producto comercial y base de tanque sin trabas de precios.
- 0 infracciones en `verify-srp.js` y builds limpios.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Ajustes aplicados en PresentationModal.jsx:
- Selector de tipo integrado en: ProductModal.jsx
- Backend adaptado: [Sí / No]
- Resultado verify-srp.js y builds: