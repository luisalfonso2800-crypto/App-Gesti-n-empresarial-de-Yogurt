TAREA CONTROLADA — CATEGORIZACIÓN DE PRESENTACIONES (COMERCIAL VS SEMIELABORADO) Y FILTRADO POKA-YOKE EN PRODUCTOS

OBJETIVO TÉCNICO:
1. En `PresentationModal.jsx`, añadir un selector maestro de uso de presentación:
   - "Comercial / Envasado Final" (para venta al público: botellas, vasos, empaques terminados).
   - "Semielaborado / Granel / WIP" (para uso interno de planta: tanques, marmitas, jaleas, porcionados auxiliares).
2. Si se elige "Semielaborado / Granel / WIP":
   - Desactivar la obligatoriedad de Oz/Ml y mostrar el banner didáctico de formato de transformación.
   - Marcar el registro con `tipoUso: 'SEMIELABORADO'` (o guardar en observaciones/metadata compatible sin romper schema).
3. En `ProductModal.jsx`, filtrar en tiempo real el desplegable de "PRESENTACIÓN":
   - Pestaña "Base Intermedia (WIP)": listar ÚNICAMENTE presentaciones de tipo "SEMIELABORADO" (o granel).
   - Pestaña "Producto Comercial Envasado": listar ÚNICAMENTE presentaciones de tipo "COMERCIAL".

FUENTES DE VERDAD:
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- apps/web/src/app/catalog/presentations/components/PresentationsTable.jsx
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos indicados (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Mantener SRP (< 145 líneas por archivo; desacoplar subcomponentes si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `PresentationModal.jsx`:
   - En la parte superior del formulario, añadir el selector de uso:
     ```jsx
     <div className={styles.formGroup}>
       <label>DESTINO / TIPO DE USO *</label>
       <select
         name="tipoUso"
         value={formData.tipoUso || 'COMERCIAL'}
         onChange={handleTipoUsoChange}
       >
         <option value="COMERCIAL">🥛 Comercial (Envase para Venta al Público)</option>
         <option value="SEMIELABORADO">🏭 Semielaborado / Granel (Uso Interno de Planta - WIP)</option>
       </select>
     </div>
     ```
   - Si `tipoUso === 'SEMIELABORADO'`:
     * Ocultar o flexibilizar los campos numéricos de Oz y Ml.
     * Al guardar, asegurar que `tipoEnvase` sea `BALDE`, `TANQUE_GRANEL` o guardar `tipoUso: 'SEMIELABORADO'` en el payload compatible.

2. EN `PresentationsTable.jsx`:
   - Mostrar una píldora visual en la tabla para saber el tipo:
     * Si es `SEMIELABORADO`: Badge gris/azul `Semielaborado (WIP)`.
     * Si es `COMERCIAL`: Badge verde/neutro `Comercial`.

3. EN `ProductModal.jsx`:
   - En el renderizado del `<select name="idPresentacion">`:
     ```javascript
     const filteredPresentations = presentations.filter((pres) => {
       const esWipPres =
         pres.tipoUso === 'SEMIELABORADO' ||
         pres.tipoEnvase === 'BALDE' ||
         pres.tipoEnvase === 'TANQUE_GRANEL' ||
         pres.nombre?.toUpperCase().includes('GRANEL');

       if (isWipMode) {
         return esWipPres;
       } else {
         return !esWipPres;
       }
     });
     ```
   - Mapear únicamente `filteredPresentations` en las opciones.
   - Si la presentación previamente seleccionada no pertenece a la lista filtrada, resetear `idPresentacion: ''` para evitar inconsistencias.

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Se pueden crear presentaciones catalogadas directamente como Semielaborado / WIP o Comercial.
- En Producto Comercial solo aparecen envases de venta.
- En Base Intermedia solo aparecen presentaciones semielaboradas / granel.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Selector de uso integrado en: PresentationModal.jsx
- Filtrado dual adaptado en: ProductModal.jsx
- Resultado verify-srp.js: