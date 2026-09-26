# INFORME DE AUDITORÍA FRONTEND DELTA — FASE F6: CAMPOS NUEVOS DEL BACKEND

> **Fecha:** 2026-09-22  
> **Ámbito:** Frontend (`apps/web/src`) — Verificación de exposición, captura y visualización de nuevos campos incorporados en base de datos y endpoints remediados.  
> **Estado:** ✅ FASE F6 COMPLETADA

---

## 1. Matriz de Exposición de Campos Nuevos del Backend

Tras los bloques de remediación 1 a 8B se agregaron campos críticos al esquema Prisma y modelos de negocio. Se auditó su visibilidad en el frontend:

| Campo Nuevo Backend | Modelo Prisma / Entidad | ¿Capturado en Form? | ¿Mostrado en UI? | ¿Editable en UI? | Estado y Diagnóstico Frontend |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`densidad`** | `Insumo` / `Producto` (Float default 1.0) | ❌ NO | ❌ NO | ❌ NO | **NO EXPUESTO:** Los catálogos de insumos y productos no permiten ingresar ni editar la densidad real ($g/ml$). Las recetas asumen densidad 1.0 por omisión en frontend. |
| **`unidadCantidadProducida`** | `Produccion` (String default "UNIDAD") | ❌ NO | ❌ NO | ❌ NO | **NO EXPUESTO:** Al completar una orden de producción, el frontend envía `realQty` escalar sin especificar la unidad explícita; el backend aplica el default `"UNIDAD"`. |
| **`saldoAFavor` / Saldo Negativo** | `Venta` (`saldoPendiente < 0` / Observación) | ⚠️ Parcial | ⚠️ Parcial | ❌ NO | **OCULTO / AMBIGUO:** Si un cliente paga de más (`HAL-F9-04`), `ReceivableClientRow.jsx` muestra `formatCurrency(saldoTotalCliente)`. Para saldos negativos formatea `-$50.000` pero no muestra una etiqueta destacada tipo badge `"SALDO A FAVOR / ANTICIPO"`. |
| **`stockAnterior` & `stockNuevo`** | `MovimientoInventario` | N/A (Server) | ❌ NO | N/A (Server) | **NO EXPUESTO EN TABLAS:** La vista de inventario (`/operations/inventory`) lista movimientos mostrando la variación (`cantidad`), pero no expone las columnas de auditoría `stockAnterior` ni `stockNuevo` que el backend ya persiste. |
| **`cantidadTeoricaOriginal`** | `DetalleProduccion` | N/A (Server) | ❌ NO | N/A (Server) | **NO EXPUESTO:** El backend preserva la formulación exacta con decimales antes de aplicar `Math.ceil` (`HAL-F6-01`), pero la vista de bitácora solo muestra `cantidadTeorica` redondeada. |
| **`costoBaseSinIva`** | `PrecioProveedor` / `DetalleCompra` | ✅ SÍ | ✅ SÍ | ✅ SÍ | **EXPUESTO Y CONFORME:** `PricesComparisonTable.jsx` y `SupplierPriceTaxFields.jsx` desglosan y editan correctamente el costo base sin IVA. |

---

## 2. Hallazgos Detallados de Campos Faltantes

### 1. Ausencia del Atributo `densidad` en Catálogo de Insumos:
- En `apps/web/src/app/catalog/supplies/components/SupplyFormModal.jsx`:
- **Problema:** El formulario de insumos solicita nombre, unidad base, costo referencial, pero no ofrece el campo numérico `densidad` (ej. Leche condensada = $1.31$, Miel = $1.42$, Pulpa = $1.05$).
- **Impacto:** Aunque el backend ya cuenta con la columna en `Insumo` y `unit-registry.js` soporta conversión masa-volumen con densidad, el usuario no puede alimentar este valor desde la interfaz gráfica.

### 2. Unidad Explícita de Producción (`unidadCantidadProducida`):
- En `ProductionOrderCompleteModal.jsx`:
- **Problema:** El modal muestra en el título la unidad obtenida, pero en el payload de liquidación (`submitComplete`) envía solo la cantidad numérica sin el string explícito `unidadCantidadProducida`.

### 3. Tratamiento de Saldos a Favor en Cartera:
- En `ReceivableClientRow.jsx`:
- **Problema:** La función `getBadge` solo distingue `SALDADO` (`saldo === 0`), `VENCIDO`, `POR_VENCER` y `AL DÍA`. Si `saldoPendiente < 0`, cae en `AL DÍA` mostrando un valor monetario negativo poco intuitivo para tesorería.

---

## 3. Conclusiones y Recomendaciones de la Fase F6

1. **Incorporar campo `densidad` en el modal de Insumos:** Permitir registrar densidades entre $0.5$ y $2.5$ con step $0.01$ (default $1.0$).
2. **Exponer trazabilidad de Kardex (`stockAnterior` / `stockNuevo`):** Enriquecer el modal de historial de movimientos de inventario con las dos columnas de balance auditadas.
3. **Badge "ANTICIPO / SALDO A FAVOR" en Cartera:** Cuando `saldoPendiente < 0`, renderizar badge verde esmeralda `ANTICIPO: $XX.XXX`.
