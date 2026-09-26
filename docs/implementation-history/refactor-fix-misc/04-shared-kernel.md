TAREA CONTROLADA — IMPLEMENTACIÓN DE COMMON COMPONENTS MÍNIMOS

OBJETIVO ÚNICO
Implementar exclusivamente los componentes transversales iniciales en apps/api/src/common/ especificados en la Sección 31 de docs/implementation/04-shared-kernel-and-common-components.md.
PROHIBIDO crear módulos de negocio, Prisma, base de datos, shared/domain o abstracciones anticipadas (BaseService, BaseRepository, GenericCrud).

1. REGLA ESTRICTA DE LECTURA (NIVEL 1 - AHORRO DE TOKENS)
- Consulta ÚNICAMENTE:
  1. docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md (conducta operativa).
  2. docs/implementation/04-shared-kernel-and-common-components.md (secciones 9, 10, 11, 15 y 31).
  3. apps/api/src/common/filters/global-exception.filter.js (para no duplicar ni romper lo existente).
- PROHIBIDO leer otros documentos, módulos de dominio o node_modules/.
- Mantener inferencia directa/mínima sin explicaciones teóricas.

2. COMPONENTES A IMPLEMENTAR (EXCLUSIVAMENTE ESTOS TRES):
1. common/errors/: Clases base de error de aplicación (BusinessRuleError, NotFoundError, ConflictError, ValidationError) que extiendan de Error o Error base de NestJS.
2. common/pipes/: Validación o transformación técnica global si no está ya cubierta en main.js.
3. common/types/: Tipos/contratos utilitarios comunes mínimos (PaginationQuery, PaginatedResult).

3. REGLAS OBLIGATORIAS:
- Código en JavaScript plano compatible con la configuración actual de Babel.
- NO crear BaseService, BaseRepository, GenericCrud ni UniversalEntity.
- NO crear carpetas vacías en shared/.
- RESPETAR y no sobrescribir apps/api/src/common/filters/global-exception.filter.js.

4. PROCEDIMIENTO Y VERIFICACIÓN
1. Crea los archivos requeridos en apps/api/src/common/.
2. Comprueba la sintaxis de los archivos creados sin colgar procesos en loop.
3. DETENTE inmediatamente tras generar el reporte.

5. REPORTE FINAL
Emite ÚNICAMENTE este formato y DETENTE:

COMMON COMPONENTS IMPLEMENTADOS
- Archivos creados: [lista con rutas relativas]
- Componentes previos respetados: [lista]
- Verificación técnica: [resultado de sintaxis]
- Bloqueos: NINGUNO