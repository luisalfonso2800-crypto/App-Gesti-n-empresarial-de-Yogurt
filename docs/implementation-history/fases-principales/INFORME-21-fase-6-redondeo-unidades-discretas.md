# INFORME-21: FASE 6 — REDONDEO Y UNIDADES DISCRETAS

> **Documento:** Auditoría de Políticas de Redondeo, Propósitos Numéricos, Unidades Discretas y Deriva Acumulativa  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-6-redondeo-unidades-discretas/TASK-07-FASE-6-REDONDEO-Y-UNIDADES-DISCRETAS.md`  
> **Estado:** Fase 6 completada al 100%. Modo auditoría pura (sin modificar código).

---

## 1. Inventario de Funciones de Redondeo (T1)

| Función / Operación | Archivos Principales | Líneas | Campos Afectados | Etapa en el Ciclo de Vida |
| :--- | :--- | :--- | :--- | :--- |
| **`Math.ceil`** | `production.repository.js` | L172, L527, L640, L643, L719 | `reqTeorico`, `cantTeorica`, `qtyReal`, `unidadesAComprar` | **Cálculo Físico y Descuento de Kardex**. |
| **`Math.ceil`** | `forecast.engine.service.js` | L42 | `demandaProyectada7d` | **Cálculo Táctico / Forecasting**. |
| **`Math.round`** | `inventory.service.js` | L32, L34 | `valorTotal` de inventario | **Almacenamiento / DTO de Valorización**. |
| **`Math.round`** | `useSaleForm.js` (Web) | L120, L124 | `baseLinea`, `ivaLinea` | **Cálculo Fiscal / Desglose de Línea**. |
| **`Math.round`** | `simulation.engine.service.js` | L103, L126-129 | `costoTotalSimulado`, `utilidadProyectada` | **Cálculo de Proyección Financiera**. |
| **`Math.round`** | `formatters.js` (Web) | L17, L40 | Formateo visual COP | **Presentación en Pantalla**. |
| **`.toFixed(2)`** | `purchases.repository.js` | L101-103, L122-124, L327-348 | Subtotales, IVA, Total de Compra | **Almacenamiento y Cierre Contable**. |
| **`.toFixed(4)`** | `production.repository.js` | L172, L527, L719, L720 | `cantidadFinal`, `qtyReal`, `diferencia` | **Cálculo y Almacenamiento de Masa/Vol**. |
| **`Math.floor`** | `numberToWords.js`, `formatters.js` | Múltiples | Desglose de billetes, millones, miles | **Presentación / Factura Impresa**. |

---

## 2. Clasificación de Redondeos por Propósito (T2)

1. **Redondeo de Unidades Físicas (Discretas/Indivisibles):** `Math.ceil` en empaques (`production.repository.js`). Correcto para unidades físicas, pero **contamina el cálculo de costos** (ver T3).
2. **Redondeo Fiscal:** `Math.round` en `useSaleForm.js` y `.toFixed(2)` en compras. **Violación:** redondear enteros en cada ítem antes del total factura genera descuadres de centavos (`HAL-F4-06`).
3. **Redondeo de Almacenamiento:** `.toFixed(4)` para cantidades continuas y `.toFixed(2)` para montos monetarios.
4. **Redondeo de Presentación:** En `formatters.js` y `dashboard.service.js`. En dashboards de analítica se usa `Math.round` que luego se suma, alterando totales consolidados.

---

## 3. Auditoría Específica de `Math.ceil` en `UNIDADES_DISCRETAS` (T3)

### Definición Literal (`production.repository.js` L18):
```javascript
const UNIDADES_DISCRETAS = ['UNIDAD', 'UNIDADES', 'UND', 'PZA', 'PIEZA', 'VASO', 'BOTELLA', 'TAPA', 'ETIQUETA'];
```

### Comportamiento del Sistema y Demostración Obligatoria:
- **En la Explosión de Materiales (BOM) (`production.repository.js` L172-173):**
  ```javascript
  const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
  const cantidadFinal = esUnidadDiscreta ? Math.ceil(reqTeorico) : Number(reqTeorico.toFixed(4));
  reqTeorico = cantidadFinal;
  ```
  `Math.ceil` se aplica **ANTES** de calcular el costo teórico (`L316: costoTeorico = cantEnUnidadBase * costoUnitario`).
- **En la Liquidación y Consumo Real (`production.repository.js` L719, L735, L760):**
  ```javascript
  const qtyReal = esUnidadDiscreta ? Math.ceil(rawQty) : Number(rawQty.toFixed(4));
  costoTotalLote += qtyReal * costoUnitarioInsumo;
  const stockFinal = Math.max(0, stockActual - qtyReal);
  ```

### Demostración con el Caso de 14.2 Tapas:
- **Situación:** Una orden requiere teóricamente $14.2\text{ tapas}$ (por merma o batch fraccionario). Stock inicial en bodega: $100\text{ tapas}$. Costo unitario: $\$50\text{ COP/tapa}$.
  1. **BOM Teórico:** El sistema redondea inmediatamente con `Math.ceil(14.2) = 15`.
  2. **Costo Teórico Calculado:** $15 \times \$50 = \$750\text{ COP}$ (en vez de $14.2 \times 50 = \$710\text{ COP}$, absorbiendo $\$40$ de costo no incurrido en la formulación teórica).
  3. **Consumo en Kardex:** Descuenta $15$ unidades exactas. Saldo final: $100 - 15 = 85\text{ tapas}$ (evita fracciones irreales en almacén, lo cual es correcto operativamente).
  4. **Problema Técnico:** La cantidad teórica de ingeniería ($14.2$) se destruye en la base de datos al guardarse como $15$ (`L527`), imposibilitando auditar desviaciones reales de uso frente al estándar de formulación.

---

## 4. Error Acumulativo por Redondeo Temprano (T4)

### Deriva en Facturación con IVA Incluido (Frontend $\to$ Backend)
- **Escenario:** Licitación escolar con 1,000 vasitos de yogurt a $\$1,050.50\text{ COP}$ c/u (IVA 19% incluido):
  - **Redondeo Temprano Actual (Línea por Línea con `Math.round`):**
    - Base por ítem: $\text{Math.round}(1050.50 / 1.19) = \text{Math.round}(882.773) = 883$
    - IVA por ítem: $1050.50 - 883 = 167.50 \to 168$
    - Base Gravable Total: $883 \times 1000 = \$883,000\text{ COP}$
    - IVA Total Cobrado: $168 \times 1000 = \$168,000\text{ COP}$
    - Total Factura: $\$1,051,000\text{ COP}$
  - **Cálculo Fiscal Estándar (Redondeo al Total de la Operación):**
    - Venta Total Pactada: $\$1,050,500\text{ COP}$
    - Base Fiscal: $\text{round}(1050500 / 1.19) = \$882,773\text{ COP}$
    - IVA Real: $\$1,050,500 - \$882,773 = \$167,727\text{ COP}$
  - **Diferencia Acumulativa:** Discrepancia de **$+\$500 COP** en total y **$+\$273 COP** en IVA reportado a la administración tributaria.

---

## 5. Redondeo en Producción y Merma (T5)

- **`factorEscala`:** No se redondea (`cantidadProduccion / rendimientoBase`). Flota como float64 de doble precisión.
- **`mermaPorcentaje`:** No se redondea antes de aplicar; opera como float64 en `(1 + (merma / 100))`.
- **`diferencia` (Desviación):** Se redondea rígidamente a 4 decimales:
  `Number((qtyReal - Number(det.cantidadTeorica)).toFixed(4))` (`production.repository.js` L720). Si `det.cantidadTeorica` ya fue redondeada con `Math.ceil`, la diferencia reportada en el historial de manufactura siempre será un número entero falso (ej. 0 o 1) sin reflejar la merma real.

---

## 6. Relación con Hallazgos Previos (T6)

- **Con `HAL-F2-04` (VASO/TAPA en Recetas):** Mientras `production.repository.js` L18 reconoce explícitamente `VASO`, `TAPA`, `BOTELLA` y `ETIQUETA` en `UNIDADES_DISCRETAS`, `recipes.service.js` los omite en `extractCanonicalUnit`, provocando que el validador rechace las recetas que producción sí sabe procesar.
- **Con `HAL-F4-08` (`Math.max`):** El redondeo temprano hacia arriba (`Math.ceil`) puede generar consumos mayores al stock físico disponible por fracciones decimales, activando `Math.max(0, ...)` y dejando el saldo en cero sin levantar alerta de desabastecimiento.

---

## 7. Hallazgos Formalizados de la Fase 6

| ID | Severidad | Módulo / Ubicación | Campo | Problema Técnico Detectado | Impacto Demostrado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F6-01** | **ALTO** | `production.repository.js` L172, L527 | `cantidadTeorica` | `Math.ceil` sobreescribe la formulación teórica antes de persistir el snapshot de la orden. | Destruye el requerimiento teórico de ingeniería ($14.2 \to 15$), falseando el análisis de merma y sobreestimando el costo teórico de fabricación. |
| **HAL-F6-02** | **MEDIO** | `production.repository.js` L720 | `diferencia` | Desviación calculada contra `cantidadTeorica` previamente redondeada con `Math.ceil`. | Oculta la variación gravimétrica real de planta en empaques e insumos discretos. |

---

## 8. Conteo Final de Severidad (Fase 6)

- **CRÍTICO:** 0
- **ALTO:** 1 (`HAL-F6-01`)
- **MEDIO:** 1 (`HAL-F6-02`)
- **BAJO:** 0  
**Total Hallazgos Fase 6:** **2**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: Las listas de `UNIDADES_DISCRETAS`, el impacto de `Math.ceil` en el BOM y costos, y la acumulación de redondeos fiscales fueron demostrados directamente en código.

---
**FASE 6 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 7.**
