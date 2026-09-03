# REGLAS GLOBALES DEL PROYECTO (STRICT)

1. ENTORNO Y COMANDOS:
   - Usa EXCLUSIVAMENTE `pnpm --filter api exec ...` para Prisma. NUNCA uses `npx`.
   - Prohibido ejecutar `prisma migrate` o alterar la base de datos real.

2. ARQUITECTURA Y EJECUCIÓN:
   - El código backend reside en `apps/api/`. El schema está en `apps/api/prisma/schema.prisma`.
   - No toques `apps/api/src/` salvo orden explícita.
   - Prohibido crear entidades fuera de la fase asignada.
   - Ejecuta las tareas en bloques completos de fase sin detenerte por confirmaciones intermedias.

3. REGLA DE DETENCIÓN:
   - Solo detente ante errores irresolubles o bloqueos reales de diseño. Si hay un error de sintaxis en Prisma introducido por ti, corrígelo de inmediato.