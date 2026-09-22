# INFORME-31: FASE 10 — SCHEMA PRISMA Y FRONTEND VS BACKEND

> **Documento:** Auditoría Exhaustiva de Tipos de Datos en Prisma, Escalas Numéricas, Contratos DTO y Discrepancias Frontend vs Backend  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-10-schema-frontend-vs-backend/TASK-11-FASE-10-SCHEMA-FRONTEND-VS-BACKEND.md`  
> **Estado:** Fase 10 completada al 100%. Modo auditoría pura (sin modificar código).

---

## 1. Matriz de Tipos de Datos en `schema.prisma` (T1)

### A. Campos `@db.Decimal(X, Y)` Formalizados

| Modelo / Tabla | Campo | Precisión ($X$) | Escala ($Y$) | Uso / Semántica | Riesgo de Insuficiencia / Límite |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Insumos` | `costoBase` | 12 | 2 | Costo de referencia COP | 2 decimales insuficiente para microgramos ($COP/mg). |
| `Precios_Proveedores` | `precioCompra`, `costoUnidadBase` | 12 | 2 | Tarifa de compra e insumo base | Escala 2 trunca costos unitarios pequeños (ej. azúcar a $3.254 COP/g). |
| `Precios_Proveedores` | `costoBaseSinIva` | 12 | 4 | Costo desglosado sin IVA | Escala adecuada (4 decimales). |
| `Precios_Proveedores`, `Productos`, `Compras`, `Detalles_Compra`, `Detalle_Ventas` | `porcentajeIva`, `tarifaIva`, `margenObjetivo` | 5 | 2 | Porcentajes impositivos y márgenes | Rango $[-999.99, 999.99]\%$. Suficiente para IVA 19% y mermas. |
| `Productos`, `Ventas`, `Detalle_Ventas` | `precioVenta`, `totalVenta`, `subtotal`, `ivaTotal`, `precioUnitario`, `totalLinea` | 12 | 2 | Transacciones monetarias COP | Máximo $\$9,999,999,999.99\text{ COP}$. Adecuado para el alcance actual. |
| `Recetas`, `Detalles_Receta` | `rendimientoBase`, `cantidadRequerida`, `mermaPorcentaje` | Default (65, 30)* | Default | Cantidades de formulación y merma | Sin restricción `@db.Decimal(...)` explícita en postgres. |
| `Producciones`, `Detalle_Produccion` | `costoTeorico`, `costoReal` | 12 | 2 | Costos liquidados de manufactura | Adecuado. |
| `Metas_Empresariales` | `valorObjetivo` | 14 | 2 | Metas financieras anuales | Admite hasta $\$999,999,999,999.99\text{ COP}$. Óptimo. |

*\*Nota: En Prisma, los campos `Decimal` sin modificador `@db.Decimal(p, s)` se mapean a `numeric` arbitrario en PostgreSQL.*

### B. Campos `Float` e `Int` en Schema
- **Campos `Float`:** **0 campos**. No se utilizan primitivos float en el modelo relacional.
- **Campos `Int`:** Usados exclusivamente para tiempos (`tiempoEstandarMin`), días de crédito (`diasCredito`), órdenes visuales (`orden`) y prioridades (`ordenPrioridad`). Ningún campo cuantitativo ni monetario usa `Int` indebidamente.

---

## 2. Auditoría de Escalas Decimal (T2)

1. **Moneda COP (`Decimal(12, 2)`):**
   - Suficiente para el valor total de ventas y compras (hasta 10 mil millones de pesos).
   - **Grave Insuficiencia en Costos Unitarios de Insumos Pequeños:**
     `costoUnidadBase` en `Precios_Proveedores` (L81) y `Insumos.costoBase` (L36) usan **`Decimal(12, 2)`**.
     - Sal o azúcar: $\$3,200\text{ COP/kg} = \$3.20\text{ COP/g}$. Si sube un 5%, pasa a $\$3.36\text{ COP/g}$.
     - Cultivo de alta concentración: $\$50,000\text{ COP} / 500\text{ g} = \$100.00\text{ COP/g}$. Si se dosifica en miligramos, el costo es **$\$0.1000\text{ COP/mg}$**.
     - Al estar limitado a 2 decimales, no puede registrar fracciones menores a $\$0.01\text{ COP}$, introduciendo redondeos severos en microdosificaciones.
2. **Campos sin Escala Explícita en Kardex:**
   `Inventario.cantidadActual`, `InventarioProducto.cantidadActual` y `Lote.cantidadDisponible` están definidos como `Decimal` genérico (sin `@db.Decimal`). Al interactuar con PostgreSQL adoptan `NUMERIC`, pero al degradarse en backend con `Number()` pierden el beneficio de la escala ilimitada.

---

## 3. Consistencia de Tipos entre Schema y DTOs (T3)

- **DTOs Vacíos sin Validación (Vulnerabilidad Arquitectónica):**
  - `CreateSaleDto` (`apps/api/src/sales/dto/create-sale.dto.js` L1): **Clase completamente vacía** (`export class CreateSaleDto {}`).
  - `CreatePurchaseDto` (`apps/api/src/purchases/dto/create-purchase.dto.js` L1): **Clase vacía** (`export class CreatePurchaseDto {}`).
  - `CreateLotDto` (`apps/api/src/lots/dto/create-lot.dto.js` L1): **Clase vacía**.
  - `CreatePaymentDto` (`apps/api/src/payments/dto/create-payment.dto.js` L1): **Clase vacía**.
