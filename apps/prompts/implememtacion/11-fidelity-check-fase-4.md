TAREA CONTROLADA — FASE 4: CONTROL DE FIDELIDAD (CONSUMO ULTRA BAJO)

OBJETIVO ÚNICO
Comparar los modelos creados en apps/api/prisma/schema.prisma contra las definiciones de dominio en docs/data-model/ para identificar discrepancias en campos, nombres y tipos.
PROHIBIDO MODIFICAR, CREAR O CORREGIR ARCHIVOS.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar o escribir código/documentación.
- PROHIBIDO inferir campos faltantes o inventar convenciones.
- PROHIBIDO analizar relaciones (@relation) o entidades de fases posteriores.
- Lee EXCLUSIVAMENTE las secciones de Presentaciones, Insumos, Proveedores, Productos y Clientes en:
  1. docs/data-model/01-entities.md
  2. docs/data-model/05-data-model-decisions.md
  3. apps/api/prisma/schema.prisma

PROCEDIMIENTO DE COMPARACIÓN
Para cada una de las 5 entidades maestras:
1. Extrae los atributos/campos definidos en el modelo documental.
2. Extrae los campos actualmente presentes en schema.prisma.
3. Lista las diferencias exactas (campos faltantes, sobrantes o tipos divergentes).
4. Si un campo no está explícito en la documentación, márcalo como "NO DETERMINABLE".

FORMATO DEL REPORTE FINAL
Emite únicamente este bloque de texto y DETENTE:

FASE 4 — CONTROL DE FIDELIDAD

Presentaciones
- Modelo documental: [Campos listados en doc]
- Prisma: [Campos actuales en schema]
- Diferencias: [Faltantes / Sobrantes / Tipos divergentes / NINGUNA]

Insumos
- Modelo documental: [Campos listados en doc]
- Prisma: [Campos actuales en schema]
- Diferencias: [Faltantes / Sobrantes / Tipos divergentes / NINGUNA]

Proveedores
- Modelo documental: [Campos listados en doc]
- Prisma: [Campos actuales en schema]
- Diferencias: [Faltantes / Sobrantes / Tipos divergentes / NINGUNA]

Productos
- Modelo documental: [Campos listados en doc]
- Prisma: [Campos actuales en schema]
- Diferencias: [Faltantes / Sobrantes / Tipos divergentes / NINGUNA]

Clientes
- Modelo documental: [Campos listados en doc]
- Prisma: [Campos actuales en schema]
- Diferencias: [Faltantes / Sobrantes / Tipos divergentes / NINGUNA]

Resultado
- Fidelidad: [COMPLETA / PARCIAL / BLOQUEADA]
- Campos que requieren decisión: [Lista o NINGUNO]
- Cambios requeridos en schema: [Lista de campos a agregar/ajustar o NINGUNO]

DETENTE inmediatamente después del reporte.