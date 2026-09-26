TAREA DE AUDITORÍA FORENSE FULLSTACK DE PUNTA A PUNTA (BASE DE DATOS ↔ BACKEND ↔ FRONTEND ↔ E2E TEST)

OBJETIVO TÉCNICO:
Diagnosticar con evidencia exacta de código en toda la cadena técnica por qué la prueba canónica `apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js` se cuelga durante 300.000 ms (5 minutos) antes de abortar en la línea 46 con "Target page, context or browser has been closed".
La inspección debe rastrear el flujo completo: desde el modelo en PostgreSQL/Prisma, pasando por los controladores/DTOs de NestJS/Express, los componentes y hooks de React/Next.js, hasta la ejecución de Playwright.

PROHIBICIONES ESTRICTAS (REGLA 07 — MODO SOLO LECTURA):
- ESTRICTAMENTE PROHIBIDO modificar o crear archivos de código (.js, .jsx, .ts, .prisma) — 0 ediciones de código.
- PROHIBIDO ejecutar Playwright, builds, migraciones o servidores dev.
- PROHIBIDO realizar búsquedas globales ciegas o comandos recursivos pesados.
- LÍMITE: Máximo 5 lecturas directas dirigidas. Escribir ÚNICAMENTE el informe final.

RUTAS EXACTAS A INSPECCIONAR (CADENA FULLSTACK DE PUNTA A PUNTA):

1. CAPA BASE DE DATOS (Prisma Schema):
   - `apps/api/prisma/schema.prisma` (Modelo `Insumo` / `Supply`):
     * Campos obligatorios, constraints `@unique`, tipos de datos de `densidad`, `contenido`, `unidadBase` y valores por defecto.

2. CAPA BACKEND (API & Persistencia):
   - `apps/api/src/supplies/` (Controller, DTO y Service):
     * ¿Qué valida el DTO de creación de insumo? ¿Rechaza campos vacíos con 400?
     * ¿Qué responde la API al intentar crear un insumo duplicado o durante un test de fuzzing? ¿Responde con JSON o la petición queda colgada?

3. CAPA FRONTEND (UI, Modales y Clientes):
   - `apps/web/src/app/catalog/supplies/page.jsx` y `apps/web/src/app/catalog/supplies/components/SupplyModal.jsx`:
     * ¿Cómo se gestiona el cierre del modal tras enviar un registro? (¿`onClose` inmediato o espera respuesta de API?).
     * ¿El botón de cierre o cancelación se desmonta del DOM antes de que Playwright intente interactuar con él?

4. CAPA DE PRUEBAS E2E (Playwright Spec y Helpers):
   - `apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js` (L1 a L50).
   - `apps/web/e2e/helpers/exhaustive-helpers.js` (`closeModal`, `waitForLoad`, etc.).

PREGUNTAS OBLIGATORIAS A RESPONDER EN EL INFORME:
1. **Punto exacto del bloqueo:** ¿En qué instrucción (línea exacta y llamada de función) Playwright queda suspendido esperando que se resuelva la promesa?
2. **Impacto Backend/DB en el test:** ¿El backend o la base de datos están devolviendo un error (400/500/timeout) que el frontend no maneja, dejando el formulario en estado de carga indefinido (`loading: true`)?
3. **Mecanismo del Cuelgue en UI:** Si el modal intenta cerrarse mediante `closeModal`, ¿el selector busca un elemento que ya no está presente, o se produce una condición de carrera entre el re-render de la tabla y la animación del modal?

SALIDA REQUERIDA:
Generar el informe detallado en:
`docs/diagnosticos/AUDITORIA_FORENSE_FULLSTACK_SUPPLIES_HANG.md`

Estructura obligatoria del informe:
1. **Resumen Ejecutivo:** Diagnóstico puntual del cuelgue de 5 minutos.
2. **Trazabilidad de Punta a Punta:**
   - Base de Datos (Restricciones y modelo).
   - Backend API (Respuesta y DTOs).
   - Frontend UI (Comportamiento del modal y estados de envío).
   - Test E2E (Instrucción exacta causante del timeout de 300s).
3. **Causa Raíz Demostrada:** Fragmentos literales de código donde colisionan la UI y el test.
4. **Solución Técnica Quirúrgica:** Código exacto a sustituir para que el test concluya con éxito en menos de 3 segundos.

DETENCIÓN:
Al guardar el informe en `docs/diagnosticos/AUDITORIA_FORENSE_FULLSTACK_SUPPLIES_HANG.md`, DETENTE inmediatamente sin realizar ninguna otra acción.