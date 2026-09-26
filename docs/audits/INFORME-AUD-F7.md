# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F7: DASHBOARD Y MÉTRICAS ANALÍTICAS

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src/app/dashboard`) frente a los servicios analíticos remediados del backend (`apps/api/src/dashboard/dashboard.service.js`).  
> **Estado:** ✅ FASE F7 COMPLETADA

---

## 1. Diagnóstico de Segregación Devengado vs Flujo de Caja Real

Durante la remediación del backend (`HAL-F9-02` / Bloque 5), se segregó formalmente la contabilidad para no confundir facturación con caja líquida:
- **`utilidadDevengada`:** `ventasBaseSinIvaCurrentMonth - expensesCurrentMonth` (utilidad operativa real sin IVA distorsionante).
- **`flujoCajaReal`:** `cashReceivedCurrentMonth - expensesCurrentMonth` (recaudo efectivo en banco/caja menos gastos).
- Retrocompatibilidad backend: `netProfitCurrentMonth = utilidadDevengada`.

### Estado en Frontend (`DashboardOperationalView.jsx` L518-536):
- La franja de métricas principales (`kpiStrip`) renderiza:
  1. `VENTAS MES` (`financial?.salesCurrentMonth`)
  2. `GASTOS OP.` (`financial?.expensesCurrentMonth`)
  3. `UTILIDAD NETA` (`financial?.netProfitCurrentMonth`)
  4. `POR COBRAR` (`financial?.accountsReceivable`)
- **HALLAZGO CRÍTICO:**  
  El frontend **NO expone** `flujoCajaReal` ni titula explícitamente `utilidadDevengada`. El operario o directivo no tiene visibilidad de la liquidez real de caja frente a las ventas a crédito devengadas en el mes.

---

## 2. Márgenes y Tratamiento del IVA en Visualización

- **Base de Comparación en KPI Strip:**  
  `salesCurrentMonth` proviene de `totalVenta` (con IVA incluido si la venta aplicó IVA), mientras que `netProfitCurrentMonth` se calculó en backend sobre `baseImponible` (sin IVA).  
  **Efecto:** Existe una asimetría conceptual en la tarjeta si no se aclara: `Ventas Mes` muestra el bruto facturado y la utilidad descuenta el IVA como pasivo fiscal.
- **Ficha Técnica de Producto (`openProductDrillDown` L234-238):**  
  Muestra márgenes fijos calculados con strings ad-hoc:  
  `Venta Directa: {Number(prod.margenPorcentaje) + 15}%` (heurística quemada en frontend).

---

## 3. Sumas Crudas vs Redondeos Intermedios en Simulador (`SimulationDrawer.jsx`)

En el Bloque 7BC se corrigió `simulation.engine.service.js` (`HAL-F6-03`) para acumular sumas crudas y redondear una única vez al final.
- En el modal de simulación local de `DashboardOperationalView.jsx` (L265-270):
  ```javascript
  simUnits = Math.floor(liters * multiplier);
  simCost = simUnits * selectedProdInfo.costoUnitario;
  simSales = simUnits * selectedProdInfo.precioVenta;
  simProfit = simSales - simCost;
  simProfitMargin = simSales > 0 ? ((simProfit / simSales) * 100).toFixed(1) : 0;
  ```
- **Evaluación:** El cálculo local usa `Math.floor` sobre unidades y multiplicación float64 estándar. Para simulaciones tácticas rápidas en pantalla es aceptable, pero debe alinearse con la respuesta de `POST /dashboard/simulate-batch` del backend cuando se requiera cálculo oficial de tanda.

---

## 4. Matriz de Discrepancias Frontend ↔ Backend en Dashboard

| Métrica Backend | Estado en Backend | Estado en Frontend UI | Severidad | Acción Requerida |
| :--- | :--- | :--- | :---: | :--- |
| **`flujoCajaReal`** | Calculado exactamente (`recaudos - gastos`). | Omitido en la interfaz. | **ALTA** | Añadir tarjeta o toggle "Caja Líquida Real" en el KPI strip. |
| **`utilidadDevengada`** | Calculado sin IVA (`baseGravable - gastos`). | Etiquetado genéricamente como "UTILIDAD NETA". | **MEDIA** | Renombrar o clarificar: "UTILIDAD DEVENGADA (Sin IVA)". |
| **Margen Venta Directa** | Calculado en backend según lista de precios. | `margenPorcentaje + 15%` hardcodeado en UI. | **MEDIA** | Eliminar el `+ 15%` quemado y leer el margen real desde el selector. |

---

## 5. Conclusiones y Recomendaciones de la Fase F7

1. **Exponer la dualidad financiera de MANNÁ:** Integrar en el KPI strip el indicador de **Flujo de Caja Real** (liquidez inmediata) al lado de la **Utilidad Devengada**.
2. **Eliminar el `+ 15%` empírico:** Las presentaciones de venta directa deben calcular su margen contrastando el `precioVenta` vs `costoUnitario` real sin inventar diferenciales en JSX.
