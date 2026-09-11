# AUDITORÍA TÉCNICA: DATOS Y TELEMETRÍA SCADA
**Proyecto:** MANNÁ ERP — Gestión Empresarial de Yogurt  
**Fecha:** 2026-09-11  
**Alcance:** `apps/api/prisma/schema.prisma` · `dashboard.service.js` · `dashboard.controller.js`

---

## 1. INVENTARIO DE TABLAS Y ATRIBUTOS OPERATIVOS DE TELEMETRÍA

### 1.1 Inventarios y Suministros

| Tabla Prisma | Campo Clave | Tipo | Rol en Telemetría |
|---|---|---|---|
| `Inventario` | `cantidadActual` | Decimal | Stock actual del insumo |
| `Inventario` | `costoPromedio` | Decimal | Costo promedio ponderado |
| `Inventario` | `fechaActualizacion` | DateTime | Timestamp de última actualización |
| `Insumo` | `stockMinimo` | Decimal | **Umbral de alarma de stock bajo** |
| `Insumo` | `unidadBase` | String | Unidad de medida operativa |
| `Insumo` | `categoria` / `subcategoria` | String | Clasificación para filtrado SCADA |
| `PrecioProveedor` | `costoUnidadBase` | Decimal | Costo de referencia por compra |
| `PrecioProveedor` | `fechaUltimaCompra` | DateTime | Antigüedad del precio registrado |
| `InventarioProducto` | `cantidadActual` | Decimal | Stock de Producto Terminado en Cava |
| `InventarioProducto` | `costoPromedio` | Decimal | Costo promedio del lote producido |

> ⚠️ **GAP DETECTADO:** La tabla `Insumo` tiene `stockMinimo` pero **no tiene campo `puntoPedido`** (punto de reorden diferenciado). El umbral de alarma actual usa el mismo valor para stock mínimo y punto de reorden. Se recomienda agregar `puntoPedido Decimal @map("Punto_Pedido")` en una migración futura.

---

### 1.2 Lotes y Producción (FEFO)

| Tabla Prisma | Campo Clave | Tipo | Rol en Telemetría |
|---|---|---|---|
| `Lote` | `fechaVencimiento` | DateTime? | **Campo FEFO primario — calcula días restantes** |
| `Lote` | `fechaProduccion` | DateTime | Calcula % de vida útil transcurrida |
| `Lote` | `cantidadDisponible` | Decimal | Stock disponible de este lote |
| `Lote` | `cantidadInicial` | Decimal | Para calcular % consumido del lote |
| `Lote` | `estado` | String | Valores esperados: `DISPONIBLE`, `AGOTADO`, `VENCIDO` |
| `Lote` | `tipoLote` | String | Distingue insumo vs producto terminado |
| `Produccion` | `estado` | String | `EN_PROCESO`, `PLANIFICADA`, `FINALIZADA` |
| `Produccion` | `cantidadPlanificada` | Decimal | Base del KPI de rendimiento |
| `Produccion` | `cantidadProducidaReal` | Decimal? | Numerador del % rendimiento real |
| `Produccion` | `fechaVencimiento` | DateTime? | Fecha de vencimiento de la producción |
| `DetalleProduccion` | `costoTeorico` | Decimal? | Costo esperado según receta |
| `DetalleProduccion` | `costoReal` | Decimal? | **Costo real ejecutado — base para alarma de desviación** |
| `DetalleProduccion` | `diferencia` | Decimal? | Diferencia real vs teórico |
| `EtapaReceta` | `tempMinimaGrados` / `tempMaximaGrados` | Decimal? | Rangos de temperatura por etapa |

---

### 1.3 Comercial y Tesorería

| Tabla Prisma | Campo Clave | Tipo | Rol en Telemetría |
|---|---|---|---|
| `Venta` | `estado` | String | `PENDIENTE`, `PAGADO`, `ANULADO` |
| `Venta` | `saldoPendiente` | Decimal | **CxC activa — base alarma morosidad** |
| `Venta` | `fechaLimitePago` | DateTime? | **Fecha límite — calcula días vencidos** |
| `Venta` | `tipoPago` | String | `CONTADO`, `CREDITO` — diferencia flujo de caja |
| `Cliente` | `diasCredito` | Int | Plazo estándar de crédito del cliente |
| `DetalleVenta` | `utilidadUnitaria` / `utilidadTotal` | Decimal | **Margen real por línea de venta** |
| `Pago` | `fechaPago` | DateTime | Historial de pagos recibidos |

