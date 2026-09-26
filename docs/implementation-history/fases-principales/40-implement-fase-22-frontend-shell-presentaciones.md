TAREA CONTROLADA — FASE 22: INICIO DEL FRONTEND V1 (ARQUITECTURA, SHELL Y MÓDULO PRESENTATIONS)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO listar directorios completos o usar búsquedas recursivas (`Select-String`, `findstr`, `grep`).
- Inspecciona EXCLUSIVAMENTE los archivos indispensables listados en la sección 1.
- Comandos CLI permitidos:
  * `pnpm --filter web dev` o validación de build: `pnpm --filter web build` (si existe script)
  * `pnpm --filter web test` (si existen pruebas frontend)
  NUNCA usar `npx` ni herramientas interactivas.
- PROHIBIDO tocar código o modificar archivos dentro de `apps/api/`. El backend es de solo lectura.

OBJETIVO
Construir la infraestructura base del Frontend (Next.js / Tailwind / App Router), el shell visual de navegación y la implementación funcional de extremo a extremo del primer módulo: Presentations (consumiendo la API real en JavaScript sobre PostgreSQL).

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/web/package.json` (o `package.json` raíz si el frontend está allí)
- `apps/api/src/presentations/presentations.controller.js` (contrato de rutas y DTOs)
- `apps/api/src/presentations/dto/create-presentation.dto.js`
- `apps/web/src/app/layout.tsx` (o equivalente existente para verificar App Router)

2. ALCANCE DIRECTO A IMPLEMENTAR
- Infraestructura y Cliente API (`apps/web/src/lib/`):
  * Crear cliente API centralizado (`apiClient` o `fetcher`) que consuma `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3000/api/v1`).
  * Normalizador de errores para capturar los formatos estándar emitidos por el `GlobalExceptionFilter` del backend.
- Shell de Navegación (`apps/web/src/components/` o `layout`):
  * Layout principal con Sidebar/Header y contenedor de vistas.
  * Menú agrupado por dominios: Catálogos, Abastecimiento, Inventario, Producción, Comercial, Finanzas.
  * Rutas pendientes con placeholders controlados sin romper la navegación.
- Módulo Funcional Presentations (`apps/web/src/app/catalog/presentations/` o ruta equivalente):
  * Tipos frontend en TypeScript (`apps/web/src/types/presentation.ts`) derivados del contrato real de la API.
  * Tabla/Listado con acciones de consulta, creación y edición.
  * Formulario con validación de entradas respetando los campos: `nombre`, `cantidadOz`, `cantidadMl`, `tipoEnvase`, `activo`, `observaciones`.
  * Estados de UI unificados: Loading, Error y Empty.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- PROHIBIDO modificar el backend (`apps/api/`).
- PROHIBIDO implementar pantallas completas o formularios de otros módulos en esta fase (Insumos, Proveedores, Ventas, etc.).
- PROHIBIDO inventar autenticación, login o guards si no están implementados en el backend.
- PROHIBIDO utilizar mocks: las llamadas de Presentations deben ejecutarse contra la API NestJS física.

4. PRUEBAS, VERIFICACIÓN TÉCNICA Y CIERRE
- Verificar compilación y renderizado del frontend:
    pnpm --filter web build (o test si está configurado; registrar NO CONFIGURADO si aplica)
- Verificar integración real de creación y consulta contra el backend en PostgreSQL.
- Actualizar `docs/implementation/05-prisma-implementation-plan.md` o el documento de estado frontend.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 22 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• Frontend base: OK
• Shell: OK
• Navegación: OK
• API Client: OK
• Variables de entorno (NEXT_PUBLIC_API_URL): OK
• Manejo de errores: OK
• Tipos TypeScript: OK
• Componentes base: OK
• Presentations: OK
• Crear: OK
• Consultar: OK
• Editar: OK
• Validaciones: OK
• Integración API → PostgreSQL: OK
• Pruebas: [OK / NO CONFIGURADAS]
• Build: [OK / NO CONFIGURADO]
• Lint: [OK / NO CONFIGURADO]
• Autoauditoría: OK
• Decisiones documentales: NINGUNA / [detalle]
• Documentos modificados: [lista]
• Archivos creados: [lista resumida]
• Archivos modificados: [lista resumida]
• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Siguiente fase: Bloque Maestros Frontend (Supplies, Suppliers, Supplier Prices, Products, Recipes)

DETENTE inmediatamente tras el reporte.