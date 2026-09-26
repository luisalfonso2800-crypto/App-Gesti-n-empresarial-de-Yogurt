# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F1: MAPA ACTUALIZADO DEL FRONTEND

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src/app`) — 17 páginas activas, 227 componentes y hooks.  
> **Estado:** ✅ FASE F1 COMPLETADA

---

## 1. Inventario y Mapa Integral de Rutas del Frontend

El frontend cuenta con 17 páginas activas distribuidas en 3 dominios funcionales: Catálogos, Comercial y Operaciones, además del Dashboard central:

| Dominio | Ruta Next.js | Archivo `page.jsx` | Líneas Reales | Estado SRP (< 120 lín) | Observaciones de Arquitectura |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Inicio** | `/` | `apps/web/src/app/page.jsx` | 5 | ✅ Conforme | Redirección inmediata a `/dashboard`. |
| **Dashboard** | `/dashboard` | `apps/web/src/app/dashboard/page.jsx` | 146 | ⚠️ Observación | Excepción tolerada por orquestación SCADA; delega a `DashboardOperationalView`. |
| **Catálogo** | `/catalog/presentations` | `apps/web/src/app/catalog/presentations/page.jsx` | 104 | ✅ Conforme | Desacoplado con hook `usePresentationsPageData`. |
| **Catálogo** | `/catalog/products` | `apps/web/src/app/catalog/products/page.jsx` | 118 | ✅ Conforme | Modularizado con `ProductModal`, `ProductsTable`. |
| **Catálogo** | `/catalog/recipes` | `apps/web/src/app/catalog/recipes/page.jsx` | 114 | ✅ Conforme | Delega a `RecipeModal` y `RecipeStageEditor`. |
| **Catálogo** | `/catalog/supplier-prices` | `apps/web/src/app/catalog/supplier-prices/page.jsx` | 118 | ✅ Conforme | Gestión de cotizaciones y presentaciones de compra. |
| **Catálogo** | `/catalog/suppliers` | `apps/web/src/app/catalog/suppliers/page.jsx` | 36 | ✅ Conforme | Extremadamente conciso y declarativo. |
| **Catálogo** | `/catalog/supplies` | `apps/web/src/app/catalog/supplies/page.jsx` | 109 | ✅ Conforme | Catálogo canónico de insumos y empaques. |
| **Comercial** | `/commercial/clients` | `apps/web/src/app/commercial/clients/page.jsx` | 98 | ✅ Conforme | Directorio de clientes y días de crédito. |
| **Comercial** | `/commercial/expenses` | `apps/web/src/app/commercial/expenses/page.jsx` | 101 | ✅ Conforme | Registro de egresos y contrapartida contable. |
| **Comercial** | `/commercial/goals` | `apps/web/src/app/commercial/goals/page.jsx` | 143 | ❌ Excedido (143/120) | Módulo "Rumbo MANNÁ" requiere extracción de handlers a hook. |
| **Comercial** | `/commercial/payments` | `apps/web/src/app/commercial/payments/page.jsx` | 102 | ✅ Conforme | Abonos, cartera y conciliación de saldos. |
| **Comercial** | `/commercial/sales` | `apps/web/src/app/commercial/sales/page.jsx` | 118 | ✅ Conforme | Formulario de venta con recálculo backend-first. |
| **Operaciones** | `/operations/inventory` | `apps/web/src/app/operations/inventory/page.jsx` | 118 | ✅ Conforme | Kardex, valoración de bodega y ajustes de stock. |
| **Operaciones** | `/operations/lots` | `apps/web/src/app/operations/lots/page.jsx` | 116 | ✅ Conforme | Trazabilidad por lote (materias primas, WIP, terminados). |
| **Operaciones** | `/operations/production` | `apps/web/src/app/operations/production/page.jsx` | 119 | ✅ Conforme | Launchpad, órdenes de producción y liquidación. |
| **Operaciones** | `/operations/purchases` | `apps/web/src/app/operations/purchases/page.jsx` | 103 | ✅ Conforme | Historial de compras y órdenes activas. |
| **Operaciones** | `/operations/purchases/new` | `apps/web/src/app/operations/purchases/new/page.jsx` | 85 | ✅ Conforme | Flujo guiado en 2 fases (`Checklist` y `FormPhase`). |

---

## 2. Auditoría Estática SRP y CSS Modules (`verify-srp.js`)

Se ejecutó la auditoría estática automatizada sobre los 227 archivos del frontend:
```bash
node .agents/scripts/verify-srp.js
```

### Hallazgos Críticos de SRP y Veto Anti-Inline-Styles (22 Infracciones):

#### A. Componentes Sobredimensionados (> 150 líneas):
1. `apps/web/src/app/operations/production/components/modal-parts/ProductionCreateForm.jsx` (**262 líneas** — Límite: 150)
2. `apps/web/src/app/catalog/recipes/components/modal-parts/StageCardItem.jsx` (**287 líneas** — Límite: 150)
3. `apps/web/src/app/dashboard/components/SimulationDrawer.jsx` (**196 líneas** — Límite: 150)
4. `apps/web/src/app/commercial/goals/components/GoalFormModal.jsx` (**187 líneas** — Límite: 150)
5. `apps/web/src/app/dashboard/components/RadarSweepCanvas.jsx` (**182 líneas** — Límite: 150)
6. `apps/web/src/components/common/tools/ToolConverterTab.jsx` (**182 líneas** — Límite: 150)

#### B. Páginas Sobredimensionadas (> 120 líneas):
1. `apps/web/src/app/commercial/goals/page.jsx` (**143 líneas** — Límite: 120)
2. *(Nota: `dashboard/page.jsx` con 146 líneas cuenta con tolerancia por orquestación Canvas/SCADA).*

#### C. Infracciones de Estilos en Línea Prohibidos (`style={{ ... }}`):
15 archivos vulneran el principio del Design System MANNÁ:
- `RecipeOperationalSummaryModal.jsx`
- `SummaryStagesNarrativeList.jsx`
- `RecipesHeader.jsx`
- `SuppliesHeader.jsx`
- `GoalCard.jsx`
- `AnalogGauge.jsx`
- `LiquidSilosCanvas.jsx`
- `OscilloscopeCanvas.jsx`
- `RadarSweepCanvas.jsx`
- `SeismographChart.jsx`
- `SimulationDrawer.jsx`
- `CurrencySmartInput.jsx`
- `SmartSelect.jsx`
- `StrictNumberInput.jsx`
- `NotificationContext.jsx`

---

## 3. Conclusiones y Diagnóstico de la Fase F1

1. **Estructura Modular Mayoritariamente Sana:** 15 de 17 páginas cumplen rigurosamente con `< 120 líneas` mediante delegación a custom hooks (`useSaleForm`, `useProductionPageData`, `useExpensesPageData`).
2. **Puntos Críticos a Intervenir en Remediación Frontend:**
   - Modularizar `ProductionCreateForm.jsx` (262 lín) dividiéndolo en selectores de receta y visualizador de BOM.
   - Extraer la lógica de `apps/web/src/app/commercial/goals/page.jsx` a `useGoalsPageData.js` para retornar a < 120 líneas.
   - Refactorizar los 15 archivos con `style={{ ... }}` hacia clases CSS Modules correspondientes para cumplir la regla `verify:srp` en verde.
