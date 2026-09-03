feat(prisma): consolidar fase 16 (bloque-abastecimiento-inventario) y cambios de proyecto

- Cambios tecnicos de la fase:
  * Modulos Purchases e Inventory implementados e inyectados en app.module.js.
  * Transacciones atomicas ($transaction) implementadas para el registro de compras, actualizacion de inventario y generacion de movimientos de inventario.
  * prisma format y prisma validate ejecutados con exito (Exit code 0).
  * Cero migraciones fisicas aplicadas a base de datos.
- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * docs/implementation/05-prisma-implementation-plan.md actualizado (Items 9 al 11 completados).
- Alcance:
  * Validacion de alcance completada sin elementos de fases posteriores.
