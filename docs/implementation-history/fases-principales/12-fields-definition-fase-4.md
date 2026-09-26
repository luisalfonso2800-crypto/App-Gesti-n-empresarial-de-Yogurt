TAREA CONTROLADA — CONTROL DE DEFINICIÓN DE CAMPOS: ENTIDADES MAESTRAS (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Extraer de la documentación existente la especificación exacta de campos para las 5 entidades maestras (Presentaciones, Insumos, Proveedores, Productos, Clientes) sin modificar archivos ni asumir datos no documentados.
PROHIBIDO MODIFICAR, CREAR O CORREGIR CÓDIGO O DOCUMENTACIÓN.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar o crear archivos.
- PROHIBIDO inferir campos, tipos, escalas numéricas o nulabilidad no documentadas. Si no está explícito, asignar: NO DETERMINADO o DECISIÓN PENDIENTE.
- PROHIBIDO analizar relaciones (@relation), Foreign Keys o entidades de fases posteriores.
- Consulta EXCLUSIVAMENTE las secciones de estas 5 entidades en:
  1. docs/data-model/01-entities.md
  2. docs/data-model/03-data-integrity-rules.md
  3. docs/data-model/05-data-model-decisions.md
  4. docs/documentacion_consolidada.md
  5. apps/api/prisma/schema.prisma

FORMATO DEL REPORTE FINAL
Emite únicamente las siguientes tablas estructuradas y DETENTE:

DEFINICIÓN DE CAMPOS — FASE 4

### Presentaciones
| Campo original | Nombre Prisma | Tipo Prisma | Obligatorio (Sí/No) | @map | Restricciones / Escala | Estado |
|---|---|---|---|---|---|---|

### Insumos
| Campo original | Nombre Prisma | Tipo Prisma | Obligatorio (Sí/No) | @map | Restricciones / Escala | Estado |
|---|---|---|---|---|---|---|

### Proveedores
| Campo original | Nombre Prisma | Tipo Prisma | Obligatorio (Sí/No) | @map | Restricciones / Escala | Estado |
|---|---|---|---|---|---|---|

### Productos
| Campo original | Nombre Prisma | Tipo Prisma | Obligatorio (Sí/No) | @map | Restricciones / Escala | Estado |
|---|---|---|---|---|---|---|

### Clientes
| Campo original | Nombre Prisma | Tipo Prisma | Obligatorio (Sí/No) | @map | Restricciones / Escala | Estado |
|---|---|---|---|---|---|---|

DECISIONES PENDIENTES
- [Lista numerada de campos con tipos, precisión o nulabilidad no determinados por la documentación, o NINGUNA]

ESTADO
[LISTO PARA IMPLEMENTAR / BLOQUEADO POR DECISIONES]

DETENTE inmediatamente después del reporte.