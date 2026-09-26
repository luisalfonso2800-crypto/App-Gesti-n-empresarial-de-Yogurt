TAREA:
Corrección del flujo de etapas de producción en recetas: concatenación acumulativa de plantillas, inserción cronológica secuencial (FIFO) y reindexación automática de numeración.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js` y `RecipeModal.jsx`:
1. Corregir `applyStageTemplate`: no debe sobreescribir las etapas existentes. Si ya hay etapas configuradas (ej. Tanque: Etapas 1 y 2), debe concatenar las nuevas (ej. Envasado) con numeración consecutiva (Etapas 3 y 4).
2. Corregir `handleAddEtapa`: añadir la nueva etapa al final del listado (orden cronológico del proceso de manufactura), asignándole `orden = etapas.length + 1` y abriéndola en edición de inmediato.
3. Reindexación automática: asegurar que al eliminar o mover etapas, el campo `orden` y el título visual se recalculen siempre como `Etapa 1`, `Etapa 2`, `Etapa 3` sin números rotos o desfasados.
4. Agregar controles discretos para subir/bajar etapas (▲ / ▼) en el acordeón para ajustar el orden si el operario lo requiere.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `AGENTS.md` (Reglas 13.1, 13.2, 35)

REGLA DE CONSULTA:
Modifica exclusivamente los archivos indicados en frontend. Prohibido tocar backend o base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. CONCATENACIÓN DE PLANTILLAS EN `useRecipeForm.js`:
   - Al invocar `applyStageTemplate(templateType)`:
     * Obtener las etapas base de la plantilla elegida:
       - `BASE_TANQUE`: Pasteurización (orden 1) + Inoculación/Fermentación (orden 2).
       - `ENVASADO_COMERCIAL`: Mezcla y Saborizado (orden 1) + Dosificación y Sellado (orden 2).
     * Evaluar `prev.etapas`:
       - Si está vacío (`length === 0`): asignar directamente las etapas de la plantilla con orden 1 y 2.
       - Si ya tiene etapas (`length > 0`): calcular `startOrder = prev.etapas.length + 1`. Asignar a las etapas de la plantilla `orden: startOrder` y `orden: startOrder + 1`, y concatenarlas al arreglo existente: `[...prev.etapas, ...nuevasEtapasMapeadas]`.
     * Abrir automáticamente en edición la primera de las nuevas etapas añadidas.

2. INSERCIÓN CRONOLÓGICA SECUENCIAL (`handleAddEtapa`):
   - Reemplazar la inserción por `unshift` (arriba) por inserción al final:
     ```javascript
     const nuevoOrden = prev.etapas.length + 1;
     const nuevaEtapa = {
       nombre: `Etapa ${nuevoOrden}`,
       orden: nuevoOrden,
       tiempoMinimoMin: '',
       tiempoEstandarMin: '',
       tiempoMaximoMin: '',
       tempMinimaGrados: '',
       tempMaximaGrados: '',
       instrucciones: '',
       detalles: []
     };
     setFormData(prev => ({
       ...prev,
       etapas: [...prev.etapas, nuevaEtapa]
     }));
     setExpandedStageIndex(prev.etapas.length); // Abre la recién creada al final
     ```

3. REINDEXACIÓN GARANTIZADA AL ELIMINAR O REORDENAR:
   - Al invocar `handleRemoveEtapa(index)`:
     * Filtrar el elemento y mapear el arreglo resultante asegurando que cada etapa conserve `orden: idx + 1`.
   - Implementar función `moveStage(index, direction)` ('UP' / 'DOWN'):
     * Permite intercambiar de posición una etapa con su vecina inmediata.
     * Re-mapea `orden: idx + 1` en todo el arreglo para preservar la secuencia exacta.

4. SINCRONIZACIÓN VISUAL EN `RecipeModal.jsx`:
   - El encabezado de cada tarjeta de etapa debe renderizar siempre:
     `Etapa ${index + 1}: ${etapa.nombre || 'Sin nombre'}`
   - Añadir en la barra de la etapa contraída y abierta botones discretos `▲` y `▼` para reordenar fácilmente si el operario cargó una fase en orden inverso.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
3. `pnpm --filter web exec next lint --file src/app/catalog/recipes/hooks/useRecipeForm.js --file src/app/catalog/recipes/components/RecipeModal.jsx`

CRITERIO DE FINALIZACIÓN:
- Cargar *Etapas de Tanque* y luego *Etapas de Envasado* resulta en 4 etapas ordenadas consecutivamente del 1 al 4.
- Agregar una etapa manual la ubica al final con el número correlativo correcto.
- Eliminar o mover etapas renumera automáticamente la secuencia del 1 a N.
- Next lint y validación de sintaxis concluyen con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Resumen del comportamiento de concatenación y orden secuencial:
- Comprobación sintáctica y lint:
- Estado: