TAREA CONTROLADA — MODULARIZACIÓN QUIRÚRGICA DE CATALOG/SUPPLIER-PRICES (FASE 2: CATÁLOGOS)

OBJETIVO TÉCNICO EXACTO
Descomponer `apps/web/src/app/catalog/supplier-prices/page.jsx` (~562 líneas) aplicando el estándar de 3 capas y trazabilidad JSDoc estipulado en `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md` y `docs/arquitectura/PLAN_MAESTRO_MODULARIZACION_FRONTEND.md`.
Reducir el orquestador principal (`page.jsx`) a menos de 120 líneas sin alterar la funcionalidad del comparador, la selección múltiple, el carrito de compras ni los estilos CSS Modules.

ESTRUCTURA DE ARCHIVOS A GENERAR
Ubicación: `apps/web/src/app/catalog/supplier-prices/`

1. hooks/ (Capa de Lógica y Estado)
   - `hooks/useSupplierPricesData.js`: Peticiones a `/api/v1/supplier-prices`, proveedores e insumos mediante `@/lib/api-client`. Manejo de estados de carga (`isLoading`), ordenamiento y filtrado reactivo.
   - `hooks/useCartManager.js`: Encapsular la lógica de sincronización con `sessionStorage`, cálculo de totales, agregado/eliminación de ítems y despacho del evento personalizado para actualizar el contador del `Header.jsx`.

2. components/ (Capa de Presentación Atómica)
   - `components/PricesFilterBar.jsx`: Barra de búsqueda, selector de categoría/insumo y controles de filtrado.
   - `components/PricesComparisonTable.jsx`: Tabla interactiva con columnas de precios, proveedores, comparación de mejor precio y botones de agregar al carrito.
   - `components/CartSidebar.jsx`: Panel deslizante/lateral de la canasta activa con resumen de insumos seleccionados, totales estimados y botón para transferir a la orden de compra (`/operations/purchases/new`).

3. Orquestador:
   - `page.jsx`: Importa `useSupplierPricesData` y `useCartManager`, conectando los datos y handlers con `PricesFilterBar`, `PricesComparisonTable` y `CartSidebar`.

REGLAS DE ARQUITECTURA Y EJECUCIÓN (OPERATING MANUAL)
1. Exclusivamente JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.
2. Usar obligatoriamente alias canónicos `@/*` para imports (`@/lib/api-client`, `@/components/ui/icons`). Prohibidas rutas relativas profundas.
3. CSS Modules estricto: Reutilizar las clases existentes en el archivo `.module.css` local sin renombrar nada.
4. Encabezado JSDoc obligatorio en cada archivo con `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.
5. Si encuentras template literals en scripts, no escapes comillas invertidas ni interpolaciones.
6. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o borrar `.next`. Validar sintaxis con `node --check`.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `node --check` sobre los hooks creados.
- Comprobar que Next.js Turbo compile `/catalog/supplier-prices` sin errores de módulos no encontrados ni variables indefinidas.

FORMATO DE REPORTE
Entregar reporte técnico detallando:
- Archivos creados y sus líneas de código.
- Reducción total de líneas en `page.jsx`.
- Estado de validación funcional y sintáctica.