> Completa los módulos restantes del ecosistema ERP cerrando la integración transversal (Lotes, Ventas/Cava, Cobros y Cierre Limpio del Sistema):

1. OBJETIVO GENERAL:
   - Una vez consolidado el ciclo Producción -> InventarioProducto (Cava) -> Kárdex Financiero -> Compras Asistidas, completar la operatividad de los módulos restantes dependientes:
     * Vista de Lotes (`/operations/lots`): Monitoreo de caducidad (FEFO/PEPS), trazabilidad de lotes de producto terminado y materias primas.
     * Módulo Comercial / Ventas (`/commercial/sales`): Despacho de producto terminado descontando stock de Cava (`InventarioProducto`) y lote seleccionado, cálculo de margen bruto (Precio Venta vs Costo Unitario de Fabricación).
     * Pagos y Cobros (`/commercial/payments` o `/commercial/payments-collections`): Trazabilidad de cuentas por cobrar originadas en ventas y cuentas por pagar originadas en compras.
     * Dashboard / Panel General (`/` o `/dashboard`): Métricas gerenciales consolidadas (Valor total en Bodega de Insumos + Cava, Órdenes en curso, Ventas del mes, Alertas de vencimiento).

─────────────────────────────────────────────────────────────────────────────
FASE 1: TRAZABILIDAD Y MONITOREO DE LOTES (/operations/lots)
─────────────────────────────────────────────────────────────────────────────
1. Interfaz y Datos:
   - Consumir los lotes emitidos por las órdenes de producción (`GET /lots` o `GET /production/lots`).
   - Mostrar tabla con estética vintage de laboratorio/cava:
     * Código de Lote (ej: `LOT-2026-XXXX`).
     * Producto asociado (Yogur Escolar, etc.).
     * Fecha de Fabricación y Fecha de Vencimiento.
     * Cantidad Inicial vs Cantidad Disponible.
     * Costo Unitario de Fabricación (proveniente de la liquidación de la orden).
     * Semáforo de Caducidad:
       - 🟢 Óptimo (> 15 días para vencer).
       - 🟡 Próximo a vencer (<= 15 días).
       - 🔴 Vencido / Retirar de cava (<= 0 días).
   - Acción de Descarte por Vencimiento: Botón que permita dar de baja unidades vencidas registrando `MovimientoInventario` con tipo `MERMA_VENCIMIENTO` y descontando del lote y de `InventarioProducto`.

─────────────────────────────────────────────────────────────────────────────
FASE 2: MÓDULO COMERCIAL / VENTAS VINCULADO A CAVA (/commercial/sales)
─────────────────────────────────────────────────────────────────────────────
1. Lógica Transaccional en Backend:
   - Al registrar una venta (`POST /sales`):
     * Verificar disponibilidad en `InventarioProducto` (Cava).
     * Seleccionar lote bajo criterio FEFO (lote activo más próximo a vencer) o permitir selección manual del lote disponible.
     * Restar stock de `InventarioProducto` y `Lote.cantidadDisponible`.
     * Grabar `MovimientoInventario` con `tipoMovimiento: 'SALIDA_VENTA'`, asociando `operacionOrigen: venta.id` y registrando el costo histórico para trazabilidad del margen.
     * Calcular en la venta: `Utilidad Bruta = Subtotal Venta - (Cantidad * CostoUnitarioFabricacion)`.
2. UI Comercial:
   - Selector reactivo de clientes y productos terminados.
   - Indicador visible del stock disponible real en Cava.
   - Resumen financiero de la orden de despacho antes de asentar.

─────────────────────────────────────────────────────────────────────────────
FASE 3: DASHBOARD GENERAL Y CRUCE FINANCIERO
─────────────────────────────────────────────────────────────────────────────
1. Conectar métricas en el Panel Principal:
   - Tarjeta: Capital Total Inmovilizado = Bodega de Insumos (`Inventario`) + Cava de Yogures (`InventarioProducto`).
   - Tarjeta: Alertas Críticas (Insumos por agotarse + Lotes próximos a vencer).
   - Tarjeta: Estado de Planta (Órdenes planificadas vs en proceso).
   - Tarjeta: Facturación / Ventas recientes con margen bruto estimado.

─────────────────────────────────────────────────────────────────────────────
FASE 4: VERIFICACIÓN TÉCNICA E HIGIENE
─────────────────────────────────────────────────────────────────────────────
1. Validar que no existan errores de sintaxis:
   node --check apps/api/src/sales/sales.controller.js
   node --check apps/web/src/app/operations/lots/page.jsx
   node --check apps/web/src/app/commercial/sales/page.jsx
2. Confirmar que el flujo completo opere sin inconsistencias:
   Compra de insumos -> Entrada a bodega -> Producción (consumo de insumo + salida a Cava con costo unitario) -> Venta (despacho de Cava con cálculo de ganancia real).