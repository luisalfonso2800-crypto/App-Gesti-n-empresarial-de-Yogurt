TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 2 TOOL CALLS):
Diferir la visibilidad de los errores de validación en el formulario de Nuevo Proveedor para que aparezcan ÚNICAMENTE tras presionar el botón "Guardar Proveedor" (o al desenfocar un campo interactuado), eliminando los mensajes rojos iniciales al abrir el modal.

REGLAS ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO búsquedas globales (`Search`, `Find`).
- PROHIBIDO leer más de 1 archivo.
- Modificación directa y exclusiva en `useSupplierForm.js` (o en `SupplierModal.jsx`).

OBJETIVO:
1. En `apps/web/src/components/catalog/parts/useSupplierForm.js` (o componente modal de proveedor):
   - Introducir o conectar la bandera booleana `hasSubmitted` (o `touchedFields`):
     * Estado inicial: `false`.
     * Resetear a `false` al abrir el modal o cambiar de registro.
   - En el renderizado / retorno de errores:
     * Los mensajes de error (`errors.nit`, `errors.telefono`) y las clases de borde rojo solo deben exponerse si `hasSubmitted === true` (o si el campo específico fue tocado).
   - En la función de envío (`handleSubmit`):
     * Marcar `setHasSubmitted(true)`.
     * Si la validación falla, recién allí se hacen visibles los textos en rojo y se bloquea el guardado.
     * Si es válido, proceder con la mutación.

2. Restricciones Técnicas:
   - Mantener el archivo bajo el límite SRP (< 135 líneas).
   - Validar sintaxis con `node --check`.
   - Ejecutar únicamente: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node --check apps/web/src/components/catalog/parts/useSupplierForm.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir "Nuevo Proveedor", el formulario se presenta completamente limpio, neutro y sin textos rojos.
- Las alertas rojas se disparan únicamente si el operador presiona "Guardar Proveedor" con datos incompletos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE de inmediato.