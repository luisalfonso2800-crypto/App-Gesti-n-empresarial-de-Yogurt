TAREA CONTROLADA — FLUJO POKA-YOKE EN CASCADA, REORDENAMIENTO DE CONTENIDO Y ASISTENTE DE DENSIDAD EN MODAL DE INSUMOS

OBJETIVO TÉCNICO:
Refactorizar la jerarquía, validación y experiencia del modal "Nuevo Insumo" (`SupplyModal.jsx` y componentes hijos):
1. Desbloqueo progresivo en cascada (campos deshabilitados hasta que el paso anterior esté completado).
2. Clarificar y reubicar "Contenido por empaque": renombrar a lenguaje cotidiano ("¿Cuánto trae cada [Empaque]?"), ubicarlo DESPUÉS de "Unidad Base", agregar separador de miles automático e incrustar la unidad de medida a la derecha con pleca divisoria (`| kg`).
3. Reordenar el flujo de Densidad: El asistente/calculadora con balanza debe desplegarse ARRIBA y proyectar el resultado en el input `DENSIDAD (G/ML)` ubicado ABAJO, el cual debe estar bloqueado (`readOnly`).

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 2 LECTURAS):
- apps/web/src/app/catalog/supplies/components/SupplyModal.jsx (o subcomponentes en modal-parts/)
- apps/web/src/app/catalog/supplies/components/modal-parts/DensityAssistant.jsx (o equivalente)
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, MÁXIMO 3 EDICIONES):
- CERO búsquedas recursivas ciegas.
- CERO estilos inline (`style={{}}`), usar CSS Modules puro.
- Respetar el estándar SRP (< 140 líneas por archivo; separar subcomponentes si es necesario).
- No romper contratos con la API ni mutar tipos en Prisma.

ACCIONES A EJECUTAR:

1. DESBLOQUEO PROGRESIVO EN CASCADA (POKA-YOKE):
   - Configurar la propiedad `disabled` condicional en cada control:
     * `Categoría`: disabled si `!form.nombre?.trim()`.
     * `Subcategoría`: disabled si `!form.categoria`.
     * `Marca` y `Empaque`: disabled si `!form.subcategoria`.
     * `Unidad Base`: disabled si `!form.empaque`.
     * `Contenido por Empaque`: disabled si `!form.unidadBase`.
     * `Stock Mínimo`, `Densidad`, `Costo Referencial`: habilitados una vez definido el contenido.
   - Aplicar estilos tenues (`opacity: 0.6; cursor: not-allowed;`) a los campos mientras estén deshabilitados.

2. REORDENAMIENTO Y FORMATO DE "CONTENIDO POR EMPAQUE":
   - Mover este campo para que aparezca inmediatamente DESPUÉS de "Unidad Base".
   - Etiqueta dinámica en lenguaje humano:
     `¿Cuánto contiene cada ${form.empaque || 'empaque'}? *`
   - Formateo numérico en vivo: permitir tipear con separador de miles (ej. `25.556`).
   - Sufijo integrado dentro del input (CSS layout con `display: flex; align-items: center;`):
     A la derecha del número, mostrar una pleca divisoria y la unidad base seleccionada:
     `[   25.556   | kg   ]`

3. REINGENIERÍA DEL FLUJO DE DENSIDAD:
   - Layout del bloque de Densidad:
     * Fila superior: Selector de presets rápidos ("Agua 1.0", "Leche 1.03", "Yogur 1.06", etc.) y enlace para abrir "⚖️ ¿No conoces la densidad? Calcúlala con tu balanza".
     * Si el usuario abre el asistente de balanza: desplegar las preguntas de medición ARRIBA (Recipiente en oz/ml $\rightarrow$ Gramos en balanza).
     * Fila inferior: El input formal `DENSIDAD (G/ML)` se ubica al pie del cálculo, en modo `readOnly` (bloqueado para no sobreescribir a mano si se usó la calculadora), con valor por defecto `1.0` y texto explicativo del peso por litro.

VERIFICACIÓN DE CALIDAD:
1. `node --check apps/web/src/app/catalog/supplies/components/SupplyModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los campos se desbloquean secuencialmente a medida que el usuario llena el formulario.
- El contenido por empaque está posicionado después de unidad base, muestra separadores de miles y la unidad dentro del input.
- El asistente de densidad opera de arriba hacia abajo, depositando el resultado en el campo bloqueado.
- `verify-srp.js` termina con código 0.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Archivos modificados y conteo de líneas.
- Resumen de flujo en cascada y reubicaciones implementadas.
- Resultado de verify-srp.js.
- Estado: [COMPLETADO / BLOQUEADO].