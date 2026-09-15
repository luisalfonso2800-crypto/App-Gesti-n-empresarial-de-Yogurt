TAREA:
Refactorizar la gestión de etapas en el módulo de Recetas (apps/web/src/app/catalog/recipes/) migrando del acordeón vertical colapsado a un layout Maestro-Detalle (Split View) ergonómico, cumpliendo estrictamente con SRP (<150 líneas por archivo) y CSS Modules puro.

OBJETIVO:
Reorganizar la interfaz de etapas de producción para que soporte fluidamente entre 1 y 20+ etapas sin scrolls infinitos ni pérdida de contexto espacial:
1. Diseñar un layout dividido en 2 columnas:
   - Panel Izquierdo (Hoja de Ruta / Pipeline, ~32% ancho): Lista vertical scrolleable fija con tarjetas compactas de etapa (número, nombre, semáforo de completitud, badges compactos de tiempo/temp/BOM y botones de orden/adición).
   - Panel Derecho (Banco de Trabajo de Etapa Activa, ~68% ancho): Espacio de edición anclado para la etapa seleccionada.
2. Integrar la "Lectura de Operación en Planta" como tarjeta de telemetría viva en la parte superior del banco de trabajo, actualizándose en tiempo real.
3. Integrar los badges de equivalencia horaria (`✦ 08:00 h`) inline junto a los inputs de minutos, ahorrando altura vertical.
4. Modularizar en componentes atómicos co-locados (<150 líneas cada uno) y hoja CSS Module propia. Prohibido `style={{}}`.
5. Salida con código 0 en `node .agents/scripts/verify-srp.js`.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/04-design-system-manna.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Inspecciona exclusivamente `apps/web/src/app/catalog/recipes/`. Prohibido tocar backend (`apps/api/`) ni esquemas de base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (o componentes de etapas actuales)
- `apps/web/src/app/catalog/recipes/recipes.module.css`

CREAR:
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx` (Panel izquierdo, < 130 líneas)
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx` (Formulario de etapa activa, < 140 líneas)
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageTelemetryCard.jsx` (Lectura en vivo de planta, < 80 líneas)
- `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx` (Lista de insumos por fase, < 120 líneas)
- `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

MODIFICAR:
- Componente contenedor o modal de recetas que orquesta las etapas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. ESTRUCTURA VISUAL (SPLIT VIEW):
   - Crear contenedor flex/grid con dos paneles con scroll independiente:
     * `.splitLayout`: `display: grid; grid-template-columns: 340px 1fr; gap: 1.25rem; align-items: start;`
     * `.timelineCol`: `max-height: 70vh; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;`
     * `.workspaceCol`: `background: #FAF8F5; border: 1px solid #E5DFD5; border-radius: 12px; padding: 1.25rem;`

2. PANEL IZQUIERDO (`RecipeStagesTimeline.jsx`):
   - Mapear cada etapa en una ficha delgada interactiva (~48px alto):
     * Número de etapa, nombre y pill de estado (`Completa` verde / `Incompleta` ámbar).
     * Micro-resumen: `⏱ 8h | 🌡 42-44°C | 📦 2 insumos`.
     * Ficha seleccionada destacada con borde verde corporativo (`#182622`) y fondo blanco.
     * Botón `+ Agregar Etapa` siempre accesible al pie de la lista.

3. BANCO DE TRABAJO DERECHO (`RecipeStageEditor.jsx`):
   - **Cabecera de Telemetría:** Invocar `RecipeStageTelemetryCard.jsx` proyectando la narración de planta en vivo con fondo marfil/crema (`#F7F4EE`) y borde tenue.
   - **Bloque de Tiempos y Tolerancias (Fila compacta):**
     * Tiempo estándar con pill inline al lado derecho: `[ 480 ] min  ✦ (08:00 h)`.
     * Rango de tolerancia: `Mín [ 420 ] a Máx [ 540 ] min`.
   - **Bloque Térmico e Instrucciones:**
     * Temperatura: `Mín [ 42 ] a Máx [ 44 ] °C`.
     * Instrucciones de operación claras para el operario.
   - **Subtabla BOM (`RecipeStageBomTable.jsx`):**
     * Tabla ágil de insumos añadidos en esta fase, cantidades, unidades y botón para quitar.
   - **Botonera Inferior de Fase:**
     * `[▲ Subir]` `[▼ Bajar]` `[Duplicar Etapa]` `[Eliminar Etapa]`.

4. COMPATIBILIDAD Y CONTRATO:
   - Mantener intacto el esquema de datos (`stages: [{ nombre, tiempoMinutos, tempMin, tempMax, bom: [...] }]`) consumido por el backend.
   - Prohibido dejar objetos `style={{ ... }}`: todas las clases deben venir de `recipe-stages.module.css`.
   - Cada componente debe iniciar con JSDoc y `'use client';`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStagesTimeline.jsx`
2. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageEditor.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Interfaz de etapas transformada en Split View funcional.
- 0 errores de compilación y reactividad fluida al cambiar entre etapas.
- `verify-srp.js` finaliza con código 0 y 0 infracciones de líneas o estilos inline.

DETENCIÓN:
Al cumplir las verificaciones y el criterio de finalización, DETENTE.

SALIDA:
- Archivos creados y líneas de código de cada uno:
- Resultado de node .agents/scripts/verify-srp.js:
- Estado: