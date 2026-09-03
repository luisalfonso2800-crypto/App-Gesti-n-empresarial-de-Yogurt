TAREA CONTROLADA — PRISMA FASE 4: VALIDACIÓN (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Validar exclusivamente que los 5 modelos de la Fase 4 existen en apps/api/prisma/schema.prisma, comprobar que no introduzcan relaciones de Fase 5 y verificar la sintaxis con el CLI. 
PROHIBIDO MODIFICAR O CREAR CÓDIGO/DOCUMENTACIÓN.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar archivos, corregir discrepancias o escribir código.
- PROHIBIDO ejecutar migraciones o generar clientes (`prisma generate` o `prisma migrate` prohibidos).
- Consulta EXCLUSIVAMENTE:
  1. apps/api/prisma/schema.prisma
  2. La sección de campos de Fase 4 en docs/implementation/05-prisma-implementation-plan.md
- PROHIBIDO leer otros documentos o inspeccionar `apps/api/src/`.

PROCEDIMIENTO DE EJECUCIÓN
1. Comprueba la presencia y campos de los 5 modelos: Presentaciones, Insumos, Proveedores, Productos y Clientes.
2. Confirma que NO existan campos de relación `@relation` (Fase 5).
3. Ejecuta en terminal únicamente:
   pnpm exec prisma validate --schema apps/api/prisma/schema.prisma
   git status -s apps/api/prisma/schema.prisma

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

PRISMA FASE 4 — VALIDACIÓN
- Presentaciones: [OK / DISCREPANCIA]
- Insumos: [OK / DISCREPANCIA]
- Proveedores: [OK / DISCREPANCIA]
- Productos: [OK / DISCREPANCIA]
- Clientes: [OK / DISCREPANCIA]
- Relaciones Fase 5 introducidas: [NO / SÍ]
- prisma validate: [Válido (Exit 0) / Error]
- Archivos modificados por la fase: [Lista según git status]
- Discrepancias: [NINGUNA / detalle exacto sin corregir]
- Estado: [VALIDADA / BLOQUEADA]

DETENTE inmediatamente tras el reporte.