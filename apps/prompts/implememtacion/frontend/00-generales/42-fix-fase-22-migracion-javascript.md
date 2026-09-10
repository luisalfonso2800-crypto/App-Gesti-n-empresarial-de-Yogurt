TAREA CONTROLADA — FASE 22-FIX: CORRECCIÓN A JAVASCRIPT PURO Y ESTABILIZACIÓN DEL FRONTEND

REGLAS TÉCNICAS ANTI-BLOQUEO Y CONTROL DE DEPENDENCIAS (WINDOWS CLI)
- PROHIBIDO ejecutar `pnpm install`, `pnpm add`, `npm install`, `yarn` o cualquier modificador de paquetes.
- PROHIBIDO borrar, recrear o alterar `pnpm-lock.yaml` o cambiar versiones en `package.json`.
- PROHIBIDO usar subshells interactivas o comandos lentos (`Select-String`, `findstr`, `grep`).
- Comandos CLI permitidos exclusivamente:
  * `pnpm --filter web build` (para verificar bundling JavaScript)
  * `pnpm --filter web test` (si existen pruebas configuradas)
- PROHIBIDO modificar `apps/api/` o el backend.

OBJETIVO
Sanear la Fase 22 eliminando completamente TypeScript del frontend (`apps/web/`) y convirtiendo la implementación a JavaScript nativo (.js, .jsx), preservando la arquitectura modular con CSS Modules, los componentes base reutilizables y la integración real de Presentations contra PostgreSQL.

1. REGLA ESTRICTA DE LENGUAJE (JAVASCRIPT OBLIGATORIO)
- Eliminar o renombrar cualquier archivo `.ts` y `.tsx` en `apps/web/`:
  * `apps/web/src/lib/api-client.ts` -> `api-client.js`
  * `apps/web/src/types/` -> ELIMINAR carpeta o archivos de tipos TypeScript.
  * `apps/web/src/components/**/*.tsx` -> `*.jsx` (o `.js`)
  * `apps/web/src/app/**/*.tsx` -> `*.jsx` (o `.js`)
  * Eliminar `tsconfig.json` si fue generado en `apps/web/`.
- Remover toda sintaxis TypeScript: interfaces, `type`, genéricos `<T>`, `as Type`, anotaciones de tipo (`: string`, etc.).

2. CONSERVACIÓN FUNCIONAL Y CSS MODULES
- Mantener la estructura modular y los estilos CSS Modules (`*.module.css`):
  * Componentes UI reutilizables: `Button`, `Input`, `Table`, `Badge`, `Modal`, `States` (Loading/Error/Empty).
  * Shell: `Sidebar`, `Header` y navegación por dominios.
  * Módulo `Presentations`: Listado, creación, edición y consumo real de la API vía `api-client.js`.
- Cero rastro de Tailwind CSS.

3. VALIDACIÓN TÉCNICA
- Ejecutar compilación para certificar compatibilidad JavaScript:
    pnpm --filter web build
- Verificar que no queden archivos TypeScript en `apps/web/src/`.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 22-FIX — CIERRE

• Estado: [COMPLETADA / BLOQUEADA]
• Lenguaje frontend: JavaScript
• Archivos TypeScript restantes (.ts/.tsx): 0
• tsconfig.json eliminado: [SÍ / NO REQUERIDO]
• CSS Modules: OK
• Componentes UI base (.jsx): OK
• Shell y Navegación (.jsx): OK
• API Client (.js): OK
• Presentations funcional: OK
• Integración API → PostgreSQL: OK
• Build (pnpm --filter web build): OK
• Modificación no autorizada de dependencias/lockfile: NINGUNA
• Archivos eliminados: [lista de archivos .ts/.tsx/tsconfig]
• Archivos creados/renombrados: [lista de archivos .js/.jsx]
• Bloqueos: NINGUNO
• Siguiente fase: Fase 23 — Bloque Maestros Frontend V1

DETENTE inmediatamente tras el reporte.