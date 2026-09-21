# REPORTE DE AUDITORÍA: CADENA DE ABASTECIMIENTO Y MÓDULO DE COMPRAS

> **Fecha:** 2026-09-21
> **ID Auditoría:** AUDIT-SUPPLY-CHAIN-AND-PURCHASES
> **Ámbito:** Catálogos Base (Presentaciones, Insumos, Proveedores, Precios de Proveedor) y Operación de Compras (Órdenes, Recepción, Liquidación, Kardex e Integración con Gastos).

---

## 1. RESUMEN EJECUTIVO Y DIAGNÓSTICO GENERAL

| Componente Auditado | Ruta / Modelo | Estado de Cumplimiento | Diagnóstico y Hallazgos Clave |
| :--- | :--- | :--- | :--- |
| **Modelos de Datos** | `schema.prisma` (`Insumos`, `Presentaciones`, `Proveedores`, `Precios_Proveedores`, `Compras`, `Detalle_Compras`) | **CONFORME** | Tipado decimal estricto (`Decimal(12,2)` / `Decimal(12,4)`). Trazabilidad completa de IVA, subtotales, vínculos de proveedor e insumo. |
| **Transaccionalidad & Kardex** | `PurchasesRepository.createWithTransaction` | **ALTA CALIDAD OPERATIVA** | Transacción atómica `$transaction`: genera consecutivo `CMP-YYYY-XXXX`, crea cabecera y detalle, calcula stock neto con factor de conversión, registra `MovimientoInventario` (`ENTRADA_COMPRA`), upsert en `PrecioProveedor` y contrapartida automática en `Gasto`. |
| **Conversión de Unidades** | Unidad de Compra vs. Unidad Base | **OPERATIVO CON CONDICIÓN** | Convierte correctamente empaques a unidades base (`cantidadBaseTotal = empaques * contenidoBase`). Aplica factor `x1000` si la unidad base del insumo es `Lt`, `Lts`, `Kg`, `Kgs`. |
| **Arquitectura Frontend** | `/catalog/*` y `/operations/purchases/*` | **CONFORME CON SRP** | `page.jsx` de compras en 103 líneas y `new/page.jsx` en 85 líneas. Gran desacoplamiento en subcomponentes (`FormPhaseRowItem`, `FormPhaseRowEconomics`, `StockLookupDrawer`). Se detectan hooks densos (`useFormPhaseData.js`: 424 líneas) como deuda técnica acotada. |

---

## 2. AUDITORÍA DETALLADA POR PUNTOS CLAVE

### 2.1 Consistencia de Unidades y Factores de Conversión
* **Modelo en Prisma:**
  - `Insumo.unidadBase`: define la unidad canónica de consumo (`g`, `ml`, `kg`, `lt`, `und`).
  - `PrecioProveedor`: almacena `presentacionCompra` (p. ej. `"BULTO x 25 Kg"`), `cantidadPresentacion`, `unidadPresentacion`, `cantidadEquivalenteBase` y `costoUnidadBase`.
