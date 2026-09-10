FASE 27-FIX — CIERRE ESLINT Y BUILD V1
Lee primero:
@[docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md]
Después revisa:
@[docs/implementation/05-prisma-implementation-plan.md]

OBJETIVO
Resolver EXCLUSIVAMENTE el bloqueo actual del build del frontend detectado en la Fase 27:
Cannot find module 'eslint-config-next/core-web-vitals'
El objetivo es conseguir:
pnpm --filter web build → OK

REGLAS
El proyecto utiliza JavaScript.
NO introducir TypeScript.
NO introducir archivos .ts o .tsx.
NO introducir Tailwind.
Mantener CSS Modules.
NO modificar la arquitectura.
NO modificar módulos funcionales.
NO modificar la lógica de negocio.
NO modificar PostgreSQL.
NO modificar Prisma salvo que sea estrictamente necesario para diagnosticar el problema.
NO instalar dependencias automáticamente.
NO modificar el lockfile deliberadamente.
NO realizar una auditoría general del proyecto.

PROCEDIMIENTO
1. Leer apps/web/package.json.
2. Leer apps/web/eslint.config.mjs.
3. Revisar únicamente la configuración relacionada con ESLint y Next.js.
4. Determinar por qué eslint-config-next/core-web-vitals no puede resolverse.
5. Comprobar las dependencias que YA están instaladas.
6. Si puede solucionarse mediante una modificación de configuración existente, realizar únicamente esa modificación.
7. Si falta una dependencia:
   NO instalarla.
   Reportar:
   DEPENDENCIA REQUERIDA
   Nombre:
   Versión:
   Motivo:
   Comando exacto para instalación manual:
8. Ejecutar nuevamente:
   pnpm --filter web build

Si el build falla por otro motivo, diagnosticar únicamente ese error.
No convertir esta tarea en una auditoría completa.

CRITERIO DE ÉXITO
La tarea termina cuando:
ESLint → OK
Build → OK
JavaScript → OK
TypeScript introducido → NO
CSS Modules → OK
Tailwind → NO
Dependencias nuevas → NINGUNA, salvo que se reporte como instalación manual requerida.

CIERRE
Entregar:
FASE 27-FIX — CIERRE
• Estado:
• Causa del problema:
• Solución aplicada:
• ESLint:
• Build:
• JavaScript:
• TypeScript introducido:
• CSS Modules:
• Tailwind:
• Dependencias nuevas:
• Instalación manual requerida:
• Archivos modificados:
• Archivos creados:
• Archivos eliminados:
• Cambios fuera de alcance:
• Bloqueos:
• Estado final del Frontend:
• Siguiente paso: