TAREA CONTROLADA — CORRECCIÓN DE CONSULTA BACKEND Y ENDPOINT EN PRECIOS DE PROVEEDORES

OBJETIVO
Corregir el error 500 / "Error en la petición" en `/catalog/supplier-prices` causado por un desacople entre las relaciones incluidas en `supplier-prices.repository.js` y el modelo real definido en `schema.prisma`.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/api/prisma/schema.prisma
- apps/api/src/supplier-prices/supplier-prices.repository.js
- apps/api/src/supplier-prices/supplier-prices.controller.js
- apps/web/src/app/catalog/supplier-prices/page.jsx

REGLAS TÉCNICAS OBLIGATORIAS
1. Backend y Frontend exclusivamente en JavaScript (.js, .jsx). PROHIBIDO TypeScript.
2. NO tocar esquemas Prisma ni alterar la base de datos PostgreSQL.
3. NO ejecutar seeds ni comandos destructivos.
4. Mantener CSS Modules en frontend.

PROCEDIMIENTO DE CORRECCIÓN
1. Inspeccionar `apps/api/prisma/schema.prisma`:
   - Buscar el modelo de precios (`PrecioProveedor` o equivalente).
   - Identificar con exactitud cómo están nombradas las relaciones hacia el modelo de Insumo y Proveedor (por ejemplo: `Insumos`, `Proveedores`, `insumo`, `proveedor`, `Insumo`, etc.).
2. Corregir `apps/api/src/supplier-prices/supplier-prices.repository.js`:
   - Adecuar el bloque `include: { ... }` para que use exactamente los nombres de los campos relacionales válidos en Prisma.
   - Si una relación opcional viene nula, garantizar que la consulta no lance excepciones.
3. Verificar `apps/web/src/app/catalog/supplier-prices/page.jsx`:
   - Mapear de forma segura los nombres en la tabla:
     `item.insumo?.Nombre_Insumo || item.insumo?.nombre || item.idInsumo`
     `item.proveedor?.Nombre_Proveedor || item.proveedor?.nombre || item.idProveedor`
   - Formatear la columna Costo Unidad Base mostrando la unidad (ej. `$1,500 / Litros`).
4. Validación:
   - Comprobar que la llamada al endpoint devuelva código HTTP 200 con el listado JSON.
   - Ejecutar `pnpm --filter web build` para confirmar compilación correcta.

CIERRE
Entregar exclusivamente este reporte:

REPARACIÓN PRECIOS PROVEEDORES — CIERRE
• Estado: COMPLETADO / ERROR
• Nombres de relación en schema.prisma: [Detalle exacto]
• Ajuste aplicado al repositorio API: SÍ / NO
• Respuesta HTTP del endpoint: 200 OK / ERROR
• Frontend mapea nombres reales: SÍ / NO
• Build: OK / ERROR
• Archivos modificados: [lista]
• Bloqueos: NINGUNO / [Detalle]