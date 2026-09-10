TAREA CONTROLADA — RESOLVER NOMBRES EN PRECIOS Y RESTAURAR UX DE INSUMOS

OBJETIVO
1. Resolver la visualización en Precios de Proveedores (`/catalog/supplier-prices`): reemplazar los UUIDs crudos por los nombres reales del Insumo y Proveedor, y formatear el Costo Unidad Base indicando la unidad.
2. Asegurar que Insumos (`/catalog/supplies`) conserve su código amigable, buscador, filtro y columna de costo de referencia.
3. Incorporar los subtítulos descriptivos en ambos encabezados.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/src/supplier-prices/ (o módulo correspondiente en API)
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/app/catalog/supplies/page.jsx

REGLAS TÉCNICAS
1. JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx).
2. Mantener CSS Modules. NO introducir Tailwind.
3. NO instalar dependencias externas.
4. NO alterar destructivamente la base de datos ni ejecutar seeds.

ALCANCE PUNTUAL

1. Precios de Proveedores:
   - Backend / Consulta: Asegurar que el repositorio/servicio de `supplier-prices` incluya las relaciones de `insumo` y `proveedor` en la consulta de Prisma (`include: { insumo: true, proveedor: true }`).
   - Frontend (`page.jsx`):
     * Columna Insumo: Mostrar `item.insumo?.nombreInsumo || item.idInsumo`.
     * Columna Proveedor: Mostrar `item.proveedor?.nombreProveedor || item.idProveedor`.
     * Columna Costo Unidad Base: Formatear agregando la unidad base (ej. `$1,500 / Litro`).
     * Agregar subtítulo debajo de `<h1>`: "Histórico y lista de tarifas vigentes cotizadas por cada proveedor para los diferentes insumos."

2. Insumos:
   - Mantener el encabezado con subtítulo: "Catálogo maestro de materias primas, envases y suministros requeridos para la formulación y empaque de productos."
   - Asegurar que la tabla muestre: Código (`generateCode` o `code`), Nombre, Categoría, Marca, Unidad Base, Stock Mínimo, Costo Ref. (Base), Estado y Acciones.
   - Mantener funcionales la barra de búsqueda y el filtro por categoría.

VALIDACIÓN
- Ejecutar `pnpm --filter web build` para confirmar compilación exitosa.

CIERRE
Entregar exclusivamente:

RESOLUCIÓN NOMBRES Y UX — CIERRE
• Estado: COMPLETADO / ERROR
• Nombres reales en Precios: SÍ / NO
• Costo formateado con unidad: SÍ / NO
• Insumos restaurado con filtros y código: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]