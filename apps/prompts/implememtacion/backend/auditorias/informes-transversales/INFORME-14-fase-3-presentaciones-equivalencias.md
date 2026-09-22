# INFORME-14: FASE 3 — PRESENTACIONES Y EQUIVALENCIAS BASE

> **Documento:** Auditoría de Presentaciones Comerciales, Factores Equivalentes y Trazabilidad Multicapa  
> **Directiva base:** `apps/prompts/implememtacion/backend/auditorias/tareas/fase-3-presentaciones-equivalencias/TASK-04-FASE-3-PRESENTACIONES-EQUIVALENCIAS-BASE.md`  
> **Estado:** Fase 3 completada al 100%. Modo solo lectura (sin modificar código).

---

## 1. Inventario de Campos de Presentación (T1)

| Campo | Modelo(s) / Ubicación | Tipo BD | Semántica Inferida | Uso en Código | Riesgo Detectado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`cantidadPresentacion`** | `PrecioProveedor` | `Decimal` | Contenido nominal del empaque de compra (ej. 50 en Bulto 50Kg). | `supplier-prices.service.js`: no se usa en cálculos (usa `cantidadEquivalenteBase`). `purchases.repository.js`: se hardcodea a `1`. | Desalineado: se confunde conteo de empaques con contenido. |
| **`cantidadEquivalenteBase`** | `PrecioProveedor` | `Decimal` | Factor multiplicador para llevar empaque a la unidad base del insumo. | `supplier-prices.service.js`: `costoUnidadBase = precioCompra / cantidadEquivalenteBase`. `purchases.repository.js` L295: `factorReal`. | Si difiere de la unidad física base, distorsiona el costo unitario. |
| **`cantidadOz`** | `Presentacion` | `Decimal?` (default 0) | Capacidad comercial en onzas del envase. | Solo string cosmético: `inventory.repository.js` L86 y `products.repository.js` L57 (`${cantidadOz} oz / ${cantidadMl} ml`). | Ambiguo: no define si es masa o volumen; `seed` usa 16.9 oz para 500 g y 33.8 oz para 1 L. |
| **`cantidadMl`** | `Presentacion` | `Decimal?` (default 0) | Volumen nominal en mililitros del envase. | En `presentations.service.js` L33 asigna 1000 ml si es granel. En productos es puramente informativo. | Desconectado de recetas y ventas. |
| **`unidadMedida`** | `Presentacion` | `String` (default "ml") | Unidad física declarada para la presentación del producto. | No se propaga a los lotes de producción ni a movimientos de inventario. | Causa raíz de `HAL-F1-02` (lotes terminados quedan en `'UNIDAD'`). |
| **`unidadPresentacion`** | `PrecioProveedor` | `String` | Unidad del empaque comprado (ej. 'Kilogramos', 'Litros'). | Meramente descriptivo; no valida coherencia dimensional contra `insumo.unidadBase`. | Permite registrar compra en unidades incompatibles. |

---

## 2. Trazabilidad de Equivalencias en Presentaciones Reales (T2)

Se analizan 4 presentaciones del catálogo real (`seed-test-data.js`):

| Presentación | Insumo / Producto Asociado | Cant. Presentación Declarada | Equivalente Base Esperado | Equivalente Base Real en BD | ¿Se respeta en Compras? | ¿En Inventario? | ¿En Producción / Receta? | ¿En Ventas? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Cantina 40L** | Leche cruda (`unidadBase='Litros'`) | 40 Litros | 40 | 40 | ⚠️ **NO** (`HAL-F1-04`: busca `'Lt'/'Lts'`, no escala) | Stock queda en unidades planas | Se formula en Litros o ml | No aplica (materia prima) |
| **Bolsa 1Kg** | Estabilizante (`unidadBase='Gramos'`) | 1 Kilogramo | 1000 Gramos | 1000 | ⚠️ **NO** (`HAL-F1-04`: no escala si unidadBase es 'Gramos') | ⚠️ **NO** (`HAL-F1-03`: divide /1000 si costo>100) | Receta descuenta en gramos | No aplica (materia prima) |
| **Vaso 3.5 oz** | Yogur Escolar 3.5 oz | 3.5 oz / 105 ml | 105 ml (o 1 und) | Campo ausente en `Producto` | No aplica | Trackea unidades discretas | Receta rendimiento=100 und | Venta descuenta 1 und entera |
| **Paca x1000** | Vaso 3.5 oz (Empaque) | 1000 Unidades | 1000 | 1000 | ✅ Sí (no escala por ser unidad neutra) | Trackea unidades | Receta exige unidad discreta | No aplica (empaque) |

---

## 3. Auditoría Específica de `cantidadOz` (T3)

1. **Semántica en Schema:** `cantidadOz` en `Presentacion` es un campo puramente descriptivo/cosmético. No interviene en cálculos aritméticos de inventario, costos ni recetas.
2. **Naturaleza (¿Volumen o Masa?):**
   - En `seed-test-data.js` L24: `Vaso 500g` $\to$ `cantidadOz: 16.9` ($500 / 29.5735 = 16.907$ fl oz volumétrica). Asume que 500 gramos equivalen a 500 ml ($d = 1.0$).
   - En `seed-test-data.js` L25: `1 Litro` $\to$ `cantidadOz: 33.8` ($1000 / 29.5735 = 33.814$ fl oz).
   - *Dictamen:* En presentaciones comerciales representa **Onzas Líquidas (Fluid Ounces US)**.
