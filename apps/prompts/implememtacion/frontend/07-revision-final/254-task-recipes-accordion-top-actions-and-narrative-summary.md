TAREA:
Implementar acordeón exclusivo por etapas, orden superior (LIFO), botonera superior fija, botón 'Finalizar y Resumir' y purga de tecnicismos en RecipeModal.jsx.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (y archivos asociados):
1. Trasladar los botones principales ("Guardar Receta" y "Cancelar") a la barra superior del modal para acceso inmediato sin scroll.
2. Implementar comportamiento de acordeón exclusivo: únicamente una etapa puede estar abierta en edición a la vez. Las etapas contraídas solo mostrarán su encabezado y su cápsula de resumen/lectura operativa.
3. Inserción superior: al crear o cargar una etapa nueva, insertarla al inicio del arreglo para que quede visible arriba y abierta automáticamente.
4. Crear el botón "Finalizar y Resumir": al pulsarlo, pliega todas las etapas y despliega una tarjeta de auditoría narrativa con el resumen encadenado de todo el proceso de fabricación.
5. Purgar la palabra "Poka-Yoke" de la interfaz: renombrar "Resumen de Composición & Proyección de Costo (Poka-Yoke)" a "Balance General de Materiales y Costos".

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `AGENTS.md` (Reglas 13.1, 13.2, 35 y 36)

REGLA DE CONSULTA:
Modifica exclusivamente los componentes del editor de recetas en frontend. Prohibido alterar backend o base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js` (si maneja el estado de acordeón o adición)

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. BOTONERA SUPERIOR PRINCIPAL (HEADER DEL MODAL):
   - En la parte superior derecha de `RecipeModal.jsx` (junto al título de la cabecera o en una barra fija superior):
     * Ubicar los botones `Cancelar` y `Guardar Receta`.
     * Botón `Guardar Receta`: Estilo Verde Bosque (`#182622`), texto `#FFFFFF`, hover `#2C3E38`.
     * Botón `Cancelar`: Fondo `#F7F4EE`, borde `#D6D3D1`, texto `#182622`.
   - Mantener la réplica o remover el botón solitario del pie si ya está arriba.

2. ACORDEÓN EXCLUSIVO DE ETAPAS:
   - Mantener un estado local `activeStageIndex` (o `expandedStageId`).
   - Cuando una etapa está activa (`isOpen === true`):
     * Muestra todos sus inputs: Tiempos, Temperaturas, Instrucciones, BOM y su cápsula de lectura al pie.
   - Cuando una etapa está contraída (`isOpen === false`):
     * Oculta los inputs extensos y la sub-tabla BOM.
     * Muestra una tarjeta compacta (fondo `#FAFAF9`, borde `#E5DFD5`, cursor pointer) con:
       - Nombre de la etapa y badges sutiles (ej. "30 min", "85°C - 90°C", "1 Insumo").
       - La cápsula de resumen/lectura operativa visible en texto tenue para saber qué hace esa etapa sin necesidad de expandirla.
       - Botón discreto "Editar Etapa" o clic en la tarjeta para expandirla (cerrando la que estuviera abierta).

3. INSERCIÓN DE NUEVA ETAPA ARRIBA:
   - Al invocar `handleAddEtapa` o pulsar `+ Agregar Etapa Manual`:
     * Insertar la nueva etapa al principio del arreglo (`unshift` o `[nuevaEtapa, ...etapasPrevias]`).
     * Asignar `activeStageIndex = 0` para que la nueva etapa quede abierta inmediatamente arriba de la lista.

4. BOTÓN "FINALIZAR Y RESUMIR":
   - Junto a los botones de plantillas rápidas (`[🥛 Tanque]`, `[🍓 Envasado]`), añadir el botón:
     `[📋 Finalizar y Resumir Proceso]`
   - Al hacer clic:
     * Colapsa todas las etapas abiertas (`activeStageIndex = null`).
     * Activa una sección destacada "Narrativa Completa de Producción":
       Un panel unificado que lista cronológicamente la lectura de todas las etapas configuradas (Etapa 1 ➔ Etapa 2 ➔ ... ➔ Etapa N) en párrafos continuos, permitiendo al usuario validar toda la receta de una sola lectura.

5. PURGA DE TECNICISMOS:
   - Renombrar el encabezado de la tarjeta verde inferior:
     Reemplazar `Resumen de Composición & Proyección de Costo (Poka-Yoke)` por:
     `Balance General de Materiales y Costos`
   - Asegurar que ningún texto visible en pantalla use términos como "Poka-Yoke", "WIP crudo" o "DTO".

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx`
2. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

CRITERIO DE FINALIZACIÓN:
- Los botones de Guardar y Cancelar están arriba y son accesibles sin scroll.
- Solo una etapa puede estar abierta a la vez; las demás muestran solo su resumen y cabecera compacta.
- Las etapas nuevas se posicionan arriba.
- El botón "Finalizar y Resumir" pliega el formulario y muestra la narrativa completa del proceso.
- Se retiró la palabra "Poka-Yoke" de la UI.
- Next lint concluye con código de salida 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Resumen de la nueva interacción de acordeón y barra superior:
- Comprobación lint:
- Estado: