# INFORME-27: FASE 8 — PRODUCCIÓN, RECETAS Y WIP

> **Documento:** Auditoría Integral de Escalamiento de Recetas, Merma, Transferencia de Costos WIP y Genealogía de Lotes  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-8-produccion-recetas-wip/TASK-09-FASE-8-PRODUCCION-RECETAS-WIP.md`  
> **Estado:** Fase 8 completada al 100%. Modo auditoría de solo lectura (código intacto).

---

## 1. Inventario de Campos de Producción y Recetas (T1)

| Campo | Modelo | Tipo BD | Semántica Inferida | Uso en Código | Riesgo Detectado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`rendimientoBase`** | `Receta` | `Decimal` | Tamaño del batch nominal de la fórmula (ej. 100 L o 100 und). | Base del divisor de `factorEscala` (`production.repository.js` L157). | Fallback `\|\| 1` encubre división por cero (`HAL-F4-03`). |
| **`cantidadRequerida`**| `DetalleReceta` | `Decimal` | Insumo necesario para el batch base. | Multiplicador base del BOM (`L167: cantRequerida * factorEscala`). | Sin tope superior; permite valores float64 no verificados. |
| **`cantidadPlanificada`**| `Produccion` | `Decimal` | Unidades o volumen total a fabricar en la orden. | Define el numerador de `factorEscala`. | Puede planificarse en unidades y consumirse en litros. |
| **`cantidadProducidaReal`**| `Produccion` | `Decimal?` | Rendimiento real obtenido al completar la orden. | Divisor de `costoUnitarioFabricacion` (`L916: costoTotalLote / qtyProducida`). | Si no se envía, toma `cantidadPlanificada` asumiendo rendimiento 100%. |
| **`cantidadTeorica`** | `DetalleProduccion` | `Decimal` | Requerimiento teórico congelado al abrir la orden. | Comparador contra `qtyReal` para calcular `diferencia`. | Sobreescrito prematuramente con `Math.ceil` (`HAL-F6-01`). |
| **`cantidadRealUtilizada`**| `DetalleProduccion` | `Decimal?` | Consumo real reportado por operario en planta. | Base para descontar inventario y liquidar `costoReal`. | Descuenta en unidad de receta sin normalizar (`HAL-F2-02`). |
| **`mermaPorcentaje`** | `DetalleReceta` | `Decimal` | Factor de desperdicio estimado por ingrediente. | Incrementa requerimiento: `* (1 + (merma / 100))`. | Sin validación $0 \le m < 100$; permite mermas negativas o $>100\%$. |
| **`unidadLote`** | `Lote` | `String` | Unidad física del lote creado en Kardex. | Asigna `'Litros'` si es intermedio o `'UNIDAD'` si es final (`L945`). | Ignora `Presentacion.unidadMedida` (`HAL-F3-02`). |

---

## 2. Auditoría del Escalamiento de Recetas (T2)

### Flujo de Escalamiento (`production.repository.js` L157-173):
1. **Cálculo de Factor:** Se calcula **una sola vez a nivel de cabecera**:
   ```javascript
   const factorEscala = cantidadProduccion / (Number(receta.rendimientoBase) || 1);
   ```
2. **Aplicación por Línea:**
   ```javascript
   let reqTeorico = Number(det.cantidadRequerida) * factorEscala;
   const merma = Number(det.mermaPorcentaje) || 0;
   reqTeorico = reqTeorico * (1 + (merma / 100));
   const esUnidadDiscreta = UNIDADES_DISCRETAS.includes((det.unidad || '').toUpperCase().trim());
   const cantidadFinal = esUnidadDiscreta ? Math.ceil(reqTeorico) : Number(reqTeorico.toFixed(4));
   ```
3. **Ejemplo Demostrado:**
   - Receta base de 100 L para producir 250 L $\to$ `factorEscala = 250 / 100 = 2.5`.
   - Empaque con requerimiento 10 tapas: $10 \times 2.5 = 25.0 \to \text{ceil}(25) = 25$.
   - Con merma de 5%: $25 \times 1.05 = 26.25 \to \text{ceil}(26.25) = 27\text{ tapas}$.
   - **Diagnóstico:** El factor no se redondea (opera en float64), pero el `Math.ceil` final destruye la fracción $26.25 \to 27$.

---

## 3. Auditoría de Merma (T3)

- **Validación de Rango:** **INEXISTENTE**. No existe validación de que $0 \le \text{mermaPorcentaje} < 100$.
- **Secuencia:** La merma se aplica **ANTES** del redondeo discreto:
  `reqTeorico = reqTeorico * (1 + (merma / 100))` y luego `Math.ceil(reqTeorico)`.
- **Ejemplo Demostrado:**
  - Receta pide 1,000 g con 5% de merma:
    $1000 \times 1.05 = 1050\text{ g}$.
  - Si un operario ingresa `mermaPorcentaje = -10%`, el requerimiento da $900\text{ g}$ (descuenta menos material del catálogo).
  - Si ingresa `mermaPorcentaje = 500%`, el requerimiento se multiplica por $6\times$, inflando compras e inventarios comprometidos sin restricción.

---

## 4. Transferencia de Costo WIP $\to$ Producto Final (T4 - Hallazgo Crítico `HAL-F8-01`)

### Falla Dimensional Catastrófica en la Transferencia de Costo WIP
En `production.repository.js` L780-885:
```javascript
const detUnidad = (det.unidad || '').toLowerCase().trim();
let decrementoLts = qtyReal;
if (detUnidad === 'g' || detUnidad === 'ml' || detUnidad === 'gramos') {
  decrementoLts = qtyReal / 1000;
}
// ... descuenta decrementoLts de los Lotes del producto intermedio ...
costoTotalLote += qtyReal * costoUnitarioIntermedio; // L877 ¡ERROR!
```
- **Mecanismo de Falla:**
  - El producto intermedio (ej. Base Láctea de Yogurt) tiene su inventario y lotes costeados en **Litros** (`costoUnitarioIntermedio = $3,400 COP/Litro`).
  - Si la receta del producto final formula el ingrediente en **Mililitros** (ej. $150\text{ ml}$ por vasito) o **Gramos**, `qtyReal` es **$150$**.
  - Para el stock, el sistema divide correctamente: `decrementoLts = 150 / 1000 = 0.15 L`.
  - **¡Pero para el costo multiplica directamente `qtyReal * costoUnitarioIntermedio`!**
    $$\text{Costo Liquidado} = 150 \times 3400 = \mathbf{\$510,000\text{ COP}}$$
    en lugar de:
    $$0.15 \times 3400 = \mathbf{\$510\text{ COP}}$$
- **Impacto Cuantificado:** **El costo transferido del WIP al producto final se infla por un factor de 1000x (+99,900% de sobrecosto)** siempre que la receta consuma el producto intermedio en gramos o mililitros.

---

## 5. Diferencias entre Producto Intermedio y Final (T5)

1. **Polimorfismo Ciego en `cantidadProducidaReal`:**
   - En producto intermedio representa **Litros** o **Kilogramos** a granel.
   - En producto terminado representa **Unidades** comerciales empacadas.
   - La tabla `Produccion` no posee columna de unidad; depende de inferencias frágiles basadas en `producto.categoria === 'INTERMEDIO_WIP'`.
2. **Desconexión con `unidadRendimiento`:**
   Si la receta define `unidadRendimiento = 'Gramos'`, al cerrar la orden `production.repository.js` L945 fuerza `unidadLote = 'Litros'` si es intermedio o `'UNIDAD'` si es final, ignorando la unidad técnica declarada por el maestro de recetas.

---

## 6. Relación con Hallazgos Previos (T6)

- **Con `HAL-F4-02` (Fallback $3400):** Si el costo del WIP es $\le 0$ o $>50000$, el fallback inyecta $\$3,400 COP/L$. Al combinarse con el error de factor 1000x de `HAL-F8-01`, un vaso de 150 ml de yogurt termina costando $\$510,000\text{ COP}$ en lugar de $\$510\text{ COP}$.
- **Con `HAL-F7-02` (Costo Instantáneo):** En L776, `costoUnitarioIntermedio` toma `intermediateProd.inventario.costoPromedio` en vez del costo real del lote de inóculo/base seleccionado en la asignación FEFO.
- **Con `HAL-F6-01` (Math.ceil):** En WIP líquidos, si por error la unidad quedó tipificada como discreta, `Math.ceil` redondearía $0.15\text{ L} \to 1.0\text{ L}$, multiplicando el consumo por $6.6\times$.

---

## 7. Hallazgos Formalizados de la Fase 8

| ID | Severidad | Módulo / Archivo | Línea | Campo / Flujo | Problema Técnico Detectado | Impacto Demostrado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F8-01** | **CRÍTICO** | `production.repository.js` | L877, L884 | `costoReal` en Consumo WIP | Multiplica `qtyReal` (en ml o g) por `costoUnitarioIntermedio` (en Litros) sin dividir por 1000. | Consumo de 150 ml de base ($3400/L) liquida $510,000 COP en vez de $510 COP (**Error factor 1000x**). | Receta con producto intermedio formulado en ml o gramos. |
| **HAL-F8-02** | **ALTO** | `production.repository.js` | L168-169 | `mermaPorcentaje` | Inexistencia de validación de límites ($0 \le m < 100$); permite mermas negativas o $>100\%$. | Merma negativa descuenta menos stock del real; merma $>100\%$ infla compras ilimitadamente. | Formulación con porcentaje de merma anómalo. |
| **HAL-F8-03** | **ALTO** | `production.repository.js` | L945 vs `schema.prisma` | `unidadLote` | Ignora `receta.unidadRendimiento` y fuerza `'Litros'` o `'UNIDAD'` sin validar la magnitud técnica. | Recetas con rendimiento en gramos o ml quedan registradas como `'UNIDAD'` en Kardex. | Finalización de orden de manufactura. |

---

## 8. Conteo Final de Severidad (Fase 8)

- **CRÍTICO:** 1 (`HAL-F8-01`)
- **ALTO:** 2 (`HAL-F8-02`, `HAL-F8-03`)
- **MEDIO:** 0
- **BAJO:** 0  
**Total Hallazgos Fase 8:** **3**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: El error multiplicativo de 1000x en la transferencia de costo WIP, la omisión de validación de merma y el hardcoding de unidades fueron demostrados y verificados directamente en el código fuente.

---
**FASE 8 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 9.**
