feat(prisma): consolidar fase 17 (produccion-lotes-trazabilidad) y cambios de proyecto

- Cambios tecnicos de la fase:
  * Modulos Production y Lots implementados e inyectados en app.module.js.
  * Transacciones atomicas ($transaction) implementadas para el registro de produccion, consumo de insumos de inventario (salida) e ingreso de lotes al inventario (entrada).
  * prisma format y prisma validate ejecutados con exito (Exit code 0).
  * Cero migraciones fisicas aplicadas a base de datos.
- Documentacion, prompts y ajustes incorporados por el desarrollador:
  * Prompts de implementacion: 35-implement-fase-17-produccion-lotes.md agregado.
  * docs/implementation/05-prisma-implementation-plan.md actualizado (Items 12 al 14 completados).
- Alcance:
  * Validacion de alcance completada sin elementos de fases posteriores.
