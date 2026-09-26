TAREA CONTROLADA — CORRECCIÓN DE ID UNDEFINED Y VALIDACIONES CONDICIONALES EN MODAL DE PROVEEDOR

OBJETIVO TÉCNICO:
1. Eliminar el error "Item with ID undefined not found" unificando el identificador del proveedor (`idProveedor || id`) en la apertura, edición y envío del modal.
2. Asegurar que `nombreContacto`, `email` y `observaciones` sean estrictamente OPCIONALES.
3. Validar el formato de `email` ÚNICAMENTE si el campo contiene texto escrito, permitiendo guardar si está vacío.
4. Mostrar errores Poka-Yoke solo después de pulsar "Guardar Proveedor" (`hasSubmitted === true`).

FUENTES DE VERDAD:
- apps/web/src/components/catalog/SupplierModal.jsx (o apps/web/src/app/catalog/suppliers/components/SupplierModal.jsx)
- apps/web/src/components/catalog/parts/useSupplierForm.js (o hook co-locado en suppliers)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE TOOL BUDGET (NIVEL 1):
- PROHIBIDO ejecutar `Find`, `Search` o búsquedas ciegas.
- Modificar EXCLUSIVAMENTE el modal de proveedor y su respectivo hook de formulario.
- Límite máximo de lecturas: 1 lectura por archivo a intervenir.
- Mantener SRP (< 140 líneas por archivo) y CSS Modules puro.

ACCIONES A EJECUTAR:
1. En el hook del formulario de proveedor (`useSupplierForm.js` o `SupplierModal.jsx`):
   - Mapeo de Identificador Robusto:
     ```javascript
     const entityId = initialData?.idProveedor ?? initialData?.id ?? null;
     const isEditing = Boolean(entityId);
     ```
   - Título y acción:
     * Si `isEditing`: título "Editar Proveedor" y botón "Actualizar Proveedor".
     * Si NO `isEditing`: título "Nuevo Proveedor" y botón "Guardar Proveedor".
   - Al despachar (`handleSubmit`):
     * Si `isEditing`: realizar `PUT/PATCH /api/v1/suppliers/${entityId}` (verificar defensivamente que `entityId` no sea undefined).
     * Si NO `isEditing`: realizar `POST /api/v1/suppliers`.
2. Validaciones Condicionales y Poka-Yoke:
   - Campos obligatorios (*): `razonSocial`, `nit`, `telefono`, `direccion`.
   - Campos opcionales: `nombreContacto`, `observaciones` y `email`.
   - Validación de Email:
     ```javascript
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     const hasEmailText = Boolean(formData.email && formData.email.trim().length > 0);
     const isEmailValid = !hasEmailText || emailRegex.test(formData.email.trim());
     ```
   - No marcar borde rojo ni error en `email` si está vacío. Solo bordear en rojo si tiene texto y no cumple el regex.
   - Respetar `hasSubmitted`: los bordes rojos y microtextos solo se activan si `hasSubmitted === true`.
3. Verificaciones de calidad:
   - `node --check` en los archivos modificados.
   - `node .agents/scripts/verify-srp.js`.

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Formulario guarda proveedores sin email ni contacto.
- Al editar, toma `idProveedor` correctamente y no emite petición a `undefined`.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Identificador unificado en:
- Validación de email condicional aplicada: [Sí / No]
- Resultado verify-srp.js: