TAREA CONTROLADA — CÁLCULO REACTIVO Y VISUALIZACIÓN DE COSTO POR UNIDAD BASE

OBJETIVO
Implementar el cálculo reactivo e instantáneo del costo por unidad base (ej. costo por gramo, mililitro o unidad individual) en el formulario y tabla de Precios de Proveedores, así como mostrar la referencia de costo en el catálogo de Insumos.

FUENTES DE VERDAD
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`
- `apps/web/src/app/catalog/supplier-prices/page.jsx`
- `apps/web/src/app/catalog/supplies/page.jsx`
- `apps/api/prisma/schema.prisma` (Modelo PrecioProveedor e Insumo)

REGLAS TÉCNICAS ESTRICTAS
1. Código fuente exclusivamente en JavaScript / JSX (.js, .jsx). PROHIBIDO TypeScript (.ts, .tsx).
2. Mantener CSS Modules. PROHIBIDO Tailwind o librerías de UI externas.
3. NO modificar el esquema de Prisma ni ejecutar migraciones (los campos ya existen en el backend).
4. NO alterar lógica de negocio ni crear dependencias de paquetes adicionales.

ALCANCE DE LA IMPLEMENTACIÓN

1. Módulo Precios de Proveedores (`apps/web/src/app/catalog/supplier-prices/page.jsx`):
   - En el formulario modal / drawer de registro y edición:
     Al ingresar o modificar `precioCompra` y `cantidadEquivalenteBase`, recalcular de inmediato:
     `costoUnidadBase = precioCompra / cantidadEquivalenteBase`
   - Incorporar debajo de los campos de precio un badge o texto dinámico destacado (ej. "Equivale a: $500 por Unidad" o "$4 por Gramo" según la `unidadBase` del insumo seleccionado).
   - En la tabla del listado: Asegurar que la columna "Costo Unidad Base" formatee el valor claramente con moneda y unidad (ej. "$4 / Gramo").

2. Módulo Insumos (`apps/web/src/app/catalog/supplies/page.jsx`):
   - En la tabla de Insumos, agregar la columna "Costo Ref. (Base)" que muestre el costo unitario base vigente o último registrado. Si el insumo aún no tiene precios asociados, mostrar "-".

VALIDACIÓN
1. Ejecutar `pnpm --filter web build` para garantizar cero errores de sintaxis y compilación.
2. Confirmar que no se hayan generado archivos .ts/.tsx ni alterado la base de datos.

FORMATO DE CIERRE
Entregar exclusivamente:

IMPLEMENTACIÓN COSTO BASE — CIERRE
• Estado: COMPLETADO / ERROR
• Módulo Precios de Proveedores actualizado: SÍ / NO
• Cálculo instantáneo en formulario: OK / ERROR
• Formato de visualización en tabla: OK / ERROR
• Columna de referencia en Insumos: OK / NO APLICADO
• JavaScript nativo: OK
• TypeScript introducido: NO
• CSS Modules: OK
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]