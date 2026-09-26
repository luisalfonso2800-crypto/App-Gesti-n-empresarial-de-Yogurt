TAREA: Verificación de Estado y Validación de Correcciones de la Auditoría Técnica (SOLO LECTURA).

CONTEXTO Y PROPÓSITO:
Inicias esta sesión sin contexto previo. Se realizó recientemente una auditoría técnica profunda documentada en:
`docs/architecture/audits/INFORME_AUDITORIA_DEPENDENCIAS_Y_ACOPLAMIENTO.md` (o la ruta correspondiente donde resida dicho informe).
El objetivo exclusivo de esta tarea es leer dicho informe, examinar el código fuente actual y contrastar si los errores, inconsistencias de contratos, hotspots y vulnerabilidades reportadas ya fueron corregidos o si aún persisten en el código.

RESTRICCIÓN CRÍTICA DE OPERACIÓN (READ-ONLY MANDATORY):
- PROHIBIDO modificar, crear, eliminar o refactorizar archivos de código fuente (`.js`, `.jsx`, `.ts`, `.tsx`, `.prisma`, etc.).
- PROHIBIDO intentar corregir los fallos encontrados en esta etapa.
- La tarea es 100% de inspección y auditoría de contraste.

PASOS A EJECUTAR:

1. Lectura del Informe Base:
   - Leer exhaustivamente `docs/architecture/audits/INFORME_AUDITORIA_DEPENDENCIAS_Y_ACOPLAMIENTO.md`.
   - Identificar los puntos clave:
     * Hotspot 1: `inventory.repository.js -> findFinishedProducts()` y su relación con el modal de ventas (`SaleCavaCatalogDrawer`).
     * Hotspot 2: `products.repository.js -> findAll()` y el endpoint sobreutilizado `/products`.
     * Hotspot 3: `apps/web/src/app/dashboard/page.jsx` (evaluar conteo real de líneas y si sigue superando el límite SRP de 120 líneas).
     * Sección 6.1 (Inconsistencias de esquema Prisma vs Frontend): `cantidadActual` vs `stockActual`, `cantidadOz`/`cantidadMl` vs `volumenOzMl`, ausencia de `costoEstandar`.
     * Sección 6.3 (Rutas 404): Estado de `GET /products/intermediates` y `GET /lots`.
     * Trazabilidad de Producción a Cava: Validación del flujo de liquidación (`upsert` en `InventarioProducto`, creación de lote y disponibilidad en ventas).

2. Inspección del Código Fuente Actual:
   - Inspeccionar los archivos reales en el repositorio:
     * `apps/api/src/production/production.repository.js` y `production.service.js`
     * `apps/api/src/products/products.repository.js`
     * `apps/api/src/inventory/inventory.repository.js`
     * `apps/api/src/lots/lots.repository.js` (o controller)
     * `apps/web/src/app/dashboard/page.jsx`
     * `apps/web/src/app/commercial/sales/components/modal-parts/SaleCavaCatalogDrawer.jsx`
     * `apps/web/src/lib/adapters/` (verificar si existe adaptador canónico de datos)

3. Elaboración de la Matriz de Verificación:
   - Contrastar punto por punto y clasificar cada hallazgo en uno de los siguientes estados:
     * `[CORREGIDO]`: Evidencia en código de que el fallo fue resuelto de forma canónica.
     * `[PARCIAL]`: Se aplicó una solución provisional pero persiste riesgo o acoplamiento.
     * `[PENDIENTE]`: El código sigue idéntico al momento de la auditoría.
     * `[NUEVO RIESGO / REGRESIÓN]`: Si alguna modificación introdujo un desajuste colateral.

FORMATO DEL REPORTE FINAL EN CONSOLA:
Presenta un informe claro y directo estructurado en:
1. Tabla resumen: `[ID/Hallazgo | Archivo Afectado | Estado (Corregido/Pendiente/Parcial) | Evidencia en Código]`
2. Estado de los 3 Hotspots Críticos: Diagnóstico específico de cada uno.
3. Estado de la liquidación de producción y entrada a inventario: ¿Entran las unidades correctamente a Cava y Ventas?
4. Lista priorizada de lo que aún falta por corregir (si aplica).
