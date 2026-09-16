# REGLAS GLOBALES DEL PROYECTO (STRICT) - ÍNDICE ENRUTADOR

> **NOTA PARA LA IA:** SIEMPRE QUE INICIES UNA SESIÓN, DEBES LEER ESTE ÍNDICE Y EL DOCUMENTO `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md`.
> Las 39 reglas maestras del proyecto han sido modularizadas bajo `.agents/rules/` para garantizar responsabilidad única y evitar el desbordamiento de contexto.

---

### TABLA DE DERIVACIÓN Y MÓDULOS ESPECIALIZADOS

Antes de intervenir cualquier módulo o ejecutar tareas, consulta el submódulo correspondiente según el alcance de tu tarea:

| Módulo | Archivo de Reglas | Reglas Cubiertas | Ámbito de Aplicación |
| :--- | :--- | :--- | :--- |
| **1. Núcleo y Ejecución** | [`.agents/rules/01-core-execution.md`](file:///.agents/rules/01-core-execution.md) | 0, 1, 3, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30 | Principio fundamental, entorno pnpm, diagnóstico raíz, criterio de finalización y gobernanza. |
| **2. Backend y Base de Datos** | [`.agents/rules/02-backend-database.md`](file:///.agents/rules/02-backend-database.md) | 2, 2.1, 9, 9.1, 10, 11, 12, 12.1, 14, 15, 23 | Prisma, rutas Express, Controller-Service-Repository, Backend-First, seeds e integridad. |
| **3. Arquitectura Frontend** | [`.agents/rules/03-frontend-architecture.md`](file:///.agents/rules/03-frontend-architecture.md) | 4, 5, 6, 6.1, 6.2, 7, 8, 8.1, 16.3, 16.4, 18, 19 | Arquitectura 3 capas, SRP (< 120 líneas en page, < 150 en modales), JSDoc, CSS Modules, no inline styles. |
| **4. Design System MANNÁ** | [`.agents/rules/04-design-system-manna.md`](file:///.agents/rules/04-design-system-manna.md) | 16, 16.1, 16.2, 35, 36, 37, 38 (jerga) | Paleta MANNÁ (`#182622`, Pergamino, Oro), Veto Anti-Blue, ergonomía de planta, AssistedEmptyState, no alerts. |
| **5. Formularios y Modales** | [`.agents/rules/05-forms-and-modals.md`](file:///.agents/rules/05-forms-and-modals.md) | 13, 13.1, 13.2, 17, 31, 32, 33, 34, 35, 36, 37, 38 (modales), 39 | Poka-Yoke, UPPERCASE, máscaras COP/NIT/Tel, SmartModal, número a letras, catálogos. |
| **6. Circuit Breaker y Anti-Loop** | [`.agents/rules/06-circuit-breaker-and-anti-loop.md`](file:///.agents/rules/06-circuit-breaker-and-anti-loop.md) | Circuit Breaker (1, 2, 3, 4) | Tope 2 reintentos, umbral 135 líneas, aislamiento hermético frontend/backend, bloqueo anti-bucle. |
| **7. Eficiencia de Tokens y Presupuesto** | [`.agents/rules/07-token-efficiency-and-tool-budget.md`](file:///.agents/rules/07-token-efficiency-and-tool-budget.md) | Regla 07 (1, 2, 3, 4, 5) | Máximo 1 lectura por archivo, restricción de barridos ciegos, presupuesto 4-6 lecturas, ejecución quirúrgica y cierre inmediato. |

---

### GUARDiÁN DE ARQUITECTURA AUTOMATIZADO (SRP)

* Para verificar la integridad de líneas y modularidad del frontend en cualquier momento, ejecuta:
  ```bash
  pnpm run verify:srp
  # o directamente: node .agents/scripts/verify-srp.js
  ```

---

### PRINCIPIO NUCLEAR DE CIERRE
1. El objetivo definido en el prompt fue implementado.
2. No quedan errores introducidos por la propia tarea.
3. Las dependencias directamente afectadas continúan siendo compatibles.
4. Se ejecutaron las validaciones proporcionales correspondientes.
5. Los cambios fueron documentados en el reporte de cierre.