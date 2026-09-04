TAREA CONTROLADA — CONTROL DE ALCANCE — FASE 4: ENTIDADES MAESTRAS (MODO BAJO CONSUMO)

OBJETIVO ÚNICO
Determinar con precisión qué entidades maestras define el plan para la Fase 4 y qué componentes existen en el schema actual, sin modificar código, sin implementar lógica y sin gastar cuota en lecturas innecesarias.

REGLAS ESTRICTAS DE CONSUMO CERO TOKENS
- PROHIBIDO modificar, crear o eliminar archivos en apps/api o docs/.
- PROHIBIDO implementar entidades, módulos, migraciones, DTOs o repositorios.
- PROHIBIDO ejecutar búsquedas recursivas en src/ o leer documentación externa.
- Consulta EXCLUSIVAMENTE:
  1. La sección referente a "Fase 4" en docs/implementation/05-prisma-implementation-plan.md.
  2. El archivo apps/api/prisma/schema.prisma.

FORMATO DEL REPORTE FINAL
Emite únicamente el siguiente bloque de texto estructurado y DETENTE:

FASE 4 — CONTROL DE ALCANCE
- Entidades maestras definidas por el plan: [Lista plana de modelos según Fase 4]
- Entidades ya representadas: [Modelos presentes actualmente en schema.prisma o 'Ninguna']
- Entidades pendientes: [Modelos que faltan por agregar al schema]
- Componentes que la Fase 4 requiere crear: [Modelos en schema.prisma / Prisma Client]
- Dependencias con fases posteriores: [Relaciones o lógica diferida a Fase 5+]
- Bloqueadores: [Decisiones de diseño o atributos pendientes según el plan, o 'Ninguno']

DETENTE inmediatamente después del reporte.