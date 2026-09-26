OBJETIVO: Eliminar definitivamente el banner "No se pudo identificar la presentación para editar (identificador no válido)" al abrir y editar presentaciones en `apps/web/src/app/catalog/presentations/`. Prohibido alterar `schema.prisma`, romper estilos existentes o usar TypeScript.

DIAGNÓSTICO Y CORRECCIÓN:

1. Inspección de Clave Real en Backend/Tabla:
   - Revisar `apps/api/src/presentations/presentations.repository.js` (o service) y `apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx` para verificar el nombre exacto de la clave del ID en el JSON devuelto (`id`, `ID_Presentacion`, `id_presentacion` o `idPresentacion`).
   - Confirmar que `PresentationsTable.jsx` pase el objeto completo con su identificador a la función `onEdit(item)`.

2. Corrección en `apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js`:
   - En `handleOpenModal(presentation)`:
     - Extraer el ID soportando todas las variantes posibles:
       `const targetId = presentation?.id ?? presentation?.idPresentacion ?? presentation?.ID_Presentacion ?? presentation?.id_presentacion ?? presentation?._id;`
     - Asignar `selectedId: targetId` y almacenar `selectedPresentation`.
     - REGLA ESTRICTA: Limpiar siempre el error al abrir (`setErrorMessage('')`). Queda prohibido setear mensajes de error preventivos al abrir el modal.
   - En `handleSubmit`:
     - Resolver el ID antes de la petición: `const id = selectedId ?? selectedPresentation?.id ?? selectedPresentation?.idPresentacion ?? selectedPresentation?.ID_Presentacion;`.
     - Si no existe ID en modo edición al enviar el formulario, abortar el submit y mostrar error en el banner.
     - Si existe, despachar `apiClient.patch(`/presentations/${id}`, payload)`.

3. Verificación en `PresentationModal.jsx`:
   - Asegurar que al abrirse (`isOpen === true`) el banner de error inicie en blanco si no se ha producido un fallo real de red.

VERIFICACIÓN:
1. `pnpm --filter web exec next lint --file src/app/catalog/presentations/hooks/usePresentationForm.js --file src/app/catalog/presentations/components/PresentationsTable.jsx --file src/app/catalog/presentations/components/PresentationModal.jsx`

SALIDA: Reporte conciso indicando: clave detectada en el objeto de presentación, líneas intervenidas y confirmación de lint sin errores.