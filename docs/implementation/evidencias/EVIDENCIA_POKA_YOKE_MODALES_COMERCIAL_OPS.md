# Bitácora de Evidencia: Estandarización Poka-Yoke Canónico en Modales de Comercial y Operaciones

- **Fecha:** 2026-09-19
- **Referencia de Tarea:** `349-standardize-commercial-and-ops-modals-poka-yoke.md` / `350-lock-commercial-and-ops-poka-yoke-evidence.md`
- **Patrón Aplicado:** Poka-Yoke Canónico (bandera `hasSubmitted`, bordes reactivos `.inputErrorBorder` `#EF4444` y microtextos explicativos `.fieldErrorText` `#DC2626`).

---

## 1. Frentes y Componentes Intervenidos

### A. Comercial - Ventas (`SaleModal`)
- **Archivos:**
  - `apps/web/src/app/commercial/sales/components/SaleModal.jsx` (Orquestador < 145 líneas)
  - `apps/web/src/app/commercial/sales/components/modal-parts/SaleGeneralFields.jsx`
  - `apps/web/src/app/commercial/sales/components/modal-parts/SaleCreditFields.jsx`
  - `apps/web/src/app/commercial/sales/components/sale-modal.module.css`
- **Validaciones Poka-Yoke:**
  - Estado reactivo `hasSubmitted` con reset al cancelar (`handleClose`).
  - Bordes de error y microtextos en `idCliente`, `fechaVenta` y `fechaLimitePago` (en ventas a crédito).

### B. Comercial - Gastos Operativos (`ExpenseFormModal`)
- **Archivos:**
  - `apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx` (Modularizado a 88 líneas)
  - `apps/web/src/app/commercial/expenses/components/modal-parts/ExpensePeriodAndCategoryFields.jsx`
  - `apps/web/src/app/commercial/expenses/components/modal-parts/ExpenseValueAndDetailFields.jsx`
  - `apps/web/src/app/commercial/expenses/expenses.module.css`
- **Validaciones Poka-Yoke:**
  - Control visual reactivo en `fecha`, `periodo`, `categoria`, `tipoGasto`, `descripcion` y `valor` (> $0).

### C. Comercial - Pagos y Cobros (`PaymentFormModal`)
- **Archivos:**
  - `apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx` (Modularizado a 88 líneas)
  - `apps/web/src/app/commercial/payments/components/modal-parts/PaymentClientAndSaleFields.jsx`
  - `apps/web/src/app/commercial/payments/components/modal-parts/PaymentAmountAndMethodFields.jsx`
  - `apps/web/src/app/commercial/payments/payments.module.css`
- **Validaciones Poka-Yoke:**
  - Resaltado y microtextos en `fechaPago`, `idCliente`, `idVenta`, `metodoPago` y `valorPagado` (incluyendo alerta de exceso de saldo pendiente).

### D. Operaciones - Inventario (`GlobalInventoryAdjustmentModal`)
- **Archivos:**
  - `apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx` (< 130 líneas)
  - `apps/web/src/app/operations/inventory/components/modal-parts/InventoryAdjustmentFields.jsx`
  - `apps/web/src/app/operations/inventory/components/modal-parts/useInventoryAdjustmentForm.js`
  - `apps/web/src/app/operations/inventory/components/adjustment-modal.module.css`
- **Validaciones Poka-Yoke:**
  - Exposición de `hasSubmitted`, reset al cerrar y banderas atómicas en `idInsumo`, `cantidad` (> 0), `costoUnitario` (en entradas/saldos iniciales) y `motivo` (obligatorio para mermas y ajustes negativos).

---

## 2. Cumplimiento de Arquitectura y Reglas

- **SRP (Single Responsibility Principle):** Todos los componentes `.jsx` se mantienen por debajo de las 150 líneas máximas.
- **CSS Modules:** 0 ocurrencias de estilos en línea (`style={{...}}`) en los componentes creados o intervenidos.
- **Integridad de Sintaxis:** Validado con `node --check` en hooks y scripts de soporte.