3. **Contradicción con `HAL-F1-01`:** En backend `UnitConverter` la trata como volumen ($29.5735\text{ ml}$), en frontend `unitNormalizer.js` la omite (factor neutro 1), y en `recipes.service.js` `extractCanonicalUnit` la aísla como `'ONZAS'`, rompiendo compatibilidad con `ml` (`HAL-F1-06`).

---

## 4. Consistencia Presentación ↔ Inventario ↔ Venta (T4)

- **Unidades de Inventario de Producto Terminado:** `InventarioProducto` almacena `cantidadActual` como un número escalar sin columna de unidad.
- **Creación en Producción:** `production.repository.js` L945 fija `unidadLote = esIntermedio ? 'Litros' : 'UNIDAD'`.
- **Descuento en Ventas:** `sales.repository.js` L128 hace `stockNuevo = stockAnterior - d.cantidad`. No existe noción de fracción de caja o presentación múltiple. Si se vende 1 unidad de "Yogur Escolar 3.5 oz", descuenta 1 unidad física.
- **Inconsistencia Crítica:** Si un producto se define en empaque secundario (ej. "Caja x 12 unidades") como presentación de venta, el sistema no posee desglose de desempacado: vender 1 caja descuenta 1 del stock de productos, sin saber si el stock de bodega estaba en botellas individuales o en cajas.

---

## 5. Conversiones Ad-Hoc de Presentación (T5)

1. **Doble interpretación en Compras (`purchases.repository.js` L206-232):**
   ```javascript
   const contenido = Number(detalle.contenidoUnitario || detalle.contenidoBase || detalle.cantidadEquivalenteBase || 1);
   // ...
   cantidadEquivalenteBase: contenido,
   cantidadPresentacion: 1
   ```
   Al registrar la compra, sobreescribe `cantidadPresentacion = 1` y asigna todo el empaque a `cantidadEquivalenteBase`.
2. **Autocompletado Mágico en Presentaciones Granel (`presentations.service.js` L32-35):**
   ```javascript
   if (isGranel && (!payload.cantidadMl)) {
     payload.cantidadMl = 1000;
     payload.cantidadOz = payload.cantidadOz || 33.81;
   }
   ```
   Inyecta valores por defecto fijos de 1000 ml y 33.81 oz sin importar el tamaño real del tanque o balde granel configurado.

---

## 6. Hallazgos Formalizados de la Fase 3

| ID | Severidad | Módulo / Archivo | Línea | Campo | Problema Técnico | Impacto Demostrado | Condición |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HAL-F3-01** | **ALTO** | `purchases.repository.js` | L232 | `cantidadPresentacion` | Sobreescribe `cantidadPresentacion = 1` en `PrecioProveedor` perdiendo el tamaño nominal del empaque (ej. Bulto 50Kg queda como cant=1 equiv=50). | Destruye la información del empaque del proveedor; reportes de compra no pueden distinguir bultos de unidades. | Recepción de compras con proveedor enlazado. |
| **HAL-F3-02** | **CRÍTICO** | `presentations.service.js` vs `production.repository.js` | L16 / L945 | `unidadMedida` | Desconexión total de `Presentacion.unidadMedida`. Producción hardcodea `'UNIDAD'` en producto terminado ignorando si era `g`, `ml` o `litros`. | `Vaso 500g` ingresa a Kardex como `'UNIDAD'`, impidiendo balance gravimétrico de masa en bodega de terminados. | Cierre de orden de producción terminada. |
| **HAL-F3-03** | **MEDIO** | `presentations.service.js` | L32-35 | `cantidadMl` / `cantidadOz` | Inyección forzada de `1000 ml` / `33.81 oz` para todo tipo `BALDE` o `TANQUE_GRANEL`. | Si un balde granel es de 20 L o un tanque de 500 L, la presentación queda registrada como 1 Litro / 33.8 oz. | Creación de presentación granel sin especificar volumen. |
| **HAL-F3-04** | **ALTO** | `supplier-prices.service.js` | L52 | `costoUnidadBase` | Cálculo ciego `precioCompra / cantidadEquivalenteBase` sin validar coherencia dimensional de la unidad del proveedor con la unidad del catálogo. | Proveedor cotiza en galón (3.785 L); si usuario introduce cant=1 equiv=1, el costo por litro queda en $40,000 en vez de $10,568. | Registro de tarifas con unidades no canónicas. |

---

## 7. Relación con Fase 1 y Fase 2 (T6)

- **Amplificación de `HAL-F1-04` (Compras):** `HAL-F3-01` y la discrepancia de `cantidadEquivalenteBase` empeoran el escalado de compras: si la compra no escala por texto (`HAL-F1-04`) y la presentación fuerza `cantidadPresentacion = 1`, el inventario queda doblemente distorsionado.
- **Amplificación de `HAL-F2-02` (Producción):** Al ignorarse `Presentacion.unidadMedida` (`HAL-F3-02`), la orden genera lotes en `'UNIDAD'` mientras los insumos se consumieron en `kg`/`litros`, haciendo imposible conciliar entradas vs salidas en balance de masa.

---

## 8. Conteo Consolidado de Severidad (Fase 3)

- **CRÍTICO:** 1 (`HAL-F3-02`)
- **ALTO:** 2 (`HAL-F3-01`, `HAL-F3-04`)
- **MEDIO:** 1 (`HAL-F3-03`)
- **BAJO:** 0  
**Total Hallazgos Fase 3:** **4**

---

## 9. Lista de `NO VERIFICADO`
- `Ninguno`: Todos los flujos de presentaciones en BD, servicios, compras y producción fueron validados contra el código fuente y seeds.

---
**FASE 3 COMPLETADA AL 100%. DETENIDO SEGÚN REGLA. NO AVANZAR A FASE 4.**
