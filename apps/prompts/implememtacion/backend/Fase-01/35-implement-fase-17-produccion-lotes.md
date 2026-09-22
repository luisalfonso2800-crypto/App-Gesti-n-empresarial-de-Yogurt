TAREA CONTROLADA — FASE 17: PRODUCCIÓN, LOTES Y TRAZABILIDAD (CONSUMO CALIBRADO)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO listar carpetas completas, búsquedas recursivas o subshells lentas (`Select-String`, `findstr`, `grep`).
- Abre EXCLUSIVAMENTE los archivos indispensables listados en la sección 1.
- Usa `apps/api/src/inventory/` y `apps/api/src/recipes/` como referencia arquitectónica y transaccional directa.
- Comandos CLI permitidos:
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test`
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en terminal o reportes.

OBJETIVO
Implementar de forma atómica y completa el bloque funcional en `apps/api/src/`:
1. Production (Producción y DetalleProducción)
2. Lots (Lotes y Trazabilidad)
3. Integración con Inventory (descuento de insumos por receta y entrada de producto terminado asociado al lote)
Todo coordinado mediante transacciones Prisma (`$transaction`), pruebas de comportamiento y autoauditoría en un único ciclo.

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/api/prisma/schema.prisma` (modelos: Produccion, DetalleProduccion, Lote, Receta, DetalleReceta, Producto, Inventario, MovimientoInventario)
- `docs/implementation/06-approved-module-pattern.md` (patrón de capas)
- `apps/api/src/inventory/inventory.service.ts` (referencia transaccional de movimientos)
- `docs/data-model/04-history-and-traceability.md` (o sección de trazabilidad e identidad de lotes)

2. ALCANCE DIRECTO A IMPLEMENTAR
- Módulo Production (`apps/api/src/production/`):
  * ProductionModule, ProductionController, ProductionService, ProductionRepository, DTOs (Create/Update/Response).
  * Consumo relacional de `Receta` para definir insumos/cantidades requeridas y persistencia en `DetalleProduccion`.
- Módulo Lots (`apps/api/src/lots/`):
  * LotsModule, LotsController, LotsService, LotsRepository, DTOs.
  * Registro de fecha de producción, fecha de vencimiento y relación de origen con `Produccion`.
- Integración Transaccional de Trazabilidad:
  * El flujo de cierre/ejecución de producción debe ejecutar una transacción atómica (`$transaction`):
    1. Registrar Produccion y DetalleProduccion.
    2. Crear o asignar Lote correspondiente.
    3. Registrar movimientos de salida de insumos en Inventario según la receta.
    4. Registrar movimiento de entrada de producto terminado asociado al Lote.
    5. Actualizar saldos físicos en Inventario.
- Registro en `apps/api/src/app.module.ts`.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- PROHIBIDO modificar `schema.prisma` ni generar migraciones salvo contradicción documental comprobada.
- PROHIBIDO adelantar lógica o módulos de Ventas, Pagos o Gastos.
- PROHIBIDO crear sistemas de auditoría paralelos o tablas adicionales; la trazabilidad reside en las relaciones nativas Producción-Lote-Movimientos.

4. PRUEBAS Y VALIDACIÓN TÉCNICA
- Implementar suite de pruebas del bloque:
  * Creación válida de orden de producción con detalle.
  * Generación consistente de lote con fechas requeridas.
  * Consumo de inventario y generación de movimientos vinculados.
  * Rollback ante fallos de inventario o receta inexistente.
  * Verificación de no-regresión sobre módulos anteriores (Presentations, Supplies, Purchases, Inventory).
- Ejecutar:
    pnpm --filter api exec prisma validate
    pnpm --filter api test

5. DOCUMENTACIÓN Y AUTOAUDITORÍA
- Actualizar `docs/implementation/05-prisma-implementation-plan.md`. Si se aclara una regla sobre el identificador o vigencia del lote, registrarla en `docs/data-model/` o `docs/implementation/`.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 17 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• Producción (Producción + Detalle): OK
• Lotes y Fechas: OK
• Trazabilidad relacional: OK
• Integración Inventario (Salidas/Entradas): OK
• Transacciones atómicas ($transaction): OK
• Module / Controller / Service / Repository: OK
• DTOs y Validaciones: OK
• Pruebas funcionales y rollback: OK
• Regresión módulos anteriores: OK
• Prisma validate: OK
• Archivos creados: [Lista resumida]
• Archivos modificados: [app.module.ts, plan de avance, etc.]
• Decisiones documentales: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Siguiente fase: Bloque Comercial (Ventas + Pagos + Gastos)

DETENTE inmediatamente tras el reporte.