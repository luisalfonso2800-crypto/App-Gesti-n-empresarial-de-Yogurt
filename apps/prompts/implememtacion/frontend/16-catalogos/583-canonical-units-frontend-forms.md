TAREA:
Adopción Estricta de Unidades Canónicas en Formularios y Selectores del Frontend (/catalog/recipes y afines)

OBJETIVO:
Garantizar que todos los formularios de Recetas (Cabecera, BOM de Etapas y Selectores de Insumos) utilicen como `value` exclusivamente los identificadores canónicos oficiales ('g', 'kg', 'ml', 'l', 'und'), evitando que se envíen o almacenen strings compuestos o dispares ("Kilogramos (kg)", "Gramos (g)", etc.).

ARCHIVOS A INTERVENIR (RUTAS DIRECTAS, NO USAR BÚSQUEDAS RECURSIVAS):
1. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStageBomTable.jsx`
3. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
4. `apps/web/src/utils/unitNormalizer.js` (si requiere exportar las opciones canónicas para selects)

INSTRUCCIONES TÉCNICAS:

1. Centralización de Opciones para Selectores:
   - En `apps/web/src/utils/unitNormalizer.js`, exportar el catálogo oficial de opciones:
     ```javascript
     export const UNIT_OPTIONS = [
       { value: 'g', label: 'Gramos (g)', category: 'mass' },
       { value: 'kg', label: 'Kilogramos (kg)', category: 'mass' },
       { value: 'ml', label: 'Mililitros (ml)', category: 'volume' },
       { value: 'l', label: 'Litros (l)', category: 'volume' },
       { value: 'und', label: 'Unidades (und)', category: 'unit' },
     ];
     ```

2. Normalización en Cabecera de Receta (`RecipeHeaderFields.jsx`):
   - El `<select>` de unidad de rendimiento debe iterar sobre `UNIT_OPTIONS`.
   - Asegurar que `value={toCanonicalUnit(formData.unidad)}`.
   - Al detonar `onChange`, enviar estrictamente `toCanonicalUnit(e.target.value)` (ej: 'kg', no 'Kilogramos (kg)').

3. Normalización en BOM de Etapas (`RecipeStageBomTable.jsx` y `useRecipeForm.js`):
   - En la fila del ingrediente/BOM, el selector de unidad de medida o la unidad mostrada junto al input de cantidad debe mapear y renderizar estrictamente valores canónicos (`toCanonicalUnit(...)`).
   - En `useRecipeForm.js`, al agregar un insumo desde catálogo:
     ```javascript
     det.unidad = toCanonicalUnit(ins ? ins.unidadBase : 'und');
     ```
   - Al modificar la unidad en la tabla, asegurar que el estado registre siempre el string canónico ('g', 'kg', 'ml', 'l', 'und').

4. Integración con `recipeHelpers.js`:
   - Verificar que `calculateRecipeCosts` reciba `toCanonicalUnit` en cada iteración para que el factor matemático sea 100% predecible y consistente.

REGLAS ESTRICTAS:
- PROHIBIDO usar búsquedas recursivas (`Get-ChildItem -Recurse`, `dir /s`). Ir directo a los archivos citados.
- NO ejecutar `pnpm --filter web build` desde la herramienta (se compilará manualmente).
- Cero estilos en línea (`style={{`). Usar CSS Modules.
- Respetar SRP (< 130 líneas por componente).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`

DETENCIÓN:
Al validar SRP en 0 infracciones, DETENTE inmediatamente.