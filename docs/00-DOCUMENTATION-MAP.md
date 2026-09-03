# MAPA MAESTRO DE DOCUMENTACIÓN

## 1. PROPÓSITO
Registro estructurado de la documentación del proyecto Yogurt Management System. Diseñado para que futuras IAs ubiquen el contexto requerido rápidamente sin necesidad de escanear o leer el repositorio completo.
- Este archivo es un índice de navegación y estructura, NO una fuente de verdad del contenido.
- No sustituye los documentos originales ni documentacion_consolidada.md.
- No constituye especificación técnica ni decisión arquitectónica.

## 2. FUENTES DE VERDAD
* Fuente estructural: Filesystem actual (working tree).
* Fuente documental/metadatos: documentacion_consolidada.md.
* Fuente operativa: AI_PROJECT_OPERATING_MANUAL.md (conducta del agente).

## 3. ÁRBOL DOCUMENTAL ACTUAL
```text
docs/
├── antigravity/
│   ├── AI_PROJECT_OPERATING_MANUAL.md
│   └── PROMPT_DESIGN_MANUAL.md
├── architecture/
│   ├── architecture-evolution.md
│   ├── dependency-rules.md
│   └── system-architecture.md
├── backend/
│   ├── 00-backend-overview.md
│   ├── 01-module-boundaries.md
│   ├── 02-module-dependencies.md
│   ├── 03-api-design.md
│   ├── 04-persistence-boundaries.md
│   ├── 05-transaction-boundaries.md
│   ├── 06-error-handling.md
│   ├── 07-validation-strategy.md
│   └── 08-backend-decisions.md
├── conventions/
│   ├── code-style.md
│   ├── comments.md
│   ├── naming.md
│   └── testing.md
├── data-model/
│   ├── 00-data-model-overview.md
│   ├── 01-entities.md
│   ├── 02-relationships.md
│   ├── 03-data-integrity-rules.md
│   ├── 04-history-and-traceability.md
│   ├── 05-data-model-decisions.md
│   ├── 06-inventory-flow.md
│   ├── 07-business-processes.md
│   ├── 08-cross-module-rules.md
│   ├── 09-calculation-responsibilities.md
│   ├── 10-technical-implementation-notes.md
│   ├── 11-model-validation.md
│   └── 12-vba-fidelity-validation.md
├── decisions/
│   ├── ADR-001-monorepo.md
│   ├── ADR-002-desktop-client-server.md
│   ├── ADR-003-modular-architecture.md
│   └── ADR-004-architecture-evolution.md
├── domains/
│   ├── 00-business-map.md
│   ├── 01-presentations.md
│   ├── 02-supplies.md
│   ├── 03-suppliers.md
│   ├── 04-products.md
│   ├── 05-recipes.md
│   ├── 06-purchases.md
│   ├── 07-inventory.md
│   ├── 08-production.md
│   ├── 09-lots.md
│   ├── 10-clients.md
│   ├── 11-sales.md
│   ├── 12-payments.md
│   ├── 13-expenses.md
│   ├── 14-costs.md
│   ├── 15-profitability.md
│   ├── 16-dashboard.md
│   ├── auth.md
│   └── users.md
├── implementation/
│   ├── 00-implementation-overview.md
│   ├── 01-backend-bootstrap.md
│   ├── 02-database-implementation-plan.md
│   ├── 03-module-implementation-order.md
│   ├── 04-shared-kernel-and-common-components.md
│   ├── 05-prisma-implementation-plan.md
│   ├── 06-api-implementation-plan.md
│   └── 07-testing-implementation-plan.md
├── project/
│   ├── development-order.md
│   ├── implementation-readiness-review.md
│   ├── module-status.md
│   ├── roadmap.md
│   └── reviews/
│       ├── 01-backend-bootstrap-technical-review.md
│       ├── 02-database-implementation-readiness-review.md
│       └── README.md
└── documentacion_consolidada.md
```

## 4. INVENTARIO COMPACTO