* **Procesamiento en Backend ([purchases.repository.js](file:///apps/api/src/purchases/purchases.repository.js)):**
  - Calcula la cantidad base neta:
    ```js
    const cantidadEmpaques = Number(detalle.cantidad) || 0;
    const contenidoUnidad = Number(detalle.contenidoBase) || 1;
    const cantidadBaseTotal = Number(detalle.cantidadBaseTotal) || (cantidadEmpaques * contenidoUnidad);
    const isLtsOrKgs = ['Lt', 'Lts', 'Kg', 'Kgs'].includes(currentInsumo.unidadBase);
    const incrementStock = isLtsOrKgs ? cantidadBaseTotal * 1000 : cantidadBaseTotal;
    ```
  - **Hallazgo:** El sistema normaliza a gramos/mililitros en la tabla `Inventario` cuando la unidad base declarada en catálogo es kilogramos o litros. En el frontend, `FormPhaseRowPackaging` y `purchaseCalculations.js` presentan la equivalencia visual clara para el operario.

---

### 2.2 Precios de Proveedor vs. Costo Real de Compra
* **Actualización en Caliente:**
  - Cuando se asienta la compra en `PurchasesRepository.createWithTransaction`, el sistema ejecuta un `upsert` sobre la tabla `PrecioProveedor`:
    - Actualiza `precioCompra` con el nuevo valor facturado.
    - Recalcula `costoUnidadBase = pCompra / contenido` con precisión de 4 decimales.
    - Actualiza `fechaUltimaCompra = new Date()`.
  - Si el proveedor no existía en el vínculo de ese insumo, se crea la tupla automáticamente.
* **Costo Promedio en Inventario:**
  - Actualmente `Inventario.cantidadActual` se incrementa atómicamente con `increment`.
  - **Observación menor:** El campo `Inventario.costoPromedio` no se recalcula por media móvil ponderada (PMP) en cada compra directa, sino que el costo queda registrado en `PrecioProveedor.costoUnidadBase` y en `MovimientoInventario.costoUnitario`.

---

### 2.3 Flujo de Compras, Kardex y Contrapartida Financiera
* **Atomicidad Transaccional (`$transaction`):**
  La operación es 100% indivisible. En un solo bloque transaccional se realizan:
  1. Creación o vinculación de `Proveedor` (soporta proveedores al vuelo).
  2. Generación del número de comprobante consecutivo (`CMP-YYYY-XXXX`).
  3. Cálculo de discriminación tributaria: `totalSinIva`, `montoIva` y `total` (con soporte para precios que incluyen o excluyen IVA y tasa personalizada).
  4. Inserción de `Compra` y `DetalleCompra`.
  5. `upsert` en `Inventario` e inserción en `MovimientoInventario` con tipo `'ENTRADA_COMPRA'` referenciando el `id` de la compra como `operacionOrigen`.
  6. Actualización o creación de lista de precios en `PrecioProveedor`.
  7. **Contrapartida Contable en Gastos:**
     ```js
     await prisma.gasto.create({
       data: {
         fecha: new Date(),
         categoria: 'COMPRAS',
         descripcion: `COMPRA DE INSUMOS ${consecutive} - PROV: ${nombreProv}`,
         valor: totalEgreso,
         tipoGasto: paymentConditionStr === 'CREDITO' ? 'CX_PAGAR' : 'OPERATIVO',
         periodo: `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
         observaciones: `Registro automático desde Módulo de Compras (${consecutive})`
       }
     });
     ```
  - **Dictamen:** No hay descuadre financiero ni desfasaje entre almacén y tesorería.

---

### 2.4 Cumplimiento Arquitectural y SRP en Frontend

#### Catálogos Base (`/catalog/*`)
* `catalog/supplies/page.jsx`: **109 líneas** ✅ (< 120 líneas).
* `catalog/suppliers/page.jsx`: **36 líneas** ✅ (< 120 líneas).
* `catalog/supplier-prices/page.jsx`: **118 líneas** ✅ (< 120 líneas).
* `catalog/presentations/page.jsx`: **104 líneas** ✅ (< 120 líneas).
* Subcomponentes modales y tablas: todos cumplen con la regla de componentes especializados (< 140 líneas).

#### Módulo de Compras (`/operations/purchases/*`)
* `operations/purchases/page.jsx`: **103 líneas** ✅ (< 120 líneas).
  - Subcomponentes modulares: `PurchasesHistoryTable` (94 líneas), `PurchasesActiveOrdersSection` (110 líneas), `PurchasesModals` (117 líneas).
* `operations/purchases/new/page.jsx`: **85 líneas** ✅ (< 120 líneas).
  - Formulario estructurado en 2 fases (`ChecklistPhase` y `FormPhase`).
  - Componentes de desglose de ítem: `FormPhaseRowItem` (119 líneas), `FormPhaseRowEconomics` (85 líneas), `FormPhaseRowPackaging` (97 líneas), `FormPhaseRowIvaSection` (71 líneas).
* **Deuda Técnica Detectada:**
  - `useFormPhaseData.js` tiene **424 líneas** (concentra validaciones, autocompletado de precios y fletes). Se aconseja en un refactor futuro desacoplar el subhook de cálculos impositivos/fletes.

---

## 3. CONCLUSIONES Y RECOMENDACIONES

1. **Robustez Transaccional:** El flujo de compras es de los más maduros del sistema, con integridad referencial completa en PostgreSQL vía Prisma, kardex automático e imputación a gastos.
2. **Recomendación Operativa:** Implementar el cálculo automático del Costo Promedio Ponderado (CPP) en `Inventario.costoPromedio` tras cada compra:
   $$\text{CPP}_{\text{nuevo}} = \frac{(\text{Stock}_{\text{ant}} \times \text{CPP}_{\text{ant}}) + (\text{Cant}_{\text{compra}} \times \text{Costo}_{\text{compra}})}{\text{Stock}_{\text{ant}} + \text{Cant}_{\text{compra}}}$$
3. **Mantenimiento Frontend:** El SRP en vistas y componentes visuales es excelente (cero infracciones en script de verificación). Mantener bajo vigilancia el hook `useFormPhaseData.js`.