> ⚠️ **GAP DETECTADO:** No existe campo `diasVencido` calculado en BD. La alarma de morosidad debe calcularse en el servicio comparando `fechaLimitePago` con `NOW()`. El servicio actual NO implementa este cálculo.

---

### 1.4 Productos y Recetas

| Tabla Prisma | Campo Clave | Tipo | Rol en Telemetría |
|---|---|---|---|
| `Producto` | `precioVenta` | Decimal | Precio de venta objetivo |
| `Producto` | `margenObjetivo` | Decimal | Margen esperado (%) |
| `Receta` | `rendimientoBase` | Decimal | Unidades teóricas por batch |
| `DetalleReceta` | `cantidadRequerida` | Decimal | Insumo requerido por batch |
| `DetalleReceta` | `mermaPorcentaje` | Decimal | **Factor de merma teórica** |

---

## 2. ESTADO ACTUAL DE LOS ENDPOINTS DEL BACKEND

### 2.1 Rutas Activas Verificadas

```
GET /api/v1/dashboard/kpis           → DashboardController.getKpis()
GET /api/v1/dashboard/full-telemetry → DashboardController.getFullTelemetry()
GET /api/v1/dashboard/rotation       → DashboardController.getRotation()
```

> **NO EXISTE:** `GET /api/v1/dashboard/alarms` — **Debe crearse.**

### 2.2 Análisis: Datos Reales vs. Datos Mockeados

| Dato en Respuesta | Fuente | Real/Mock |
|---|---|---|
| `financials.salesCurrentMonth` | `prisma.venta.aggregate` | ✅ **REAL** |
| `financials.expensesCurrentMonth` | `prisma.gasto.aggregate` | ✅ **REAL** |
| `financials.accountsReceivable` | `prisma.venta.aggregate saldoPendiente` | ✅ **REAL** |
| `inventoryValuation.rawMaterialsValue` | `prisma.inventario.findMany` × costo | ✅ **REAL** |
| `alerts.lowStock` | `cantidadActual <= stockMinimo` | ✅ **REAL** |
| `radarLots` (FEFO) | `prisma.lote` × `fechaVencimiento` | ✅ **REAL** |
| `estadoPlanta.rendimientoPromedioLote` | `cantidadProducidaReal / cantidadPlanificada` | ✅ **REAL** |
| `trends.trendSales` (12 puntos) | Agrupación diaria real del mes | ✅ **REAL** |
| `productsTelemetry.costBreakdown` | `leche: cost*0.4, fruta: cost*0.2...` | ❌ **MOCK DURO** |
| `criticalSupplies.proveedorSugerido` | Hardcodeado como `'Proveedor Registrado'` | ❌ **MOCK PARCIAL** |
| `supply.supplierVariations` | Array vacío `[]` | ❌ **OMITIDO** |

---

## 3. MATRIZ DE ALARMAS REALES FACTIBLES

### 3.1 Nivel CRÍTICO 🔴

| ID | Tipo | Consulta Prisma | Condición | Campo Fuente |
|---|---|---|---|---|
| ALM-C01 | Stock Cero de Insumo | `Inventario` | `cantidadActual <= 0` | `Inventario.cantidadActual` |
| ALM-C02 | Lote VENCIDO en Cava | `Lote` | `fechaVencimiento < NOW() AND cantidadDisponible > 0` | `Lote.fechaVencimiento` |
| ALM-C03 | Producción Bloqueada | `Produccion` | `estado = 'EN_PROCESO' AND fechaPlanificada < NOW() - 24h` | `Produccion.estado` + `fechaProduccion` |
| ALM-C04 | Insumo sin stock para receta activa | JOIN `DetalleReceta` × `Inventario` | `cantidadActual < cantidadRequerida * (1 + merma/100)` | Cruce tablas |

### 3.2 Nivel ADVERTENCIA 🟡

