# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F0: INGESTA Y RECONCILIACIÓN

> **Fecha:** 2026-09-22  
> **Alcance:** Ingesta y reconciliación de 7 auditorías previas de la carpeta `docs/audits/` contrastadas con la remediación total del backend (39/39 hallazgos resueltos) y el estado real del frontend (`apps/web`).  
> **Estado:** ✅ FASE F0 COMPLETADA

---

## 1. Documentos Auditados e Ingestados

Se extrajeron y reconciliaron los hallazgos documentados en los 7 reportes maestros:
1. `docs/audits/AUDIT-CARTERA-VENTAS-PAGOS.md`
2. `docs/audits/AUDIT-EXPENSES-DASHBOARD-SCADA.md`
3. `docs/audits/AUDIT-INVENTORY-PRODUCTION-UNITS.md`
4. `docs/audits/AUDIT-RECIPES-BOM-COSTING.md`
5. `docs/audits/AUDIT-SUPPLY-CHAIN-AND-PURCHASES.md`
6. `docs/audits/AUDIT-TAX-IVA-PRODUCTS-SALES-IMPACT.md`
7. `docs/audits/AUDIT-TECHNICAL-DEBT-ARCHITECTURE.md`

---

## 2. Matriz Única Consolidada y Reconciliación Delta

Cada hallazgo previo ha sido clasificado bajo el lente post-remediación backend en:
- **RESUELTO:** El backend o frontend ya implementó la solución definitiva y está cubierto por tests/arquitectura.
- **VIGENTE:** Sigue presente como deuda técnica o comportamiento que requiere ajuste en frontend.
- **OBSOLETO:** El contexto cambió o fue absorbido por otro diseño.
- **REAGRAVADO:** Un cambio reciente en el backend generó una nueva incompatibilidad o excepción no atrapada en cliente.