- **Consecuencia Crítica:** Los módulos transaccionales más sensibles (Ventas, Compras, Pagos y Lotes) **no ejecutan validación de tipos mediante `class-validator`**. Aceptan cualquier payload JSON sin tipado estricto, permitiendo inyectar números, strings, nulos o valores negativos directamente a los repositorios.

---

## 4. Frontend: Duplicación de Cálculos vs Backend (T4)

| Operación / Cálculo | Implementación en Frontend (`apps/web`) | Implementación en Backend (`apps/api`) | ¿Duplicado? | ¿Coinciden los Resultados? |
| :--- | :--- | :--- | :--- | :--- |
| **Subtotal de Venta** | `useSaleForm.js` L91: `cant * precio` | `sales.repository.js` L136: `d.cantidad * d.precioUnitario` | **SÍ** | ✅ Coinciden. |
| **Descuentos** | `useSaleForm.js` L92: `brutoLinea - desc` | `sales.repository.js`: Recibe `descuentoTotal` | **SÍ** | ⚠️ Frontend aplica por línea; backend no revalida. |
| **Base Gravable e IVA** | `useSaleForm.js` L120: `Math.round(subLinea / 1.19)` | `sales.repository.js` L146: `cant * precio` (fallback crudo) | **SÍ** | ❌ **DIVERGEN**. Backend ignora IVA si no viene `baseGravable`. |
| **Saldo Pendiente** | `useSaleForm.js` L144: `totalVenta - valorPagado` | `payments.repository.js` L55: `totalVenta - nuevoValorPagado` | **SÍ** | ⚠️ Ambos usan `Math.max(0, ...)`. |
| **Margen Comercial** | `SaleBalanceReceiptCard.jsx` L59 | `dashboard.service.js` L562: `(precio - costo)/precio` | **SÍ** | ❌ **DIVERGEN**. Dashboard divide entre precio con IVA. |

---

## 5. Discrepancias Graves Frontend vs Backend (T5)

1. **Falta de Validación Server-Side en Facturación:**
   El backend en `SalesRepository.create` no recalcula los totales: confía ciegamente en `data.subtotal`, `data.totalVenta`, `data.ivaTotal` y `data.descuentoTotal` enviados por el navegador. Un cliente HTTP malicioso puede enviar `totalVenta: 1` para una compra de $\$1,000,000\text{ COP}$ y el backend lo persiste sin validar.
2. **Redondeo Asimétrico de Impuestos:**
   El frontend redondea a enteros (`Math.round`) en cada fila, mientras el schema en BD define `@db.Decimal(12, 2)` con soporte de centavos, generando descuadres contables acumulativos de centavos (`HAL-F4-06`).

---

## 6. Relación con Hallazgos Previos (T6)

- **Con `HAL-F4-07` (288 `Number()`):** Se constata que el 100% de las conversiones `Number()` en backend obedecen a que los DTOs no tipifican campos Decimal, forzando a los repositorios a hacer coerciones manuales inline.
- **Con `HAL-F5-03` (Cuádruple Casteo):** Se origina por la desconexión total de contratos: el backend serializa Decimals a strings en JSON, el frontend los convierte a números primitivos con `Number()`, y los devuelve al backend sin validación de esquema.

---

## 7. Hallazgos Formalizados de la Fase 10

| ID | Severidad | Módulo / Archivo | Línea | Campo / Tipo | Problema Técnico Detectado | Impacto Demostrado | Condición |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F10-01** | **CRÍTICO** | `sales/dto`, `purchases/dto`, `payments/dto` | L1 en c/u | DTOs Transaccionales | DTOs vacíos (`{}`) sin decoradores de `class-validator` en Ventas, Compras y Pagos. | Acepta payloads corruptos o manipulados sin validación server-side de tipos ni límites. | Cualquier petición POST a ventas, compras o pagos. |
| **HAL-F10-02** | **CRÍTICO** | `sales.repository.js` | L165-171 | Totales de Venta | Backend persiste totales financieros enviados por el cliente sin recalcular ni validar integridad aritmética en el servidor. | Cliente puede alterar `totalVenta` en el payload JSON pagando menos del valor real de los productos. | Petición de venta con totales alterados. |
| **HAL-F10-03** | **ALTO** | `schema.prisma` (`Precios_Proveedores`, `Insumos`) | L36, L81 | `costoUnidadBase`, `costoBase` | Escala restringida a `@db.Decimal(12, 2)` en insumos que se dosifican en gramos o miligramos. | Imposibilidad de almacenar fracciones de centavo ($COP/g o $COP/mg), distorsionando costos de micro-ingredientes. | Materias primas de alto rendimiento y bajo gramaje. |

---

## 8. Conteo Final de Severidad (Fase 10)

- **CRÍTICO:** 2 (`HAL-F10-01`, `HAL-F10-02`)
- **ALTO:** 1 (`HAL-F10-03`)
- **MEDIO:** 0
- **BAJO:** 0  
**Total Hallazgos Fase 10:** **3**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: El contenido vacío de los DTOs, la falta de recálculo server-side en ventas y las escalas de `@db.Decimal` en el schema fueron verificados directamente en los archivos correspondientes.

---
**FASE 10 FINALIZADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 11.**
