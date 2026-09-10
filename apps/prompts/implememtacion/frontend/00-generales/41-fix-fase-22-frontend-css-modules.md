TAREA CONTROLADA — FASE 22 (REINTENTO): INFRAESTRUCTURA FRONTEND CON CSS MODULES Y MÓDULO PRESENTATIONS

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO ejecutar `create-next-app`, instaladores interactivos o asistentes CLI.
- PROHIBIDO usar subshells lentas o comandos de búsqueda recursiva (`findstr`, `Select-String`, `grep`).
- PROHIBIDO instalar o usar Tailwind CSS. El estilizado es EXCLUSIVAMENTE CSS Modules (`*.module.css`) y CSS nativo.
- PROHIBIDO tocar o modificar archivos dentro de `apps/api/`. El backend es de solo lectura.
- Comandos CLI permitidos:
  * `pnpm install`
  * `pnpm --filter web build` (o `pnpm --filter web dev` para validación puntual)
  * `pnpm --filter web test` (si aplica)
  NUNCA usar `npx`.

OBJETIVO
Crear de forma directa y determinista la estructura de `apps/web/` con Next.js (App Router), TypeScript y CSS Modules; configurar el shell de navegación con componentes reutilizables, y dejar operativo el módulo funcional Presentations consumiendo la API NestJS física sobre PostgreSQL.

1. CONFIGURACIÓN DIRECTA DE DEPENDENCIAS (SIN ASISTENTES)
Si `apps/web/package.json` no existe, crearlo directamente con:
- Dependencias: `next`, `react`, `react-dom`
- Dependencias de desarrollo: `typescript`, `@types/react`, `@types/node`, `@types/react-dom`
- Scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`
Ejecutar inmediatamente:
  pnpm install

2. INFRAESTRUCTURA Y COMPONENTES REUTILIZABLES (CSS MODULES)
Implementar una capa de UI modularizada en `apps/web/src/components/ui/` para evitar duplicar código en las siguientes fases:
- Componentes Base:
  * `Button` (`button.module.css`): variantes primary, secondary, danger.
  * `Input` (`input.module.css`): soporte para labels, estados de error y disabled.
  * `Table` (`table.module.css`): contenedor con estilos de filas, cabeceras y hover.
  * `Badge` (`badge.module.css`): indicador visual de estado (Activo / Inactivo).
  * `Modal` (`modal.module.css`): contenedor de diálogo accesible para formularios.
- Componentes de Estado Transversal:
  * `LoadingState`, `EmptyState`, `ErrorState` (`states.module.css`).
- Shell de Aplicación (`apps/web/src/components/shell/`):
  * `Sidebar` y `Header` (`shell.module.css`) con navegación agrupada (Catálogos, Abastecimiento, Inventario, Producción, Comercial, Finanzas). Rutas pendientes con placeholders claros.

3. CLIENTE API Y CONTRATO TIPADO
- Crear cliente HTTP centralizado en `apps/web/src/lib/api-client.ts` que consuma `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'`.
- Normalizar errores HTTP para capturar el formato del `GlobalExceptionFilter` del backend.
- Definir tipos en `apps/web/src/types/presentation.ts` basados en `apps/api/src/presentations/`:
  `id`, `nombre`, `cantidadOz`, `cantidadMl`, `tipoEnvase`, `activo`, `observaciones`.

4. MÓDULO FUNCIONAL PRESENTATIONS
- Ubicación: `apps/web/src/app/catalog/presentations/page.tsx` (o ruta equivalente con `presentations.module.css`).
- Listado: Tabla con datos reales desde la API.
- Creación y Edición: Formulario modal o embebido reutilizando los componentes `Input`, `Button` y validación de tipos requeridos.
- Acciones: Cambiar estado (Activo/Inactivo) o editar valores numéricos.
- PROHIBIDO usar mocks: verificar la conexión física contra el backend.

5. VERIFICACIÓN Y CIERRE
- Validar compilación TypeScript y bundling de Next.js:
    pnpm --filter web build
- Verificar integración real de creación y consulta contra PostgreSQL.
- Actualizar el estado de la Fase 22 en `docs/implementation/05-prisma-implementation-plan.md`.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 22 — CIERRE

• Estado: [COMPLETADA / BLOQUEADA]
• Frontend base (Next.js + TypeScript): OK
• Estilos: CSS MODULES (Cero Tailwind)
• Componentes reutilizables (Button/Input/Table/States): OK
• Shell y Navegación: OK
• API Client: OK
• Presentations (Listado / Crear / Editar): OK
• Integración API → PostgreSQL: OK
• Build (pnpm --filter web build): OK
• Decisiones documentales: Adopción de CSS Modules nativo y componentes base
• Documentos modificados: [lista]
• Archivos creados: [lista resumida de componentes y vistas]
• Archivos modificados: [lista]
• Bloqueos: NINGUNO
• Siguiente fase: Bloque Maestros Frontend (Supplies, Suppliers, Supplier Prices, Products, Recipes)

DETENTE inmediatamente tras el reporte.