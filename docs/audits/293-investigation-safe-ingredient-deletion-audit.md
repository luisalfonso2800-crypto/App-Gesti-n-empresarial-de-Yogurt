TAREA:
Investigar y auditar en el backend las dependencias relacionales y el impacto de implementar una eliminación segura/condicional de insumos desactivados (`catalog/ingredients`).

OBJETIVO:
1. Inspeccionar el modelo `schema.prisma` (o definiciones de base de datos) para mapear todas las relaciones del modelo `Ingredient` / `Insumo`:
   - Órdenes de compra / Recepciones.
   - Movimientos de kardex / Inventario.
   - Fórmulas / Recetas técnicas (BOM).
   - Registros de lotes de producción.
2. Evaluar la viabilidad de una eliminación condicional:
   - Permitir `DELETE` físico únicamente cuando no existan registros hijos vinculados (cero compras, cero movimientos, cero recetas).
   - Bloquear y devolver un error legible (`409 Conflict` o regla de negocio) cuando existan referencias históricas, protegiendo la integridad referencial.
3. Emitir un informe de viabilidad técnica y proponer el contrato seguro para el endpoint de eliminación.

FUENTES DE VERDAD:
- `apps/api/prisma/schema.prisma` (o modelos del backend)
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`

REGLA DE CONSULTA OBLIGATORIA:
Solo lectura e investigación técnica en backend. Prohibido ejecutar migraciones destructivas o modificar código sin orden previa.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma`
- Controladores y servicios de insumos en `apps/api/`

NO MODIFICAR:
- ningún archivo funcional de la aplicación.

INSTRUCCIONES:
1. Identificar todas las tablas con clave foránea hacia el insumo.
2. Redactar el análisis indicando si existe `onDelete: Cascade` o `onDelete: Restrict`.
3. Detallar la lógica requerida para habilitar la eliminación segura en frontend y backend.

CRITERIO DE FINALIZACIÓN:
- Documento de diagnóstico claro con el mapa de impacto relacional.

DETENCIÓN:
Al completar la auditoría y redactar el reporte, DETENTE.

SALIDA:
- Tablas dependientes identificadas:
- Riesgos de integridad referencial:
- Recomendación técnica de implementación:
- Estado: