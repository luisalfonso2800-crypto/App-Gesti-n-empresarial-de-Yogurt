TAREA CONTROLADA — FASE 16: BLOQUE ABASTECIMIENTO E INVENTARIO (CONSUMO ULTRA BAJO)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO leer carpetas completas, subshells lentas o búsquedas recursivas (`Select-String`, `findstr`, `grep`).
- Abre ÚNICAMENTE los archivos explícitamente listados en la sección 1.
- Usa `apps/api/src/recipes/` o `apps/api/src/supplies/` como plantilla arquitectónica directa.
- Comandos CLI permitidos exclusivamente:
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test`
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en terminal o reportes.

OBJETIVO
Implementar de forma integral el flujo de Abastecimiento e Inventario en `apps/api/src/`:
1. Purchases (Compras y DetalleCompra)
2. Inventory (Inventario y MovimientoInventario)
Garantizando persistencia atómica mediante transacciones de Prisma cuando una compra confirmada genere entrada de existencias y movimiento de inventario trazable.

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/api/prisma/schema.prisma` (modelos: Compra, DetalleCompra, Inventario, MovimientoInventario, Insumo, Proveedor)
- `docs/implementation/06-approved-module-pattern.md` (patrón de capas)
- `apps/api/src/recipes/recipes.service.ts` (referencia para manejo relacional cabecera-detalle)

2. ALCANCE DIRECTO A IMPLEMENTAR
- Módulo Purchases (`apps/api/src/purchases/`):
  * PurchasesModule, PurchasesController, PurchasesService, PurchasesRepository, DTOs (Create/Update).
  * Manejo relacional cabecera-detalle (Compra -> DetalleCompra) conservando costo unitario y cantidades históricas.
- Módulo Inventory (`apps/api/src/inventory/`):
  * InventoryModule, InventoryController, InventoryService, InventoryRepository, DTOs.
  * Separación estricta entre Saldo Actual (`Inventario`) e Historial Trazable (`MovimientoInventario`).
- Integración Transaccional:
  * El servicio debe ejecutar transacciones Prisma (`$transaction`) cuando la confirmación de compra impacte saldo de existencias y registre el movimiento de entrada.
- Registro de ambos módulos en `apps/api/src/app.module.ts`.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- PROHIBIDO tocar `schema.prisma` ni ejecutar migraciones salvo discrepancia documental insalvable.
- PROHIBIDO implementar lógica de Producción, Lotes, Ventas, Pagos o Gastos.
- PROHIBIDO crear abstracciones genéricas complejas o event buses; usar llamadas directas/transacciones de servicio.

4. PRUEBAS, AUTOAUDITORÍA Y DOCUMENTACIÓN
- Implementar suite de pruebas para purchases e inventory (creación con detalle, registro de movimiento y verificación de saldo).
- Ejecutar:
    pnpm --filter api exec prisma validate
    pnpm --filter api test
- Actualizar `docs/implementation/05-prisma-implementation-plan.md`. Si surge una decisión de regla de negocio (ej. momento exacto de impacto de inventario), persistirla en `docs/implementation/` o el documento de dominio correspondiente.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato y DETENTE:

FASE 16 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• Compras (Compras + DetalleCompra): OK
• Inventario (Saldo + Movimientos): OK
• Transacciones atómicas ($transaction): OK
• Module / Controller / Service / Repository: OK
• DTOs y Validaciones: OK
• Pruebas funcionales: OK
• Prisma validate: OK
• Regresión módulos anteriores: OK
• Archivos creados: [Lista resumida]
• Archivos modificados: [app.module.ts, plan de implementación, etc.]
• Decisiones documentales: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Siguiente fase: Bloque Producción + Lotes + Trazabilidad

DETENTE inmediatamente tras el reporte.