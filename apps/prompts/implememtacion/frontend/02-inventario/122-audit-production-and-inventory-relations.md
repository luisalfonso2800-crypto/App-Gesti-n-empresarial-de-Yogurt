> Realiza una auditoría técnica profunda del módulo de Producción en el Backend, sus modelos Prisma y el ciclo de vida del inventario (SOLO LECTURA / AUDITORÍA, NO MODIFICAR CÓDIGO):

1. OBJETIVO:
   - Inspeccionar exhaustivamente en apps/api/prisma/schema.prisma y en la lógica de backend (apps/api/src/production/) cómo se conecta una Orden de Producción con el Inventario de Materias Primas (descuento/consumo) y con el Inventario de Producto Terminado (ingreso de producto listo/cava).
   - Diagnosticar qué modelos soportan el BOM (Bill of Materials), cálculo de mermas, rendimientos y lotes resultantes.

2. PUNTOS DE INSPECCIÓN EN BACKEND:
   - Modelos de Producción en schema.prisma:
     * `Produccion` (u `OrdenProduccion`): campos de estado (PLANIFICADA, EN_PROCESO, FINALIZADA, CANCELADA), fechas de inicio/fin, rendimiento real vs teórico, y relación con el producto/receta a fabricar.
     * `DetalleProduccion`: ¿Registra el insumo, `cantidadTeorica` (BOM escalado) y `cantidadRealUtilizada`? ¿Guarda costo unitario o histórico del insumo consumido?
   - Conexión con Inventario y Movimientos:
     * ¿En qué momento se descuenta el stock de insumos: al crear la orden (reserva), al iniciarla, o al finalizarla?
     * ¿Se emite `MovimientoInventario` con tipo `SALIDA_PRODUCCION` para cada insumo del BOM?
     * ¿Qué ocurre si hay un 'FALTANTE' (como los 310.00 Kg de Jalea en la vista actual)? ¿El backend bloquea la orden o permite registrarla en estado borrador/pendiente de compra?
   - Entrada de Producto Terminado y Lotes:
     * Al finalizar la producción (ej. 32 unidades de Yogur Escolar): ¿se crea automáticamente un registro en la tabla `Lote` con código de trazabilidad y fecha de vencimiento?
     * ¿A dónde entra físicamente el producto fabricado si la tabla `Inventario` hoy solo está ligada a `Insumo`?
   - Trazabilidad de Costos (Costeo de Producción):
     * ¿Cómo se calcula el costo unitario final del yogur producido? ¿Suma el subtotal de insumos reales consumidos entre las unidades obtenidas?

3. FORMATO DEL INFORME QUE DEBES EMITIR (En docs/implementation/audits/production-inventory-audit.md):
   Elabora un reporte estructurado con las siguientes secciones:

   A. DIAGNÓSTICO DEL FLUJO DE PRODUCCIÓN ACTUAL:
      - Modelos y campos existentes en Prisma para Recetas, Producción y Lotes.
      - Mecánica actual del botón "Registrar Orden y Tomar Snapshot".

   B. BRECHAS TÉCNICAS (GAPS) IDENTIFICADAS:
      - Desconexiones entre el BOM teórico y el descuento real en `Inventario`.
      - Falta de bloqueo o alerta cuando hay insumos con stock insuficiente (faltantes).
      - Manejo del producto resultante (carencia de inventario de producto terminado o registro de lote automático).
      - Pérdida de cálculo de mermas (diferencia entre teórico consumido y real gastado).

   C. ARQUITECTURA PROPUESTA PARA UN FLUJO INDUSTRIAL COMPLETO:
      - Flujo de estados: 
        1. `PLANIFICADA / BORRADOR` (Calcula BOM y detecta faltantes; opción de disparar lista de compra).
        2. `EN_PROCESO` (Reserva o bloquea stock de materias primas).
        3. `FINALIZADA` (Descuenta materias primas definitivas vía `SALIDA_PRODUCCION`, genera el `Lote` con caducidad, ingresa las unidades a la Cava/Producto Terminado y fija el costo real por unidad).
      - Integración con Compras: Generación automática de orden de compra para insumos con faltantes.

   D. RECOMENDACIONES DE ENDPOINTS / TRANSACCIONES:
      - Endpoints necesarios en `production.controller.js` para ejecutar este ciclo transaccional seguro con Prisma `$transaction`.

REGLA ESTRICTA: NO modifiques ningún archivo ni ejecutes migraciones. Emite exclusivamente el informe técnico detallado.