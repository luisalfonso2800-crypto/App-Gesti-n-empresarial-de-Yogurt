TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 ARCHIVOS EN FRONTEND - CERO BUCLES DE LECTURA):
Construir la vista principal de Rumbo MANNÁ en `apps/web/src/app/commercial/goals/`, integrando la pieza editorial inmutable (dedicatoria a Yenny Prado), las tarjetas de sueños/metas con las 5 preguntas cuantitativas y estado botánico/ritmo, y el modal para registrar nuevos objetivos, respetando estrictamente la regla SRP (< 130 líneas por archivo) y CSS Modules.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/goals/page.jsx` (Orquestador principal < 110 líneas)
2. `apps/web/src/app/commercial/goals/components/PurposeDedicationSection.jsx` (Pieza editorial inmutable < 120 líneas)
3. `apps/web/src/app/commercial/goals/components/GoalCard.jsx` (Tarjeta cuantitativa y de ritmo < 125 líneas)
4. `apps/web/src/app/commercial/goals/components/GoalFormModal.jsx` (Modal para sembrar nuevo sueño/meta < 125 líneas)
5. `apps/web/src/app/commercial/goals/goals.module.css` (Estilos editoriales, paleta MANNÁ, sin estilos inline)

INSTRUCCIONES TÉCNICAS:

1. Pieza Editorial Inmutable (`PurposeDedicationSection.jsx`):
   - Cabecera sobria y discreta con el lema: *"Seguimos sembrando."*
   - Botón sutil: *"Leer nuestra historia"*.
   - Al pulsar, despliega la dedicatoria completa a Yenny Prado en tipografía serif clásica y fondo pergamino (#FAF8F5 / borde tenue en oro viejo):
     * "Todo fruto comienza con una semilla. Pero algunas semillas nacen en terrenos difíciles. Esta fue la nuestra."
     * "Para Yenny Prado..."
     * Texto inmutable (sin botones de edición ni eliminación; grabado en el código del componente).
     * Cierre: "MANNÁ · Semilla · Tiempo · Fruto".

2. Tarjetas de Metas / Sueños (`GoalCard.jsx`):
   - Cada tarjeta responde las 5 preguntas clave:
     * ¿Qué queremos conseguir? (Título y badge de Ámbito: `Personal/Familiar` o `Empresarial`).
     * ¿Cuánto necesitamos? (Valor objetivo formateado en COP).
     * ¿Cuánto llevamos? (Valor actual y % progreso).
     * ¿Cuánto nos falta? (Diferencia numérica).
     * ¿Vamos a tiempo? (Badge de Ritmo: `ADELANTADA`, `EN RITMO`, `EN RIESGO`, `ATRASADA`, `CUMPLIDA`).
   - Indicador de Etapa Botánica con icono o badge: `[ Semilla ]` (0-25%), `[ En Crecimiento ]` (26-70%), `[ Floración ]` (71-99%), `[ Cosechada ]` (100%).
   - Si la meta tiene recompensa/sueño asociado, mostrarlo en pie de tarjeta con tipografía cursiva cálida.

3. Modal de Siembra (`GoalFormModal.jsx`):
   - Formulario para crear meta consumiendo `POST /goals`:
     * Selector de Ámbito: `Objetivo Empresarial` vs `Sueño Personal / Familiar`.
     * Categoría: Hogar Propio, Maquinaria, Crecer MANNÁ, Fondo de Seguridad, etc.
     * Métrica: Ventas ($), Recaudo ($), Producción (Lts/Baches), Gastos ($).
     * Valor objetivo y fechas (Inicio y Fin).
     * Propósito / Recompensa emocional opcional.

4. Consumo API y Estado (`page.jsx`):
   - Consultar `GET /goals` para renderizar el listado reactivo.
   - Header con título "Rumbo MANNÁ", botón "+ Sembrar Nuevo Sueño" y métricas globales de resumen.
   - Cumplir SRP (< 130 líneas por archivo).

VERIFICACIÓN:
1. `node .agents/scripts/verify-srp.js`
2. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- La ruta `/commercial/goals` carga correctamente.
- La dedicatoria a Yenny se visualiza con diseño editorial de alta calidad.
- Las metas muestran su avance en tiempo real conectadas a los datos de la API.
- Cero infracciones de SRP y build limpio (código 0).

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.