| ID | Tipo | Consulta Prisma | Condición | Campo Fuente |
|---|---|---|---|---|
| ALM-W01 | Insumo bajo Stock Mínimo | `Inventario` JOIN `Insumo` | `cantidadActual <= stockMinimo AND cantidadActual > 0` | `Insumo.stockMinimo` |
| ALM-W02 | Lote próximo a vencer (<= 7 días) | `Lote` | `diasRestantes <= 7 AND diasRestantes > 0 AND cantidadDisponible > 0` | `Lote.fechaVencimiento` |
| ALM-W03 | Lote próximo a vencer (<= 15 días) | `Lote` | `diasRestantes <= 15 AND diasRestantes > 7` | `Lote.fechaVencimiento` |
| ALM-W04 | Cuenta por Cobrar Vencida | `Venta` | `fechaLimitePago < NOW() AND saldoPendiente > 0` | `Venta.fechaLimitePago` |
| ALM-W05 | Desvío de Costo Real > 20% | `DetalleProduccion` | `costoReal > costoTeorico * 1.20` | `DetalleProduccion.diferencia` |

### 3.3 Nivel OPERATIVO 🔵

| ID | Tipo | Consulta Prisma | Condición |
|---|---|---|---|
| ALM-O01 | Órdenes de Producción Activas | `Produccion` | `estado IN ('EN_PROCESO', 'PLANIFICADA')` |
| ALM-O02 | Rendimiento de Lote bajo 90% | `Produccion` FINALIZADA | `cantidadProducidaReal / cantidadPlanificada < 0.90` |
| ALM-O03 | Precio de insumo sin actualizar > 30 días | `PrecioProveedor` | `fechaUltimaCompra < NOW() - 30 DAYS` |
| ALM-O04 | Margen real inferior al margen objetivo | `DetalleVenta` × `Producto` | `(precioVenta - costoUnitario)/precioVenta < margenObjetivo` |

---

## 4. CONTRATO DEL ENDPOINT `/api/v1/dashboard/alarms`

### 4.1 Contrato Actual
```
❌ NO EXISTE este endpoint en el backend.
```

### 4.2 Contrato Propuesto — Payload de Respuesta

```json
{
  "generatedAt": "2026-09-11T12:00:00.000Z",
  "summary": {
    "critical": 1,
    "warning": 3,
    "operational": 2,
    "total": 6
  },
  "alarms": [
    {
      "id": "ALM-C02-<loteId>",
      "level": "CRITICAL",
      "channel": "CANAL 02 · CAVA / FEFO",
      "code": "LOT_EXPIRED",
      "title": "Lote vencido con stock disponible",
      "detail": "Lote Yogurt Fresa 200g expiró hace 2 días. Stock: 48 unidades.",
      "action": "Retirar lote de cava de inmediato. No despachar.",
      "entityType": "Lote",
      "entityId": "<uuid>",
      "triggeredAt": "2026-09-11T10:15:00.000Z",
      "metadata": {
        "producto": "Yogurt Fresa 200g",
        "fechaVencimiento": "2026-09-09",
        "cantidadDisponible": 48,
        "diasVencido": 2
      }
    },
    {
      "id": "ALM-W01-<insumoId>",
      "level": "WARNING",
      "channel": "CANAL 03 · SUMINISTROS",
      "code": "LOW_STOCK",
      "title": "Insumo bajo stock mínimo",
      "detail": "Leche Cruda: 80L actuales / Mínimo 100L.",
      "action": "Generar orden de compra al proveedor registrado.",
      "entityType": "Insumo",
      "entityId": "<uuid>",
      "triggeredAt": "2026-09-11T10:22:00.000Z",
      "metadata": {
        "insumo": "Leche Cruda",
        "cantidadActual": 80,
        "stockMinimo": 100,
        "unidad": "L"
      }
    }
  ]
}
```

### 4.3 Implementación Recomendada en Backend

```javascript
// En dashboard.service.js → agregar método getAlarms()
async getAlarms() {
  const now = new Date();
  const alarms = [];

  // ALM-C02: Lotes vencidos con stock
  const expiredLots = await this.prisma.lote.findMany({
    where: { fechaVencimiento: { lt: now }, cantidadDisponible: { gt: 0 } },
    include: { producto: true, insumo: true }
  });
  // ... mapear a estructura de alarma

  // ALM-W01: Insumos bajo stock mínimo
  const lowStockItems = await this.prisma.inventario.findMany({
    where: {}, include: { insumo: true }
    // filtrar en JS: cantidadActual <= insumo.stockMinimo
  });

  // ALM-W04: CxC vencidas
  const overdueReceivables = await this.prisma.venta.findMany({
    where: { fechaLimitePago: { lt: now }, saldoPendiente: { gt: 0 } },
    include: { cliente: true }
  });

  return { generatedAt: now, summary: { ... }, alarms };
}
```