| ID Original | Severidad | Módulo / Componente | Descripción del Problema | Estado Post-Remediación | Justificación / Diagnóstico Delta |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **PAY-01** | CRÍTICO | `apps/api/src/payments` | No se actualizaba `saldoPendiente` ni `valorPagado` en `Venta` al registrar un pago. | **RESUELTO** | Remediado transaccionalmente en Bloque 5 y 6A (`PaymentsRepository.create`). |
| **PAY-02** | ALTO | `apps/web/commercial/sales` | Abono inicial en venta a crédito no generaba tupla en `Pagos`. | **OBSOLETO** | Diseñado por arquitectura de modelo: la deuda se persiste en la cabecera `Venta`. Soportado con anticipos y saldos a favor (HAL-F9-04). |
| **PAY-03** | CRÍTICO | `apps/web/commercial/payments` | Pagos mayores al saldo lanzaban error en backend impidiendo anticipos. | **RESUELTO** | Remediado en HAL-F9-04: ahora genera saldo a favor y actualiza saldo negativo exacto con `Decimal.js`. |
| **EXP-01** | MEDIO | `apps/web/dashboard` | `DashboardOperationalView.jsx` (891 líneas) y `Dashboard.module.css` (1451 líneas) sobredimensionados. | **VIGENTE** | Deuda técnica de SRP en frontend pendiente de modularización. |
| **EXP-02** | MEDIO | `apps/web/dashboard` | `dashboard/page.jsx` excede 120 líneas (146 líneas). | **VIGENTE** | Deuda SRP identificada en `verify-srp.js`. |
| **INV-01** | CRÍTICO | `inventory.service.js` | Heurística `costoUnitario > 100` distorsionaba insumos pequeños ($120/g -> $0.12/g). | **RESUELTO** | Resuelto en HAL-F1-03 (Bloque 7A): eliminada heurística y normalizado por `unit-registry.js`. |
| **INV-02** | ALTO | `common/utils/unit-converter` | Ausencia de conversor canónico y factores dimensionales masa/volumen. | **RESUELTO** | Resuelto en Bloque 3: implementado `unit-registry.js` y conversor dimensional canónico. |
| **PRD-01** | CRÍTICO | `production.repository.js` | Deducción de BOM en producción sin normalizar a unidad base del insumo (error 1000x). | **RESUELTO** | Resuelto en HAL-F8-01 (Bloque 2) y Bloque 3. |
| **PRD-02** | ALTO | `production.repository.js` | Trazabilidad y reserva de inóculo WIP con múltiples lotes FEFO. | **RESUELTO** | Resuelto e implementado en `production.repository.js` con soporte multilote. |
| **PRD-03** | ALTO | `production.repository.js` | Fallback silencioso `$3,400` en costo WIP y `|| 1` en `rendimientoBase = 0`. | **RESUELTO** | Resuelto en HAL-F4-02 y HAL-F4-03 (Bloque 7BC): ahora lanzan `BadRequestException`. |
| **PRD-04** | CRÍTICO | `apps/web/operations/production` | Formulario frontend no maneja nuevas excepciones `BadRequestException` de backend. | **REAGRAVADO** | Al lanzar el backend excepciones formales por rendimiento <= 0, merma >= 100 o costos erróneos, la UI puede mostrar toasts genéricos o fallar sin validación previa. |
| **DB-01** | MEDIO | Base de Datos (Seeds) | Precios históricos asignados en Kg a insumos con unidad base en gramos. | **VIGENTE** | Script de migración y calibración de seeds de catálogo pendiente (documentado como G-04). |
| **REC-01** | ALTO | `recipes.service.js` | Falta de exclusividad entre Insumo comprado y Producto Intermedio WIP. | **RESUELTO** | Resuelto con validación Poka-Yoke estricta en `validateRecipeIntegrity`. |
| **REC-02** | MEDIO | `apps/web/catalog/recipes` | `recipeHelpers.js` (702 líneas) y `useRecipeForm.js` (454 líneas) concentran lógica analítica. | **VIGENTE** | Deuda técnica SRP en frontend. |
| **PUR-01** | ALTO | `purchases.repository.js` | Normalización de empaques a unidades base y liquidación con IVA. | **RESUELTO** | Resuelto en Bloque 5 y completado al 100% con `Decimal.js` en Bloque 8A. |
| **TAX-01** | CRÍTICO | `apps/api/src/products` | Falta de atributos de IVA en `Producto` (`tarifaIva`, `precioIncluyeIva`). | **RESUELTO** | Resuelto en Bloque 4 (`HAL-F7-01` / `HAL-F7-02`). |
| **TAX-02** | CRÍTICO | `apps/api/src/sales` | Ventas no discriminaban base gravable, IVA ni descuentos comerciales vs financieros. | **RESUELTO** | Resuelto en Bloque 4 y 8A con `Decimal.js` server-side estricto. |
| **SRP-01** | ALTO | `apps/web/src` | Violaciones a reglas de SRP y CSS Modules en frontend. | **REAGRAVADO** | La ejecución de `verify-srp.js` detectó **22 infracciones vigentes** (archivos con inline styles y componentes > 150 líneas, ej. `ProductionCreateForm.jsx` 262 líneas, `GoalFormModal.jsx` 187 líneas). |
| **CSS-01** | MEDIO | `apps/web/src` | Uso de `style={{` en lugar de CSS Modules. | **VIGENTE** | 15 archivos presentan inline styles vetados por el Design System MANNÁ. |
| **MOD-01** | MEDIO | `apps/web/src/components` | Poka-Yoke y validaciones previas antes de submit. | **VIGENTE** | Formularios cliente aún no validan consistencia de mermas y rendimientos antes de llamar a la API. |

---

## 3. Conclusiones de la Reconciliación F0

1. **Backbone Backend Saneado (100%):** Los hallazgos de lógica de negocio, contabilidad de saldos, IVA, Kardex, precisión decimal y conversor de unidades están plenamente resueltos y blindados con 60 tests verdes.
2. **Foco Crítico del Frontend Delta:**
   - **Reagravamiento por endurecimiento de API (PRD-04):** El frontend requiere validación preventiva y feedback claro ante las nuevas `BadRequestException` del backend.
   - **Deuda Arquitectural Vigente (SRP-01 / CSS-01):** Existen 22 infracciones activas detectadas por `verify-srp.js` que violan los límites de líneas y el veto anti-inline-styles de MANNÁ.
   - **Contratos y Cálculo Local:** Necesidad de verificar que formularios de ventas, producción y compras no dupliquen cálculos o envíen tipos incompatibles a Zod.
