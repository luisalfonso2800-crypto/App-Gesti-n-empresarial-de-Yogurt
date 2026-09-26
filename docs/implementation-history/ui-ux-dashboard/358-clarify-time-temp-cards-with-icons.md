TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Clarificar visualmente las tarjetas gemelas de Tiempo y Temperatura (`RecipeStageParametersCards.jsx`), integrando iconografía universal (reloj ⏱ y termómetro 🌡), jerarquía visual para el campo Objetivo (🎯 Meta) y flechas de límite (↓ Mín / ↑ Máx), para eliminar la confusión de lectura en planta.

CLÁUSULA ANTI-CONSUMO DE CUOTA (REGLA 07):
- PROHIBIDO usar `Search`, `Find`, `Grep` o exploraciones globales.
- LECTURA ÚNICA: Lee cada archivo exactamente 1 vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageParametersCards.jsx`
2. `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

OBJETIVO TÉCNICO:

1. En `RecipeStageParametersCards.jsx`:
   - Cabeceras de tarjeta con iconografía explícita:
     * Tarjeta de Tiempo: Mostrar icono o emoji `⏱` seguido de `TIEMPO OPERATIVO (MIN)` y a la derecha la pastilla sutil con el cálculo `≈ X h`.
     * Tarjeta de Temperatura: Mostrar icono o emoji `🌡` seguido de `TEMPERATURA OPERATIVA (°C)` y a la derecha la pastilla sutil con `≈ X °F`.
   - Etiquetas de los 3 campos internos:
     * Campo 1: Reemplazar etiqueta plana "MÍN" por `↓ Mínimo` (o `Tolerancia Mín`).
     * Campo 2 (Central): Destacar con etiqueta `🎯 Objetivo` (resaltado como valor primario del lote).
     * Campo 3: Reemplazar etiqueta plana "MÁX" por `↑ Máximo` (o `Tolerancia Máx`).
   - Mantener la validación Poka-Yoke activa: si `min > obj` o `obj > max`, aplicar `.inputErrorBorder` (#EF4444) en el grupo correspondiente.
   - Respetar el límite de líneas SRP (< 135 líneas).

2. En `recipe-stages.module.css`:
   - Ajustar el grid o flex de las 3 casillas para dar mayor peso al centro:
     * `min` y `max`: ancho compacto, fondo tenue `#F8FAFC`, texto sutil.
     * `obj`: ancho prioritario (40%), borde primario verde oscuro MANNÁ (`#1B4332`), etiqueta en negrita.
   - Microtextos de sufijo dentro o junto a cada casilla (`min` o `°C`) para que el operario nunca dude de qué unidad manipula.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageParametersCards.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Las tarjetas de tiempo y temperatura se identifican al instante con iconos `⏱` y `🌡`.
- El valor objetivo destaca de forma evidente sobre los límites mínimo y máximo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.