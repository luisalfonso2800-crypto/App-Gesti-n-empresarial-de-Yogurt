# INFORME-16: FASE 4 — INVENTARIO DE FÓRMULAS MATEMÁTICAS DE NEGOCIO

> **Documento:** Auditoría Exhaustiva de Operaciones Aritméticas, Cálculos de Negocio, IVA, Redondeos y Precisión  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-4-formulas-matematicas/TASK-05-FASE-4-INVENTARIO-FORMULAS-MATEMATICAS.md`  
> **Estado:** Fase 4 completada al 100%. Modo auditoría pura (sin modificar código).

---

## 1. Inventario de Operaciones Aritméticas y Librerías (T1)

- **Librerías de Alta Precisión Arbitraria:** `Decimal.js`, `bignumber.js` y `big.js` **NO están instaladas ni importadas en el proyecto**.
- **Tipo Nativo Utilizado en Aritmética:** Todo el cálculo matemático en backend (`apps/api`) y frontend (`apps/web`) se realiza convirtiendo objetos Prisma Decimal a primitivos IEEE 754 de JavaScript mediante `Number()`, `parseFloat()` o coerción implícita, sufriendo errores inherentes de coma flotante binaria.
- **Inventario de Funciones `Math.*`:**
  - `Math.round`: Usado en `inventory.service.js` (L32, L34) para forzar valores monetarios enteros en COP, y en `useSaleForm.js` (L120, L124) en cada línea de factura.
  - `Math.ceil`: Usado en `production.repository.js` (L172, L527, L719) sobre `UNIDADES_DISCRETAS`, y en `purchases.repository.js` (L640, L643) para empaques mínimos de compra.
  - `Math.max`: Usado en `inventory.repository.js`, `production.repository.js` (L735, L790, L832) y `sales.repository.js` (L128) para forzar topes mínimos en 0 (`Math.max(0, saldo - deduccion)`).

---

## 2. Inventario de Fórmulas de Negocio Específicas (T2)

| Dominio | Campo / Función | Archivo y Línea | Fórmula Actual Implementada | Fórmula Esperada según Regla de Negocio | Riesgo / Casos Límite |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kardex** | `stockNuevo` | `inventory.repository.js` L141 | `stockAnterior + cantidadAjuste` | $S_{nuevo} = S_{ant} \pm Q$ | Si $S_{ant} < Q$ en ajuste negativo, permite negativos salvo que se trunque. |
| **Compras** | `incrementStock` | `purchases.repository.js` L174 | `isLtsOrKgs ? cantidadBaseTotal * 1000 : cantidadBaseTotal` | $Q \times \text{FactorCanónico}$ | Falla activa (`HAL-F1-04`): case-sensitive y omite `'Litros'/'Kilogramos'`. |
| **Compras** | `costoBaseUnitario` | `purchases.repository.js` L325 | `factorReal > 0 ? (precioUnitario / factorReal) : precioUnitario` | $C_{empaque} / Q_{equivalente}$ | Si `factorReal = 0`, asume costo total de empaque como costo unitario. |
| **Compras** | `costoPromedio` | `inventory.repository.js` L152 | `(stockAnterior * costoAnterior + cantidadAjuste * costoUnitario) / stockNuevo` | $\frac{\sum (S_i \cdot C_i)}{S_{total}}$ | **CRÍTICO:** ¡Las compras normales directas no ejecutan esta fórmula! |
| **Recetas** | `factorEscala` | `production.repository.js` L157 | `cantidadProduccion / (Number(receta.rendimientoBase) \|\| 1)` | $Q_{prod} / R_{base}$ | Si `rendimientoBase = 0`, el fallback `\|\| 1` asume base 1 sin alertar. |
| **Producción**| `reqTeorico` (BOM) | `production.repository.js` L167-169 | `(cantidadRequerida * factorEscala) * (1 + (merma / 100))` | $Q_{req} \times F \times (1 + m)$ | `merma` puede ser negativa o $>100\%$, inflando insumos ilimitadamente. |
| **Producción**| `costoTeorico` | `production.repository.js` L259 | `reqTeorico * costoUnitario` | $Q_{req} \times C_{unit}$ | En productos WIP, si costo $\le 0$ o $>50000$, hardcodea $3400 COP. |
| **Producción**| `costoReal` | `production.repository.js` L767 | `qtyReal * costoUnitarioInsumo` | $Q_{real} \times C_{real}$ | Utiliza `costoPromedio` actual, no el costo histórico del lote consumido. |
| **Producción**| `diferencia` | `production.repository.js` L720 | `Number((qtyReal - Number(det.cantidadTeorica)).toFixed(4))` | $Q_{real} - Q_{teorica}$ | Redondeo fijo a 4 decimales. |
| **Ventas** | `baseImponible` | `sales.repository.js` L146 | `d.cantidad * Number(d.precioUnitario)` | $\text{Base} = \text{Total} / (1 + \text{IVA})$ si incluye IVA | **CRÍTICO:** El backend ignora si el precio incluía IVA y toma subtotal bruto como base. |
| **Ventas** | `utilidadTotal` | `sales.repository.js` L137 | `subVenta - (d.cantidad * costoUnit)` | $\text{IngresoNeto} - \text{CostoTotal}$ | Si costo es 0 (ej. sin compras previas), la utilidad es 100% irreal. |
| **Pagos** | `nuevoSaldo` | `payments.repository.js` L55 | `Math.max(0, Number(venta.totalVenta) - nuevoValorPagado)` | $\text{Total} - \sum \text{Pagos}$ | Trunca a 0 si hay sobrepago en vez de registrar anticipo/saldo a favor. |
| **Tarifas** | `costoUnidadBase`| `supplier-prices.service.js` L52 | `cantidadEquivalenteBase > 0 ? (precioTotalConIva / cantidadEquivalenteBase) : 0` | $P_{conIva} / Q_{equiv}$ | Mezcla precio con IVA para calcular costo base unitario sin discriminar impuesto descontable. |

---

## 3. Auditoría del Costo Promedio Ponderado (T3 - Prioridad Máxima)

### Hallazgo Crítico Estructural: Desconexión de Compras y Costo Promedio
- **¿Dónde se calcula?** La fórmula de ponderación reside **exclusivamente** en `apps/api/src/inventory/inventory.repository.js` L152, dentro del método `createAjuste()`.
- **En el flujo de compras (`purchases.repository.js` L171-197):**
  Al registrar una compra, el sistema ejecuta:
  ```javascript
  await prisma.inventario.upsert({
    where: { idInsumo: detalle.idInsumo },
    update: { cantidadActual: { increment: incrementStock } }
  });
  ```
  **¡JAMÁS ACTUALIZA `costoPromedio` EN LA TABLA `Inventario` DURANTE UNA COMPRA!**
  Solo incrementa `cantidadActual`. El costo unitario de la compra se almacena en `PrecioProveedor` o `DetalleCompra`, pero el `Inventario.costoPromedio` permanece congelado con el costo inicial o se actualiza únicamente si el usuario hace un ajuste manual.

### Ejemplo Numérico Demostrado:
- **Datos de prueba:**
  - Compra 1: 10 kg a $1,000/kg $\to$ Inversión: $10,000
  - Compra 2: 5 kg a $2,000/kg $\to$ Inversión: $10,000
  - Compra 3: 2 kg a $500/kg $\to$ Inversión: $1,000
- **Resultado Esperado Contable (CPP):**
  $$\text{CPP} = \frac{10000 + 10000 + 1000}{10 + 5 + 2} = \frac{21000}{17} = \$1,235.2941\text{ COP/kg}$$
- **Resultado Actual en el Sistema:**
  El `costoPromedio` de la tabla `Inventario` queda en **$1,000 COP/kg** (congelado desde la carga inicial), o toma el último precio del proveedor ($500) según la pantalla que lo consulte.
- **Impacto:** Subvaluación del inventario por un diferencial de $\$235.29\text{ COP}$ por kilo ($19\%$ de error en valoración de activos).

---

## 4. Auditoría de Cálculos de IVA y Descuentos (T4)

### Discrepancia Grave: Frontend calcula IVA Desglosado, Backend lo Asume Crudo
1. **En el Frontend (`useSaleForm.js` L119-125):**
   ```javascript
   if (incluye) {
     baseLinea = Math.round(subLinea / (1 + (tarifa / 100)));
     ivaLinea = subLinea - baseLinea;
   }
   ```
   Aplica redondeo entero `Math.round` en **cada línea de la venta**.
2. **En el Backend (`sales.repository.js` L146-167):**
   ```javascript
   baseGravable: d.baseGravable !== undefined ? Number(d.baseGravable) : (d.cantidad * Number(d.precioUnitario))
   ```
   Si el payload no envía explícitamente `baseGravable`, el backend toma `cantidad * precioUnitario` como base gravable **sin descontar el IVA**, cobrando el IVA por duplicado o reportando una base inflada.

### Ejemplo Numérico de Redondeo en Línea vs Factura:
- 3 productos de $10,500 COP c/u con IVA 19% incluido ($P_{inc} = 10,500$):
  - **Cálculo línea a línea en Frontend:**
    - Base línea: $\text{round}(10500 / 1.19) = \text{round}(8823.529) = 8,824$
    - IVA línea: $10500 - 8824 = 1,676$
    - Suma de 3 líneas: $\text{Base Total} = 26,472$, $\text{IVA Total} = 5,028$, $\text{Total} = 31,500$.
  - **Cálculo Global Fiscal Esperado:**
    - $\text{Base Total} = \text{round}(31500 / 1.19) = 26,471$
    - $\text{IVA Total} = 31500 - 26471 = 5,029$.
  - **Diferencia:** Descuadre recurrente de $\pm \$1\text{ COP}$ entre cabecera y suma de bases por redondear enteros en cada ítem.

---

## 5. Cálculos de Producción y Merma (T5)

1. **Vulnerabilidad en `factorEscala` (`production.repository.js` L157):**
   ```javascript
   const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);
   ```
   Si una receta se crea con `rendimientoBase = 0`, el operador `|| 1` enmascara el error y calcula sobre base 1.
   - Si la receta era para 100 litros de yogurt y se pone 0 por error, al producir 100 unidades el sistema calcula `factorEscala = 100 / 1 = 100`, requiriendo $100 \times 12\text{ L} = 1,200\text{ L}$ de leche en lugar de 12 L (**explosión de materiales al 10,000%**).
2. **Merma sin Límite Físico (`production.repository.js` L169):**
   ```javascript
   reqTeorico = reqTeorico * (1 + (merma / 100));
   ```
   No existe validación Poka-Yoke de merma ($0 \le \text{merma} < 100$). Si un usuario digita 150%, el requerimiento se multiplica por 2.5x; si digita negativo (-10%), descuenta menos insumo del que realmente consume.
3. **Costo Arbitrario Hardcodeado en Intermedios WIP (`production.repository.js` L251-253):**
   ```javascript
   if (costoUnitario <= 0 || costoUnitario > 50000) {
     costoUnitario = 3400; // Valor de referencia estándar por litro de base de yogurt
   }
   ```
   Si el costo real del semielaborado no está liquidado o supera $50,000 COP, el backend **reemplaza silenciosamente el costo por $3,400 COP**, falseando por completo el costo teórico de fabricación.

---

## 6. Relación con Hallazgos Previos (T6)

- **Amplificación de `HAL-F1-03` (División /1000):** La heurística de costo unitario $>100$ divide arbitrariamente por 1000. Al consumirse en producción (`production.repository.js` L256), `costoTeorico` multiplica por este costo corrupto, subestimando el costo de las órdenes de producción.
- **Amplificación de `HAL-F2-02` (Stock sin Normalizar):** En `production.repository.js` L735, la resta `stockActual - qtyReal` trunca a 0 con `Math.max`. Al no tener unidades alineadas, destruye el saldo real de inventario.
- **Amplificación de `HAL-F3-03` (Granel Forzado a 1000 ml):** Si el granel inyecta 1000 ml para un tanque de 500 L, la fórmula de costo de producto intermedio (`costoUnitarioFabricacion`) distribuye el costo total sobre 1 litro en vez de 500 litros, inflando el costo unitario por 500x y activando la trampa hardcodeada de los $3,400 COP.

---

## 7. Hallazgos Formalizados de la Fase 4

| ID | Severidad | Módulo / Archivo | Línea | Fórmula Afectada | Problema Técnico Detectado | Impacto Demostrado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F4-01** | **CRÍTICO** | `purchases.repository.js` | L176-185 | Costo Promedio en Compras | Compras incrementa stock físico pero **NO recalcula ni actualiza `costoPromedio` en inventario**. | El costo de bodega queda desactualizado; distorsiona la valoración financiera de inventarios. |
| **HAL-F4-02** | **CRÍTICO** | `production.repository.js` | L251-253 | Costo WIP Fallback | Hardcoding de $3,400 COP si costo unitario de semielaborado es $\le 0$ o $>50,000$. | Suprime el costo real de producción sustituyéndolo por una constante arbitraria. |
| **HAL-F4-03** | **CRÍTICO** | `production.repository.js` | L157 | `factorEscala` | `rendimientoBase = 0` cae en fallback `\|\| 1` sin lanzar excepción. | Puede multiplicar los requerimientos de insumos por $100\times$ o más en un error de digitación. |
| **HAL-F4-04** | **ALTO** | `sales.repository.js` | L146 | `baseGravable` en Ventas | Si no viene `baseGravable`, backend asume `cantidad * precioUnitario` ignorando `precioIncluyeIva`. | Facturación con base inflada o duplicidad de impuesto en reportes de venta. |
| **HAL-F4-05** | **ALTO** | `supplier-prices.service.js` | L52 | `costoUnidadBase` | Divide `precioTotalConIva / cantidadEquivalenteBase` sin discriminar IVA descontable. | Infla el costo unitario de materia prima con el impuesto cuando debería ser costo neto. |
| **HAL-F4-06** | **MEDIO** | `useSaleForm.js` vs Backend | L120 / L148 | Redondeo de IVA en Línea | `Math.round` en cada ítem en vez de aplicar redondeo al total de la factura. | Provoca desbalances de $\pm \$1\text{ COP}$ entre el total facturado y la suma de impuestos. |

---

## 8. Conteo Consolidado de Severidad (Fase 4)

- **CRÍTICO:** 3 (`HAL-F4-01`, `HAL-F4-02`, `HAL-F4-03`)
- **ALTO:** 2 (`HAL-F4-04`, `HAL-F4-05`)
- **MEDIO:** 1 (`HAL-F4-06`)
- **BAJO:** 0  
**Total Hallazgos Fase 4:** **6**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: Todas las fórmulas, fallbacks de $3400, omisión de CPP en compras y cálculos de IVA fueron extraídos y comprobados literalmente en el código fuente.

---
**FASE 4 COMPLETADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 5.**
