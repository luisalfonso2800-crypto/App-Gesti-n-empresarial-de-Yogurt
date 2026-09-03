TAREA DE AUDITORÍA — DETECCIÓN DE ARCHIVOS TYPESCRIPT (.ts / .tsx)

OBJETIVO ÚNICO
Listar de manera exhaustiva todos los archivos con extensión .ts y .tsx existentes en el repositorio para preparar la migración estricta a JavaScript puro (Node.js/Babel), sin modificar ni eliminar código aún.

REGLAS ESTRICTAS DE CONSUMO (AHORRO DE TOKENS)
- PROHIBIDO modificar, renombrar o eliminar archivos en esta etapa.
- PROHIBIDO inspeccionar el contenido completo de los archivos.
- PROHIBIDO instalar paquetes o ejecutar builds.
- EXCLUIR de la búsqueda las carpetas: node_modules, .git, dist, build, .turbo, .next.

PROCEDIMIENTO DE EJECUCIÓN
1. Ejecuta una búsqueda por comando de sistema (PowerShell o bash) filtrando extensiones:
   Get-ChildItem -Recurse -Include *.ts,*.tsx -Exclude *node_modules*,*dist*,*.git* | Select-Object FullName
2. Agrupa los resultados encontrados por módulo o carpeta:
   - Raíz y configuración (ej. prisma.config.ts)
   - apps/api (código fuente y tests)
   - apps/web u otros paquetes del workspace

FORMATO DEL REPORTE FINAL
Emite únicamente una tabla o lista plana con el siguiente formato y DETENTE:

| Archivo Detectado | Rol del Archivo | ¿Requiere Conversión a .js? |
| --- | --- | --- |
| ruta/archivo.ts | Config / Lógica de negocio / Test | Sí / No (si es archivo de tipos .d.ts de librería) |

No agregues explicaciones teóricas ni texto de relleno al final.