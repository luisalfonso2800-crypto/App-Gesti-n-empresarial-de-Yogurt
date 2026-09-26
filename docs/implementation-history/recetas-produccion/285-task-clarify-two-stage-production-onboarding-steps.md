TAREA:
Actualizar el texto y la lógica descriptiva de los pasos 4 y 5 del widget de Puesta en Marcha (`OnboardingWizardWidget.jsx`) para aclarar la secuencia industrial obligatoria: 1° Base en Tanque (WIP) y 2° Producto Comercial Terminado (para venta).

OBJETIVO:
1. En el componente `OnboardingWizardWidget.jsx` (o su servicio de diagnóstico asociado en frontend):
   - Ajustar las descripciones textuales de los pasos para que guíen al usuario sin ambigüedad:
     * **Paso 4:** *"Ficha Comercial y Receta de Base (Tanque)"* indicando claramente que es el semielaborado a granel.
     * **Paso 5:** *"Fabricar Primer Lote Comercial (Producto Terminado)"* especificando que requiere ensamblar la base con envases y presentación para poder pasar a la venta final.
2. Asegurar que las etiquetas y tooltips del asistente expliquen por qué se requieren ambas fases antes de habilitar el Paso 6 de Ventas.
3. Respetar el límite de < 150 líneas y CSS Modules puro. Cero `style={{}}`.
4. Ejecutar `verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Modifica exclusivamente el componente del widget de onboarding y textos descriptivos de su controlador en frontend. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/components/shell/OnboardingWizardWidget.jsx`
- Archivos de estilos o constantes del wizard si aplica.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:
1. Actualizar los textos explicativos en las descripciones del widget para guiar al usuario sobre la diferencia entre la receta de base y la receta comercial final.
2. Mantener la reactividad transversal existente (`onboarding:refresh`).

VERIFICACIÓN:
1. `node --check apps/web/src/components/shell/OnboardingWizardWidget.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El widget de puesta en marcha comunica de forma transparente la ruta de dos etapas (Base + Producto Comercial).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0, DETENTE.

SALIDA:
- Componentes modificados:
- Textos actualizados:
- Resultado de verify-srp.js:
- Estado: