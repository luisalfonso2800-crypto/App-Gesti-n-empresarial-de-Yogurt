feat(prisma): consolidar fase 18 (bloque-comercial-ventas-pagos-gastos) y cambios de proyecto

- Cambios tecnicos de la fase:
  * Modulos Sales, Payments, Expenses y Clients implementados e inyectados en app.module.js.
  * Transacciones atomicas ($transaction) implementadas para el registro de ventas con validacion y descuento de stock en inventario y lotes.
  * prisma format y prisma validate ejecutados con exito (Exit code 0).
  * Cero migraciones fisicas aplicadas a base de datos.
- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * Prompts de implementacion: 36-implement-fase-18-bloque-comercial.md agregado.
  * docs/implementation/05-prisma-implementation-plan.md actualizado (Items 15 al 19 completados).
- Alcance:
  * Validacion de alcance completada sin elementos de fases posteriores.
