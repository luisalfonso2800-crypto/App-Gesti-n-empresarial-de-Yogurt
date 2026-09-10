TAREA CONTROLADA — SINCRONIZACIÓN REAL DE LISTAS, FUSIÓN CON CHECKBOXES Y UX MODERNA

OBJETIVO TÉCNICO EXACTO
Resolver la desincronización entre el carrito y las órdenes de compra activas, erradicar `window.alert`/`window.confirm` reemplazándolos por confirmaciones modales no invasivas, habilitar selección visual mediante checkboxes para la fusión de listas y actualizar labels/acciones de acuerdo a las reglas de AI_PROJECT_OPERATING_MANUAL.md.

ALCANCE PUNTUAL DE CAMBIOS

1. SINCRONIZACIÓN REAL DE LISTAS (FUENTE DE VERDAD):
   - Archivos: `apps/web/src/context/CartContext.jsx`, `apps/web/src/components/shell/Header.jsx` y `apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.js`.
   - Problema: El carrito muestra pestañas dummy ("General", "Nueva") en vez de las listas reales del sistema.
   - Solución:
     * `CartContext` debe inicializar y sincronizar sus listas a partir de las órdenes activas en backend (`GET /api/v1/purchases` con estado `PENDIENTE` / en ruta, ej. `ORD-2026-0001` a `ORD-2026-0007`).
     * En el dropdown del carrito, cada pestaña o elemento debe corresponder a una lista real: `ORD-2026-XXXX - [Nombre]`.
     * Cada pestaña en el carrito debe incluir un botón `Trash2` para descartar/eliminar la lista (con confirmación modal).
     * Si no hay lista seleccionada, la primera lista activa queda como predeterminada.

2. FEEDBACK Y REASIGNACIÓN EN PRECIOS DE PROVEEDORES:
   - Archivo: `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` y `useCartManager.js`.
   - En el Toast verde de confirmación:
     * Cambiar el texto a: `Añadido a [Nombre de Lista Activa]`.
     * Incluir junto al mensaje un botón interactivo "Cambiar de lista" (`ArrowRightLeft`).
     * Al presionar "Cambiar de lista", abrir un selector modal que permita mover ese insumo recién agregado a cualquiera de las otras listas activas.

3. MÓDULO DE COMPRAS — FUSIÓN CON CHECKBOXES Y ELIMINACIÓN REAL:
   - Archivo: `apps/web/src/app/operations/purchases/page.jsx` (o sus subcomponentes).
   - Eliminación sin `window.alert`:
     * PROHIBIDO el uso de `window.alert` o `window.confirm`.
     * Implementar modal estilizado de confirmación ("¿Eliminar la lista ORD-XXXX?").
     * Al confirmar, ejecutar la petición de eliminación a la API / Context, remover la tarjeta del DOM y emitir un toast de confirmación.
   - Fusión Inteligente con Selección Múltiple:
     * Al pulsar "Fusionar Seleccionadas" (`GitMerge`), activar un estado de selección (`isMergingMode: true`).
     * En cada tarjeta `ORD-2026-XXXX`, renderizar un checkbox visible para seleccionar las listas a fusionar.
     * Al seleccionar 2 o más listas, habilitar botón de acción "Confirmar Fusión".
     * Fusionar agrupando insumos por `(insumoId + presentacionId + proveedorId)` sumando cantidades si coinciden, o manteniéndolos independientes si difieren.
   - Cambio de Textos y Botones de Tarjeta:
     * Reemplazar el texto del botón `Checklist (Fase 1)` por: `Ver Lista` (acompañado del icono `Eye` o `ClipboardList`).

REGLAS DE ARQUITECTURA Y VALIDACIÓN (STRICT)
1. Exclusivamente JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript.
2. Iconografía: Importar iconos exclusivamente desde `lucide-react` (ej. `Eye`, `Trash2`, `GitMerge`, `ArrowRightLeft`).
3. PROHIBIDO el uso de diálogos nativos del navegador (`alert`, `confirm`, `prompt`). Usar componentes modales controlados por estado.
4. MODO RÁPIDO: PROHIBIDO ejecutar `pnpm build`. Validar con `node --check` o comprobación sintáctica local.

FORMATO DE REPORTE
Entregar reporte técnico detallando:
- Archivos intervenidos.
- Eliminación de alertas nativas del navegador.
- Flujo de sincronización de listas aplicado.