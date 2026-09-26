TAREA DE AUDITORÍA ARQUITECTURAL (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 TOOL CALLS - SOLO LECTURA):
Auditar la cadena contable y de datos entre Clientes → Ventas → Cuentas por Cobrar / Pagos → Cartera, para determinar la fuente de verdad del saldo pendiente antes de rediseñar el módulo de Pagos y Cobros.

PROHIBICIONES ESTRICTAS (CONSUMO CERO DE TOKENS INNECESARIOS):
- PROHIBIDO modificar, crear o eliminar código (`Edit`, `Write` prohibidos en código fuente). Solo se permite escribir el reporte final.
- PROHIBIDO ejecutar búsquedas recursivas ciegas en todo el proyecto.
- NO leer archivos CSS, tests ni componentes decorativos.

ARCHIVOS EXACTOS A INSPECCIONAR (MÁXIMO 5 LECTURAS DIRIGIDAS):
1. `apps/api/prisma/schema.prisma` (Buscar únicamente los modelos `Cliente`, `Venta`, `DetalleVenta`, `Pago`, `CuentaPorCobrar` o equivalentes).
2. `apps/api/src/commercial/sales/` (o la ruta del servicio de ventas en backend: revisar cómo se procesa `tipoPago: 'CREDITO'` y el abono inicial).
3. `apps/api/src/commercial/payments/` (o servicio de pagos/cobros: revisar cómo se crea un pago, si enlaza a `idVenta` o `idCliente` y cómo calcula el saldo).
4. `apps/web/src/app/commercial/sales/` (Revisar el formulario/modal donde se envía el abono inicial y la fecha límite).
5. `apps/web/src/app/commercial/payments/` (Revisar cómo la pantalla actual consulta y lista la cartera o los pagos).

OBJETIVOS PUNTUALES A RESPONDER:
1. **Entidad de la Deuda:** ¿La deuda vive en la tabla `Venta` (con campos `saldoPendiente`, `totalPagado`, `estadoPago`), existe una tabla separada `CuentaPorCobrar`, o se calcula dinámicamente restando pagos?
2. **Relación Venta ↔ Pago:** ¿El modelo de pagos apunta directamente a `idVenta`, a `idCliente` o a un movimiento contable genérico?
3. **Flujo de Abono Inicial en Venta:** Cuando una venta se crea con `tipoPago = Crédito` y un valor abonado inicial, ¿se genera una fila en la tabla de pagos o solo se descuenta de un campo en la venta?
4. **Cálculo del Saldo:** ¿Dónde y cómo se calcula `saldo = total - abonos`? ¿Se hace en SQL/Prisma, en el Service de NestJS o está calculado en el frontend?
5. **Fechas Límite:** ¿Dónde se persiste la fecha de vencimiento del crédito y cómo soportaría un nuevo plazo al registrar un abono parcial?

SALIDA REQUERIDA:
Generar un único archivo consolidado y conciso en:
`docs/audits/AUDIT-CARTERA-VENTAS-PAGOS.md`

Estructura del entregable:
1. **Modelos y Relaciones Clave:** Fragmentos Prisma de las tablas involucradas y cardinalidad.
2. **Diagrama de Flujo Actual (Mermaid):** Cliente → Venta → Cartera → Pago.
3. **Hallazgos Críticos:** Inconsistencias, riesgos de doble contabilidad o dependencias en frontend.
4. **Contrato de Integración Recomendado:** Endpoints y reglas para que la nueva vista de "Pagos y Cobros" liquide y filtre cartera por rangos de saldo y vencimiento sin duplicar lógica.

DETENCIÓN:
Al guardar el reporte markdown en `docs/audits/`, DETENTE inmediatamente sin ejecutar ninguna otra acción.