---

## 5. OPORTUNIDADES DE TELEMETRÍA ADICIONAL

### 5.1 Nuevos Indicadores Enriquecibles Inmediatos

| Indicador | Fuente en BD | Pantalla Sugerida |
|---|---|---|
| **% Vida Útil Promedio de Cava** | `Lote.fechaVencimiento` vs `NOW()` | Dial radial tipo velocímetro |
| **Ratio CxC / Ventas del Mes** | `Venta.saldoPendiente / totalVenta` | Termómetro financiero |
| **Top 5 Insumos por Costo de Inventario** | `Inventario.cantidadActual × costoPromedio` | Barras horizontales rankeadas |
| **Evolución del Margen Real vs Objetivo** | `DetalleVenta.utilidadTotal / totalLinea` vs `Producto.margenObjetivo` | Osciloscopio overlay |
| **Merma Real vs Merma Teórica por Lote** | `DetalleProduccion.diferencia` acumulado | Gauge de eficiencia de planta |
| **Días de Inventario (DOI)** | `cantidadActual / (ventasMes / 30)` | KPI card compacto |
| **Proveedor con Mayor Variación de Precio** | `PrecioProveedor.costoUnidadBase` histórico | Mini sparkline por proveedor |

### 5.2 Nuevos Canales de Drill-Down Propuestos

```
CANAL 05 · TESORERÍA DETALLADA
  → Tabla de deudores ordenada por saldo + días vencidos
  → Sparkline de flujo de caja diario (cobros vs gastos)
  → Ratio de cobranza: % pagado en plazo / fuera de plazo

CANAL 06 · EFICIENCIA DE PLANTA
  → Gauge de rendimiento promedio de lote (% vs 100%)
  → Tabla de desvío costo-teórico vs costo-real por producción
  → Merma total del mes en kg/L/unidades
```

---

## 6. RESUMEN EJECUTIVO — 5 ALARMAS REALES INMEDIATAS

El sistema puede comenzar a emitir las siguientes alarmas **sin modificar el schema de BD**, únicamente implementando el endpoint `/api/v1/dashboard/alarms`:

| # | Código | Tipo | Fuente de Datos | Implementación |
|---|---|---|---|---|
| 1 | **ALM-W01** `LOW_STOCK` | ⚠️ Advertencia | `Inventario.cantidadActual <= Insumo.stockMinimo` | Ya calculado en `getKpis()` → `alerts.lowStock` |
| 2 | **ALM-C02** `LOT_EXPIRED` | 🔴 Crítica | `Lote.fechaVencimiento < NOW() AND cantidadDisponible > 0` | Nueva consulta simple en `getAlarms()` |
| 3 | **ALM-W03** `LOT_EXPIRING_SOON` | ⚠️ Advertencia | `Lote.diasRestantes <= 15` | Ya calculado en `radarLots` → `alerta = 'CRITICO' / 'PREVENCION'` |
| 4 | **ALM-W04** `OVERDUE_RECEIVABLE` | ⚠️ Advertencia | `Venta.fechaLimitePago < NOW() AND saldoPendiente > 0` | Nueva consulta simple en `getAlarms()` |
| 5 | **ALM-W05** `COST_DEVIATION` | ⚠️ Advertencia | `DetalleProduccion.costoReal > costoTeorico * 1.20` | Nueva consulta en `getAlarms()` con JOIN a Produccion |

> **Alarmas 1 y 3 ya tienen su lógica de cálculo implementada** en `dashboard.service.js`. Solo requieren exponerse en un endpoint `/alarms` dedicado con el payload estructurado propuesto.

---

*Documento generado por auditoría técnica — MANNÁ ERP v1.0*  
*Próximo paso: Implementar `GET /api/v1/dashboard/alarms` en `dashboard.service.js` y `dashboard.controller.js`.*
