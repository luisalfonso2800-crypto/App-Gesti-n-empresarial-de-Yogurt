TAREA CONTROLADA — FASE 8: IMPLEMENTACIÓN DE RECETAS Y PRODUCCIÓN

REGLAS TÉCNICAS ANTI-BLOQUEO (STRICT WINDOWS CLI)
- PROHIBIDO usar comandos como `Select-String`, `findstr`, `grep` interactivos o subshells largas.
- Inspecciona los archivos mediante la herramienta nativa de lectura directa (Read / readFile).
- Comandos CLI permitidos: ÚNICAMENTE `pnpm --filter api exec prisma format` y `pnpm --filter api exec prisma validate`. NUNCA usar `npx`.

1. OBJETIVO
Implementar en apps/api/prisma/schema.prisma los modelos, campos y relaciones correspondientes exclusivamente a la Fase 8 del modelo de datos del sistema de gestión empresarial de Yogurt.
La fase debe ejecutarse como una unidad completa de:
análisis → implementación → autoauditoría → validación técnica → corrección → cierre.
No se debe crear una fase posterior de auditoría separada si esta ejecución termina sin discrepancias.

2. REGLA PRINCIPAL
La implementación debe realizarse contra el contrato documental existente.
La fuente de verdad, en orden de prioridad, es:
1. AI_PROJECT_OPERATING_MANUAL.md
2. Documentación específica de la Fase 8.
3. docs/implementation/05-prisma-implementation-plan.md
4. Documentación del modelo de datos en docs/data-model/
5. Decisiones previamente ratificadas en docs/implementation/
6. Estado actual de apps/api/prisma/schema.prisma
El schema.prisma existente representa el estado técnico acumulado de las fases anteriores y NO debe ser reconstruido ni simplificado.
No inventes campos, relaciones, restricciones o reglas que no estén respaldados por el contrato.

3. ALCANCE DE ESTA FASE
Implementar únicamente los elementos correspondientes a:
Recetas y Producción.
La Fase 7 ya implementó:
- Compra
- DetalleCompra
- Inventario
- MovimientoInventario
y sus relaciones correspondientes con Proveedor e Insumo.
La Fase 8 debe continuar sobre ese estado y agregar únicamente los modelos, campos y relaciones definidos documentalmente para:
- Recetas.
- Detalle de recetas.
- Producción.
- Detalle de producción.
- Relaciones necesarias con las entidades previamente existentes.
Antes de modificar el esquema, determina exactamente qué modelos, campos y relaciones pertenecen a esta fase consultando la documentación.
No asumas que los nombres anteriores son suficientes para definir el esquema final: verifica el contrato.

4. RESTRICCIÓN DE ALCANCE
Durante esta tarea:

SÍ se permite:
- Modificar apps/api/prisma/schema.prisma.
- Agregar modelos correspondientes a la Fase 8.
- Agregar campos correspondientes a la Fase 8.
- Agregar relaciones necesarias para integrar correctamente estos modelos con el esquema existente.
- Ejecutar prisma format.
- Ejecutar prisma validate.
- Consultar archivos de documentación necesarios.
- Corregir inmediatamente errores encontrados durante la propia implementación.
- Actualizar únicamente la documentación de cierre de implementación si el proceso existente del proyecto lo requiere.

NO se permite:
- Crear migraciones ni ejecutar prisma migrate.
- Modificar datos reales.
- Modificar controladores, servicios, módulos NestJS, DTOs o repositorios.
- Modificar frontend.
- Crear nuevos archivos de aplicación.
- Implementar lógica de negocio, endpoints, formularios o seeders.
- Modificar fases posteriores.
- Modificar entidades ya implementadas salvo que sea estrictamente necesario para establecer una relación requerida por el contrato de esta fase.
- Cambiar una decisión previamente ratificada sin evidencia documental explícita.

5. PROCEDIMIENTO DE EJECUCIÓN
PASO 1 — LEER EL CONTEXTO
Antes de editar cualquier archivo, lee de forma directa:
- AI_PROJECT_OPERATING_MANUAL.md
- este prompt
- docs/implementation/05-prisma-implementation-plan.md
- la documentación de relaciones y entidades correspondiente en docs/data-model/
- apps/api/prisma/schema.prisma
No leas indiscriminadamente todo el proyecto. Busca solamente la información necesaria para ejecutar esta fase.

PASO 2 — DETERMINAR EL CONTRATO DE LA FASE
Identifica explícitamente, antes de editar:
- Modelos que deben existir.
- Campos de cada modelo, tipos Prisma, nulabilidad y valores por defecto.
- IDs, @map y @@map.
- Restricciones @unique y @@unique.
- Relaciones, campos FK y cardinalidad.
- Entidades previamente existentes involucradas.

PASO 3 — INSPECCIONAR EL ESTADO ACTUAL
Revisa apps/api/prisma/schema.prisma comprobando nombres, convenciones y relaciones que deben extenderse sin duplicar.

PASO 4 — IMPLEMENTAR
Implementa directamente en apps/api/prisma/schema.prisma respetando el contrato documental y convenciones existentes.

PASO 5 — AUTOAUDITORÍA OBLIGATORIA
Antes de declarar la fase completada, audita tu propio resultado contra la documentación (Modelos, campos, tipos, nulabilidad, defaults, IDs, @map, @@map, @unique, @@unique, FKs, relaciones y ausencia de fases posteriores).
prisma validate confirma validez técnica; NO confirma fidelidad al modelo de negocio. Ambas validaciones son obligatorias.

6. REGLA DE AUTOCORRECCIÓN
Si durante la autoauditoría encuentras una discrepancia causada por tu propia implementación: corrígela inmediatamente, revalida y continúa sin detenerte.

7. REGLA PARA CONTRADICCIONES DOCUMENTALES
Si encuentras una contradicción real e irresoluble entre documentos: NO inventes soluciones. Detén únicamente la parte afectada e informa Documento A, Documento B, contradicción y decisión necesaria.

8. VALIDACIÓN TÉCNICA
Ejecuta:
  pnpm --filter api exec prisma format
  pnpm --filter api exec prisma validate
Ambos comandos deben terminar en Exit code 0.

9. CRITERIO DE ÉXITO
La Fase 8 se declara COMPLETADA solo si:
- Modelos, campos, tipos, nulabilidad, defaults, IDs, maps y restricciones de Fase 8 están correctos según contrato.
- Relaciones con entidades anteriores integradas limpiamente.
- No se implementaron fases posteriores.
- prisma format y prisma validate terminan en OK.
- Cero cambios fuera de alcance y cero discrepancias.

10. REPORTE FINAL OBLIGATORIO
Al finalizar, responde ÚNICAMENTE con este formato y DETENTE:

FASE 8 — CIERRE

• Estado: [COMPLETADA / BLOQUEADA]
• Modelos implementados: [Lista exacta]
• Relaciones implementadas: [Lista exacta]
• Archivos modificados: apps/api/prisma/schema.prisma [, docs/implementation/05-prisma-implementation-plan.md]
• Prisma format: OK
• Prisma validate: OK
• Autoauditoría: OK
• Migraciones: NO
• Cambios fuera de alcance: NINGUNO
• Discrepancias: NINGUNA
• Bloqueos: NINGUNO
• Siguiente fase: Fase 9

DETENTE inmediatamente tras el reporte.