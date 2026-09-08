TAREA CONTROLADA — MODULARIZACIÓN QUIRÚRGICA DE PURCHASES/NEW (FASE 1: OPERACIONES)

OBJETIVO TÉCNICO EXACTO
Descomponer `apps/web/src/app/operations/purchases/new/page.jsx` (~1247 líneas) aplicando el estándar de 3 capas y trazabilidad JSDoc definido en `docs/arquitectura/PLAN_MAESTRO_MODULARIZACION_FRONTEND.md`.
El orquestador final (`page.jsx`) debe reducirse a menos de 150 líneas sin alterar la funcionalidad existente (sincronización de carrito, consecutivos ORD-2026-XXXX, alertas de duplicados y modales).

ESTRUCTURA DE ARCHIVOS A GENERAR
Ubicación: `apps/web/src/app/operations/purchases/new/`

1. hooks/ (Capa de Control y Estado)
   - `hooks/usePurchaseData.js`: Carga de catálogos base (proveedores, insumos, presentaciones), lectura segura de orden activa (`orderId`), simulación y prevención de flicker.
   - `hooks/useChecklistManager.js`: Estado del checklist, marcado de 'Conseguido'/'Descartar', cálculo de totales/subtotales y alerta de duplicados cruzados entre órdenes activas.
   - `hooks/usePurchaseModals.js`: Estados booleanos y referencias de apertura/cierre de modales (creación rápida de proveedor e insumo).

2. components/ (Capa de Presentación Atómica)
   - `components/PurchaseHeader.jsx`: Selector de proveedor, condiciones de pago, fecha y consecutivo de orden.
   - `components/ChecklistSection.jsx`: Contenedor del checklist interactivo con progreso y botón de confirmación.
   - `components/ChecklistItemRow.jsx`: Fila/tarjeta individual de insumo en el checklist con badge de duplicado.
   - `components/QuickSupplierModal.jsx`: Modal de alta rápida de proveedor.
   - `components/QuickSupplyModal.jsx`: Modal de alta rápida de insumo.

3. Orquestador:
   - `page.jsx`: Importa los 3 hooks y renderiza los componentes de presentación pasando props declarativas.

REGLAS DE ARQUITECTURA Y CALIDAD
1. JavaScript nativo puro (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo: Reutilizar `new-purchase.module.css` sin renombrar clases para preservar el diseño intacto.
3. Encabezado JSDoc OBLIGATORIO en la primera línea de cada archivo creado con: `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.
4. Comentar las funciones críticas explicando brevemente su propósito de negocio.
5. PROHIBIDO compilar con `pnpm build` o borrar `.next`.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `node --check` sobre cada archivo en `hooks/`, `components/` y `page.jsx`.
- Comprobar que no existan variables sin definir (`ReferenceError`) ni desbalances de llaves.

FORMATO DE REPORTE
Entregar reporte técnico detallando:
- Archivos creados con sus líneas de código resultantes.
- Reducción de líneas en `page.jsx`.
- Confirmación de validación sintáctica limpia.