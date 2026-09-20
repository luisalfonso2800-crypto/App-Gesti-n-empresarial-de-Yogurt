TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Aislar el formulario "Planificar Nueva Orden" (`ProductionOrderForm` / sección de planificación) para que se comporte como un Modal enfocado (o vista exclusiva), evitando que se renderice amontonado encima del cartel de estado vacío y de la bitácora en `apps/web/src/app/production/page.jsx`.

CLÁUSULA ANTI-EXPLORACIÓN (REGLA 07):
- PROHIBIDO usar `Search`, `Find`, `Grep` o comandos recursivos.
- LECTURA ÚNICA: Lee una sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos listados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/production/page.jsx`
2. `apps/web/src/app/production/production.module.css` (o archivo CSS del módulo)

INSTRUCCIONES TÉCNICAS:

1. En `apps/web/src/app/production/page.jsx`:
   - Evaluar el estado de planificación (`isPlanningOpen` o `showOrderForm`).
   - Convertir la sección "Planificar Nueva Orden" en un Modal flotante con Backdrop (`styles.modalOverlay` y `styles.modalContent`), O implementar renderizado mutuamente excluyente:
     * Cuando `isPlanningOpen === true`:
       Renderizar el formulario dentro del contenedor modal enfocado (con cabecera, botón de cierre '✕' y foco visual completo).
     * El cartel de estado vacío ("Comienza programando tu primera Orden...") y la bitácora NO deben competir visualmente en el mismo flujo de scroll mientras se planifica.
   - Conectar el botón "Cancelar Formulario" para que ejecute `setIsPlanningOpen(false)` y limpie la URL (`router.replace('/production')`).
   - Mantener el archivo bajo el límite SRP (< 135 líneas).

2. En el archivo CSS correspondiente:
   - Añadir/ajustar las clases para el modal de planificación:
     * `.modalOverlay`: `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 50; display: flex; align-items: center; justify-content: center;`
     * `.modalContent`: `background: #FFFFFF; border-radius: 12px; width: 92%; max-width: 980px; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);`

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al pulsar "+ Nueva Producción" o "Producir Lote", el formulario se abre como un modal limpio y enfocado sobre la pantalla.
- La bitácora de fondo ya no queda amontonada verticalmente con el formulario.
- Al pulsar "Cancelar", el modal se cierra y regresa a la vista de la bitácora sin recargas.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.