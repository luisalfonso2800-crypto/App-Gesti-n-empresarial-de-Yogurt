TAREA CONTROLADA — SINCRONIZACIÓN GIT INTEGRAL Y CIERRE DE FASE (ESTÁNDAR REUTILIZABLE)

OBJETIVO ÚNICO
Auditar todos los cambios del repositorio, purgar artefactos temporales y de compilación, asegurar que todos los cambios válidos (tanto los generados por la IA como los creados/modificados manualmente por el desarrollador: código fuente, prompts, documentación o esquemas) queden registrados mediante un documento formal de commit en `docs/implementation/commits/`, commitear en la rama actual, fusionar en `main`, sincronizar con GitHub (`origin/main`) y preparar la rama de la siguiente fase.

PARÁMETROS DE ENTRADA (Definidos por contexto o comando de invocación)
- FASE_ACTUAL: [Número de la fase a cerrar, ej: 8]
- NOMBRE_FASE: [Nombre descriptivo, ej: recetas-y-produccion]
- RAMA_ACTUAL: [Rama de la fase que cierra, ej: feat/prisma-fase-8-recetas-produccion]
- FASE_SIGUIENTE: [Número de la siguiente fase, ej: 9]
- NOMBRE_SIGUIENTE: [Nombre descriptivo siguiente, ej: ventas-y-despachos]
- RAMA_SIGUIENTE: [Rama siguiente a crear, ej: feat/prisma-fase-9-ventas-despachos]

REGLAS DE SEGURIDAD Y CONTROL DE TOKENS
- PROHIBIDO modificar el código funcional durante esta tarea de cierre.
- PROHIBIDO commitear o trackear artefactos de compilación, carpetas de dependencias o logs (`.next`, `.turbo`, `dist`, `node_modules`, `*.log`, etc.).
- PROHIBIDO subir variables de entorno con credenciales locales (`.env`, `.env.local`).
- Se deben incluir TODOS los archivos legítimos del proyecto (código funcional, prompts en `apps/prompts/`, esquemas en `prisma/`, documentación en `docs/` y manuales).

PROCEDIMIENTO DE EJECUCIÓN

1. HIGIENE Y PURGA DE ARTEFACTOS TEMPORALES:
   Ejecutar limpieza de carpetas de caché/build que no deben ser rastreadas:
     Remove-Item -Recurse -Force apps/web/.next -ErrorAction SilentlyContinue
     Remove-Item -Recurse -Force apps/api/dist -ErrorAction SilentlyContinue
     Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue

2. INSPECCIÓN GLOBAL DE CAMBIOS:
   Ejecutar `git status --porcelain` para inventariar exclusivamente archivos válidos:
   - Archivos de código modificados por la fase técnica.
   - Archivos de configuración y esquemas actualizados (`schema.prisma`, `package.json`, etc.).
   - Prompts nuevos o editados en `apps/prompts/`.
   - Documentación y manuales en `docs/` o raíz.

3. CREACIÓN DEL ARCHIVO FORMAL DE COMMIT:
   Crear el archivo `docs/implementation/commits/commit-fase-[FASE_ACTUAL]-completada.md` con la siguiente estructura:

   feat(fase-[FASE_ACTUAL]): consolidar [NOMBRE_FASE] y documentacion de proyecto

   - Cambios tecnicos de la fase:
     * [Listar componentes, servicios, endpoints o esquemas implementados y validados].
     * Verificaciones de consistencia ejecutadas con exito (lint/format/validate).
   - Documentacion, prompts y ajustes incorporados por el desarrollador:
     * [Listar explicitamente los prompts creados/modificados en apps/prompts/].
     * [Listar manuales, planes o documentos actualizados en docs/].
     * [Listar cualquier otro archivo legitimo untracked/modificado que pertenezca al proyecto].
   - Alcance:
     * Cierre estricto de fase sin inclusion de elementos fuera de alcance.

4. CONSOLIDACIÓN Y SINCRONIZACIÓN GIT:
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
  * Tecnicos de la fase: [Breve lista de componentes/modelos]
  * Documentos/prompts del desarrollador: [Lista de prompts o docs agregados]
- Higiene: Artefactos temporales (.next, dist, logs) purgados/ignorados
- Commit registrado: EXITOSO (en [RAMA_ACTUAL])
- Merge a main: EXITOSO
- Git push origin main: EXITOSO
- Nueva rama activa: [RAMA_SIGUIENTE]
- Estado: REPOSITORIO LIMPIO Y SINCRONIZADO
- Siguiente paso: Ejecutar /clear en consola antes de iniciar Fase [FASE_SIGUIENTE].

DETENTE inmediatamente tras el reporte.