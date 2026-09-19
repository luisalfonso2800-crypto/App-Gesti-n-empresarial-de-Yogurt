TAREA CONTROLADA — FILTRADO POKA-YOKE DE PRESENTACIONES EN PRODUCTOS WIP Y SOPORTE DE PORCIONADOS AUXILIARES

OBJETIVO TÉCNICO:
1. En `PresentationModal.jsx`, incorporar en el selector "TIPO DE ENVASE" la opción formal para semielaborados porcionados en planta: `PORCIONADO_WIP` ("Copita / Pote Auxiliar Semielaborado - WIP") para cereales reempacados y complementos.
2. En `ProductModal.jsx`, condicionar estrictamente el selector de "PRESENTACIÓN":
   - Cuando esté activa la pestaña "Base Intermedia / Tanque (WIP)": listar ÚNICAMENTE presentaciones de tipo granel (`BALDE`, `TANQUE_GRANEL`, `A GRANEL`) o semielaboradas auxiliares (`PORCIONADO_WIP`). Bloquear envases comerciales finales.
   - Cuando esté activa la pestaña "Producto Comercial Envasado": listar ÚNICAMENTE formatos comerciales terminados (`VASO`, `BOTELLA`, `ENVASE`, `BOLSA`), excluyendo el granel puro de tanque.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/app/catalog/products/components/modal-parts/ (subcomponente de campos o selectores)
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Mantener SRP (< 145 líneas por archivo de componente).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `PresentationModal.jsx`:
   - En el `<select name="tipoEnvase">`:
     * Agregar la opción:
       `<option value="PORCIONADO_WIP">COPITA / POTE AUXILIAR (Semielaborado / Cereal WIP)</option>`
     * Si se selecciona `PORCIONADO_WIP`:
       - Permitir definir los gramos u onzas del porcionado (ej. copita de 25 g o 30 g de cereal).
       - Desplegar microtexto: "💡 Usa este envase auxiliar para copitas de cereal, toppings o cucharitas que la planta prepara antes del envasado final."

2. EN `ProductModal.jsx`:
   - Al renderizar las opciones dentro del `<select name="idPresentacion">`:
     * Determinar si la pestaña activa es WIP (`isWipMode` o `selectedTab === 'WIP'`):
       ```javascript
       const filteredPresentations = presentations.filter((pres) => {
         const tipo = pres.tipoEnvase?.toUpperCase() || '';
         const nombre = pres.nombre?.toUpperCase() || '';
         const esGranel = tipo === 'BALDE' || tipo === 'TANQUE_GRANEL' || nombre.includes('GRANEL');
         const esAuxiliarWip = tipo === 'PORCIONADO_WIP' || nombre.includes('WIP') || nombre.includes('CEREAL');

         if (isWipMode) {
           return esGranel || esAuxiliarWip;
         } else {
           // En modo comercial, solo envases de venta terminada
           return !esGranel;
         }
       });
       ```
     * Mapear `filteredPresentations` en las `<option>`.
     * Si el valor actual de `formData.idPresentacion` no existe dentro de `filteredPresentations`, resetear la selección al primer elemento válido o string vacío para no arrastrar envases incompatibles.

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- En Base Intermedia (WIP) no vuelve a aparecer "CONTENEDOR DE 16 OZ" a menos que sea una presentación categorizada como auxiliar de planta.
- La creación de presentaciones soporta potes de cereal auxiliar sin trabas.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Tipo de envase auxiliar añadido en: PresentationModal.jsx
- Filtrado condicional aplicado en: ProductModal.jsx
- Resultado verify-srp.js: