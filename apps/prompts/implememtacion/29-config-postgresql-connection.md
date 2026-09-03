TAREA CONTROLADA — INFRAESTRUCTURA: CREACIÓN DE VARIABLES DE ENTORNO Y CONEXIÓN REAL POSTGRESQL

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos interactivos o subshells de terminal lentas (`Select-String`, `findstr`, `grep`).
- Inspecciona y escribe archivos exclusivamente mediante las herramientas nativas del entorno (Read / Write / Edit).
- PROHIBIDO imprimir contraseñas, secretos o la cadena completa `DATABASE_URL` en la terminal o en el reporte final.
- Comandos CLI permitidos: `pnpm --filter api exec prisma validate` y la comprobación de conexión `prisma db execute`. NUNCA usar `npx`.

OBJETIVO
Crear y configurar el archivo de variables de entorno (`.env`), configurar la cadena de conexión de PostgreSQL con las credenciales locales existentes y verificar la conexión física real entre NestJS, Prisma y la base de datos `yogurt_dev`.

1. CREDENCIALES Y PARÁMETROS DETERMINADOS
- Motor: PostgreSQL (localhost:5432)
- Base de datos: `yogurt_dev`
- Usuario: `postgres`
- Contraseña establecida: `1083002350Luis1995`
- Formato canónico de DATABASE_URL:
  `postgresql://postgres:1083002350Luis1995@localhost:5432/yogurt_dev?schema=public`

2. LÍMITES ESTRICTOS (PROHIBICIONES)
- NO implementar módulos funcionales, Controllers, Services o DTOs.
- NO modificar el modelo relacional en `apps/api/prisma/schema.prisma` (únicamente verificar el bloque `datasource`).
- NO ejecutar migraciones físicas (`prisma migrate dev` o `prisma migrate deploy` están prohibidos en esta tarea).
- NO versionar archivos con credenciales reales en Git (asegurar que `.env` esté en `.gitignore`).

3. PROCEDIMIENTO DE EJECUCIÓN
a) Configuración de Entorno (.env):
   - Inspeccionar si existe `.env` en la raíz del proyecto y/o en `apps/api/.env`.
   - Si no existe o no tiene `DATABASE_URL`, crear o actualizar el archivo `.env` correspondiente con:
     DATABASE_URL="postgresql://postgres:1083002350Luis1995@localhost:5432/yogurt_dev?schema=public"
   - Si existe un archivo `.env.example`, actualizarlo con una plantilla sin secretos:
     DATABASE_URL="postgresql://usuario:password@localhost:5432/yogurt_dev?schema=public"
   - Verificar que `.env` esté listado dentro de `.gitignore` para evitar filtraciones.

b) Configuración de Prisma y NestJS:
   - Revisar `apps/api/prisma/schema.prisma` y asegurar que `datasource db` use `provider = "postgresql"` y `url = env("DATABASE_URL")`.
   - Verificar que la infraestructura base de NestJS (`ConfigModule`, `PrismaService`) esté preparada para cargar `DATABASE_URL`.

c) Prueba de Conexión Física Real (Gate Obligatorio):
   - Ejecutar:
     pnpm --filter api exec prisma validate
   - Ejecutar comprobación no destructiva contra el motor PostgreSQL:
     pnpm --filter api exec prisma db execute --stdin
     (enviando la consulta: SELECT 1;)
   - La prueba debe retornar código de salida 0 para confirmar que la autenticación y el socket de red responden.

4. REPORTE FINAL OBLIGATORIO (DETENERSE TRAS EMITIR)
Responder ÚNICAMENTE con este formato:

CONEXIÓN POSTGRESQL — CIERRE

• Estado: [COMPLETADA / BLOQUEADA]

• Archivo .env: [CREADO / ACTUALIZADO]
• Variables configuradas: DATABASE_URL (PostgreSQL local)
• PostgreSQL local (5432): OK
• Base de datos yogurt_dev: OK
• Usuario postgres: OK
• NestJS Config / PrismaService: [OK / PENDIENTE]
• Prisma validate: [OK / FALLA]
• Prueba real de conexión (SELECT 1): [OK / FALLA]

• Migraciones ejecutadas: NO
• Schema modificado: [SÍ / NO]
• Módulos funcionales creados: NO
• Archivos modificados/creados: [Lista de archivos tocados, ej: apps/api/.env, .env.example]
• Secretos expuestos en Git/Reporte: NO

• Bloqueos: [NINGUNO / detalle exacto del error]

• Siguiente etapa: Migración inicial de Prisma (prisma migrate dev)

DETENTE inmediatamente tras el reporte.