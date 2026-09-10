TAREA CONTROLADA — CORRECCIÓN DE ENDPOINT DELETE Y REDISEÑO A ACORDEÓN VERTICAL EN CARRITO

OBJETIVO TÉCNICO
Corregir la ruta del endpoint DELETE en el frontend para la eliminación de órdenes de compra y rediseñar la interfaz de listas dentro del dropdown del carrito (`Header.jsx` / `CartSidebar.jsx`) a una estructura vertical tipo acordeón, respetando estrictamente `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`.

ALCANCE DE IMPLEMENTACIÓN

1. Corrección del Endpoint DELETE (Backend / API Client):
   - Archivos a inspeccionar/corregir: `apps/web/src/context/CartContext.jsx` o donde se ejecute la eliminación de la orden.
   - Error actual: La petición se envía a `/api/v1/purchases/orders/:id` arrojando 404.
   - Ruta canónica correcta: Cambiar la llamada a `DELETE /api/v1/purchases/${id}`.
   - Confirmar que si la orden se elimina exitosamente en backend:
     * Se remueva del estado de `CartContext`.
     * Si la lista eliminada era la activa, seleccionar automáticamente la siguiente lista disponible como activa.
     * Emitir notificación toast informativa ("Lista eliminada correctamente").

2. Rediseño Vertical Tipo Acordeón en el Carrito:
   - Archivos: `apps/web/src/components/shell/Header.jsx` (o subcomponentes del dropdown del carrito) y `shell.module.css`.
   - Estructura y Comportamiento:
     * Eliminar el contenedor horizontal con scroll (`overflow-x`).
     * Apilar las listas de compra de forma estrictamente VERTICAL.
     * La lista que esté seleccionada como activa es la que se muestra ABIERTA/DESPLEGADA con su detalle de insumos visibles al abrir el carrito.
     * Las demás listas permanecen como filas CERRADAS (mostrando solo: Nombre de lista, cantidad de ítems y botón `Trash2`).
     * Al hacer clic sobre cualquier lista cerrada:
       1. Pasa a ser la Lista Activa del sistema (`setActiveList(id)`).
       2. Se despliega automáticamente mostrando sus insumos.
       3. La lista anteriormente abierta se colapsa.
       4. Todos los nuevos productos que se compren en el catálogo se destinarán a esta nueva lista activa.
     * Cada cabecera de lista en el acordeón debe incluir:
       - Nombre: `ORD-2026-XXXX - [Nombre Personalizado] - [Fecha]`.
       - Contador de ítems.
       - Botón de eliminación directa (`Trash2` de `lucide-react`) con modal de confirmación no bloqueante (prohibido `window.confirm`).

REGLAS DE ARQUITECTURA (STRICT)
1. JavaScript nativo puro (.js, .jsx). PROHIBIDO TypeScript.
2. Uso exclusivo de iconos de `lucide-react` (`Trash2`, `ChevronDown`, `ChevronUp`, `Layers`).
3. PROHIBIDO el uso de `window.alert` o `window.confirm`.
4. MODO RÁPIDO: PROHIBIDO `pnpm build`. Comprobar con `node --check`.

REPORTE DE CIERRE
Indicar archivos corregidos, ajuste de la URL del endpoint y confirmación de funcionamiento del acordeón vertical.