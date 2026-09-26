TAREA CONTROLADA — CORRECCIÓN DEL BOTÓN GUARDAR CAMBIOS Y NOTIFICACIÓN DE RETROALIMENTACIÓN EN PRESENTACIONES

OBJETIVO TÉCNICO:
1. Reparar la inactividad del botón "Guardar Cambios" en `PresentationModal.jsx` (y su hook `usePresentationForm.js`), garantizando que capture el evento `e.preventDefault()`, aísle el payload para evitar serializar el botón HTML, y envíe el `PUT` con el ID correcto.
2. Implementar los estados obligatorios del botón (loading "Guardando...", disabled durante el envío).
3. Conectar la confirmación visual explícita (Toast de éxito y banner de error en caso de fallo) para que el usuario reciba retroalimentación inequívoca tras guardar.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js
- apps/web/src/app/catalog/presentations/hooks/usePresentationsData.js
- .agents/rules/05-forms-and-modals.md
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente `PresentationModal.jsx` y `usePresentationForm.js` (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules.
- Respetar SRP (< 145 líneas por archivo).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `usePresentationForm.js` (o función `handleSubmit`):
   - Asegurar la firma y guardia del evento:
     ```javascript
     const handleSubmit = async (e) => {
       if (e && typeof e.preventDefault === 'function') {
         e.preventDefault();
       }
       // Garantizar que no se intente serializar el evento sintético:
       const payload = {
         nombre: formData.nombre?.trim()?.toUpperCase(),
         tipoEnvase: formData.tipoEnvase,
         unidadMedida: formData.unidadMedida || 'ml',
         cantidadMl: Number(formData.cantidadMl || 0),
         cantidadOz: Number(formData.cantidadOz || 0),
         imagenUrl: formData.imagenUrl || null,
         observaciones: formData.observaciones?.trim() || null,
         activo: Boolean(formData.activo ?? true)
       };

       try {
         setIsSubmitting(true);
         setErrorMessage('');

         if (isEditing && initialData?.id) {
           await updatePresentation(initialData.id, payload);
           toast.success(`Presentación "${payload.nombre}" actualizada correctamente.`);
         } else {
           await createPresentation(payload);
           toast.success(`Presentación "${payload.nombre}" creada correctamente.`);
         }

         if (typeof onSaved === 'function') onSaved();
         if (typeof onClose === 'function') onClose();
       } catch (error) {
         console.error('Error al guardar presentación:', error);
         setErrorMessage(error?.message || 'Ocurrió un error al procesar la presentación.');
       } finally {
         setIsSubmitting(false);
       }
     };
     ```

2. EN `PresentationModal.jsx`:
   - Verificar que el formulario use `<form onSubmit={handleSubmit}>` y el botón de acción principal sea `<button type="submit" disabled={isSubmitting}>`.
   - Mostrar el texto condicional en el botón: `{isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Presentación')}`.
   - Renderizar el banner de error si `errorMessage` tiene contenido:
     ```jsx
     {errorMessage && (
       <div className={styles.errorBanner}>
         ⚠️ {errorMessage}
       </div>
     )}
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node --check apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Al hacer clic en "Guardar Cambios", el formulario procesa el envío sin trabarse.
- El botón pasa al estado "Guardando..." durante la petición.
- Se muestra un toast verde de confirmación con el nombre de la presentación modificada.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Manejador de guardado corregido en: usePresentationForm.js
- Feedback y estados de botón implementados en: PresentationModal.jsx
- Resultado verify-srp.js: