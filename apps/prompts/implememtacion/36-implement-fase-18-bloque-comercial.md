TAREA CONTROLADA — FASE 18: BLOQUE COMERCIAL (VENTAS, PAGOS, GASTOS) (CONSUMO CALIBRADO)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO listar carpetas completas, búsquedas recursivas o subshells lentas (`Select-String`, `findstr`, `grep`).
- Abre EXCLUSIVAMENTE los archivos indispensables listados en la sección 1.
- Usa `apps/api/src/production/` e `inventory/` como referencia arquitectónica y transaccional directa.
- Comandos CLI permitidos:
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test`
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en terminal o reportes.

OBJETIVO
Implementar de forma modular e integrada el bloque comercial en `apps/api/src/`:
1. Sales (Ventas y DetalleVenta) integrado con Clientes, Productos, Lotes e Inventario.
2. Payments (Pagos de Clientes) vinculado a Cliente y Venta según cardinalidad del modelo.
3. Expenses (Gastos) como registro económico independiente.
Coordinado mediante transacciones atómicas Prisma (`$transaction`) en ventas que descuenten inventario, pruebas funcionales completas y autoauditoría en un único ciclo.

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/api/prisma/schema.prisma` (modelos: Venta, DetalleVenta, PagoCliente, Gasto, Cliente, Producto, Lote, Inventario, MovimientoInventario)
- `docs/implementation/06-approved-module-pattern.md` (patrón de capas)
- `apps/api/src/production/production.service.ts` (referencia transaccional de impacto en inventario)

2. ALCANCE DIRECTO A IMPLEMENTAR
- Módulo Sales (`apps/api/src/sales/`):
  * SalesModule, SalesController, SalesService, SalesRepository, DTOs (Create/Update/Response).
  * Validación previa de disponibilidad de stock.
  * Transacción atómica `$transaction`:
    1. Crear Venta y DetalleVenta.
    2. Vincular Lote si aplica según el modelo.
    3. Registrar movimiento de salida en MovimientoInventario.
    4. Actualizar saldo en Inventario.
- Módulo Payments (`apps/api/src/payments/`):
  * PaymentsModule, PaymentsController, PaymentsService, PaymentsRepository, DTOs.
  * Registro de abonos/cancelaciones vinculados a Cliente y Venta respetando cardinalidad de persistencia.
- Módulo Expenses (`apps/api/src/expenses/`):
  * ExpensesModule, ExpensesController, ExpensesService, ExpensesRepository, DTOs.
  * Registro y consulta de salidas económicas.
- Registro de los 3 módulos en `apps/api/src/app.module.ts`.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- PROHIBIDO modificar `schema.prisma` ni generar migraciones salvo contradicción documental comprobada.
- PROHIBIDO implementar reportes avanzados, dashboards o cálculos contables de rentabilidad en esta fase.
- PROHIBIDO crear repositorios genéricos ("CommercialRepository"); mantener separación modular de cada entidad.

4. PRUEBAS, VALIDACIÓN TÉCNICA Y NO-REGRESIÓN
- Implementar pruebas funcionales:
  * Venta válida con descuento de stock y movimiento de salida.
  * Rechazo por stock insuficiente o cliente inexistente con rollback garantizado.
  * Registro y consulta de pagos válidos e inválidos.
  * Registro y consulta de gastos.
  * Ejecutar suite general de tests para asegurar no-regresión en fases anteriores (13 a 17).
- Ejecutar:
    pnpm --filter api exec prisma validate
    pnpm --filter api test

5. DOCUMENTACIÓN Y AUTOAUDITORÍA
- Actualizar `docs/implementation/05-prisma-implementation-plan.md`.
- Si surge una aclaración sobre reglas de asignación de lotes en venta o estados de pago, persistirla en `docs/implementation/` o documento de dominio correspondiente.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 18 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• Ventas (Venta + Detalle): OK
• Pagos de Clientes: OK
• Gastos: OK
• Integración Clientes y Productos: OK
• Integración Lotes: OK / NO APLICA
• Integración Inventario (Salidas/Stock): OK
• Transacciones atómicas ($transaction): OK
• Module / Controller / Service / Repository (por módulo): OK
• DTOs y Validaciones: OK
• Pruebas funcionales y rollback: OK
• Regresión módulos anteriores: OK
• Prisma validate: OK
• Archivos creados: [Lista resumida]
• Archivos modificados: [app.module.ts, plan de avance, etc.]
• Decisiones documentales: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Siguiente fase: Integración transversal del flujo completo

DETENTE inmediatamente tras el reporte.