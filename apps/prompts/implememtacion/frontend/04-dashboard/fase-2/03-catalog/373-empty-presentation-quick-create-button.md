TAREA CONTROLADA — BOTÓN DE ALTA RÁPIDA (+ CREAR FORMATO) EN SELECTOR DE PRESENTACIONES VACÍO

OBJETIVO TÉCNICO:
En `ProductModal.jsx` (y su submódulo de campos de presentación en `modal-parts/`):
1. Cuando el listado de presentaciones filtradas esté vacío (`filteredPresentations.length === 0` o "No hay registros disponibles"), colocar al lado derecho un botón visible de acción rápida: "+ Crear Formato" (o "+ Nueva Presentación").
2. Al pulsar dicho botón, redirigir a `/catalog/presentations?crear=true&tipoUso=${isWipMode ? 'SEMIELABORADO' : 'COMERCIAL'}` cerrando el modal actual, o disparar la apertura guiada de `PresentationModal` precargando la categoría correspondiente (Semielaborado/Granel para WIP o Comercial para venta final).
3. En la página de Presentaciones (`/catalog/presentations/page.jsx`), detectar los query params `crear=true` y `tipoUso` para desplegar automáticamente el modal con el tipo de uso seleccionado.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/app/catalog/products/components/modal-parts/
- apps/web/src/app/catalog/presentations/page.jsx
- apps/web/src/app/catalog/presentations/components/PresentationModal.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales ciegas (`Find`, `Search`).
- Leer únicamente los archivos intervenidos (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules puro.
- Mantener SRP (< 145 líneas por archivo; desacoplar subcomponentes si excede).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `ProductModal.jsx` (o subcomponente de selector de presentación):
   - Al renderizar el campo `PRESENTACIÓN *`:
     * Si no hay opciones disponibles para el modo actual (`filteredPresentations.length === 0`):
       - Envolver en un contenedor flex (`display: flex; gap: 0.5rem; align-items: center;`).
       - Mostrar la caja de estado: `<span className={styles.emptyPresText}>No hay formatos disponibles</span>`.
       - Añadir el botón de alta rápida:
         ```jsx
         <button
           type="button"
           className={styles.btnQuickCreatePres}
           onClick={handleIrACrearPresentacion}
         >
           + Crear Formato
         </button>
         ```
     * En `handleIrACrearPresentacion`:
       - Determinar el destino:
         `const tipoUso = isWipMode ? 'SEMIELABORADO' : 'COMERCIAL';`
         `router.push(`/catalog/presentations?crear=true&tipoUso=${tipoUso}`);`
       - Cerrar el modal actual (`onClose()`).

2. EN `apps/web/src/app/catalog/presentations/page.jsx`:
   - Detectar mediante `useSearchParams`:
     * Si `searchParams.get('crear') === 'true'`:
       - Disparar `handleOpenModal(null)` automáticamente al montar la vista.
       - Pasar como valor inicial `tipoUso: searchParams.get('tipoUso') || 'COMERCIAL'`.

3. ESTILOS (`product-modal.module.css`):
   - Estilizar el botón con los tokens de identidad (#1C454C o verde oscuro, texto blanco, bordes redondeados y padding compacto):
     ```css
     .btnQuickCreatePres {
       background-color: #1C454C;
       color: #FFFFFF;
       border: none;
       border-radius: 6px;
       padding: 0.5rem 0.85rem;
       font-size: 0.8rem;
       font-weight: 700;
       cursor: pointer;
       white-space: nowrap;
       transition: background-color 0.15s ease;
     }

     .btnQuickCreatePres:hover {
       background-color: #275C66;
     }
     ```

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node --check apps/web/src/app/catalog/presentations/page.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Cuando no hay presentaciones disponibles en Producto, aparece el botón "+ Crear Formato".
- Al hacer clic, aterriza en Presentaciones con el modal abierto listo para crear el formato requerido.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Botón incorporado en: ProductModal.jsx
- Auto-apertura con query params en: presentations/page.jsx
- Resultado verify-srp.js: