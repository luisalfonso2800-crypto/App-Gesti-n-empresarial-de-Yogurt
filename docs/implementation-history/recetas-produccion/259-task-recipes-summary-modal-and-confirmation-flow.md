TAREA:
Transformar el guardado de recetas en un flujo de confirmación de 2 pasos: botón superior 'Finalizar y Resumir', modal de auditoría técnica basado en SmartModal ('Hoja de Ruta Operativa de Planta') y acciones de Guardar, Editar o Descartar con advertencia destructiva.

OBJETIVO:
En `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` (y componentes vinculados):
1. Reemplazar el botón superior "Guardar Receta" por el botón primario "[ 📋 Finalizar y Resumir ]".
2. Al pulsar "Finalizar y Resumir" (tras superar las validaciones básicas de producto, rendimiento y empaque obligatorio):
   - En lugar de persistir inmediatamente en base de datos, abrir una ventana modal dedicada basada en el estándar `SmartModal` (con backdrop blur, estética MANNÁ `#FAF8F5`, `#182622`, bordes atenuados y tipografía limpia).
3. Renombrar "Ruta Continua de Fabricación (Lenguaje de Planta)" por un nombre industrial más técnico y humano:
   **"Hoja de Ruta Operativa de Planta"** (con subtítulo: *"Protocolo paso a paso para la elaboración del lote en piso de producción"*).
4. Dentro del modal de resumen presentar:
   - Ficha técnica de cabecera: Producto a elaborar, rendimiento esperado y tiempo total acumulado de fabricación.
   - La secuencia narrativa cronológica de todas las etapas configuradas (Etapa 1 ➔ Etapa 2 ➔ Etapa N) con sus insumos, tiempos, temperaturas y especificaciones.
   - Balance resumido de costos y rentabilidad.
5. Botonera de decisión dentro del modal de resumen:
   - **[ ✓ Guardar y Publicar Receta ]**: Botón primario institucional (Verde Bosque `#182622`, texto blanco, hover `#2C3E38`), que ejecuta el guardado definitivo (`onSubmit`) enviando la transacción al backend.
   - **[ ✏️ Corregir / Seguir Editando ]**: Botón secundario (fondo blanco o `#F7F4EE`, borde `#D6D3D1`, texto `#182622`) que cierra el modal de resumen y regresa al formulario sin perder ningún cambio para realizar ajustes.
   - **[ ✕ Descartar Receta Completa ]**: Botón de advertencia destructiva (fondo `#FEF2F2`, borde `#FCA5A5`, texto `#991B1B`), con mensaje o alerta clara: *"⚠️ Atención: Si cancelas se descartará todo el proceso formulado y se perderán los datos ingresados"*. Si el operario confirma, resetea el formulario y cierra ambos modales.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/components/common/SmartModal.module.css` (o componente modal estándar del proyecto)
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
- `AGENTS.md` (Reglas 13.1, 13.2, 35 de Flujo Mental y 36 de Estilo MANNÁ)

REGLA DE CONSULTA:
Modifica exclusivamente los archivos del editor de recetas en frontend. Prohibido tocar archivos de backend (`apps/api/`) o esquemas de base de datos.

ALCANCE:

LEER:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`

MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`

NO MODIFICAR:
- ningún archivo en `apps/api/`.

INSTRUCCIONES:

1. MODIFICACIÓN DE BOTONERA SUPERIOR EN `RecipeModal.jsx`:
   - Reemplazar el botón `Guardar Receta` del header por:
     `<button type="button" onClick={handleOpenSummaryModal} className={styles.btnFinalizar}>📋 Finalizar y Resumir</button>`
   - Mantener el botón `Cancelar` superior con confirmación preventiva si el formulario está sucio (`dirty`).

2. GESTIÓN DEL ESTADO DEL MODAL DE AUDITORÍA:
   - Declarar estado local: `const [showSummaryModal, setShowSummaryModal] = useState(false);`
   - En `handleOpenSummaryModal`:
     * Validar que exista `formData.idProducto` y `formData.rendimientoBase > 0`.
     * Validar la regla de empaque obligatorio si el producto es comercial.
     * Si las validaciones pasan, activar `setShowSummaryModal(true)`.

3. ESTRUCTURA Y DISEÑO DEL MODAL DE RESUMEN (`SmartModal`):
   - Renderizar el modal condicionado a `showSummaryModal`:
     * **Backdrop**: fondo semi-transparente oscuro con `backdrop-filter: blur(4px)`.
     * **Contenedor**: Tarjeta centrada con `max-width: 780px`, fondo `#FAF8F5`, bordes redondeados `12px`, padding generoso y sombra profunda.
     * **Encabezado del Modal**:
       - Título: "Hoja de Ruta Operativa de Planta"
       - Subtítulo: "Protocolo técnico de fabricación para [Nombre del Producto] — Rendimiento: [X] [Unidad]"
     * **Cuerpo del Modal**:
       - Bloque narrativo con scroll interno suave si excede la altura de pantalla (`max-height: 55vh`, `overflow-y: auto`).
       - Cada etapa renderizada como tarjeta con borde `#E5DFD5`, fondo blanco, numeración correlativa en verde `#182622` y la frase en lenguaje de planta completa.
       - Barra de balance financiero al pie: Costo unitario proyectado, badge de rentabilidad y costo total del lote.
     * **Pie de Acciones (Footer)**:
       - Izquierda: Botón `[ ✕ Descartar Receta ]` con texto en rojo suave (`#991B1B`). Al hacer clic, solicitar confirmación: *"¿Seguro que deseas salir? Esta acción eliminará todo el proceso configurado y no se guardará ningún cambio"*.
       - Derecha: Botón `[ ✏️ Seguir Editando ]` (cierra este modal y vuelve al formulario) y Botón `[ ✓ Guardar y Publicar Receta ]` (invoca `handleSubmit(onSubmit)` con estado de carga `Guardando...`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
2. `pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx`

CRITERIO DE FINALIZACIÓN:
- El botón superior dice "Finalizar y Resumir".
- Al presionarlo abre el modal con estilo SmartModal y backdrop blur.
- La sección se llama formalmente "Hoja de Ruta Operativa de Planta".
- El modal incluye los 3 botones: Guardar y Publicar, Seguir Editando y Descartar Receta con advertencia destructiva.
- Next lint y validación de sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos modificados:
- Resumen del flujo de confirmación implementado:
- Comprobación sintáctica y lint:
- Estado: