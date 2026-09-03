TAREA CONTROLADA — SINCRONIZACIÓN GIT INTEGRAL Y CIERRE DE FASE (ESTÁNDAR REUTILIZABLE)

OBJETIVO ÚNICO
Auditar todos los cambios del repositorio (tanto los generados por la IA como los creados/modificados manualmente por el desarrollador: prompts, documentación, esquemas o ajustes de configuración), redactar el documento formal de commit en `docs/implementation/commits/`, asegurar que todo quede commiteado en la rama de la fase actual, fusionar en `main`, sincronizar con GitHub (`origin/main`) y crear la rama aislada para la siguiente fase.

PARÁMETROS DE ENTRADA (Definidos por contexto o comando de invocación)
- FASE_ACTUAL: [Número de la fase a cerrar, ej: 8]
- NOMBRE_FASE: [Nombre descriptivo, ej: recetas-y-produccion]
- RAMA_ACTUAL: [Rama de la fase que cierra, ej: feat/prisma-fase-8-recetas-produccion]
- FASE_SIGUIENTE: [Número de la siguiente fase, ej: 9]
- NOMBRE_SIGUIENTE: [Nombre descriptivo siguiente, ej: ventas-y-despachos]
- RAMA_SIGUIENTE: [Rama siguiente a crear, ej: feat/prisma-fase-9-ventas-despachos]

REGLAS DE SEGURIDAD Y CONTROL DE TOKENS
- PROHIBIDO modificar el código fuente funcional de `schema.prisma` o `apps/api/src/` durante esta tarea.
- Usa comandos directos de Git sin pipelines interactivos pesados.
- Se deben incluir TODOS los archivos legítimos del repositorio que se encuentren modificados o como "untracked" (prompts en `apps/prompts/`, documentación en `docs/`, manuales y planes).

PROCEDIMIENTO DE EJECUCIÓN

1. INSPECCIÓN GLOBAL DE CAMBIOS:
   Ejecutar `git status --porcelain` para inventariar:
   - Archivos modificados por la implementación técnica de la fase.
   - Archivos creados/modificados manualmente por el desarrollador (prompts nuevos, actualizaciones a manuales, planes, etc.).
   - Nuevos documentos de seguimiento.

2. CREACIÓN DEL ARCHIVO FORMAL DE COMMIT:
   Crear el archivo `docs/implementation/commits/commit-fase-[FASE_ACTUAL]-completada.md` con la siguiente estructura:

   feat(prisma): consolidar fase [FASE_ACTUAL] ([NOMBRE_FASE]) y cambios de proyecto

   - Cambios tecnicos de la fase:
     * Modelos, relaciones, enums o tipos Prisma implementados/validados.
     * prisma format y prisma validate ejecutados con exito (Exit code 0).
     * Cero migraciones fisicas aplicadas a base de datos.
   - Documentacion, prompts y ajustes incorporados por el desarrollador:
     * [Listar explicitamente los prompts creados/modificados en apps/prompts/].
     * [Listar manuales, planes o documentos actualizados en docs/].
     * [Listar cualquier otro archivo untracked/modificado que pertenezca al proyecto].
   - Alcance:
     * Validacion de alcance completada sin elementos de fases posteriores.

3. CONSOLIDACIÓN Y SINCRONIZACIÓN GIT:
   Ejecutar en orden estricto desde la raíz del proyecto:
     git add .
     git commit -F docs/implementation/commits/commit-fase-[FASE_ACTUAL]-completada.md
     git switch main
     git merge [RAMA_ACTUAL]
     git push origin main
     git switch -c [RAMA_SIGUIENTE]

FORMATO DEL REPORTE FINAL (DETENERSE TRAS EMITIR)
GIT SYNC INTEGRAL FASE [FASE_ACTUAL] — REPORTE
- Archivo de auditoria creado: docs/implementation/commits/commit-fase-[FASE_ACTUAL]-completada.md
- Cambios incluidos:
  * Tecnicos de la fase: [Breve lista]
  * Documentos/prompts del desarrollador: [Lista de prompts o docs agregados]
- Commit registrado: EXITOSO (en [RAMA_ACTUAL])
- Merge a main: EXITOSO
- Git push origin main: EXITOSO
- Nueva rama activa: [RAMA_SIGUIENTE]
- Estado: REPOSITORIO LIMPIO Y SINCRONIZADO
- Siguiente paso: Ejecutar /clear en consola antes de iniciar Fase [FASE_SIGUIENTE].

DETENTE inmediatamente tras el reporte.