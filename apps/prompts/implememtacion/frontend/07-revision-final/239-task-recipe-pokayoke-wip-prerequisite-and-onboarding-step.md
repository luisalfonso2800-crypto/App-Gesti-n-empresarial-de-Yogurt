OBJETIVO:
Implementar en el módulo de Recetas (`apps/web/src/app/catalog/recipes/`) la guardia Poka-Yoke que impida formular productos comerciales envasados si no existe al menos una base intermedia a granel (WIP), y actualizar el widget de onboarding (`OnboardingWizardWidget.jsx`) para guiar la secuencia técnica (1° Base en Tanque ➔ 2° Producto Envasado). Prohibido tocar backend ni usar TypeScript.

FUENTE DE VERDAD:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o formulario de receta)
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 31, 38, 39)

REGLA DE CONSULTA:
Lee exclusivamente los archivos de `apps/web/src/app/catalog/recipes/` y `apps/web/src/components/shell/`. No explores compras, ventas ni backend.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/page.jsx`
- Componentes y hooks de formulario en `apps/web/src/app/catalog/recipes/`
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- Archivos de formulario/página de recetas (`page.jsx`, `RecipeModal.jsx`, `useRecipeForm.js` según corresponda).
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`.

NO MODIFICAR:
- Backend (`apps/api/`).
- Catálogo de insumos ni compras.

INSTRUCCIONES:

1. GUARDIA POKA-YOKE EN FORMULACIÓN DE RECETAS:
   - Identificar si en el catálogo de `products` existe al menos un producto con presentación a granel:
     `const hasBulkProduct = products.some(p => p.presentacion?.tipoEnvase === 'TANQUE_GRANEL' || p.presentacion?.nombre?.toUpperCase().includes('GRANEL'));`
   - Evaluar el producto asociado seleccionado en la receta (`selectedProduct` o `formData.idProducto`):
     * Determinar si el producto seleccionado es comercial/envasado (su presentación NO es `TANQUE_GRANEL` ni `A GRANEL`).
   - Si el producto a formular es comercial/envasado y `!hasBulkProduct`:
     * Renderizar un banner orientador Poka-Yoke (#EFF6FF, borde #BFDBFE, texto #1E40AF, padding '0.75rem 1rem', borderRadius '8px', marginBottom '1rem') encima de las etapas:
       "⚠️ **Secuencia de Planta:** Estás formulando un producto comercial envasado. Para una elaboración láctea estándar, debes registrar primero el producto base (ej. 'Base Blanca de Yogurt' con presentación A GRANEL) antes de formular el producto envasado."
     * Incluir dentro del banner un botón/enlace directo hacia `/catalog/products`: `[+ Registrar Producto A GRANEL]`.
     * Deshabilitar el botón primario de guardar/crear receta (`disabled`, `opacity: 0.5`, `cursor: 'not-allowed'`) con atributo `title="Debe existir al menos un producto base a granel en el catálogo para formular productos terminados"`.
   - Si el producto seleccionado ES `A GRANEL`:
     * Permitir la formulación libre sin bloqueos, ya que la base láctea se formula directamente a partir de insumos primarios (leche cruda, cultivo, etc.).

2. ACTUALIZACIÓN DEL ASISTENTE EN EL HEADER (`OnboardingWizardWidget.jsx`):
   - En el Paso 4 ("Ficha Comercial y Receta Técnica"):
     * Aclarar en el subtítulo/descripción la secuencia técnica esperada:
       "Secuencia: 1° Base en Tanque (A Granel) ➔ 2° Producto Envasado Comercial"
     * Si no existen productos a granel pero sí comerciales, reflejar una indicación de estado:
       "Pendiente: Base láctea a granel requerida para enlazar fórmulas secundarias."

3. VERIFICACIÓN Y LINT:
   - Ejecutar linter de Next.js sobre los archivos intervenidos.

CRITERIO DE FINALIZACIÓN:
- La creación de recetas para productos comerciales queda bloqueada con banner explicativo si no existe ningún producto "A GRANEL" en catálogo.
- Los productos "A GRANEL" pueden formularse libremente sin bloqueos.
- El dropdown del widget de onboarding detalla la secuencia de 2 fases en el paso 4.
- `next lint` finaliza con código 0.

VERIFICACIÓN:
pnpm --filter web exec next lint --file src/app/catalog/recipes/page.jsx --file src/components/shell/OnboardingWizardWidget.jsx

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Lógica de la condición Poka-Yoke aplicada:
- Resultado de comprobación lint:
- Estado:
```[cite: 3, 4]

---

**Comando para ejecutar en Antigravity:**

```text
> ejecuta la tarea @[apps/prompts/implememtacion/frontend/08-modales/239-task-recipe-pokayoke-wip-prerequisite-and-onboarding-step.md]
```[cite: 3]