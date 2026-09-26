TAREA CONTROLADA — VERIFICACIÓN PREVIA EN CÓDIGO REAL Y FIX RESILIENTE: DROPDOWN PROVEEDOR (C01) Y SELECTOR UNIDAD DE MEDIDA (T05-T07)

OBJETIVO TÉCNICO:
Resolver los 2 fallos que impiden el 33/33 en la suite de `supplier-prices`:
1. En `apps/web/e2e/helpers/supplier-price-form.js`: Garantizar apertura confiable y selección en el Combobox de Proveedor sin timeouts.
2. En `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`: Alinear los selectores de Presentación y Unidad de Medida en T05, T06 y T07 con el DOM real para erradicar el error `element(s) not found`.

REGLAS DE ORO (INSPECCIÓN PREVIA MANDATORIA — FUENTE DE VERDAD):
- REGLA 10 & 20: ANTES DE REALIZAR CUALQUIER EDICIÓN, DEBES LEER EL CÓDIGO REAL DEL COMPONENTE para verificar qué atributos (`name`, `label`, `class`, `type`) existen realmente. Cero asunciones a ciegas.
- CERO modificaciones a código de producción (`apps/web/src/**`, `apps/api/**`).
- PROHIBIDO ejecutar Playwright automáticamente (la ejecución la realiza el operador humano).
- Modificar EXCLUSIVAMENTE:
  * `apps/web/e2e/helpers/supplier-price-form.js`
  * `apps/web/e2e/supplier-prices/supplier-prices-modal-flow.spec.js`
- LÍMITES SRP: Helper < 95 líneas, Spec < 140 líneas.

FUENTES DE VERDAD A INSPECCIONAR (EXACTAMENTE 2 LECTURAS):
1. `apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPricePresentationFields.jsx`
2. `apps/web/src/app/catalog/supplier-prices/components/modal-parts/SupplierPriceEquivalenceFields.jsx`
