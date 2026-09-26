feat(prisma): consolidar fase 20 (endurecimiento-seguridad-backend-v1) y cambios de proyecto

- Cambios tecnicos de la fase:
  * Configuracion CORS agregada a apps/api/src/main.js.
  * Filtro global de excepciones (global-exception.filter.js) mejorado para interceptar y manejar errores genericos de Prisma (PrismaClientKnownRequestError) y prevenir fugas de informacion sensible.
  * prisma format y prisma validate ejecutados con exito (Exit code 0).
  * Cero migraciones fisicas aplicadas a base de datos.
- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * Prompts de implementacion: 38-implement-fase-20-endurecimiento.md agregado.
  * docs/implementation/05-prisma-implementation-plan.md actualizado (Item Fase 20 Endurecimiento y Seguridad completado).
- Alcance:
  * Validacion de alcance completada sin elementos de fases posteriores.