| Documento | Ruta Relativa | Área/Dominio | Propósito (1 línea) | Estado | Relaciones Clave |
| :--- | :--- | :--- | :--- | :--- | :--- |
| AI_PROJECT_OPERATING_MANUAL.md | docs/antigravity | Operaciones IA | Manual operativo de comportamiento | EXISTENTE (No evaluado) | PROMPT_DESIGN_MANUAL.md |
| PROMPT_DESIGN_MANUAL.md | docs/antigravity | Operaciones IA | Guía de diseño de prompts | EXISTENTE (No evaluado) | AI_PROJECT_OPERATING_MANUAL.md |
| architecture-evolution.md | docs/architecture | Arquitectura | Evolución del diseño | EXISTENTE (No evaluado) | system-architecture.md |
| dependency-rules.md | docs/architecture | Arquitectura | Reglas de dependencias | EXISTENTE (No evaluado) | backend/02-module-dependencies.md |
| system-architecture.md | docs/architecture | Arquitectura | Arquitectura general del sistema | EXISTENTE (No evaluado) | NO DETERMINABLE |
| 00-backend-overview.md | docs/backend | Backend | Vista general de la capa backend | EXISTENTE (No evaluado) | implementation/00-implementation-overview.md |
| 01-module-boundaries.md | docs/backend | Backend | Límites de módulos en el backend | EXISTENTE (No evaluado) | 02-module-dependencies.md |
| 02-module-dependencies.md | docs/backend | Backend | Dependencias entre módulos del backend | EXISTENTE (No evaluado) | architecture/dependency-rules.md |
| 03-api-design.md | docs/backend | Backend | Diseño de la API | EXISTENTE (No evaluado) | NO DETERMINABLE |
| 04-persistence-boundaries.md | docs/backend | Backend | Límites de persistencia | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 05-transaction-boundaries.md | docs/backend | Backend | Límites y manejo de transacciones | EXISTENTE (No evaluado) | data-model/03-data-integrity-rules.md |
| 06-error-handling.md | docs/backend | Backend | Manejo de errores en backend | EXISTENTE (No evaluado) | conventions/code-style.md |
| 07-validation-strategy.md | docs/backend | Backend | Estrategia de validación | EXISTENTE (No evaluado) | data-model/11-model-validation.md |
| 08-backend-decisions.md | docs/backend | Backend | Decisiones técnicas del backend | EXISTENTE (No evaluado) | NO DETERMINABLE |
| code-style.md | docs/conventions | Convenciones | Guía de estilo de código | EXISTENTE (No evaluado) | naming.md |
| comments.md | docs/conventions | Convenciones | Convenciones sobre comentarios | EXISTENTE (No evaluado) | code-style.md |
| naming.md | docs/conventions | Convenciones | Reglas de nombrado | EXISTENTE (No evaluado) | code-style.md |
| testing.md | docs/conventions | Convenciones | Estándares de pruebas | EXISTENTE (No evaluado) | implementation/07-testing-implementation-plan.md |
| 00-data-model-overview.md | docs/data-model | Modelo de Datos | Visión global del modelo de datos | EXISTENTE (No evaluado) | domains/00-business-map.md |
| 01-entities.md | docs/data-model | Modelo de Datos | Definición de entidades | EXISTENTE (No evaluado) | NO DETERMINABLE |
| 02-relationships.md | docs/data-model | Modelo de Datos | Relaciones entre entidades | EXISTENTE (No evaluado) | 01-entities.md |
| 03-data-integrity-rules.md | docs/data-model | Modelo de Datos | Reglas de integridad de datos | EXISTENTE (No evaluado) | 11-model-validation.md |
| 04-history-and-traceability.md | docs/data-model | Modelo de Datos | Historial y trazabilidad del modelo | EXISTENTE (No evaluado) | 01-entities.md |
| 05-data-model-decisions.md | docs/data-model | Modelo de Datos | Decisiones del modelo de datos | EXISTENTE (No evaluado) | 00-data-model-overview.md |
| 06-inventory-flow.md | docs/data-model | Modelo de Datos | Flujo de inventario a nivel datos | EXISTENTE (No evaluado) | domains/07-inventory.md |
| 07-business-processes.md | docs/data-model | Modelo de Datos | Procesos de negocio mapeados a datos | EXISTENTE (No evaluado) | domains/00-business-map.md |
| 08-cross-module-rules.md | docs/data-model | Modelo de Datos | Reglas cruzadas entre módulos | EXISTENTE (No evaluado) | backend/01-module-boundaries.md |
| 09-calculation-responsibilities.md | docs/data-model | Modelo de Datos | Responsabilidades de cálculo | EXISTENTE (No evaluado) | 10-technical-implementation-notes.md |
| 10-technical-implementation-notes.md | docs/data-model | Modelo de Datos | Notas de implementación técnica | EXISTENTE (No evaluado) | NO DETERMINABLE |
| 11-model-validation.md | docs/data-model | Modelo de Datos | Validación de los modelos | EXISTENTE (No evaluado) | backend/07-validation-strategy.md |
| 12-vba-fidelity-validation.md | docs/data-model | Modelo de Datos | Validación de fidelidad contra VBA original | EXISTENTE (No evaluado) | NO DETERMINABLE |
| ADR-001-monorepo.md | docs/decisions | Decisiones | Uso de monorepo | Ratificado | architecture/system-architecture.md |
| ADR-002-desktop-client-server.md | docs/decisions | Decisiones | Arquitectura cliente-servidor desktop | Ratificado | architecture/system-architecture.md |
| ADR-003-modular-architecture.md | docs/decisions | Decisiones | Arquitectura modular | Ratificado | architecture/system-architecture.md |
| ADR-004-architecture-evolution.md | docs/decisions | Decisiones | Evolución de arquitectura | Ratificado | architecture/architecture-evolution.md |
| 00-business-map.md | docs/domains | Negocio/Dominios | Mapa de negocio principal | EXISTENTE (No evaluado) | data-model/00-data-model-overview.md |
| 01-presentations.md | docs/domains | Negocio/Dominios | Dominio de presentaciones | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 02-supplies.md | docs/domains | Negocio/Dominios | Dominio de insumos | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 03-suppliers.md | docs/domains | Negocio/Dominios | Dominio de proveedores | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 04-products.md | docs/domains | Negocio/Dominios | Dominio de productos | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 05-recipes.md | docs/domains | Negocio/Dominios | Dominio de recetas | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 06-purchases.md | docs/domains | Negocio/Dominios | Dominio de compras | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 07-inventory.md | docs/domains | Negocio/Dominios | Dominio de inventario | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 08-production.md | docs/domains | Negocio/Dominios | Dominio de producción | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 09-lots.md | docs/domains | Negocio/Dominios | Dominio de lotes | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 10-clients.md | docs/domains | Negocio/Dominios | Dominio de clientes | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 11-sales.md | docs/domains | Negocio/Dominios | Dominio de ventas | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 12-payments.md | docs/domains | Negocio/Dominios | Dominio de pagos | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 13-expenses.md | docs/domains | Negocio/Dominios | Dominio de gastos | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 14-costs.md | docs/domains | Negocio/Dominios | Dominio de costos | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 15-profitability.md | docs/domains | Negocio/Dominios | Dominio de rentabilidad | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 16-dashboard.md | docs/domains | Negocio/Dominios | Dominio de tablero/dashboard | EXISTENTE (No evaluado) | data-model/01-entities.md |
| auth.md | docs/domains | Negocio/Dominios | Dominio de autenticación | EXISTENTE (No evaluado) | data-model/01-entities.md |
| users.md | docs/domains | Negocio/Dominios | Dominio de usuarios | EXISTENTE (No evaluado) | data-model/01-entities.md |
| 00-implementation-overview.md | docs/implementation | Implementación | Visión general de implementación | EXISTENTE (No evaluado) | project/roadmap.md |
| 01-backend-bootstrap.md | docs/implementation | Implementación | Bootstrap del backend | EXISTENTE (No evaluado) | backend/00-backend-overview.md |
| 02-database-implementation-plan.md | docs/implementation | Implementación | Plan de base de datos | EXISTENTE (No evaluado) | data-model/00-data-model-overview.md |
| 03-module-implementation-order.md | docs/implementation | Implementación | Orden de módulos | EXISTENTE (No evaluado) | project/development-order.md |
| 04-shared-kernel-and-common-components.md| docs/implementation | Implementación | Componentes comunes | EXISTENTE (No evaluado) | backend/01-module-boundaries.md |
| 05-prisma-implementation-plan.md | docs/implementation | Implementación | Plan para Prisma | EXISTENTE (No evaluado) | data-model/00-data-model-overview.md |
| 06-api-implementation-plan.md | docs/implementation | Implementación | Plan para la API | EXISTENTE (No evaluado) | backend/03-api-design.md |
| 07-testing-implementation-plan.md | docs/implementation | Implementación | Plan de pruebas | EXISTENTE (No evaluado) | conventions/testing.md |
| development-order.md | docs/project | Proyecto | Orden de desarrollo | EXISTENTE (No evaluado) | implementation/03-module-implementation-order.md |
| implementation-readiness-review.md | docs/project | Proyecto | Revisión de estado de implementación | EXISTENTE (No evaluado) | NO DETERMINABLE |
| module-status.md | docs/project | Proyecto | Estado de módulos | EXISTENTE (No evaluado) | NO DETERMINABLE |
| roadmap.md | docs/project | Proyecto | Hoja de ruta general | EXISTENTE (No evaluado) | NO DETERMINABLE |
| 01-backend-bootstrap-technical-review.md | docs/project/reviews | Proyecto/Revisiones | Revisión de bootstrap backend | EXISTENTE (No evaluado) | implementation/01-backend-bootstrap.md |
| 02-database-implementation-readiness-review.md| docs/project/reviews | Proyecto/Revisiones | Revisión de base de datos | EXISTENTE (No evaluado) | implementation/02-database-implementation-plan.md |
| README.md | docs/project/reviews | Proyecto/Revisiones | Índice de revisiones | EXISTENTE (No evaluado) | NO DETERMINABLE |

