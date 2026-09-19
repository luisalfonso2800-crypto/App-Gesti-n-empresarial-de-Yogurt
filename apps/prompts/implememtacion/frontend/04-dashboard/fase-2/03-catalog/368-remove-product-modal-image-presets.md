TAREA CONTROLADA — ELIMINACIÓN DE PRESETS GRÁFICOS EN SECCIÓN DE IMAGEN DE PRODUCTMODAL

OBJETIVO TÉCNICO:
En el formulario modal de Productos (`ProductModal.jsx` y su respectivo submódulo en `modal-parts/`):
1. Eliminar permanentemente los botones/iconos de presets gráficos de envases (los 5 contenedores de dibujo naranja/verde).
2. Renombrar el encabezado del campo a "FOTO O IMAGEN DEL PRODUCTO".
3. Mantener exclusivamente el botón de carga local desde el equipo, el campo de URL/ruta y el contenedor de previsualización interactiva de la imagen cargada.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/app/catalog/products/components/modal-parts/ (subcomponente de campos o imagen)
- apps/web/src/app/catalog/products/components/product-modal.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales (`Find`, `Search`).
- Leer únicamente el componente modal de productos y el subcomponente donde esté maquetada la carga de imagen (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules.
- Respetar el límite SRP (< 145 líneas por archivo).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. En el componente donde reside la sección de imagen de Producto:
   - Localizar y remover por completo el bloque o contenedor que renderiza la fila de presets gráficos:
     ```jsx
     {/* ELIMINAR ESTE BLOQUE */}
     <div className={...}>
       {PRESETS.map(...) || (botones con iconos de vasos, botellas, tarros)}
     </div>
     ```
   - Eliminar cualquier arreglo local de constantes o funciones de selección asociadas a esos presets obsoletos (`PRESET_ICONS`, `handleSelectPreset`, etc.).
   - Actualizar el texto del label superior:
     - De: "IMAGEN DEL PRODUCTO (URL O PRESET)"
     - A: "FOTO COMERCIAL DEL PRODUCTO"
   - Conservar intactos:
     * Botón `[ 📁 Subir Imagen desde el Equipo ]`.
     * Input controlado de URL o ruta generada.
     * Caja de previsualización (avatar/recuadro donde se aprecia la foto subida con botón para descartarla).

2. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los 5 iconos genéricos de envase han desaparecido del modal de nuevo/editar producto.
- La carga y previsualización de imágenes reales desde el equipo se mantiene plenamente operativa.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Bloque de presets eliminado en:
- Resultado verify-srp.js: