TAREA CONTROLADA — VINCULACIÓN DE BOTÓN NUEVA COMPRA A PÁGINA DEDICADA

OBJETIVO
Actualizar la vista de Compras (`apps/web/src/app/operations/purchases/page.jsx`):
1. El botón principal "Nueva Compra" debe redirigir mediante navegación (`useRouter` o `<Link>`) a `/operations/purchases/new`.
2. Retirar o desactivar el modal superpuesto anterior ("ID Proveedor", "Total", etc.) que quedó obsoleto.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/operations/purchases/page.jsx

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Usar `useRouter` de `next/navigation` o `<Link href="/operations/purchases/new">`.

VALIDACIÓN
- Ejecutar `pnpm --filter web build` y comprobar código 0.

FORMATO DE CIERRE
Entregar el reporte estándar confirmando la redirección limpia del botón a `/operations/purchases/new`.