TAREA CONTROLADA — CONFIGURACIÓN BASE DE PRISMA Y PERSISTENCIA (FASE 1-3)

OBJETIVO ÚNICO
Implementar la infraestructura técnica base de Prisma según las Secciones 5, 6, 7 y 42 de docs/implementation/05-prisma-implementation-plan.md.
PROHIBIDO crear modelos de negocio en schema.prisma, entidades, tablas, migraciones de negocio o repositorios.

1. REGLA ESTRICTA DE LECTURA (NIVEL 1 - AHORRO DE CUOTA)
- Consulta ÚNICAMENTE:
  1. docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md (conducta operativa).
  2. docs/implementation/05-prisma-implementation-plan.md (secciones 5, 6, 7, 42 y 57).
  3. apps/api/src/app.module.js (para registrar DatabaseModule).
- PROHIBIDO leer docs/domains/, docs/data-model/, node_modules/ o archivos fuera de persistencia base.
- Inferencia directa/mínima: sin explicaciones teóricas ni rediseños.

2. ALCANCE DE IMPLEMENTACIÓN (EXCLUSIVAMENTE INFRAESTRUCTURA BASE)
1. Prisma Schema Base: Crear/verificar apps/api/prisma/schema.prisma conteniendo únicamente:
   - datasource db (postgresql, env("DATABASE_URL"))
   - generator client (prisma-client-js)
   (SIN modelos de negocio todavía).
2. Prisma Service & Module: Implementar en apps/api/src/database/:
   - prisma.service.js (gestión de conexión y ciclo de vida OnModuleInit / OnModuleDestroy en NestJS).
   - database.module.js (exportando PrismaService).
3. Integración en AppModule: Registrar DatabaseModule en apps/api/src/app.module.js respetando los módulos existentes.

3. REGLAS TÉCNICAS
- Código en JavaScript plano compatible con la configuración actual de Babel.
- NO ejecutar `prisma migrate dev` todavía (no hay modelos que migrar).
- NO instalar dependencias adicionales si ya existen, o reportar únicamente si falta @prisma/client / prisma.

4. PROCEDIMIENTO Y VERIFICACIÓN
1. Crea los archivos base de Prisma y la carpeta database en apps/api/src/database/.
2. Registra el módulo en AppModule.
3. Verifica la sintaxis con `node -c` de los archivos tocados.
4. DETENTE inmediatamente tras generar el reporte.

5. REPORTE FINAL Y DETENCIÓN
Emite ÚNICAMENTE este formato y DETENTE:

INFRAESTRUCTURA PRISMA IMPLEMENTADA
- Archivos creados/modificados: [lista de rutas]
- Modelos agregados a schema.prisma: NINGUNO (postergados a Fase 4)
- Verificación técnica: [resultado sintaxis]
- Bloqueos: [NINGUNO o detalle de dependencias faltantes]