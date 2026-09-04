TAREA CONTROLADA — FIX INTEGRAL: REVINCULACIÓN DE SHELL Y LIMPIEZA DE TYPESCRIPT EN FRONTEND

REGLAS DE ARQUITECTURA Y SEGURIDAD (WINDOWS CLI)
- PROHIBIDO desvincular componentes modulares o reemplazar la arquitectura por HTML plano.
- PROHIBIDO eliminar la envoltura de `<Shell>` en el layout.
- PROHIBIDO tocar dependencias en package.json o pnpm-lock.yaml.
- PROHIBIDO modificar el backend (apps/api/).
- Comando de verificación permitido:
  * `pnpm --filter web build`

OBJETIVO
Asegurar que toda la arquitectura modular quede 100% vinculada (Shell en layout y componentes UI en Presentations) y eliminar todos los residuos de sintaxis TypeScript en apps/web/src/ para que el build en JavaScript puro (.js / .jsx) termine exitosamente.

1. REVINCULACIÓN OBLIGATORIA DE ARQUITECTURA
- apps/web/src/app/layout.jsx:
  * DEBE importar y renderizar `<Shell>` envolviendo `{children}`.
- apps/web/src/app/catalog/presentations/page.jsx:
  * DEBE utilizar e importar los componentes modulares de UI (`Button`, `Table`, `Badge`, `Modal`, `States`), NO elementos HTML nativos sueltos sin modularizar.

2. LIMPIEZA EXHAUSTIVA DE TYPESCRIPT
Revisar y retirar cualquier residuo de sintaxis de tipos en:
- apps/web/src/components/ui/ (Button.jsx, Input.jsx, Table.jsx, Badge.jsx, Modal.jsx, States.jsx)
- apps/web/src/components/shell/ (Header.jsx, Sidebar.jsx, Shell.jsx)
- apps/web/src/lib/api-client.js
- apps/web/src/app/ (layout.jsx, page.jsx, catalog/presentations/page.jsx)

Remover:
- Parámetros con tipo: `(param: string)`, `(item?)`, `: void`.
- Declaraciones: `type`, `interface`, `enum`.
- Castings y genéricos: `as string`, `<T>`, `as any`.
- Tipos de React: `React.FC`, `React.ReactNode`, `React.ChangeEvent` (reemplazar por props limpias como `{ children, ...props }`).

3. VALIDACIÓN
Ejecutar:
  pnpm --filter web build

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE:

FIX GLOBAL JAVASCRIPT — CIERRE
• Estado: [COMPLETADA / ERROR]
• Shell revinculado en layout.jsx: OK
• Componentes UI vinculados en Presentations: OK
• Sintaxis TypeScript eliminada en UI y Shell: OK
• Build (pnpm --filter web build): OK
• Bloqueos: NINGUNO