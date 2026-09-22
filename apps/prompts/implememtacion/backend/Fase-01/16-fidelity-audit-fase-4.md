TAREA CONTROLADA — AUDITORÍA FINAL DE FIDELIDAD PRISMA FASE 4 (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Contrastar punto por punto `apps/api/prisma/schema.prisma` contra el contrato ratificado en `docs/implementation/06-decisiones-fase-4-prisma.md` para certificar fidelidad técnica y estructural absoluta.
PROHIBIDO MODIFICAR, CREAR O CORREGIR CÓDIGO/ARCHIVOS.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- Tarea estrictamente de SOLO LECTURA y VERIFICACIÓN.
- PROHIBIDO modificar archivos, ejecutar migraciones (`prisma migrate` prohibido) o generar Prisma Client.
- PROHIBIDO corregir discrepancias automáticamente.
- Consulta EXCLUSIVAMENTE:
  1. docs/implementation/06-decisiones-fase-4-prisma.md
  2. apps/api/prisma/schema.prisma
  3. git status -s (para verificar alcance de archivos)

PUNTOS CRÍTICOS A VERIFICAR:
1. Modelos (Presentacion, Insumo, Proveedor, Producto, Cliente): nombres PascalCase, mapeos @@map, IDs String @id @default(uuid()).
2. Atributos: coincidencia exacta de campos, tipos, nulabilidad, @map, defaults (activo @default(true)) y escalas Decimal.
3. Tapilla: atributo String? opcional dentro de Presentacion (sin entidad independiente).
4. Producto: restricción @@unique([nombre, idPresentacion]) escalar. Cero directivas `@relation`.
5. Proveedor: nitCedula sin @unique.
6. Fase 5 aislada: ausencia total de relaciones foráneas `@relation`.
7. Alcance: apps/api/src/database/ sin tocar, cero migraciones.

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque estructurado y DETENTE:

PRISMA FASE 4 — AUDITORÍA DE FIDELIDAD

- Presentacion: [EXACTA / DISCREPANCIA]
- Insumo: [EXACTA / DISCREPANCIA]
- Proveedor: [EXACTA / DISCREPANCIA]
- Producto: [EXACTA / DISCREPANCIA]
- Cliente: [EXACTA / DISCREPANCIA]

- Campos: [OK / DISCREPANCIA]
- Tipos: [OK / DISCREPANCIA]
- Nulabilidad: [OK / DISCREPANCIA]
- Defaults: [OK / DISCREPANCIA]
- @map / @@map: [OK / DISCREPANCIA]
- Restricciones: [OK / DISCREPANCIA]
- IDs: [OK / DISCREPANCIA]
- Decimales: [OK / DISCREPANCIA]
- Tapilla: [OK / DISCREPANCIA]
- Relaciones Fase 5: [AUSENTES / PRESENTES]
- Migraciones: [AUSENTES / PRESENTES]
- Archivos fuera de alcance modificados: [NINGUNO / lista]

- Discrepancias encontradas:
  [lista exacta / NINGUNA]

- Estado de fidelidad: [EXACTA / BLOQUEADA]

DETENTE inmediatamente tras el reporte.