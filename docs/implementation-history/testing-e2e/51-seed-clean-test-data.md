TAREA CONTROLADA — SCRIPTS DE CARGA MASIVA (SEED) Y LIMPIEZA TOTAL (CLEAN) DE BASE DE DATOS

OBJETIVO
Crear dos scripts en JavaScript nativo dentro de `apps/api/prisma/` para gestionar datos de prueba en PostgreSQL mediante Prisma Client:
1. `seed-test-data.js`: Carga masiva de datos realistas para probar todas las tablas y vistas del sistema.
2. `clean-test-data.js`: Vaciado completo y seguro de todas las tablas de datos, reiniciando contadores de identidad sin eliminar el esquema.

FUENTES DE VERDAD
- `apps/api/prisma/schema.prisma`: Inspeccionar todos los modelos, relaciones, enums y restricciones obligatorias.
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`.

REGLAS TÉCNICAS ESTRICTAS
1. JavaScript nativo (CommonJS o ES Modules según soporte de `apps/api/package.json`). PROHIBIDO TypeScript (.ts).
2. CERO instalación de paquetes externos. Usar exclusivamente `@prisma/client` ya existente.
3. No alterar `schema.prisma` ni crear migraciones de base de datos.
4. Respetar estrictamente el orden de dependencias e integridad referencial al insertar datos.

ALCANCE DE LOS SCRIPTS

1. `apps/api/prisma/seed-test-data.js`
Debe insertar volumen significativo de datos realistas cubriendo todo el ciclo operativo:
- Maestros y Catálogo:
  * Presentaciones (mínimo 4: 250ml, 500ml, 1L, Galón).
  * Insumos (mínimo 8: Leche cruda, cultivo láctico, azúcar, pulpa fresa, pulpa mora, estabilizante, botellas, etiquetas).
  * Proveedores (mínimo 4 con NIT, teléfono, email reales).
  * Precios de Proveedor (asociar precios vigentes a múltiples insumos por proveedor).
  * Productos terminados (mínimo 6: Yogurt Fresa 1L, Yogurt Mora 1L, Yogurt Melocotón 1L, Yogurt Natural 500ml, Yogurt Griego 250ml, etc.).
  * Recetas y Detalles de Receta (asociar productos con sus insumos y cantidades exactas de consumo).
- Operación:
  * Compras a Proveedores: múltiples compras con detalles, estados (PENDIENTE, RECIBIDA, PAGADA) y fechas variadas.
  * Inventario: stock inicial de insumos y movimientos consistentes.
  * Órdenes de Producción: órdenes en estados PLANIFICADA, EN_PROCESO y COMPLETADA.
  * Lotes de Producción: lotes generados con fecha de vencimiento, lote alfanumérico y stock disponible.
- Comercial:
  * Clientes (mínimo 6: tiendas, cafeterías, supermercados, clientes particulares).
  * Ventas: múltiples pedidos/facturas de venta con detalles de producto, lotes asignados y totales.
  * Pagos: cobros registrados totales y parciales asociados a las ventas.
  * Gastos: registros operativos (servicios públicos, mantenimiento, nómina, empaque).

2. `apps/api/prisma/clean-test-data.js`
Debe ejecutar un vaciado total mediante sentencias SQL nativas sobre PostgreSQL:
- Truncar todas las tablas del esquema `public` excepto `_prisma_migrations`.
- Utilizar `TRUNCATE TABLE ... RESTART IDENTITY CASCADE;`.
- Dejar la base de datos vacía, con IDs reseteados y lista para iniciar en cero.

3. CONFIGURACIÓN DE COMANDOS EN `apps/api/package.json`
Registrar en la sección `"scripts"` de `apps/api/package.json`:
- `"db:seed:test": "node prisma/seed-test-data.js"`
- `"db:clean:test": "node prisma/clean-test-data.js"`

VALIDACIÓN TÉCNICA
1. Ejecutar: `node apps/api/prisma/clean-test-data.js` para asegurar que limpia sin errores de llaves foráneas.
2. Ejecutar: `node apps/api/prisma/seed-test-data.js` para validar que todas las tablas quedan pobladas sin errores de Prisma.

FORMATO DE CIERRE (DETENERSE TRAS EMITIR)
SCRIPTS DE PRUEBA — CIERRE
• Estado: COMPLETADO / ERROR
• Registros insertados: [Resumen por dominio: Maestros, Operación, Comercial]
• Script de carga creado: apps/api/prisma/seed-test-data.js
• Script de limpieza creado: apps/api/prisma/clean-test-data.js
• Comandos configurados en package.json: OK / ERROR
• Validación de ejecución (clean -> seed): OK / ERROR
• Dependencias nuevas: NINGUNA
• Bloqueos: NINGUNO / [Detalle]