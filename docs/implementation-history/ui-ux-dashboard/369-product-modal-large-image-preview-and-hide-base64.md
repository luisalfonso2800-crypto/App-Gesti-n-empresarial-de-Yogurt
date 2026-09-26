TAREA CONTROLADA — VISOR GRANDE DE IMAGEN COMERCIAL Y OCULTAMIENTO DE BASE64 EN PRODUCTMODAL

OBJETIVO TÉCNICO:
1. En `ProductModal.jsx` (y sus submódulos de `modal-parts/`), reestructurar la sección de imagen del producto para situarla de extremo a extremo entre "Canal de Venta" y "Descripción".
2. Ocultar completamente al usuario el input de texto que muestra el Base64 (`data:image/...`), manteniendo el valor en el estado del formulario de manera transparente.
3. Crear un contenedor de previsualización visual grande, nítido y adaptable (altura ~160px a 200px, fondo neutro, marco sutil) con `object-fit: contain`, botón para subir imagen local y botón para removerla si ya existe.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/app/catalog/products/components/modal-parts/ (subcomponentes de campos de producto)
- apps/web/src/app/catalog/products/components/product-modal.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales (`Find`, `Search`).
- Leer únicamente `ProductModal.jsx`, el subcomponente correspondiente de imagen y su CSS Module (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), respetar CSS Modules puro.
- Mantener SRP (< 145 líneas por archivo de componente).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN EL SUBCOMPONENTE DE IMAGEN DE PRODUCTO:
   - Eliminar por completo el `<input type="text">` visible donde se proyectaba el string en Base64 o la URL. Mantener el input de tipo `<input type="file" accept="image/*" hidden />` asociado al botón de carga.
   - Diseñar el layout en dos columnas funcionales o bloque horizontal integrado:
     * **Columna / Barra de Acciones:**
       - Etiqueta: `FOTO COMERCIAL DEL PRODUCTO`
       - Botón: `[ 📁 Subir Imagen desde el Equipo ]`
       - Botón condicional: `[ 🗑 Quitar Imagen ]` (visible solo cuando `formData.imagenUrl` tenga valor).
       - Microtexto de ayuda: `Formatos admitidos: PNG, JPG, WebP. Resolución óptima recomendada: 400x400 o superior.`
     * **Visor Adaptativo Ampliado:**
       - Contenedor con altura proporcional (`height: 180px`, `width: 100%`), fondo pergamino/marfil (`#FAF8F5`), borde fino (`1px solid #E5DFD5`) y esquinas redondeadas (`8px`).
       - Si `formData.imagenUrl` tiene valor:
         Renderizar `<img>` con `width: 100%`, `height: 100%`, `object-fit: contain` y sombra suave.
       - Si NO tiene valor:
         Renderizar placeholder con icono sutil de producto/botella y texto `"Sin imagen comercial asignada"`.

2. EN `product-modal.module.css`:
   - Configurar las clases del contenedor:
     ```css
     .imageSectionContainer {
       grid-column: 1 / -1;
       display: grid;
       grid-template-columns: 200px 1fr;
       gap: 1.25rem;
       align-items: center;
       margin: 0.75rem 0;
       padding: 0.85rem;
       background-color: #FAF8F5;
       border: 1px solid #E5DFD5;
       border-radius: 8px;
     }

     .imageActionsCol {
       display: flex;
       flex-direction: column;
       gap: 0.6rem;
     }

     .imagePreviewBox {
       height: 170px;
       background-color: #FFFFFF;
       border: 1px solid #E2E4E1;
       border-radius: 6px;
       display: flex;
       align-items: center;
       justify-content: center;
       overflow: hidden;
     }

     .productImageLarge {
       max-width: 100%;
       max-height: 100%;
       object-fit: contain;
     }
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- El Base64 no es visible para el operario en ningún input de texto.
- La imagen ocupa un espacio amplio y claro entre "Canal de Venta" y "Descripción".
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Input Base64 ocultado en:
- Visor ampliado integrado en:
- Resultado verify-srp.js: