feat(prisma): implementar y validar relaciones base de fase 5

- Definida relacion bidireccional Producto <-> Presentacion en apps/api/prisma/schema.prisma.
- Configurada foreign key idPresentacion en Producto referenciando Presentacion.id.
- Validacion sintactica exitosa via prisma validate (Exit code 0).
- Actualizado docs/implementation/05-prisma-implementation-plan.md marcando Fase 5 como completada.
- Cero migraciones fisicas aplicadas y cero entidades de fases 6+ introducidas.
