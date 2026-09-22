CORRECCIÓN DE RUNTIME EN PERSISTENCIA:
El arranque de NestJS falló en node index.js con el error:
"Cannot find module '.prisma/client/default' Require stack: apps/api/src/database/prisma.service.js"

Modifica EXCLUSIVAMENTE apps/api/src/database/prisma.service.js para resolver este error mediante un fallback defensivo:
1. Reemplaza el require/import directo de @prisma/client por una carga segura dentro de un bloque try/catch.
2. Si falla la importación de @prisma/client, usa una clase dummy como base con métodos $connect y $disconnect asíncronos vacíos.
3. Exporta la clase PrismaService decorada con @Injectable() extendiendo de dicha clase base.
4. Verifica sintaxis con node -c apps/api/src/database/prisma.service.js y detente.