TAREA CONTROLADA — FASE 19: INTEGRACIÓN TRANSVERSAL Y VALIDACIÓN DEL BACKEND V1 (CONSUMO CALIBRADO)

REGLAS DE CUOTA ESTRICTA Y ANTI-BLOQUEO (WINDOWS CLI)
- PROHIBIDO listar carpetas completas, búsquedas recursivas o subshells lentas (`Select-String`, `findstr`, `grep`).
- Abre EXCLUSIVAMENTE los servicios y modelos involucrados en la cadena de integración.
- Comandos CLI permitidos exclusivamente:
  * `pnpm --filter api exec prisma validate`
  * `pnpm --filter api exec prisma generate`
  * `pnpm --filter api test`
  NUNCA usar `npx`.
- PROHIBIDO exponer `DATABASE_URL`, contraseñas o credenciales en terminal o reportes.

OBJETIVO
Validar y demostrar que el backend V1 opera como un sistema integrado cohesivo.
NO crear nuevos módulos de negocio ni agregar entidades nuevas.
Implementar una suite de pruebas de integración que ejecute el flujo de negocio completo de extremo a extremo:
Compra de insumos -> Entrada a Inventario -> Producción con consumo de receta -> Creación de Lote -> Ingreso de producto terminado -> Venta con descuento de stock -> Pago de Cliente -> Registro de Gastos.
Verificar atomicidad transaccional, trazabilidad relacional y consistencia física en PostgreSQL.

1. LECTURA MÍNIMA ESTRICTA (SOLO ESTOS ARCHIVOS)
- `apps/api/prisma/schema.prisma` (verificar relaciones entre Compras, Inventario, Recetas, Producción, Lotes, Ventas, Pagos)
- `apps/api/src/inventory/inventory.service.ts`
- `apps/api/src/production/production.service.ts`
- `apps/api/src/sales/sales.service.ts`
- `apps/api/src/payments/payments.service.ts`

2. ALCANCE DIRECTO A IMPLEMENTAR
- Suite de Integración End-to-End (`apps/api/test/business-flow.integration.spec.ts`):
  * Flujo Abastecimiento: Proveedor -> Insumo -> Compra -> Entrada de Inventario (saldo positivo).
  * Flujo Producción: Consumo de insumos por Receta -> Producción -> Creación de Lote -> Entrada de Producto Terminado -> Salida de Insumos.
  * Flujo Comercial: Cliente -> Venta con asignación de Lote -> Salida de Inventario -> Registro de DetalleVenta.
  * Flujo Cobranza: Registro de PagoCliente liquidando o abonando a la Venta.
  * Registro de Gasto independiente.
- Verificación de Rollback Transaccional:
  * Prueba de fallo intencional en Producción (insumo insuficiente) confirmando que no se persiste producción huérfana ni movimientos.
  * Prueba de fallo en Venta (stock insuficiente) confirmando aborto completo.
- Correcciones puntuales en servicios existentes si se detectan fallas de integración entre interfaces o tipos.

3. LÍMITES ESTRICTOS (PROHIBICIONES)
- NO implementar frontend, Next.js, vistas ni dashboards.
- NO implementar módulos de analítica avanzada o autenticación JWT en esta fase (pertenecen a la fase de endurecimiento/seguridad).
- NO alterar el esquema relacional en `schema.prisma` salvo corrección de un error flagrante de relaciones.

4. PRUEBAS, REGRESIÓN Y AUTOAUDITORÍA
- Ejecutar suite completa para certificar cero regresiones:
    pnpm --filter api exec prisma validate
    pnpm --filter api test
- Actualizar el estado de la Fase 19 en `docs/implementation/05-prisma-implementation-plan.md`.

REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

FASE 19 — CIERRE

• Estado: [COMPLETADA / PARCIAL / BLOQUEADA]
• Integración general: OK / ERROR
• Flujo Compras → Inventario: OK / ERROR
• Flujo Producción → Inventario → Lotes: OK / ERROR
• Flujo Ventas → Inventario → Lotes: OK / ERROR
• Flujo Ventas → Pagos: OK / ERROR
• Gastos: OK / ERROR
• Trazabilidad relacional: OK / ERROR
• Transacciones atómicas y Rollback: OK / ERROR
• Persistencia PostgreSQL: OK / ERROR
• Pruebas de integración E2E: OK / ERROR
• Regresión módulos anteriores: OK / ERROR
• Prisma validate: OK / ERROR
• Prisma generate: OK / ERROR
• Build: OK / ERROR / NO CONFIGURADO
• Autoauditoría: OK / ERROR
• Decisiones documentales: NINGUNA / [detalle]
• Documentos modificados: [lista]
• Archivos creados: [apps/api/test/business-flow.integration.spec.ts, etc.]
• Archivos modificados: [lista de servicios ajustados si aplica]
• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA / [detalle]
• Bloqueos: NINGUNO
• Siguiente fase: Endurecimiento y Seguridad del Backend V1

DETENTE inmediatamente tras el reporte.