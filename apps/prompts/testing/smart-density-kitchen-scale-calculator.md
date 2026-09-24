TAREA CONTROLADA — ASISTENTE INTELIGENTE POKA-YOKE DE DENSIDAD (BALANZA Y RECIPIENTE) EN MODAL DE INSUMOS

OBJETIVO TÉCNICO:
Reemplazar la entrada manual rígida y abstracta de "DENSIDAD (G/ML)" en el modal de Nuevo Insumo por un asistente guiado e interactivo que permita deducir la densidad a partir de una balanza/gramera casera y un recipiente conocido (ml u oz), incorporando también accesos directos de 1 clic para densidades comunes (Agua, Leche, Miel, Yogur).

FUENTES DE VERDAD:
- apps/web/src/app/catalog/supplies/ (Modal de nuevo insumo, ej: SupplyModal.jsx o componente co-locado)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO búsquedas recursivas ciegas. Ir directo al modal de insumos.
- CERO estilos inline (`style={{}}`), usar CSS Modules puro.
- Mantener SRP (< 140 líneas por componente; extraer subcomponente a `parts/DensityAssistant.jsx` si es necesario).
- Conservar la persistencia del campo final `densidad` (Decimal / Float) hacia el backend/API.

ACCIONES A EJECUTAR:

1. Diseñar el asistente de densidad (subcomponente o bloque integrado):
   - Presets de 1 clic:
     * Botones o chips compactos: "Agua (1.0)", "Leche (1.03)", "Yogur (~1.06)", "Miel/Jalea (1.42)".
     * Al hacer clic en un preset, fijar el valor en el input de densidad.
   - Modo "Calcular con Gramera y Envase":
     * Botón desplegable o tab: "⚖️ ¿No conoces la densidad? Calcúlala con tu balanza".
     * Pregunta A (Recipiente/Volumen): Selector rápido con opciones comunes:
       - 250 ml
       - 500 ml
       - 16 oz (473 ml)
       - 32 oz (946 ml)
       - 1.000 ml (1 Litro)
       - Otro (input libre en ml)
     * Pregunta B (Peso en Balanza): Input numérico con label:
       "Peso neto en gramos (sin el envase)" (placeholder: "Ej: 515").
     * Cálculo reactivo inmediato:
       `densidad = pesoGramos / volumenMl`
     * Visualización clara del resultado con redondeo a 2 decimales (ej. `1.03 g/ml`) y frase de contexto:
       `✦ 1 Litro de este producto pesará aprox. ${(densidad * 1000).toLocaleString()} g`.

2. En el formulario general de Nuevo Insumo:
   - Mantener el input numérico `densidad` visible o autocompletado con el resultado para no romper el contrato del formulario.
   - Asegurar que el valor enviado al payload sea el número flotante calculado (default `1.0` si no se especifica).

VERIFICACIONES DE CALIDAD:
1. `node --check apps/web/src/app/catalog/supplies/components/SupplyModal.jsx` (o componente intervenido)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- El modal permite calcular la densidad con una gramera y un recipiente conocido sin exigir cálculos matemáticos manuales al operario.
- Los presets comunes completan el valor con un solo clic.
- `verify-srp.js` retorna código 0.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Archivos modificados y líneas resultantes.
- Componente/asistente implementado.
- Resultado de verify-srp.js.
- Estado: [COMPLETADO / BLOQUEADO].