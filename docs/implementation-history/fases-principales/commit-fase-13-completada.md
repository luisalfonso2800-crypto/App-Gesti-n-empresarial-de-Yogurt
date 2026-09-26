feat(fase-13): consolidar suite e2e, ui launchpad produccion y normalizacion de unidades

- Cambios tecnicos de la fase:
  * Implementacion de suite de pruebas E2E automatizada con Playwright (`apps/web/playwright.config.js`, `apps/web/e2e/value-chain-complete.spec.js`, `apps/web/e2e/all-modules-exhaustive.spec.js`).
  * Rediseño y optimizacion de "Productos Formulados Listos para Producir" en produccion (`ProductionProductLaunchpad.jsx`, `ProductionProductLaunchpadCard.jsx`, `production-launchpad.module.css`): cuadrícula responsiva, paginación de a 5 elementos (carrusel), buscador en tiempo real y tarjetas verticales con imagen a 120px.
  * Creación del conversor canónico de unidades `UnitConverter` (`apps/api/src/common/utils/unit-converter.js`).
  * Normalización de requerimientos de insumos en BOM de manufactura en `apps/api/src/production/production.repository.js`.
  * Corrección de la valorización distorsionada de bodega en `apps/api/src/inventory/inventory.service.js` (eliminando inflación de orden de magnitud g vs kg).
  * Verificación estricta de límites de líneas y arquitectura modular: `verify-srp.js` con 0 infracciones.
  * Compilación limpia en Next.js (`pnpm --filter web build`) y NestJS/Prisma (`pnpm --filter api build`).

- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * Prompts de QA y testing: `apps/prompts/implememtacion/frontend/13-qa/517-setup-full-value-chain-e2e.md`, `518-e2e-chaos-and-workflow-chain.md`, `519-e2e-exhaustive-menu-modals-chain.md`.
  * Prompts de UI de producción: `apps/prompts/implememtacion/ui/520-scalable-ready-to-produce-catalog.md`, `521-direct-production-grid-redesign.md`, `522-fix-production-cards-and-grid.md`, `523-launchpad-carousel-pagination.md`.
  * Prompts de auditoría y corrección de unidades: `apps/prompts/implememtacion/frontend/08-produccion/524-audit-inventory-valuation-root-cause.md.md`, `526-audit-recipe-production-inventory-units-chain.md`, `527-implement-canonical-unit-converter.md`, `528-ensure-inventory-service-valuation-fix.md`.
  * Reorganización y consolidación de reportes de auditoría en `docs/audits/` (`AUDIT-INVENTORY-PRODUCTION-UNITS.md`, `AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md` y archivo histórico).

- Alcance:
  * Cierre estricto de fase de UI/UX, testing integral y resolución de deuda técnica en unidades e inventario.
