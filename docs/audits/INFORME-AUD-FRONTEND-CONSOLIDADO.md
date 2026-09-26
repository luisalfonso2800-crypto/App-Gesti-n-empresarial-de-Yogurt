# INFORME CONSOLIDADO DE AUDITORÍA FORENSE DELTA FRONTEND

> **Fecha:** 2026-09-22  
> **Alcance:** Auditoría transversal del frontend (`apps/web`) tras la remediación integral del backend (39/39 hallazgos resueltos, Bloques 1 a 8B).  
> **Fases Ejecutadas:** F0 a F11 completadas al 100%.

---

## 1. Resumen Ejecutivo y Diagnóstico Global

La auditoría forense delta del frontend examinó 17 páginas activas, 227 componentes, hooks de orquestación, contratos de esquemas Zod y suites E2E Playwright.

El backend se encuentra plenamente blindado con precisión `Decimal.js` y reglas contables canónicas. Sin embargo, la interfaz de usuario presenta brechas de compatibilidad, divergencias aritméticas en previews y deuda arquitectural acumulada:

- **10 Hallazgos previos resueltos** en el backend.
- **6 Hallazgos vigentes** en frontend (SRP, fallbacks en previews, campos omitidos).
- **2 Hallazgos reagravados** (`PRD-04`: nuevas excepciones `BadRequestException` capturadas con `alert()` nativo en UI; y `SRP-01`: 22 infracciones estáticas detectadas por `verify-srp.js`).
- **5 Brechas críticas de validación preventiva Poka-Yoke** que provocan errores 400 innecesarios.

---

## 2. Matriz Consolidada de Hallazgos Frontend

| ID Hallazgo | Severidad | Origen | Archivo / Componente | Descripción del Problema | Impacto Operativo | Acción Propuesta |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **HAL-F0-01** | CRÍTICO | REAGRAVADO | `useProductionPageData.js:129, 144` | Captura de errores con `alert(e.message)` nativo de navegador. | Bloqueo tosco de interfaz; viola Design System MANNÁ (regla no alerts). | Migrar a `NotificationContext` / Toasts. |
| **HAL-F2-01** | CRÍTICO | REAGRAVADO | `recipeHelpers.js:564` | Inyección de costo ficticio `unitCostWip = 4390` si un semielaborado no tiene costo. | El usuario ve márgenes falsos en UI; el backend rechaza la orden con error 400 (`HAL-F4-02`). | Eliminar fallback y advertir badge rojo "WIP sin costo". |
| **HAL-F4-01** | ALTO | NUEVO | `RecipeStageBomTable.jsx:109` | Input de merma con `max="100"`. Permite ingresar `100%`. | Backend lanza `BadRequestException` ante `merma >= 100` (`HAL-F8-02`). | Cambiar a `max="99.9"` y validar `< 100`. |
| **HAL-F4-02** | ALTO | NUEVO | `PresentationModal.jsx` | Permite guardar envases `BALDE` o `TANQUE_GRANEL` sin `cantidadMl`. | Backend rechaza la creación con error 400 (`HAL-F3-03`). | Forzar validación obligatoria de volumen en granel. |
| **HAL-F9-01** | ALTO | NUEVO | `create-sale.schema.js` vs `useSaleForm.js` | Backend rechaza descuentos comerciales $> 50\%$; frontend no tiene límite visual. | Vendedor digita descuento del 60% y la venta explota al guardar (`HAL-F7-03`). | Añadir guarda Poka-Yoke en UI para descuento máx 50%. |
| **HAL-F9-02** | ALTO | NUEVO | `useSaleForm.js:198` | Spread `...formData` en la raíz del payload hacia `POST /sales`. | Si se agregan flags de UI, Zod `.strict()` rechaza con `unrecognized_keys`. | Whitelist estricto en mapper DTO de salida. |
| **HAL-F7-01** | MEDIO | VIGENTE | `DashboardOperationalView.jsx:518` | `flujoCajaReal` omitido en el KPI strip; `utilidadDevengada` etiquetada genéricamente. | La gerencia no distingue facturación devengada de dinero líquido en caja (`HAL-F9-02`). | Añadir tarjeta de Caja Real en el dashboard. |
| **HAL-F6-01** | MEDIO | VIGENTE | `SupplyFormModal.jsx` | Campo `densidad` ausente en el formulario de Insumos. | Operario no puede configurar densidades ($g/ml$) requeridas para balances de masa. | Agregar input numérico `densidad` (default 1.0). |
| **HAL-F6-02** | MEDIO | VIGENTE | `ReceivableClientRow.jsx` | Saldos negativos (anticipos) se muestran como `-$XX.XXX` sin badge. | Confusión contable sobre si el cliente debe o tiene saldo a favor (`HAL-F9-04`). | Mostrar badge verde `ANTICIPO / SALDO A FAVOR`. |
| **HAL-F1-01** | ALTO | VIGENTE | `apps/web/src` | 22 infracciones en `verify-srp.js` (6 componentes > 150 lín, 15 inline styles). | Incumplimiento de las reglas maestras de arquitectura y veto anti-blue/anti-inline. | Modularizar componentes y migrar estilos a CSS Modules. |
| **HAL-F5-01** | BAJO | VIGENTE | `useFormPhaseData.js:152` | Fallback ciego `|| 'kg'` al agregar insumos en compras. | Insumos unitarios (tapas, botellas) se configuran en kg por omisión. | Exigir selección obligatoria de unidad sin fallback. |
| **HAL-F8-01** | BAJO | VIGENTE | `formatters.js:15` | `formatCurrency` trunca decimales en micro-costos ($18.4523/g -> $18). | Pérdida de resolución visual en ingredientes de alto valor (cultivos). | Crear helper `formatUnitCost` con 4 decimales. |

---

## 3. Hoja de Ruta de Remediación Frontend Recomendada

Para sanear el frontend y dejar el sistema 100% armónico con el backend:

1. **Bloque Front-1: Poka-Yoke y Errores Críticos (Inmediato)**
   - Reemplazar `alert(e.message)` por `NotificationContext` en `useProductionPageData.js`.
   - Eliminar fallback `unitCostWip = 4390` en `recipeHelpers.js`.
   - Limitar merma a `max="99.9"` en `RecipeStageBomTable.jsx`.
   - Obligatoriedad de volumen en presentaciones a granel.
   - Whitelist en payload de `POST /sales` y guarda visual de descuento máx 50%.
2. **Bloque Front-2: Arquitectura SRP y CSS Modules**
   - Modularizar `ProductionCreateForm.jsx` (262 lín) y `StageCardItem.jsx` (287 lín).
   - Extraer handlers en `commercial/goals/page.jsx` para retornar a < 120 líneas.
   - Limpiar los 15 archivos con `style={{ ... }}` para llevar `verify-srp.js` a 0 infracciones.
3. **Bloque Front-3: Visibilidad Financiera y Campos Nuevos**
   - Incorporar métrica de **Caja Real** en el Dashboard.
   - Exponer campo `densidad` en Insumos y badge de anticipo en Cartera.
   - Añadir tests E2E Poka-Yoke en Playwright.
