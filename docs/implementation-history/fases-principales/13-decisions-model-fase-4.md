TAREA CONTROLADA — DEFINICIÓN DEL MODELO PRISMA FASE 4 (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Resolver y contrastar documentalmente las definiciones exactas de campos, tipos, restricciones y nombres de las 5 entidades maestras (Presentaciones, Insumos, Proveedores, Productos, Clientes) para que el schema sea 100% fiel al modelo de datos original.
PROHIBIDO MODIFICAR, CREAR O TOCAR CÓDIGO Y SCHEMAS.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar o crear archivos de código, esquemas (.prisma) o documentación.
- PROHIBIDO inventar tipos, escalas, enums o convenciones no documentadas. Si no hay evidencia textual explícita, registrar: "NO DETERMINADO DOCUMENTALMENTE".
- PROHIBIDO analizar relaciones (@relation) o fases posteriores (Fase 5+).
- Consulta EXCLUSIVAMENTE las secciones de estas 5 entidades en:
  1. docs/data-model/01-entities.md
  2. docs/data-model/03-data-integrity-rules.md
  3. docs/data-model/05-data-model-decisions.md
  4. docs/documentacion_consolidada.md
  (Verificar específicamente si "Tapilla" figura documentalmente en Presentaciones o Insumos).

FORMATO DEL REPORTE FINAL
Emite únicamente la siguiente matriz tabular por entidad y la sección de decisiones pendientes, luego DETENTE:

# MATRIZ DE DEFINICIÓN — FASE 4

### 1. PRESENTACIONES
| Campo documental | Campo Prisma propuesto | Tipo | Obligatorio | Default | Unique | @map | Restricción | Evidencia / Estado |
|---|---|---|---|---|---|---|---|---|

### 2. INSUMOS
| Campo documental | Campo Prisma propuesto | Tipo | Obligatorio | Default | Unique | @map | Restricción | Evidencia / Estado |
|---|---|---|---|---|---|---|---|---|

### 3. PROVEEDORES
| Campo documental | Campo Prisma propuesto | Tipo | Obligatorio | Default | Unique | @map | Restricción | Evidencia / Estado |
|---|---|---|---|---|---|---|---|---|

### 4. PRODUCTOS
| Campo documental | Campo Prisma propuesto | Tipo | Obligatorio | Default | Unique | @map | Restricción | Evidencia / Estado |
|---|---|---|---|---|---|---|---|---|

### 5. CLIENTES
| Campo documental | Campo Prisma propuesto | Tipo | Obligatorio | Default | Unique | @map | Restricción | Evidencia / Estado |
|---|---|---|---|---|---|---|---|---|

# DECISIONES REALMENTE PENDIENTES
Lista únicamente lo que los documentos no resuelvan taxativamente, categorizado en:
- DECISIÓN DE MODELO (ej. pertenencia de Tapilla)
- DECISIÓN DE NOMENCLATURA (ej. camelCase vs snake_case en @map)
- DECISIÓN DE TIPO / ESCALA (ej. Decimal(10,2) vs Float, Boolean vs Enum para Activo)
- DECISIÓN DE RESTRICCIÓN (ej. campos @unique no formalizados)

ESTADO FINAL: [LISTO PARA DECISIÓN DE USUARIO]
DETENTE inmediatamente después del reporte.