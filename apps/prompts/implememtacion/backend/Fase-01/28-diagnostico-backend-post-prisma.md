TAREA CONTROLADA — DIAGNÓSTICO DE PREPARACIÓN BACKEND (POST PRISMA V1)

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells de terminal lentas.
- Inspecciona archivos exclusivamente mediante la herramienta nativa de lectura directa (Read / readFile).
- PROHIBIDO modificar o crear archivos de código, esquemas o documentación. Tarea estrictamente de solo lectura y diagnóstico.

OBJETIVO
Realizar una revisión integral del proyecto para contrastar la documentación de arquitectura backend contra el código real implementado, determinando la siguiente etapa técnica de trabajo sin asumir ni inventar fases.

1. LECTURA Y FUENTES DE VERDAD
Inspecciona de forma directa:
- `AI_PROJECT_OPERATING_MANUAL.md`
- Documentación de arquitectura y contratos en `docs/backend/`
- Definición de dominios en `docs/domains/`
- Modelo de datos validado en `docs/data-model/`
- Planes y decisiones en `docs/implementation/`
- Árbol y archivos reales en `apps/api/src/` y `apps/api/prisma/`

2. LÍMITES ESTRICTOS (SOLO LECTURA)
- NO implementar código, DTOs, controllers, services ni repositorios.
- NO modificar `schema.prisma` ni ejecutar migraciones.
- NO modificar documentación ni crear archivos nuevos.

3. PUNTOS DE DIAGNÓSTICO
1. Evaluar si existe la infraestructura base en `apps/api/src/` (PrismaService, DatabaseModule, ConfigModule, manejo global de errores/filtros).
2. Determinar qué módulos están definidos documentalmente vs. cuáles tienen código real.
3. Identificar si el orden contractual exige primero infraestructura global o iniciar por módulos maestros/transaccionales.
4. Identificar contradicciones documentales o bloqueos que impidan continuar.

4. INFORME FINAL REQUERIDO
Al terminar responde ÚNICAMENTE con el siguiente reporte estructurado y DETENTE:

REVISIÓN POST-PRISMA V1

1. ESTADO REAL DEL PROYECTO
• Estado: [Nivel de madurez: A, B, C, D, E o F]
• Prisma: [Estado de schema y client]
• Base de datos: [Estado físico / migraciones]
• Infraestructura backend: [Qué existe en apps/api/src/]
• Módulos: [Qué módulos existen en código]
• Casos de uso: [Existencia en código]
• API: [Controllers existentes]
• Pruebas: [Estado actual de tests]

2. DOCUMENTACIÓN BACKEND
• Arquitectura: [Definida / Pendiente]
• Módulos: [Lista documental]
• Persistencia: [Enfoque documental: Prisma directo vs Repository]
• Transacciones: [Manejo documentado]
• Validaciones: [Pipes / DTOs documentados]
• Orden de implementación: [Ruta oficial documentada]

3. CORRESPONDENCIA DOCUMENTACIÓN ↔ CÓDIGO
• Correctamente implementado:
• Parcialmente implementado:
• Documentado pero no implementado:
• Implementado sin documentación:

4. DEPENDENCIAS
• Infraestructura pendiente:
• Dependencias técnicas:
• Dependencias funcionales:
• Bloqueos reales:

5. SIGUIENTE ETAPA RECOMENDADA
• Nombre:
• Objetivo:
• Alcance:
• Dependencias:
• Por qué corresponde ahora:

6. ORDEN POSTERIOR
[Secuencia resumida de siguientes etapas]

7. DECISIONES PENDIENTES
• [Ninguna / Lista]

8. CONCLUSIÓN
[¿Está el backend preparado para iniciar módulos de negocio o falta infraestructura técnica previa?]

9. PROPUESTA DE SIGUIENTE PROMPT
[Acción concreta que debe abordar el siguiente prompt de implementación]

DETENTE inmediatamente tras el reporte.