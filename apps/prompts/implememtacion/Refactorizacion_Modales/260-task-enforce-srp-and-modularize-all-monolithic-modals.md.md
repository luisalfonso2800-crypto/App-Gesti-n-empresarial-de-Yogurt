TAREA:
1. Registrar en AGENTS.md la regla obligatoria de Principio de Responsabilidad Única (SRP), modularización atómica reutilizable (< 150 líneas) y veto absoluto a estilos en línea (`style={{}}`) en modales y vistas.
2. Auditar de forma delimitada todos los modales del sistema (`*Modal.jsx`), identificando y refactorizando quirúrgicamente cualquier archivo que exceda 150 líneas, mezcle múltiples responsabilidades o contenga estilos inline.

OBJETIVO:
Erradicar la deuda técnica y el consumo desmedido de cuota de tokens en el frontend:
1. Incorporar en `AGENTS.md` las reglas 6.1, 6.2 y 8.1 para formalizar que ningún archivo puede tener más de una sola responsabilidad ni contener estilos inline, exigiendo subcomponentes atómicos co-locados y CSS Modules.
2. Localizar mediante inspección estática (`git grep` y conteo de líneas) los modales que violan estas directrices (comenzando por `RecipeModal.jsx` y revisando `ProductionModal.jsx`, `ProductModal.jsx`, `PresentationModal.jsx`, `SupplyModal.jsx`, `SupplierModal.jsx`, `SaleModal.jsx`).
3. Descomponer cada modal infractor en subcomponentes declarativos (< 150 líneas cada uno) alojados en su respectiva carpeta co-locada `modal-parts/` o `components/`, y migrar el 100% de los estilos inline hacia sus archivos `.module.css`.

FUENTES DE VERDAD:
- `AGENTS.md` (Reglas 6, 7, 8, 34, 38)
- `docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md` (Reglas 0, 6, 23, 26)
- Archivos de modales en `apps/web/src/app/**/components/*Modal.jsx`

REGLA DE CONSULTA:
Prohibido leer recursivamente todo el repositorio. Usa comandos directos de conteo de líneas y búsqueda puntual de `style={{` para identificar únicamente los archivos infractores. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER:
- `AGENTS.md`
- Modales que superen 150 líneas o contengan `style={{`:
  * `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
  * `apps/web/src/app/operations/production/components/ProductionModal.jsx`
  * `apps/web/src/app/catalog/products/components/ProductModal.jsx`
  * Demás modales activos del sistema que incumplan SRP.

CREAR:
- Archivos `.module.css` donde falten estilos desacoplados.
- Subcarpetas `modal-parts/` en cada módulo infractor con sus subcomponentes atómicos.

MODIFICAR:
- `AGENTS.md`
- Todos los archivos `*Modal.jsx` que violen el límite de 150 líneas o el principio de responsabilidad única.

NO MODIFICAR:
- ningún archivo en `apps/api/`.
- esquemas ni migraciones de Prisma.

INSTRUCCIONES:

1. ACTUALIZACIÓN NORMATIVA EN `AGENTS.md`:
   Incorporar en el Bloque I (Reglas 6 y 8) y Bloque VI (Modales):
   - **Regla 6.1: Principio de Responsabilidad Única (SRP) y Modularización Obligatoria:**
     Queda estrictamente prohibido crear o mantener archivos que concentren más de una única responsabilidad (mezclar en el mismo archivo orquestación, lógica de formulario, cálculos, múltiples secciones de interfaz y modales secundarios). Todo componente que crezca más allá de su propósito nuclear DEBE modularizarse y fragmentarse en subcomponentes atómicos co-locados (`components/` o `modal-parts/`) diseñados para ser reutilizables, testeables y legibles, evitando el agotamiento de cuota de contexto.
   - **Regla 6.2: Modales Atómicos y Límite de Líneas (< 150 líneas):**
     Ningún archivo modal (`*Modal.jsx`) puede superar las 150 líneas de código. Los modales deben actuar exclusivamente como orquestadores locales que delegan sus campos y secciones a subcomponentes hijos declarativos.
   - **Regla 8.1: Prohibición Estricta de Inline Styles (`style={{ ... }}`):**
     Queda terminantemente vetado incrustar objetos de estilo inline en el JSX. Todos los colores, espaciados, bordes, flexbox, tipografías y grids DEBEN declararse exclusivamente en archivos `.module.css`. Ningún pull request o commit debe contener `style={{` en sus vistas o modales.

2. DETECCIÓN Y DIAGNÓSTICO QUIRÚRGICO DE INFRACTORES:
   - Ejecutar comprobación rápida de líneas sobre los modales del sistema para listar cuáles exceden 150 líneas.
   - Localizar ocurrencias de `style={{` en `apps/web/src/app/`.

3. DESCOMPOSICIÓN DE `RecipeModal.jsx` (Prioridad 1):
   - Extraer estilos inline hacia `recipe-modal.module.css`.
   - Fragmentar en `modal-parts/`:
     * `RecipeHeaderFields.jsx` (selección de producto, nombre, cantidad, unidad bloqueada).
     * `RecipeStagesList.jsx` (barra de etapas, empty state asistido, acordeón).
     * `StageCardItem.jsx` (tarjeta individual abierta/cerrada con inputs de tiempo, badges digitales de reloj `⏱️ HH:MM` y BOM).
     * `RecipeOperationalSummaryModal.jsx` (modal de 2 pasos "Hoja de Ruta Operativa de Planta").
   - Dejar `RecipeModal.jsx` como orquestador limpio (< 120 líneas) con cero estilos inline.

4. REFACTORIZACIÓN EN CASCADA DE DEMÁS MODALES INFRACTORES:
   - Aplicar el mismo patrón de extracción a cualquier otro modal detectado con más de 150 líneas o estilos inline (ej. `ProductionModal.jsx`, `ProductModal.jsx`):
     * Mover estilos a su archivo `.module.css` respectivo.
     * Extraer secciones de formulario a subcomponentes hijos co-locados.
     * Asegurar que ningún archivo resultante exceda 150 líneas.

VERIFICACIÓN:
1. Verificar ausencia total de estilos inline en los modales intervenidos:
   git grep "style={{" apps/web/src/app/catalog/recipes/components/
2. Comprobar que ningún archivo modal intervenido supere las 150 líneas.
3. Ejecutar comprobación de sintaxis:
   node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx
4. Ejecutar linter:
   pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx

CRITERIO DE FINALIZACIÓN:
- `AGENTS.md` incluye formalmente las reglas 6.1, 6.2 y 8.1.
- Todos los modales intervenidos quedan por debajo de 150 líneas.
- Se eliminan los estilos inline (`style={{}}`) de los componentes refactorizados en favor de CSS Modules.
- Cero regresiones en la lógica funcional ni en la interfaz visual.
- Next.js lint y validación de sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Reglas añadidas a AGENTS.md:
- Inventario de modales diagnosticados y refactorizados:
- Archivos creados en modal-parts/ y líneas de cada uno:
- Comprobación de líneas finales y ausencia de inline styles:
- Estado: