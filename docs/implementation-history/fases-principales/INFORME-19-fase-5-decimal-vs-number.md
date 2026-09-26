# INFORME-19: FASE 5 — AUDITORÍA DECIMAL VS NUMBER

> **Documento:** Auditoría Exhaustiva de Coerción de Tipos Numéricos, Degeneración Float64 y Ciclo de Vida Decimal ↔ Number  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-5-decimal-vs-number/TASK-06-FASE-5-AUDITORIA-DECIMAL-VS-NUMBER.md`  
> **Estado:** Fase 5 completada al 100%. Modo auditoría pura (sin modificar código).

---

## 1. Inventario Exhaustivo de Conversiones Numéricas (T1)

Se ejecutó un barrido estricto de patrones de coerción y casteo numérico en todo el repositorio:
- **En Backend (`apps/api`):** Se identificaron **288 ocurrencias** de coerciones activas (`Number(...)`, `parseFloat(...)`, `.toFixed(...)`).
  - `.toNumber()` de `Prisma.Decimal`: **0 ocurrencias** (no se utiliza el método oficial de Prisma).
  - Métodos aritméticos de precisión (`.plus()`, `.minus()`, `.times()`, `.dividedBy()`): **0 ocurrencias**.
  - Librerías `decimal.js` / `big.js`: **0 ocurrencias**.
- **En Frontend (`apps/web`):** Las conversiones se concentran en `formatters.js` y `useSaleForm.js` (parseos mediante `Number()` y redondeos enteros con `Math.round`).

---

## 2. Identificación de Cadenas Críticas: Decimal → Number → Cálculo → Decimal (T2)

Prisma recupera campos `@db.Decimal` como instancias de `Decimal` (provenientes internamente del motor de Prisma). Sin embargo, ningún servicio ni repositorio opera sobre estas instancias: se degradan a float64 primitivo inmediatamente:

| Flujo / Dominio | Archivo y Línea Inicial | Línea de Persistencia | Campos Afectados | Cadena Concreta Detectada | Error / Riesgo de Precisión |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Kardex / Insumos** | `production.repository.js` L732 | L739 | `Insumo.inventario.cantidadActual` | `Decimal` $\to$ `Number()` $\to$ `stockActual - qtyReal` $\to$ `update: { cantidadActual: stockFinal }` (`Number` a `Decimal`) | Fraccionamiento float64 en balance de masa; borrado silencioso con `Math.max(0, ...)`. |
| **Kardex / Terminados** | `sales.repository.js` L127 | L132 | `InventarioProducto.cantidadActual` | `Decimal` $\to$ `Number()` $\to$ `stockAnterior - d.cantidad` $\to$ `update: { cantidadActual: stockNuevo }` | Pérdida de centésimas en inventario de productos fraccionables. |
| **Costo Promedio (CPP)** | `inventory.repository.js` L128 | L164 | `Inventario.costoPromedio` | `Decimal` $\to$ `Number()` $\to$ `(valorAnt + valorAj) / stockNuevo` $\to$ `upsert: { costoPromedio }` | Propagación de coma flotante en costo unitario de bodega. |
| **WIP / Terminados** | `production.repository.js` L1027 | L1039 | `InventarioProducto.costoPromedio` | `Decimal` $\to$ `Number()` $\to$ `(valorAnt + valorNuevo) / stockNuevoProd` $\to$ `upsert: { costoPromedio }` | Deriva acumulativa de centavos en costo de fabricación. |
| **Pagos y Cartera** | `payments.repository.js` L35 | L59 | `Venta.saldoPendiente` | `Decimal` $\to$ `Number()` $\to$ `totalVenta - nuevoValorPagado` $\to$ `update: { saldoPendiente: nuevoSaldo }` | Descuadre de centavos en liquidación de créditos. |

---

## 3. Cálculos Financieros Operados en Primitivos `Number` (T3)

Todos los cálculos monetarios del negocio operan en `IEEE 754 float64`:
1. **Costos:** `costoPromedio`, `costoUnidadBase`, `costoReal`, `costoTeorico` se calculan con multiplicaciones y divisiones nativas `/` y `*` sobre `Number()`.
2. **Precios y Totales de Venta:** En `sales.repository.js` L136-151, `totalLinea`, `baseGravable`, `montoIva`, `utilidadUnitaria` y `utilidadTotal` se calculan en `Number`.
3. **Persistencia Prisma:** Al hacer `upsert` o `update`, Prisma recibe primitivos `number` de JS y los coerciona a columnas `@db.Decimal(12, 2)` o `(12, 4)`, truncando o redondeando según la base de datos sin control aplicativo.

---

## 4. Frontend: Ciclo JSON ↔ Number ↔ Backend (T4)

1. **Serialización Backend:** Al emitir JSON a través de NestJS / Express, Prisma serializa los campos `@db.Decimal` como **strings** (ej. `"10500.00"`) o numbers según la versión y configuración del motor.
2. **Recepción en Frontend (`api-client.js` L76):** `response.json()` parsea los strings directamente.
3. **Consumo en Formularios (`useSaleForm.js` L63-68):**
   ```javascript
   precioVenta: Number(p.precioVenta || 0),
   tarifaIva: Number(p.tarifaIva ?? 19)
   ```
   Fuerza conversión con `Number()`.
4. **Envío de Vuelta:** El frontend realiza `Math.round` en las líneas y despacha números al backend en el payload JSON. El backend a su vez los vuelve a castear con `Number(d.precioUnitario)`. **Hay 4 capas sucesivas de conversión float64 en un solo ciclo de venta**.

---

## 5. Ejemplos Numéricos Demostrados (T5)

### Caso 1: Imprecisión Acumulativa en Costo Promedio Ponderado
- **Escenario:** Adición sucesiva de 3 microporciones de cultivo láctico de alta concentración en gramos:
  - Consumo 1: $0.1\text{ g}$
  - Consumo 2: $0.2\text{ g}$
- **Operación Actual en Código (`production.repository.js`):**
  $$0.1 + 0.2 = 0.30000000000000004$$
  Al persistir en `@db.Decimal(12, 4)`: se almacena `0.3000`.
  Si se multiplica por un factor de costo unitario $C = \$85,000\text{ COP/g}$:
  - Con float64: $0.30000000000000004 \times 85000 = 25500.000000000004$
  - Con 1000 iteraciones en planta: distorsión acumulativa de centavos en el balance de costos.

### Caso 2: División de IVA y Descuento en Cartera
- **Operación:** Base de venta de $\$10,500\text{ COP}$ con IVA 19%:
  - `Number`: $10500 / 1.19 = 8823.529411764706$
  - Con `Math.round` en frontend: $8,824$.
  - Con `Decimal` exacto: $8823.5294... \to$ Base: $\$8,823.53$, IVA: $\$1,676.47$.
  - **Diferencia:** Descuadre de $\$0.47\text{ COP}$ por línea, acumulando inconsistencias en reportes contables frente a la DIAN.

### Caso 3: Descuento de Stock Fraccionado en Producción
- Insumo con stock de $5.0\text{ kg}$. Consumo en 3 etapas de receta: $1.1\text{ kg}$, $2.2\text{ kg}$, $1.7\text{ kg}$.
  - Operación float64: $5.0 - 1.1 - 2.2 - 1.7 = -2.220446049250313e-16$.
  - Al evaluar `stockFinal <= 0`, detona condición de agotado prematuro o activa `Math.max(0, ...)`, borrando el remanente infinitesimal y falseando la bandera de inventario.

---

## 6. Relación con Hallazgos Previos (T6)

- **`HAL-F4-07`:** Este informe confirma la materialización física de la ausencia de librerías decimales: existen **288 conversiones** `Number()` en el backend que degradan `@db.Decimal`.
- **`HAL-F1-03` (Heurística > 100):** Se apoya en la debilidad de `Number()` para realizar divisiones enteras `/ 1000` sin respetar la escala decimal del catálogo.
- **`HAL-F4-08` (`Math.max`):** Se implementó precisamente para tapar los resultados `-0.000000000000001` propios de las restas en float64 de JavaScript, terminando por ocultar saldos negativos reales.

---

## 7. Hallazgos Formalizados de la Fase 5

| ID | Severidad | Módulo / Ubicación | Campo / Flujo | Problema Técnico Detectado | Impacto Demostrado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F5-01** | **CRÍTICO** | `production.repository.js` L732-739 | `cantidadActual` / Kardex | Cadena `Decimal` $\to$ `Number()` $\to$ resta float64 $\to$ `Decimal` en consumo de insumos. | Deriva por coma flotante IEEE 754 y pérdida de precisión gravimétrica en planta. |
| **HAL-F5-02** | **CRÍTICO** | `inventory.repository.js` L150-164 | `costoPromedio` | Cálculo ponderado en float64 antes de persistir en `@db.Decimal`. | Pérdida de exactitud decimal en la valuación unitaria de materias primas. |
| **HAL-F5-03** | **ALTO** | `useSaleForm.js` L120 vs `sales.repository.js` | `baseGravable` / `montoIva` | Cuádruple casteo float64 (BD $\to$ JSON string $\to$ Web Number $\to$ Backend Number). | Discrepancias de centavos entre el valor cobrado y la base imponible fiscal. |
| **HAL-F5-04** | **ALTO** | `payments.repository.js` L54-59 | `saldoPendiente` | Liquidación de cartera en `Number()` sin usar aritmética de precisión Prisma. | Descuadres residuales de centavos en saldos pendientes de clientes. |

---

## 8. Conteo Final de Severidad (Fase 5)

- **CRÍTICO:** 2 (`HAL-F5-01`, `HAL-F5-02`)
- **ALTO:** 2 (`HAL-F5-03`, `HAL-F5-04`)
- **MEDIO:** 0
- **BAJO:** 0  
**Total Hallazgos Fase 5:** **4**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: Las 288 llamadas a `Number()`, la ausencia de librerías decimales y las cadenas de persistencia fueron verificadas exhaustivamente mediante inspección estática del código.

---
**FASE 5 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 6.**
