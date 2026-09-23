# INFORME DE REMEDIACIÓN — BLOQUE FRONT-2B

**Fecha:** 22 de Septiembre de 2026  
**Rama:** `remediation/frontend-bloque-2a-2`  
**Objetivo:** Implementación quirúrgica de los 5 hallazgos de visibilidad financiera, precisión numérica y campos complementarios.

---

## 1. Resumen de Cumplimiento

| Hallazgo | Severidad | Archivo Intervenido | Resumen de la Acción | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **HAL-F7-01** | MEDIO | `DashboardOperationalView.jsx` | Renombrada tarjeta "UTILIDAD NETA" a "UTILIDAD DEVENGADA" y agregada tarjeta "CAJA LÍQUIDA REAL" conectada a `financial?.flujoCajaReal`. | Resuelto |
| **HAL-F6-01** | MEDIO | `SupplyCostAndNotesFields.jsx`, `useSupplyForm.js` | Incorporado input numérico `densidad` (default 1.0, min 0.5, max 2.5, step 0.01) con helper descriptivo y persistencia en payload API. | Resuelto |
| **HAL-F6-02** | MEDIO | `ReceivableClientRow.jsx` | Cuando `saldoPendiente < 0`, se despliega badge `ANTICIPO: $XX.XXX` con el valor absoluto, sin montos negativos crudos. | Resuelto |
| **HAL-F8-01** | BAJO | `formatters.js` | Exportada función pura `formatUnitCost(value)`: 4 decimales para valores `< 100` y 2 decimales para `>= 100`. | Resuelto |
| **HAL-F5-01** | BAJO | `useFormPhaseData.js` | Erradicado fallback hardcodeado `'kg'`; ahora asigna `''` exigiendo selección canónica del insumo. | Resuelto |

---

## 2. Auditoría Arquitectónica y Cierre

- **`node .agents/scripts/verify-srp.js --all`:** **0 infracciones en todo el proyecto**.
  - Componentes > 150 líneas: **0** (Se compactó `ReceivableClientRow.jsx` a 137 líneas).
  - Páginas > 120 líneas: **0**.
  - Inline styles (`style={{`): **0**.
