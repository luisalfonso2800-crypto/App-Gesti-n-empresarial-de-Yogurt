# IMPLEMENTACIÓN — MULTIPLEXOR SCADA POR CANALES Y DRILL-DOWN TOTAL (ALTA EFICIENCIA DE CUOTA)

REGLAS DE MÁXIMO AHORRO DE CUOTA:
- NO reescribas ni abras los archivos Canvas funcionales (RadarSweepCanvas, LiquidSilosCanvas, OscilloscopeCanvas). Úsalos tal cual.
- Cero Tailwind: usa exclusivamente CSS Modules.
- Cero cálculos en frontend: consume los datos directamente del Backend.
- Poka-Yoke: formato monetario entero sin decimales ($X.XXX).

---

1. BACKEND (`apps/api/src/dashboard/`):
En `dashboard.service.js` y `dashboard.controller.js`, expón `GET /api/v1/dashboard/full-telemetry` consolidando la data existente y agregando los arreglos para drill-down:
- `financial`: `salesCurrentMonth`, `expensesCurrentMonth`, `netProfitCurrentMonth`, `accountsReceivable`, `trendSales`, `trendExpenses`, y `debtors` (top clientes con saldoPendiente > 0, días de crédito y teléfono).
- `plant`: `finishedProductsValue`, `activeOrdersCount`, `yieldEfficiencyPercentage`, `productsTelemetry` (con desglose de costos por insumo/empaque), y `radarLots`.
- `supply`: `rawMaterialsValue` (mantener el valor real de ~$5.6M), `criticalSupplies` (insumos en punto de reorden con proveedor sugerido), y `supplierVariations` (últimos 3 precios registrados por insumo).

---

2. MULTIPLEXOR TÁCTICO (`apps/web/src/app/dashboard/`):
En `page.jsx` y `Dashboard.module.css`:
- Agrega barra selectora de canales en el header: `[AUTO-SCAN]` | `[CH-01 FINANZAS]` | `[CH-02 PLANTA/FEFO]` | `[CH-03 SUMINISTROS]`.
- Estado `activeChannel` (1, 2 o 3) y `isAutoScan` (boolean).
- Ciclo automático: Cada 10 segundos avanza de canal si `isAutoScan === true`.
- Interrupción: Cualquier clic en un canal, filtro o gráfico detiene el Auto-Scan y fija el canal activo.

Renderizado por Canal:
- **Canal 01 (Finanzas):** Contadores rápidos + `OscilloscopeCanvas` + Grilla de deudores y flujo de caja.
- **Canal 02 (Planta & Cava):** Telemetría de productos con tacómetros + `RadarSweepCanvas` (blips de lotes) + Tarjeta de órdenes activas.
- **Canal 03 (Suministros):** `LiquidSilosCanvas` (Materia Prima vs Cava) + Lista interactiva de insumos críticos y precios de proveedor.

---

3. DRILL-DOWN ASISTIDO CON `SmartModal`:
Haz interactivos los bloques mediante `onClick` abriendo `<SmartModal>` con información extendida:
- **Clic en Silo Materia Prima ($5.6M):** Modal con tabla de todos los insumos en inventario (nombre, cantidad, unidad base, costo total inmovilizado) y botón "Ir a Compras".
- **Clic en Silo Cava:** Modal con stock por producto en cava, lote asociado y botón "Despachar".
- **Clic en Blip o Lista del Radar FEFO:** Modal con radiografía del lote (días restantes, fecha caducidad, unidades disponibles) y botón "Priorizar Venta".
- **Clic en Cartera / Osciloscopio:** Modal con desglose de facturas pendientes por cobrar por cliente y botón "Registrar Cobro".
- **Clic en Producto de Telemetría:** Modal con desglose de costos (leche, fruta, cultivo, envase) y margen neto unitario.

---

VALIDACIÓN:
- Compila con `pnpm --filter web build --no-lint`.
- Confirma que el Auto-Scan rote entre los 3 canales cada 10s.
- Confirma que al hacer clic en silos, métricas o radar se congele el scan y se abra el SmartModal con los datos detallados.