## 5. RELACIONES Y ORDEN DE NAVEGACIÓN DOCUMENTAL

Este apartado no define dependencias arquitectónicas, contratos formales ni decisiones de ingeniería del proyecto. Representa únicamente una guía de orientación para la navegación documental.

Orden general de consulta recomendado:
1. `antigravity/` — Reglas operativas para actuar como agente de IA.
2. `domains/` — Contexto funcional y reglas del negocio.
3. `data-model/` — Modelo de datos, entidades y reglas de integridad.
4. `architecture/` — Diseño técnico y evolución arquitectónica.
5. `decisions/` — Decisiones arquitectónicas formalizadas (ADRs).
6. `backend/` — Diseño de módulos, APIs y límites de persistencia.
7. `implementation/` — Planes de trabajo y bootstrap de componentes.
8. `project/` — Estado de módulos, roadmap, orden de desarrollo y revisiones técnicas.

> **Regla de interpretación:** El orden anterior es una guía de navegación temática, NO una cadena obligatoria de ejecución ni una secuencia rígida de pasos para cada tarea. Las dependencias funcionales específicas solo son válidas si están explícitamente respaldadas dentro del texto del documento correspondiente.

## 6. DOCUMENTOS REFERENCIADOS PERO NO LOCALIZADOS
Ninguno.

