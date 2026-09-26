# INFORME-24: FASE 7 — COSTOS, IVA Y DESCUENTOS

> **Documento:** Auditoría Exhaustiva de Costeo, Mecánica de IVA, Orden de Descuentos, Márgenes y Fórmulas Financieras  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-7-costos-iva-descuentos/TASK-08-FASE-7-COSTOS-IVA-DESCUENTOS.md`  
> **Estado:** Fase 7 completada al 100%. Modo auditoría de solo lectura (código intacto).

---

## 1. Inventario de Fórmulas de Costo y Rentabilidad (T1)

| Métrica | Archivo y Línea | Fórmula Literal en Código | Unidad | Escala | Tipo | Manejo Casos Límite |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`costoPromedio` (CPP)** | `inventory.repository.js` L152 | `(stockAnterior * costoAnterior + cantidadAjuste * costoUnitario) / stockNuevo` | COP / unidad base | Float64 $\to$ Decimal | `Number` | Si `stockNuevo <= 0`, devuelve `costoUnitario`. **Omitido en Compras**. |
| **`costoUnidadBase`** | `supplier-prices.service.js` L52 | `cantidadEquivalenteBase > 0 ? (precioTotalConIva / cantidadEquivalenteBase) : 0` | COP / unidad base | Float64 $\to$ Decimal | `Number` | Mezcla IVA con costo base neto (`HAL-F3-04`). |
| **`costoTeorico` (BOM)**| `production.repository.js` L316 | `cantEnUnidadBase * costoUnitario` | COP total etapa | Float64 | `Number` | Usa precio proveedor activo o `costoPromedio` congelado. |
| **`costoReal` (Orden)** | `production.repository.js` L767 | `qtyReal * costoUnitarioInsumo` | COP total insumo | Float64 | `Number` | Multiplica cantidad real por costo promedio actual, no del lote. |
| **`costoUnitarioFabricacion`**| `production.repository.js` L916 | `qtyProducida > 0 ? costoTotalLote / qtyProducida : 0` | COP / unidad prod | Float64 $\to$ Decimal | `Number` | Si `qtyProducida = 0`, devuelve 0. |
| **`utilidadUnitaria`** | `sales.repository.js` L150 | `Number(d.precioUnitario) - costoUnit` | COP / unidad venta | Float64 $\to$ Decimal | `Number` | No valida si costo es mayor al precio (permite utilidades negativas). |
| **`margenPorcentaje`** | `dashboard.service.js` L562 | `((precioVenta - costoUnitario) / precioVenta) * 100` | Porcentaje (%) | Float64 $\to$ Decimal | `Number` | **Calcula sobre precio bruto con IVA** en lugar de base gravable. |
| **`diferencia` (Merma)** | `production.repository.js` L720 | `Number((qtyReal - Number(det.cantidadTeorica)).toFixed(4))` | Unidad física | 4 decimales | `Number` | Distorsionado si `cantTeorica` fue forzada con `Math.ceil`. |

---

## 2. Auditoría de IVA y Descuentos (T2)

### Análisis del Flujo y Orden de Operaciones
En `useSaleForm.js` (L87-130):
1. `brutoLinea = cant * precio`
2. `subLinea = Math.max(0, brutoLinea - desc)` (El descuento se aplica al valor bruto).
3. Si `precioIncluyeIva = true`:
   `baseLinea = Math.round(subLinea / (1 + (tarifa / 100)))`
   `ivaLinea = subLinea - baseLinea`
4. Si `precioIncluyeIva = false`:
   `baseLinea = subLinea`
   `ivaLinea = Math.round(baseLinea * (tarifa / 100))`

### Ejemplo Obligatorio Demostrado:
- **Datos:** 1 Producto con Precio de Lista $\$119,000\text{ COP}$, IVA 19% incluido, Descuento comercial del 10% ($\$11,900\text{ COP}$).
  - **Flujo Esperado Financiero / Tributario:**
    - Valor Bruto Pagado por Cliente: $\$119,000 - \$11,900 = \$107,100\text{ COP}$.
    - Base Imponible Real: $\$107,100 / 1.19 = \mathbf{\$90,000\text{ COP}}$.
    - IVA Descontable Real: $\$107,100 - \$90,000 = \mathbf{\$17,100\text{ COP}}$.
  - **Comportamiento en Frontend (`useSaleForm.js`):**
    - `subLinea = 119000 - 11900 = 107100`.
    - `baseLinea = Math.round(107100 / 1.19) = 90000`.
    - `ivaLinea = 107100 - 90000 = 17100`.
    - *Resultado Frontend:* Cuadra matemáticamente.
  - **Comportamiento en Backend (`sales.repository.js` L146):**
    - Si el frontend envía `precioUnitario: 119000`, `descuento: 11900`, pero el backend procesa `d.baseGravable` por fallback:
      `baseGravable = 1 * 119000 = 119000` $\to$ **Se ignora el descuento en la base y se cobra IVA sobre el precio de lista pleno**, generando el error crítico de facturación (`HAL-F4-04`).

---

## 3. Costos Teóricos vs Reales en Manufactura (T3)

- **Fórmula de Desviación de Costo:** No existe un campo consolidado `desviacionCosto` en `DetalleProduccion`; solo se calculan `costoTeorico` y `costoReal`.
- **Análisis de Costo Histórico vs Actual:**
  - `production.repository.js` L728:
    ```javascript
    const costoUnitarioInsumo = insumo?.inventario?.costoPromedio ? Number(insumo.inventario.costoPromedio) : ...
    ```
  - **Falla Técnica Grave:** Al cerrar la orden de producción, el sistema **no consulta el costo de adquisición histórico del lote específico consumido**, sino el `costoPromedio` que tenga la bodega en el instante exacto del cierre.
  - **Ejemplo:** Si se formularon 1,000 L de leche presupuestados a $\$1,500/L$ ($C_{teorico} = \$1,500,000$) y antes de completar la orden se registra una compra de leche cara a $\$2,000/L$, la orden liquida su consumo real a $\$2,000/L$ ($C_{real} = \$2,000,000$), arrojando una falsa ineficiencia operativa de $+\$500,000\text{ COP}$ por variación de precios de mercado.

---

## 4. Auditoría de Margen y Utilidad (T4)

### Distorsión Fiscal en el Cálculo de Margen
En `dashboard.service.js` L562:
```javascript
margenPorcentaje = ((precioVenta - costoUnitario) / precioVenta) * 100;
```
- **Error Conceptual:** `precioVenta` en catálogo almacena el **precio de venta al público con IVA incluido** (campo `precioIncluyeIva = true` por defecto en Prisma L109).
- **Impacto Demostrado:**
  - Yogurt con precio al público $\$11,900\text{ COP}$ (Base: $\$10,000$, IVA: $\$1,900$). Costo de fabricación: $\$7,000\text{ COP}$.
  - *Margen Real (sobre ingresos propios):*
    $$\text{Margen Real} = \frac{10000 - 7000}{10000} \times 100 = \mathbf{30.0\%}$$
  - *Margen Calculado por el Dashboard:*
    $$\text{Margen Falso} = \frac{11900 - 7000}{11900} \times 100 = \frac{4900}{11900} \times 100 = \mathbf{41.17\%}$$
  - **Distorsión:** El dashboard infla artificialmente el margen operativo en **$+11.17\%$** al computar los impuestos de la DIAN como utilidad de la empresa.

---

## 5. Auditoría de Descuentos (T5)

1. **Descuento por Línea vs Global:**
   - La tabla `DetalleVenta` admite `descuento` por ítem.
   - La cabecera `Venta` posee `descuentoTotal`. En `sales.repository.js` L166 se almacena la suma de los descuentos de línea. No existe soporte para descuentos globales de factura (ej. pie de factura) distribuidos proporcionalmente entre bases.
2. **Validación Poka-Yoke de Descuento Máximo:**
   - **Ausente:** No existe validación de que `descuento <= subtotalBruto`.
   - Si se ingresa un descuento superior al precio, `Math.max(0, bruto - desc)` trunca la línea a 0. Si `descuento = 100%`, el sistema produce `base = 0` y `IVA = 0`, facturando en $\$0\text{ COP}$ sin exigir autorización gerencial ni generar alertas.

---

## 6. Relación con Hallazgos Previos (T6)

- **Con `HAL-F4-01` (CPP Ausente en Compras):** Al no actualizarse el CPP en compras, `costoUnitarioInsumo` en producción opera con costos desactualizados de meses anteriores, falseando `costoReal` y el precio sugerido de venta.
- **Con `HAL-F4-02` (Fallback $3,400 en WIP):** Cuando la base láctea activa el fallback de $\$3,400\text{ COP}$, el costo del producto terminado absorbe este valor ficticio, transmitiendo el error al margen comercial del dashboard.
- **Con `HAL-F1-03` (División / 1000):** La división artificial de costos $>100$ hace que un insumo de $\$120,000/kg$ figure a $\$120$, haciendo que la utilidad calculada en `sales.repository.js` L151 aparente márgenes astronómicos del $99\%$.

---

## 7. Hallazgos Formalizados de la Fase 7

| ID | Severidad | Módulo / Archivo | Línea | Campo / Flujo | Problema Técnico Detectado | Impacto Demostrado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F7-01** | **CRÍTICO** | `dashboard.service.js` | L562 | `margenPorcentaje` | Margen calculado sobre precio de venta con IVA en lugar de la base gravable neta. | Margen inflado artificialmente en $+11.17\%$ en productos gravados al 19%. |
| **HAL-F7-02** | **ALTO** | `production.repository.js` | L728, L760 | `costoReal` en Lotes | Liquidación de consumo real contra `costoPromedio` instantáneo de bodega en vez del costo del lote asignado. | Desvirtúa la variación de costos de producción mezclando inflación de compras con eficiencia operativa. |
| **HAL-F7-03** | **MEDIO** | `useSaleForm.js` vs `sales.repository.js` | L90 / L144 | `descuento` en Ventas | Inexistencia de validación de descuento máximo (permite descuentos $> 100\%$ sin autorización). | Facturación en $\$0\text{ COP}$ silenciosa por truncamiento con `Math.max(0, ...)`. |

---

## 8. Conteo Final de Severidad (Fase 7)

- **CRÍTICO:** 1 (`HAL-F7-01`)
- **ALTO:** 1 (`HAL-F7-02`)
- **MEDIO:** 1 (`HAL-F7-03`)
- **BAJO:** 0  
**Total Hallazgos Fase 7:** **3**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: Las fórmulas de margen, costeo de órdenes, mecánica de IVA y aplicación de descuentos fueron verificadas y demostradas directamente en el código fuente.

---
**FASE 7 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 8.**
