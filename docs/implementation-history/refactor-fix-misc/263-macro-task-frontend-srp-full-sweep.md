TAREA:
Barrido integral de refactorización modular frontend: erradicación de estilos inline y cumplimiento estricto de SRP (<120 líneas en page.jsx y <150 líneas en componentes) en Shell, Páginas Maestras y Flujo de Compras.

OBJETIVO:
Ejecutar en un único ciclo estructurado la modularización de los archivos detectados en AUDITORIA_SRP_FRONTEND.md:
1. Shell: Desacoplar Header.jsx y OnboardingWizardWidget.jsx a componentes atómicos en `src/components/shell/parts/` y CSS Modules.
2. Páginas Maestras: Reducir `purchases/page.jsx`, `payments/page.jsx`, `clients/page.jsx`, `inventory/page.jsx`, `expenses/page.jsx` y `production/page.jsx` a orquestadores de menos de 120 líneas delegando lógica a sus hooks co-locados.
3. Flujo de Compras: Modularizar `FormPhase.jsx`, `ChecklistPhase.jsx` y `ChecklistItemRow.jsx` en subcomponentes (< 150 líneas) y mover sus 158 estilos inline a `new-purchase.module.css`.

FUENTES DE VERDAD:
- `docs/diagnosticos/AUDITORIA_SRP_FRONTEND.md`
- `AGENTS.md` (Reglas 6, 6.1, 6.2, 8.1)
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md` (Reglas 0, 7, 10, 28)

REGLA DE CONSULTA Y CUOTA:
Prohibido leer carpetas completas, node_modules o backend (`apps/api/`). Abre y edita exclusivamente los archivos indicados en cada frente. Cero explicaciones teóricas intermedias.

ALCANCE:

LEER Y MODIFICAR:
- Frente 1: `apps/web/src/components/shell/Header.jsx` y `OnboardingWizardWidget.jsx`
- Frente 2: `apps/web/src/app/operations/purchases/page.jsx`, `apps/web/src/app/commercial/payments/page.jsx`, `apps/web/src/app/commercial/clients/page.jsx`, `apps/web/src/app/operations/inventory/page.jsx`, `apps/web/src/app/commercial/expenses/page.jsx`, `apps/web/src/app/operations/production/page.jsx`
- Frente 3: `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx`, `ChecklistPhase.jsx` y `ChecklistItemRow.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.
- `apps/web/src/app/dashboard/page.jsx` (módulo SCADA independiente).

INSTRUCCIONES DE EJECUCIÓN:

FRENTE 1: SHELL Y HEADER (UI COMPARTIDA)
1. En `Header.jsx`:
   - Extraer la campana y panel de alarmas SCADA a `parts/HeaderScadaBadge.jsx`.
   - Extraer el atajo de carrito y perfil a `parts/HeaderProfileWidget.jsx`.
   - Mover el 100% de los estilos inline hacia `header.module.css`.
   - Reducir `Header.jsx` a < 120 líneas.
2. En `OnboardingWizardWidget.jsx`:
   - Extraer cada fila de paso a `parts/OnboardingStepItem.jsx`.
   - Mover estilos inline a `onboarding-widget.module.css`.
   - Reducir `OnboardingWizardWidget.jsx` a < 150 líneas.

FRENTE 2: PÁGINAS MAESTRAS (ORQUESTADORES < 120 LÍNEAS)
Para cada una de las 6 páginas maestras (`purchases`, `payments`, `clients`, `inventory`, `expenses`, `production`):
1. Extraer la carga de datos (`fetch`), estados de filtros y handlers a un hook co-locado `hooks/use[Nombre]PageData.js`.
2. Delegar la barra superior de acciones a su componente de cabecera y la grilla/tabla a su respectivo componente co-locado.
3. Eliminar cualquier `style={{}}` presente en la vista trasladándolo al archivo `.module.css` del módulo.
4. Garantizar que cada `page.jsx` quede con menos de 120 líneas puramente declarativas.

FRENTE 3: FLUJO DE COMPRAS (COMPUESTOS MONOLÍTICOS)
1. En `FormPhase.jsx` (1.004 líneas):
   - Extraer la tabla de insumos adicionales a `parts/PurchaseItemsTable.jsx`.
   - Extraer la barra de totales y liquidación financiera a `parts/PurchaseFinancialSummary.jsx`.
   - Mover sus 75 estilos inline a `new-purchase.module.css`.
   - Dejar `FormPhase.jsx` en < 150 líneas.
2. En `ChecklistPhase.jsx` y `ChecklistItemRow.jsx`:
   - Mover los estilos inline a `checklist.module.css`.
   - Reducir cada archivo a < 150 líneas respetando los botones de Conseguido, No Conseguido y motivos.

VERIFICACIÓN FINAL Y LINTER:
1. Comprobar que ningún `page.jsx` de los intervenidos supere las 120 líneas:
   Get-ChildItem -Path "apps/web/src/app" -Filter "page.jsx" -Recurse | ForEach-Object { [PSCustomObject]@{ File = $_.FullName; Lines = (Get-Content $_.FullName | Measure-Object -Line).Lines } } | Where-Object { $_.Lines -gt 120 }
2. Comprobar reducción drástica de estilos inline en los directorios modificados:
   git grep -c "style={{" -- "apps/web/src/components/shell" "apps/web/src/app/operations/purchases"
3. Validar sintaxis estática:
   node --check apps/web/src/components/shell/Header.jsx
   node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
4. Ejecutar linter:
   pnpm --filter web exec next lint --file src/components/shell/Header.jsx

CRITERIO DE FINALIZACIÓN:
- Header y Onboarding quedan desacoplados bajo 120 y 150 líneas respectivamente.
- Las 6 páginas maestras quedan convertidas en orquestadores < 120 líneas.
- FormPhase queda modularizado bajo 150 líneas y sin estilos inline.
- Cero regresiones en la lógica funcional ni llamadas a la API.
- Linter y verificación sintáctica finalizan con código 0.

DETENCIÓN:
Al terminar las verificaciones, DETENTE.

SALIDA:
Entrega exclusivamente:
- Inventario de archivos intervenidos y líneas finales de cada uno:
- Subcomponentes creados en parts/:
- Resultado de comprobación de estilos inline restantes:
- Estado: