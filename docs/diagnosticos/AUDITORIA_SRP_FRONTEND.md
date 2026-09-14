# AUDITORÍA GLOBAL DE CUMPLIMIENTO SRP Y LÍMITES EN FRONTEND (`apps/web`)

**Fecha de ejecución:** 2026-09-13  
**Alcance:** Árbol de código fuente de `apps/web/src`  
**Reglas auditadas:**
- **Regla 6 (Arquitectura Modular y SRP en Vistas):** `page.jsx` < 120 líneas.
- **Regla 6.1 (Principio de Responsabilidad Única):** Componentes delimitados por función única.
- **Regla 6.2 (Límite por Componente):** Componentes `.jsx` < 150 líneas.
- **Regla 8.1 (Veto a Estilos en Línea `style={{ ... }}`):** Migración estricta a CSS Modules (`.module.css`).

---

## 1. Archivos `page.jsx` que Superan las 120 Líneas (Regla 6)

Un total de **10 archivos `page.jsx`** exceden el límite de 120 líneas estipulado en la Regla 6 de `AGENTS.md`.

| # | Archivo | Líneas | Estado / Observación |
| :-: | :--- | :---: | :--- |
| 1 | `apps/web/src/app/dashboard/page.jsx` | **974** | Infractor crítico: concentra orquestación, websockets/polling, SCADA y múltiples paneles interactivos. |
| 2 | `apps/web/src/app/operations/purchases/page.jsx` | **501** | Infractor alto: mezcla filtros, tabla, balance contable y modales de compras. |
| 3 | `apps/web/src/app/commercial/payments/page.jsx` | **336** | Infractor medio: concentra lógica de conciliación, formulario y tabla de cobros. |
| 4 | `apps/web/src/app/commercial/clients/page.jsx` | **319** | Infractor medio: contiene tabla, formulario de creación y detalle en el mismo orquestador. |
| 5 | `apps/web/src/app/operations/inventory/page.jsx` | **317** | Infractor medio: tabla de existencias, filtros y lógica de ajuste en un solo archivo. |
| 6 | `apps/web/src/app/commercial/expenses/page.jsx` | **317** | Infractor medio: tabla de egresos operativos y formulario acoplado. |
| 7 | `apps/web/src/app/operations/production/page.jsx` | **304** | Infractor medio: concentra listado de lotes y controles de transición de estados. |
| 8 | `apps/web/src/app/catalog/recipes/page.jsx` | **198** | Infractor moderado: tabla de fórmulas y modales de creación/resumen. |
| 9 | `apps/web/src/app/catalog/products/page.jsx` | **163** | Infractor leve: tabla de catálogo y orquestación de modal de productos. |
| 10 | `apps/web/src/app/catalog/supplier-prices/page.jsx` | **123** | Infractor marginal: 3 líneas por encima del umbral máximo de 120. |

---

## 2. Componentes `.jsx` (Excluyendo `page.jsx`) que Superan las 150 Líneas (Regla 6.2)

Un total de **17 componentes `.jsx`** en `apps/web/src` exceden las 150 líneas de código:

| # | Componente / Submódulo | Líneas | Tipo / Rol |
| :-: | :--- | :---: | :--- |
| 1 | `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` | **1004** | Formulario monolítico de registro de órdenes de compra. |
| 2 | `apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx` | **395** | Fila de checklist de inspección de compras. |
| 3 | `apps/web/src/components/shell/Header.jsx` | **361** | Barra superior global (notificaciones, atajos y perfil). |
| 4 | `apps/web/src/components/catalog/SupplyModal.jsx` | **354** | Modal de insumos (ubicado en `components/catalog/`). |
| 5 | `apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.jsx` | **328** | Hook de lógica/renderizado de cotización y carrito. |
| 6 | `apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx` | **304** | Fase de checklist de recepción de materia prima. |
| 7 | `apps/web/src/components/catalog/SupplierModal.jsx` | **299** | Modal de proveedores (ubicado en `components/catalog/`). |
| 8 | `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` | **293** | Tabla comparativa de listas de precios de proveedores. |
| 9 | `apps/web/src/app/catalog/recipes/components/modal-parts/StageCardItem.jsx` | **273** | Tarjeta de etapa de producción en modal de recetas. |
| 10 | `apps/web/src/components/shell/OnboardingWizardWidget.jsx` | **266** | Asistente flotante de onboarding paso a paso. |
| 11 | `apps/web/src/context/CartContext.jsx` | **256** | Contexto y provider de carrito de compras. |
| 12 | `apps/web/src/app/operations/production/components/modal-parts/ProductionCreateForm.jsx` | **246** | Subformulario de apertura de orden de producción. |
| 13 | `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx` | **183** | Tabla y formulario de dosificación de insumos BOM. |
| 14 | `apps/web/src/app/dashboard/components/SimulationDrawer.jsx` | **180** | Drawer lateral de simulación predictiva de demanda. |
| 15 | `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsDispatchSection.jsx` | **177** | Sección de adición y tabla de despacho en ventas. |
| 16 | `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeStagesList.jsx` | **168** | Lista y orquestador de etapas en modal de recetas. |
| 17 | `apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx` | **166** | Visualizador Canvas SCADA tipo radar. |

*(Nota: Todos los archivos orquestadores `*Modal.jsx` de `apps/web/src/app` cumplen estrictamente la Regla 6.2 con menos de 150 líneas).*

---

## 3. Ocurrencias de Estilos en Línea `style={{ ... }}` (Regla 8.1)

Se detectaron **533 ocurrencias totales** de `style={{` distribuidas en **37 archivos** `.jsx`:

| # | Archivo | Ocurrencias | Ámbito |
| :-: | :--- | :---: | :--- |
| 1 | `apps/web/src/app/dashboard/page.jsx` | **83** | Vistas / Dashboards |
| 2 | `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` | **75** | Operaciones / Compras |
| 3 | `apps/web/src/app/operations/purchases/page.jsx` | **64** | Operaciones / Compras |
| 4 | `apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx` | **54** | Operaciones / Compras |
| 5 | `apps/web/src/components/shell/Header.jsx` | **32** | Shell / UI Global |
| 6 | `apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx` | **29** | Operaciones / Compras |
| 7 | `apps/web/src/app/operations/inventory/page.jsx` | **19** | Operaciones / Inventario |
| 8 | `apps/web/src/components/catalog/SupplierModal.jsx` | **16** | Catálogo / Modales |
| 9 | `apps/web/src/components/catalog/SupplyModal.jsx` | **16** | Catálogo / Modales |
| 10 | `apps/web/src/app/operations/production/page.jsx` | **14** | Operaciones / Producción |
| 11 | `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx` | **13** | Catálogo / Recetas |
| 12 | `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` | **11** | Catálogo / Precios |
| 13 | `apps/web/src/app/commercial/expenses/page.jsx` | **11** | Comercial / Egresos |
| 14 | `apps/web/src/app/commercial/clients/page.jsx` | **10** | Comercial / Clientes |
| 15 | `apps/web/src/app/commercial/payments/page.jsx` | **10** | Comercial / Cobros |
| 16 | `apps/web/src/app/catalog/supplier-prices/hooks/useCartManager.jsx` | **9** | Catálogo / Precios |
| 17 | `apps/web/src/app/dashboard/components/SimulationDrawer.jsx` | **8** | Dashboard / SCADA |
| 18 | `apps/web/src/components/ui/inputs/CurrencySmartInput.jsx` | **7** | Componentes UI / Inputs |
| 19 | `apps/web/src/components/shell/OnboardingWizardWidget.jsx` | **5** | Shell / UI Global |
| 20 | `apps/web/src/app/operations/lots/page.jsx` | **5** | Operaciones / Lotes |
| 21 | `apps/web/src/components/ui/inputs/SmartSelect.jsx` | **5** | Componentes UI / Inputs |
| 22 | `apps/web/src/app/catalog/recipes/page.jsx` | **5** | Catálogo / Recetas |
| 23 | `apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx` | **4** | Dashboard / SCADA |
| 24 | `apps/web/src/app/catalog/products/page.jsx` | **4** | Catálogo / Productos |
| 25 | `apps/web/src/app/dashboard/components/AnalogGauge.jsx` | **3** | Dashboard / SCADA |
| 26 | `apps/web/src/app/operations/purchases/new/components/ChecklistSection.jsx` | **3** | Operaciones / Compras |
| 27 | `apps/web/src/components/ui/inputs/StrictNumberInput.jsx` | **2** | Componentes UI / Inputs |
| 28 | `apps/web/src/app/dashboard/components/OscilloscopeCanvas.jsx` | **2** | Dashboard / SCADA |
| 29 | `apps/web/src/app/dashboard/components/LiquidSilosCanvas.jsx` | **2** | Dashboard / SCADA |
| 30 | `apps/web/src/app/catalog/supplies/components/SuppliesHeader.jsx` | **2** | Catálogo / Insumos |
| 31 | `apps/web/src/app/operations/purchases/new/page.jsx` | **2** | Operaciones / Compras |
| 32 | `apps/web/src/app/catalog/products/components/ProductsTable.jsx` | **2** | Catálogo / Productos |
| 33 | `apps/web/src/app/dashboard/components/SeismographChart.jsx` | **2** | Dashboard / SCADA |
| 34 | `apps/web/src/app/catalog/recipes/components/RecipesHeader.jsx` | **1** | Catálogo / Recetas |
| 35 | `apps/web/src/context/NotificationContext.jsx` | **1** | Contextos |
| 36 | `apps/web/src/components/shell/Sidebar.jsx` | **1** | Shell / Navegación |
| 37 | `apps/web/src/components/ui/SmartModal.jsx` | **1** | Componentes UI / Modal Base |

---

## 4. Conclusiones y Prioridades de Refactorización

1. **Vistas Principales (`page.jsx`):** El módulo `dashboard/page.jsx` (974 líneas) y el submódulo de compras `operations/purchases/` (501 líneas) son los puntos de mayor acoplamiento en la capa visual. Requieren separación en hooks orquestadores y subcomponentes atómicos.
2. **Flujo de Compras (`purchases/new`):** El flujo de creación de compras (`FormPhase.jsx` con 1004 líneas y 75 estilos en línea; `ChecklistPhase.jsx` con 304 líneas) representa la mayor deuda técnica residual en cumplimiento SRP y CSS Modules.
3. **Modales de Catálogo Globales (`SupplyModal.jsx` y `SupplierModal.jsx`):** A diferencia de los modales co-locados en `apps/web/src/app/`, estos dos modales ubicados en `src/components/catalog/` superan las 290 líneas y contienen estilos en línea, requiriendo su modularización bajo el estándar de la Regla 6.2.
