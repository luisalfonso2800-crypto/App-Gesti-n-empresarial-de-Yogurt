TAREA CONTROLADA — REGISTRO DE COMMIT DETALLADO Y SINCRONIZACIÓN GIT (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Generar un documento de auditoría técnica exhaustivo con todos los cambios detectados en el monorepo (migración JS, reestructuración documental, infraestructura y entidades maestras), incluirlo en Git, aplicar el commit usando dicho informe como mensaje y hacer push a GitHub resolviendo el upstream.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar código fuente, esquemas Prisma o configuraciones del sistema.
- PROHIBIDO inspeccionar el contenido interno de los archivos; usa únicamente comandos de terminal.
- Usa EXCLUSIVAMENTE llamadas de Bash para generar el archivo y ejecutar los comandos de Git desde la raíz.

PROCEDIMIENTO DE EJECUCIÓN
1. Ubicarse en la raíz del proyecto.
2. Crear el directorio `docs/implementation/commits/` si no existe.
3. Crear el archivo `docs/implementation/commits/commit-fase-4-completada.md` con el siguiente contenido técnico estructurado:

feat(core): consolidar arquitectura js puro, reestructuracion documental y persistencia prisma fases 1-4

1. BACKEND & INFRAESTRUCTURA (JS PURO)
- Migracion de apps/api a JavaScript puro (Node.js/Babel/Jest), eliminando tsconfig.base.json.
- Integracion de PostgreSQL con @prisma/adapter-pg y pg en Prisma v7.10.0.
- Creacion y registro de DatabaseModule y PrismaService integrados en el ciclo de vida de NestJS.
- Ajuste del bootstrap en main.js para mantener la escucha de puerto activa.
- Suite de pruebas base en Jest aprobada (1 suite / 1 test ok).

2. PERSISTENCIA - PRISMA FASES 1 A 4
- Fases 1 a 3 cerradas y validadas tecnicamente (configuracion, driver nativo y conexion).
- Fase 4: Implementacion de 5 entidades maestras en apps/api/prisma/schema.prisma:
  * Presentacion (ID uuid, tapilla opcional integrada, medidas Decimal, activo Boolean)
  * Insumo (clasificacion, unidad base, stock minimo Decimal, activo Boolean)
  * Proveedor (datos de contacto, nitCedula no unique en esta fase, activo Boolean)
  * Producto (categoria, canal, precioVenta Decimal(12,2), margen Decimal(5,2), @@unique([nombre, idPresentacion]))
  * Cliente (tipo, canal, contacto, diasCredito Int, activo Boolean)
- Cero relaciones @relation de Fase 5 y cero migraciones fisicas (schema validado con prisma validate).

3. REESTRUCTURACION DOCUMENTAL Y TRAZABILIDAD
- Migracion del modelo de dominio desde docs/domains/data/ hacia docs/data-model/ (archivos 00 al 10).
- Incorporacion de documentacion consolidada (docs/documentacion_consolidada.md y 00-DOCUMENTATION-MAP.md).
- Registro de manuales operativos y revisiones en docs/antigravity/ y docs/project/reviews/.
- Registro de contratos tecnicos y estado de persistencia:
  * docs/implementation/05-estado-persistencia.md
  * docs/implementation/06-decisiones-fase-4-prisma.md
- Auditoria de fidelidad certificada con coincidencia exacta (16-fidelity-audit-fase-4.md).

4. GESTION DE PROMPTS
- Versionado de artefactos controlados de bajo consumo en apps/prompts/implememtacion/ (prompts 08 al 17).

4. Ejecutar en terminal:
   git add .
   git commit -F docs/implementation/commits/commit-fase-4-completada.md
   git push -u origin main

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

GIT BACKUP & SYNC — REGISTRO HISTÓRICO
- Documento de auditoría creado: docs/implementation/commits/commit-fase-4-completada.md
- Git add / commit: EXITOSO
- Git push (-u origin main): EXITOSO
- Estado de sincronización: Repositorio remoto actualizado
- Próximo paso: Ejecutar /clear en la consola de AGY

DETENTE inmediatamente tras el reporte.