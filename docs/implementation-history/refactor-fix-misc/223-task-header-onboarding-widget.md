OBJETIVO: Implementar el widget de Onboarding guiado en el Header (`apps/web/src/components/shell/Header.jsx`) y su endpoint de diagnóstico ligero en backend para orientar al operador en la puesta en marcha de la planta según la secuencia cronológica de la cadena de valor.

ALCANCE Y FUENTES DE VERDAD:
- Auditoría: `docs/diagnosticos/AUDITORIA_CADENA_VALOR_Y_DEPENDENCIAS.md` (Sección 3 y 4)
- Backend: `apps/api/src/` (crear módulo/controlador liviano `system` o endpoint en dashboard/app)
- Frontend: `apps/web/src/components/shell/Header.jsx`, nuevo hook `useOnboardingStatus.js` y componente de dropdown
- Reglas: AGENTS.md (Reglas 1, 2, 9.1, 13.1, 31, 38)

INSTRUCCIONES:

1. BACKEND (`apps/api`):
   - Crear endpoint liviano `GET /api/v1/system/onboarding-status` que ejecute un conteo eficiente (`count()`) en Prisma para:
     * `presentations`: Formatos de envase.
     * `supplies`: Insumos dados de alta.
     * `suppliers`: Proveedores registrados.
     * `products`: Productos terminados creados.
     * `recipes`: Recetas formuladas y aprobadas.
     * `suppliesWithStock`: Insumos con `cantidadActual > 0` en `Inventario`.
     * `finishedLotsWithStock`: Lotes con saldo disponible en `Inventario_Productos` o `Lotes`.
     * `sales`: Ventas registradas.
   - Determinar en el payload el `currentStep` (1 al 6) y `isCompleted: boolean`.

2. FRONTEND (`apps/web`):
   - Crear hook `useOnboardingStatus.js` para consultar el endpoint al cargar y permitir revalidación manual.
   - En `apps/web/src/components/shell/Header.jsx`:
     - Incorporar el componente `OnboardingWizardWidget`:
       * Indicador compacto: Píldora interactiva con progreso (ej. `Paso 3/6: Abastecimiento (50%)` con barra de progreso o badge de color sutil). Si `isCompleted === true`, colapsar a un icono discreto de checklist con estado "Planta Operativa".
       * Menú Desplegable (Dropdown Guía):
         1. `[✔/➜] 1. Configurar Formatos y Envases` (`/catalog/presentations`)
         2. `[✔/➜] 2. Registrar Insumos y Proveedores` (`/catalog/supplies`)
         3. `[✔/➜] 3. Ingresar Stock Inicial / Compras` (`/operations/inventory`)
         4. `[✔/➜] 4. Ficha Comercial y Receta Técnica` (`/catalog/recipes`)
         5. `[✔/➜] 5. Fabricar Primer Lote (Producción)` (`/operations/production`)
         6. `[✔/➜] 6. Emitir Primera Venta` (`/commercial/sales`)
       * Resaltar visualmente el paso activo pendiente con botón de enlace directo para navegar a la ruta correspondiente.
       * Permitir al usuario cerrar o colapsar el menú haciendo clic fuera o en un botón de minimizar.

VERIFICACIÓN:
1. `node --check apps/api/src/system/system.controller.js` (o ruta asignada)
2. `pnpm --filter web exec next lint --file src/components/shell/Header.jsx`

SALIDA: Reporte conciso indicando: archivos creados/modificados en API y Web, estructura del payload de estado y validación exitosa de lint/sintaxis. Sin texto de relleno.