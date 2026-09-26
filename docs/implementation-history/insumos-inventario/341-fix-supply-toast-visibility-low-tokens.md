TAREA (PRESUPUESTO ESTRICTO: MÁXIMO 4 TOOL CALLS):
Hacer visible la alerta/toast de confirmación al guardar un insumo consumiendo el `NotificationContext` global del sistema, sin inflar líneas en `page.jsx` ni ejecutar búsquedas exploratorias.

REGLAS DE CONSUMO MÍNIMO (ANTI-QUOTA EXHAUSTION):
- PROHIBIDO ejecutar `Search` o `Find`.
- PROHIBIDO leer un archivo más de 1 vez.
- Modificación directa y única en los 2 archivos indicados.

OBJETIVO:
1. En `apps/web/src/app/catalog/supplies/page.jsx`:
   - Importar el hook de notificaciones global existente:
     `import { useNotification } from '@/context/NotificationContext';`
   - Extraer: `const { showNotification } = useNotification();` (o `showToast` según el hook).
   - En la función que resuelve el guardado exitoso de `useSupplyForm` o tras el `await`:
     Llamar de inmediato:
     `showNotification({ type: 'success', message: 'Insumo guardado correctamente' });`
   - Retirar los estados locales temporales de toast creados en `supplies.module.css` y en `page.jsx` que solo inflan líneas y no se renderizan.

2. En `apps/web/src/app/catalog/supplies/hooks/useSupplyForm.js` (si aplica):
   - Asegurar que `onSuccess()` se invoque explícitamente tras la respuesta 200 de la mutación `PUT`/`POST`.

3. Restricciones Técnicas:
   - `page.jsx` debe quedar en menos de 115 líneas.
   - Ejecutar únicamente: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
`node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al editar o crear un insumo, se utiliza el sistema de notificación global que ya está montado en el layout, mostrando el aviso flotante sin código huérfano.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE inmediatamente sin generar explicaciones largas.