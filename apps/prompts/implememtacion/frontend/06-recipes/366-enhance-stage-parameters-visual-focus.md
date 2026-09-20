TAREA (PRESUPUESTO ULTRA-BAJO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Aumentar el foco ergonómico de las tarjetas de Tiempo y Temperatura (`RecipeStageParametersCards.jsx`), implementando diferenciación cromática funcional (cronómetro azul / térmica ámbar), jerarquía tipográfica grande para el valor Objetivo (18px negrita) y límites de tolerancia secundarios.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee cada archivo exactamente 1 vez y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageParametersCards.jsx`
2. `apps/web/src/app/catalog/recipes/components/parts/recipe-stages.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `RecipeStageParametersCards.jsx`:
   - Envolver la tarjeta de Tiempo con una clase semántica (ej: `styles.timeCardContainer`) y la de Temperatura con (`styles.tempCardContainer`).
   - El input central de `🎯 Objetivo`:
     * Aplicar clase `styles.targetInputHighlight`.
     * Destacar la etiqueta como `🎯 META / OBJETIVO`.
   - Los inputs laterales `MÍN` y `MÁX`:
     * Aplicar clase `styles.toleranceInput`.
   - Mantener intactas las validaciones Poka-Yoke existentes y el límite SRP (< 135 líneas).

2. En `recipe-stages.module.css`:
   - `.timeCardContainer`: borde suave con acento azul `#E0F2FE`, cabecera con badge azul tenue (`background: #EFF6FF; color: #1D4ED8;`).
   - `.tempCardContainer`: borde suave con acento ámbar `#FEF3C7`, cabecera con badge ámbar tenue (`background: #FFFBEB; color: #B45309;`).
   - `.targetInputHighlight`:
     * `font-size: 18px; font-weight: 800; color: #111827; text-align: center;`
     * Borde reforzado verde institucional MANNÁ `#1B4332` o sombra suave de foco.
   - `.toleranceInput`:
     * `font-size: 13px; font-weight: 500; color: #64748B; background: #F8FAFC; text-align: center;`

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/parts/RecipeStageParametersCards.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El Tiempo y la Temperatura se distinguen a simple vista por tono e icono.
- El valor meta/objetivo resalta con tipografía dominante (18px) frente a los límites.
- `verify-srp.js` devuelve código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE de inmediato.