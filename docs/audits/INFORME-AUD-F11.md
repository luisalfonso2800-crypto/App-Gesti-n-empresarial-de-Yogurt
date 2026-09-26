# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F11: TESTS E2E Y CIERRE

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/e2e`) — Inventario, cobertura y brechas de pruebas end-to-end automatizadas frente a los cambios de la remediación.  
> **Estado:** ✅ FASE F11 COMPLETADA

---

## 1. Inventario de Suites E2E Existentes

El frontend cuenta con 2 suites de pruebas Playwright en `apps/web/e2e`:

1. **`value-chain-complete.spec.js` (40 líneas):**
   - **Flujo:** Receta $\rightarrow$ Producción/Liquidación $\rightarrow$ Cava (Inventario) $\rightarrow$ Venta desde stock disponible.
   - **Estado:** Pasa de forma desatendida. Verifica que la liquidación descuente stock y que la cava refleje unidades reales en la orden de venta.
2. **`all-modules-exhaustive.spec.js` (891 líneas):**
   - **Flujo:** Recorrido exhaustivo por 14 módulos y 24 modales/drawers con fuzzing de validaciones de entrada, cierre y cancelaciones.
   - **Estado:** Robusto en navegación y comportamiento modal.

---

## 2. Cobertura vs Brechas Post-Remediación

A raíz de los 39 hallazgos resueltos en el backend, se identificaron **brechas críticas no cubiertas** en las suites E2E:

| Flujo de Negocio / Cambio Backend | Cobertura Actual E2E | Riesgo de Regresión No Detectada | Test E2E Propuesto |
| :--- | :---: | :---: | :--- |
| **Rechazo de Merma >= 100% (`HAL-F8-02`)** | ❌ 0% | ALTO | Intentar guardar receta con merma 100% y verificar que la UI bloquee o muestre mensaje preventivo. |
| **Rendimiento Base = 0 (`HAL-F4-03`)** | ❌ 0% | ALTO | Verificar que el botón guardar esté deshabilitado si `rendimientoBase <= 0`. |
| **Envases Granel sin volumen (`HAL-F3-03`)** | ❌ 0% | MEDIO | Crear presentación `BALDE` sin `cantidadMl` y verificar que el formulario impida el submit. |
| **Límite Descuento Comercial 50% (`HAL-F7-03`)**| ❌ 0% | ALTO | En nueva venta, digitar descuento del 70% del valor bruto y verificar que la UI avise del tope. |
| **Saldos a Favor / Anticipos (`HAL-F9-04`)** | ❌ 0% | MEDIO | Pagar un valor superior al saldo en Cartera y verificar que se genere la observación o badge de anticipo sin error de servidor. |
| **Suma Cruda en Dashboard (`HAL-F6-03`)** | ❌ 0% | BAJO | Verificar que las tarjetas del dashboard carguen valores consistentes con los KPIs agregados. |

---

## 3. Plan de Expansión E2E Recomendado

Se propone la creación de una suite especializada:  
`apps/web/e2e/remediation-poka-yoke.spec.js` conteniendo:
1. `TEST-E2E-POKA-01`: Bloqueo preventivo de merma $\ge 100\%$.
2. `TEST-E2E-POKA-02`: Validación obligatoria de volumen en presentaciones a granel.
3. `TEST-E2E-POKA-03`: Alerta de tope de descuento comercial ($> 50\%$).
4. `TEST-E2E-POKA-04`: Registro de pago con excedente (anticipo) en Cartera.

---

## 4. Conclusión de la Fase F11
Las pruebas E2E actuales garantizan la viabilidad del flujo principal (happy path), pero carecen de aserciones de borde contra las nuevas excepciones defensivas del backend.
