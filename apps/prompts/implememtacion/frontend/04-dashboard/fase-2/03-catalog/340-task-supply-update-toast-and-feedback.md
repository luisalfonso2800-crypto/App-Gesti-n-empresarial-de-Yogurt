TAREA:
Integrar la notificación de confirmación táctica (Toast botánico de éxito) y feedback explícito de los campos modificados al actualizar un insumo en el catálogo de Insumos (`catalog/supplies`).

REGLAS DE EFICIENCIA Y RENDIMIENTO (REGLA 07):
- Máximo 1 lectura por archivo. Prohibido ejecutar searches globales.
- Edición focalizada en el modal/hook de Insumos.
- Cumplimiento estricto de SRP (< 135 líneas por archivo en frontend).

OBJETIVO:
1. En el componente de edición de Insumos (`SupplyModal.jsx` o hook asociado en `apps/web/src/app/catalog/supplies/`):
   - Al recibir respuesta exitosa (HTTP 200) de la actualización:
     * Disparar la notificación toast institucional:
       `toast.success(`Insumo "${nombre}" actualizado correctamente.`);`
     * (Opcional) Si existen campos alterados clave (ej. costo base, stock mínimo), reportar un resumen breve en la notificación o mantener feedback visual de éxito durante 350ms antes de desmontar el modal.
   - Refrescar la lista de insumos (`mutate()` o `refetch()`) para que la tabla refleje los datos actualizados de inmediato.

2. Restricciones Técnicas:
   - Mantener componentes bajo 135 líneas (SRP).
   - Estilos 100% en CSS Modules (sin inline styles).
   - Validar sintaxis con `node --check` y `node .agents/scripts/verify-srp.js` asegurando código 0.

FUENTES DE VERDAD:
- Componentes de insumos en `apps/web/src/app/catalog/supplies/`
- Sistema de toast / notificaciones en `apps/web/src/components/ui/` o `apps/web/src/context/`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/07-token-efficiency-and-tool-budget.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente frontend en `apps/web/src/app/catalog/supplies/`. Backend intacto.

ALCANCE:

MODIFICAR:
- Componente/hook de guardado de Insumos.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check <ruta-del-archivo-modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al editar un insumo, el operador recibe una confirmación visual clara (Toast con check verde botánico) indicando qué se guardó.
- La tabla refresca los valores automáticamente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Notificación/feedback implementado:
- Resultado de verify-srp.js:
- Estado: