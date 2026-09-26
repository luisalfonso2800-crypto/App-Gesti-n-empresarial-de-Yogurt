TAREA CONTROLADA — BACKEND BOOTSTRAP (MODO AHORRO DE CUOTA)

OBJETIVO ÚNICO
Implementar únicamente el bootstrap técnico inicial de apps/api/ siguiendo estrictamente docs/implementation/01-backend-bootstrap.md.
PROHIBIDO implementar módulos de negocio, Prisma, base de datos, autenticación, endpoints funcionales o frontend.

1. REGLA ESTRICTA DE LECTURA Y CONTEXTO MÍNIMO (NIVEL 1)
- Consulta ÚNICAMENTE estos archivos específicos:
  1. docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md (conducta operativa).
  2. docs/implementation/01-backend-bootstrap.md (especificación técnica única).
  3. Los archivos de configuración existentes dentro de apps/api/ estrictamente necesarios (ej. package.json de la api).
- PROHIBIDO leer docs/00-DOCUMENTATION-MAP.md, documentacion_consolidada.md, node_modules/, o archivos en docs/architecture/, docs/backend/ o docs/decisions/.
- No utilices razonamiento reflexivo profundo (mantener inferencia baja/directa).

2. ALCANCE DE MODIFICACIÓN
PERMITIDO:
- Crear/modificar exclusivamente los archivos técnicos base de apps/api/ que 01-backend-bootstrap.md ordene.
- Modificar package.json raíz o configuración de workspace SOLO si la especificación lo exige de forma explícita.

PROHIBIDO:
- No rediseñar arquitectura, ni agregar capas, librerías o scripts no pedidos.
- No modificar código fuera de apps/api/ por conveniencia.
- Si un componente del bootstrap ya existe y cumple la especificación, CONSÉRVALO; no lo reescribas.

3. PROCEDIMIENTO CONTROLADO
1. Lee docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md y docs/implementation/01-backend-bootstrap.md.
2. Inspecciona únicamente los archivos existentes en apps/api/ directamente implicados en el bootstrap.
3. Implementa quirúrgicamente las diferencias detectadas frente a la especificación.
4. Ejecuta la verificación técnica mínima indispensable para confirmar que el bootstrap levanta/funciona según su criterio.
5. Si falta una decisión crítica o una dependencia de fase posterior, repórtala y DETENTE (no improvises).

4. VERIFICACIÓN Y REPORTE FINAL
Al finalizar, entrega ÚNICAMENTE este formato conciso y DETENTE:

BOOTSTRAP IMPLEMENTADO
- Archivos creados/modificados: [lista concisa]
- Verificación ejecutada: [comando y resultado breve]
- Bloqueos o decisiones pendientes: [ninguno / detalle breve]