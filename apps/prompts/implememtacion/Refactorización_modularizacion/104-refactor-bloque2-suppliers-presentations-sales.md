TAREA CONTROLADA — MODULARIZACIÓN EN BLOQUE 2 (SUPPLIERS, PRESENTATIONS, SALES)

OBJETIVO TÉCNICO EXACTO
Refactorizar y modularizar en un único ciclo quirúrgico las 3 páginas monolíticas restantes, aplicando el estándar estricto de 3 capas y trazabilidad JSDoc estipulado en `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`:
1. `apps/web/src/app/catalog/suppliers/page.jsx` (~250 líneas)
2. `apps/web/src/app/catalog/presentations/page.jsx` (~225 líneas)
3. `apps/web/src/app/commercial/sales/page.jsx` (~220 líneas)

Cada `page.jsx` resultante debe quedar estrictamente como orquestador declarativo (< 100-120 líneas).

ESTRUCTURA DE ARCHIVOS A GENERAR POR MÓDULO

1. MÓDULO: catalog/suppliers
   - `hooks/useSuppliersData.js`: Carga de proveedores y estados asíncronos vía `@/lib/api-client`.
   - `hooks/useSupplierForm.js`: Manejo de estado del formulario de proveedor (datos fiscales, contacto, condiciones de pago).
   - `components/SuppliersHeader.jsx`: Buscador y botón de alta de proveedor.
   - `components/SuppliersTable.jsx`: Tabla de proveedores registrados con acciones.
   - `components/SupplierModal.jsx`: Modal de administración de proveedor.

2. MÓDULO: catalog/presentations
   - `hooks/usePresentationsData.js`: Carga de presentaciones de empaque y volumen.
   - `hooks/usePresentationForm.js`: Estado y validaciones de factor de conversión y unidad.
   - `components/PresentationsHeader.jsx`: Filtros y botón de nueva presentación.
   - `components/PresentationsTable.jsx`: Listado de presentaciones configuradas.
   - `components/PresentationModal.jsx`: Modal de creación/edición de presentación.

3. MÓDULO: commercial/sales
   - `hooks/useSalesData.js`: Carga de facturas/ventas, clientes y catálogo de productos disponibles para venta.
   - `hooks/useSaleForm.js`: Manejo de la orden de venta (selección de cliente, adición de líneas de producto, cálculo de subtotales, IVA y total).
   - `components/SalesHeader.jsx`: Filtros por fecha/estado y botón de nueva venta.
   - `components/SalesTable.jsx`: Tabla histórica de ventas y estado de cobranza.
   - `components/SaleModal.jsx`: Modal o formulario de emisión de venta con líneas dinámicas.

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