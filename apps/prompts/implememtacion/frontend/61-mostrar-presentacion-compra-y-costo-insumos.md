TAREA CONTROLADA — DESGLOSE DE PRESENTACIÓN DE COMPRA Y COSTO REFERENCIAL EN INSUMOS

OBJETIVO
1. En Precios de Proveedores (`/catalog/supplier-prices`), mostrar cómo se compra comercialmente (Presentación y Cantidad Equivalente) antes del cálculo del costo unitario.
2. En Insumos (`/catalog/supplies`), vincular el costo unitario base del último precio de proveedor registrado para eliminar el valor "N/A".

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/prisma/schema.prisma
- apps/api/src/supplies/supplies.repository.js (o equivalente)
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/app/catalog/supplies/page.jsx

REGLAS TÉCNICAS
1. JavaScript nativo (.js, .jsx). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. NO introducir Tailwind.
3. NO alterar la base de datos ni ejecutar migraciones/seeds.
4. Mantener compilación en cero errores (`pnpm --filter web build`).

ALCANCE PUNTUAL

1. Precios de Proveedores (`apps/web/src/app/catalog/supplier-prices/page.jsx`):
   - Agregar a la tabla las columnas intermedias del modelo:
     * "Presentación Compra": ej. `${item.cantidadPresentacion || 1} ${item.unidadPresentacion || 'Paquete'}`
     * "Contenido Base": ej. `${item.cantidadEquivalenteBase} ${item.insumo?.Unidad_Base || item.insumo?.unidadBase || ''}`
   - El orden de columnas sugerido: Insumo | Proveedor | Presentación Compra | Contenido Base | Precio Compra | Costo Unidad Base | Estado | Acciones.

2. Insumos - Backend y Frontend:
   - Backend (`supplies.repository.js`): Asegurar que la consulta de insumos incluya los precios vigentes (`include: { precios: { where: { activo: true }, take: 1, orderBy: { fechaActualizacion: 'desc' } } }` o equivalente según el esquema).
   - Frontend (`apps/web/src/app/catalog/supplies/page.jsx`):
     * Mapear el `costoUnidadBase` del precio asociado en la columna "Costo Ref. (Base)".
     * Formatear con su unidad base: ej. `$300 / Unidades` o `$3,000 / Kilogramos`. Si no existe precio, mostrar "-".

VALIDACIÓN
- Ejecutar `pnpm --filter web build`.

CIERRE
Entregar exclusivamente este formato:

DESGLOSE COMPRA Y COSTO REF — CIERRE
• Estado: COMPLETADO / ERROR
• Columnas de empaque en Precios: SÍ / NO
• Costo referencial conectado en Insumos: SÍ / NO
• JavaScript nativo: OK
• TypeScript introducido: NO
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]