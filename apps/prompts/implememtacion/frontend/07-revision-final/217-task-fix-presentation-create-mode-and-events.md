OBJETIVO: Corregir la apertura del modal en modo creación ("Nueva Presentación") y blindar el hook contra eventos sintéticos de React en `apps/web/src/app/catalog/presentations/`. Prohibido tocar backend o usar TypeScript.

CAUSA RAÍZ:
El botón "Nueva Presentación" pasa el SyntheticEvent del clic a `handleOpenModal(e)`. El hook interpreta el evento como un objeto de presentación, activando erróneamente `isEditing = true` y buscando un ID que no existe.

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/presentations/page.jsx`
- `apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js`
- `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`

INSTRUCCIONES:

1. Desacople de Eventos en `page.jsx`:
   - Asegurar que el botón "Nueva Presentación" invoque la apertura explícita sin pasar el evento:
     `onClick={() => handleOpenModal(null)}` o `onClick={() => handleOpenModal()}`.

2. Blindaje de Modo en `usePresentationForm.js`:
   - En `handleOpenModal(presentation = null)`:
     - Detectar si el argumento es nulo, no es objeto o es un SyntheticEvent (`presentation?.nativeEvent` o `presentation?._reactName`).
     - Determinar `isEditing`: solo debe ser `true` si `presentation` es un objeto válido y posee un ID real (`id`, `idPresentacion`, `ID_Presentacion`).
     - Si es creación (`!isEditing`):
       - `setIsEditing(false)`
       - `setSelectedId(null)`
       - `setSelectedPresentation(null)`
       - `setFormData(initialFormData)`
       - `setErrorMessage('')`
     - Si es edición (`isEditing`):
       - Cargar los datos del registro y asignar el ID resuelto.
   - En `handleSubmit`:
     - Si `!isEditing`: despachar creación vía `POST /presentations` con el payload.
     - Si `isEditing`: despachar actualización vía `PATCH /presentations/${id}` con el payload.

3. Textos Contextuales en `PresentationModal.jsx`:
   - Título del modal: `{isEditing ? 'Editar Presentación' : 'Nueva Presentación'}`.
   - Botón primario: `{isEditing ? 'Guardar Cambios' : 'Crear Presentación'}`.
   - Resumen Poka-Yoke: Ajustar verbo según el modo (`Se registrará la presentación...` en creación vs `Se actualizará la presentación...` en edición).

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/presentations/page.jsx --file src/app/catalog/presentations/hooks/usePresentationForm.js --file src/app/catalog/presentations/components/PresentationModal.jsx`

SALIDA: Reporte conciso indicando: causa corregida, líneas modificadas en hook/page/modal y confirmación del lint sin errores.