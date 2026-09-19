TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 3 TOOL CALLS):
Añadir el desglose de cambios (diff de campos anteriores vs nuevos) en la notificación toast al actualizar un insumo en `catalog/supplies`.

REGLAS ANTI-QUOTA EXHAUSTION (REGLA 07):
- PROHIBIDO ejecutar búsquedas globales (`Search`, `Find`).
- PROHIBIDO leer un archivo más de 1 vez.
- Modificación directa y exclusiva en el hook o componente del formulario de insumos.
- Cumplimiento estricto de SRP (< 135 líneas por archivo).

OBJETIVO:
1. En `apps/web/src/app/catalog/supplies/hooks/useSupplyForm.js` (o en la función que ejecuta el submit):
   - Al actualizar (`isEditing === true`), comparar el estado previo (`initialData`) contra los datos nuevos (`formData`).
   - Identificar los campos modificados (ej. `nombre`, `costoBase`, `stockMinimo`, `marca`, `empaque`).
   - Formatear el mensaje de confirmación:
     * Si cambió solo 1 campo numérico/clave (ej. costoBase):
       `Insumo "${nombre}" actualizado (Costo: $${prev} → $${next})`
     * Si cambiaron 2 o más campos:
       `Insumo "${nombre}" actualizado (Modificado: Costo, Stock)`
     * Si no varió ningún valor crítico:
       `Insumo "${nombre}" actualizado sin cambios críticos.`
   - Pasar este mensaje al callback de éxito / notificación toast.

2. Restricciones Técnicas:
   - Mantener el archivo por debajo del límite SRP (< 135 líneas). Si se requiere una función helper pura `getSupplyDiffMessage(prev, next)`, ubicarla en un archivo utilitario o inline concisa.
   - Ejecutar únicamente: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
`node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El toast verde muestra exactamente qué valor se alteró tras editar el insumo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE inmediatamente sin explicaciones adicionales.