## 7. DISCREPANCIAS DOCUMENTALES
1. Reorganización de modelo de datos: `docs/domains/data/` fue eliminado del tracking de Git y reemplazado en el working tree por `docs/data-model/` (untracked). La correspondencia semántica exacta entre ambos no ha sido evaluada.
2. Nuevas carpetas documentales untracked: `docs/antigravity/` y `docs/project/reviews/` existen físicamente pero no forman parte del baseline confirmado de Git (commit bb2936b9).
3. Documento consolidado: `docs/documentacion_consolidada.md` existe únicamente como artefacto local untracked.

## 8. REGLAS DE NAVEGACIÓN PARA FUTURAS IAS
* Leer primero este mapa (docs/00-DOCUMENTATION-MAP.md).
* Identificar el área requerida y abrir únicamente los archivos indispensables.
* Usar el documento original para detalles profundos, y documentacion_consolidada.md si se requiere una búsqueda textual específica global de un metadato.
* No realizar lecturas completas ni escaneos globales del repositorio sin justificación absoluta.
* No tratar las descripciones o propósitos de este mapa como especificaciones técnicas definitivas; consultar siempre el archivo original o consolidado.
* Para cualquier decisión, regla de negocio, especificación o dato técnico concreto, el **documento original individual tiene prioridad absoluta** sobre el inventario de este mapa y sobre cualquier resumen derivado de documentacion_consolidada.md.
