TAREA CONTROLADA — MODULARIZACIÓN EN BLOQUE 1 (PRODUCTION, SUPPLIES, PRODUCTS)

OBJETIVO TÉCNICO EXACTO
Refactorizar y modularizar en un único ciclo quirúrgico las siguientes 3 páginas monolíticas, aplicando el estándar estricto de 3 capas y trazabilidad JSDoc estipulado en `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`:
1. `apps/web/src/app/operations/production/page.jsx` (~361 líneas)
2. `apps/web/src/app/catalog/supplies/page.jsx` (~286 líneas)
3. `apps/web/src/app/catalog/products/page.jsx` (~256 líneas)

Cada `page.jsx` resultante debe quedar estrictamente como orquestador declarativo (< 100-120 líneas).

ESTRUCTURA DE ARCHIVOS A GENERAR POR MÓDULO

1. MÓDULO: operations/production
   - `hooks/useProductionData.js`: Carga de órdenes, recetas asociadas y lotes activos vía `@/lib/api-client`.
   - `hooks/useProductionForm.js`: Manejo de estado para creación de lotes, cálculo de cantidades e insumos requeridos.
   - `components/ProductionHeader.jsx`: Controles de filtrado por estado de lote y botón de nueva producción.
   - `components/ProductionTable.jsx`: Listado de órdenes de producción con badges de estado.
   - `components/ProductionModal.jsx`: Modal de registro y despacho de producción.

2. MÓDULO: catalog/supplies
   - `hooks/useSuppliesData.js`: Peticiones a API de insumos, categorización y control de estado (`isLoading`, errores).
   - `hooks/useSupplyForm.js`: Estado y validación del formulario de insumo (nombre, unidad base, stock mínimo).
   - `components/SuppliesHeader.jsx`: Buscador, filtros y trigger de nuevo insumo.
   - `components/SuppliesTable.jsx`: Tabla de insumos con acciones de editar/eliminar.
   - `components/SupplyModal.jsx`: Modal de creación/edición de insumo.

3. MÓDULO: catalog/products
   - `hooks/useProductsData.js`: Carga de productos terminados y relaciones.
   - `hooks/useProductForm.js`: Estado para creación/edición de productos y asignación de presentaciones.
   - `components/ProductsHeader.jsx`: Barra de búsqueda y botón de nuevo producto.
   - `components/ProductsTable.jsx`: Listado de productos con categorías y estado activo/inactivo.
   - `components/ProductModal.jsx`: Modal de administración de producto.

REGLAS DE ARQUITECTURA Y CALIDAD (STRICT)
1. JavaScript nativo puro (.jsx, .js). PROHIBIDO TypeScript.
2. Usar exclusivamente alias canónicos `@/*` para imports (`@/lib/api-client`, `@/components/ui/icons`). PROHIBIDAS rutas relativas profundas (`../../../../`).
3. CSS Modules estricto: Reutilizar los archivos `.module.css` locales sin alterar nombres de clases.
4. Encabezado JSDoc obligatorio en cada archivo creado: `@file`, `@module`, `@description`, `@responsibility`, `@usedBy`, `@dependencies`.
5. No escapar comillas invertidas (\`) ni interpolaciones (\${}) en template literals.
6. MODO RÁPIDO: PROHIBIDO compilar con `pnpm build` o borrar `.next`. Validar sintaxis con `node --check`.

VALIDACIÓN LIGERA (SIN BUILD)
- Ejecutar `node --check` sobre todos los hooks creados en los 3 módulos.
- Confirmar que ningún archivo nuevo tenga variables indefinidas (`ReferenceError`).

FORMATO DE REPORTE
Entregar reporte técnico resumiendo:
- Archivos creados y líneas resultantes por módulo.
- Líneas finales en los 3 `page.jsx`.
- Estado de la validación sintáctica.