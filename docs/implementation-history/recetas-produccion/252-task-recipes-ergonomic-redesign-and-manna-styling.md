TAREA:
Rediseño ergonómico, reordenamiento de flujo visual (Producto primero), Empty State asistido y armonización visual MANNÁ en el editor de Recetas Técnicas (`RecipeModal.jsx`, `recipes.module.css`).

OBJETIVO:
Transformar la pantalla de creación/edición de recetas en una interfaz intuitiva, ergonómica y a prueba de errores para operarios de planta:
1. Reordenar el flujo de la Cabecera: el selector de "Producto a Formular" debe ser el campo protagónico #1 (arriba a la izquierda). El "Nombre de la Receta" pasa a segundo plano con autocompletado reactivo.
2. Bloquear visualmente la "Unidad de Rendimiento" (fondo pergamino/grisáceo desactivado con badge de solo lectura) para evitar que el operario intente escribir en ella.
3. Eliminar el vacío blanco en Etapas de Producción mediante un "Empty State Asistido" (tarjeta con borde punteado que explique con claridad cómo usar las plantillas rápidas).
4. Reemplazar los botones azules genéricos (#2563EB) por la paleta institucional MANNÁ: Verde Bosque (#182622), botón secundario pergamino (#F7F4EE / borde #E8E2D7) y acento ámbar (#C58A3E).
5. Mejorar los botones de plantillas rápidas para que luzcan como tarjetas tácticas claras y fáciles de presionar en planta.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css`
- `docs/antigravity/MANUAL_DE_DISENO_UI_UX.md` (Reglas 29, 30, 31, 39, 69)
- `AGENTS.md` (Reglas 13.1, 13.2, 16)

ARCHIVOS A MODIFICAR:
- `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css` (o estilos de componentes de recetas)

NO MODIFICAR:
- Backend ni controladores de API.
- Lógica de persistencia ni DTOs.

INSTRUCCIONES:

1. REORDENAMIENTO ERGONÓMICO DE CABECERA (FLUJO CAUSA -> EFECTO):
   - Estructurar la Cabecera en 2 columnas equilibradas:
     * Columna 1 (Izquierda):
       - Label: "PRODUCTO A FABRICAR *" (Selector principal protagónico). Al seleccionar el producto, conmuta automáticamente la unidad y sugiere el nombre.
       - Label: "NOMBRE TÉCNICO DE LA RECETA *" (Input de texto sugerido automáticamente, ej. "Fórmula Maestra - [Producto]", editable si el usuario desea).
     * Columna 2 (Derecha):
       - Fila dual de Rendimiento:
         * Input "CANTIDAD RENDIMIENTO BASE *" (placeholder "Ej: 100", numérico limpio sin ceros).
         * Campo "UNIDAD DE MEDIDA": Visualmente bloqueado (`disabled` o `readOnly`), con fondo `#F7F4EE`, borde `#D6D3D1`, texto `#182622` y texto de ayuda en cursiva: "Definida por la presentación del producto".
     * Fila Inferior (Ancho completo `gridColumn: '1 / -1'`):
       - Label: "OBSERVACIONES TÉCNICAS O NOTAS DE PLANTA" (opcional).

2. EMPTY STATE ASISTIDO EN ETAPAS DE PRODUCCIÓN:
   - Si `formData.etapas.length === 0`:
     * Reemplazar el espacio vacío blanco por una tarjeta orientadora con borde discontinuo:
       ```jsx
       <div style={{
         border: '2px dashed #D6D3D1',
         backgroundColor: '#FAFAF9',
         borderRadius: '8px',
         padding: '1.5rem',
         textAlign: 'center',
         margin: '1rem 0'
       }}>
         <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.5rem' }}>📋</span>
         <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#182622', margin: '0 0 0.25rem 0' }}>
           No hay etapas configuradas en esta receta
         </h4>
         <p style={{ fontSize: '0.78rem', color: '#78716C', margin: '0 0 1rem 0' }}>
           Usa una de las plantillas rápidas de un solo clic para cargar los tiempos y temperaturas estándar de planta, o agrega una etapa manualmente.
         </p>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
           <button type="button" onClick={() => onApplyStageTemplate('BASE_TANQUE')} className={styles.templateBtn}>
             🥛 Cargar Etapas de Tanque (Pasteurización + Fermentación)
           </button>
           <button type="button" onClick={() => onApplyStageTemplate('ENVASADO_COMERCIAL')} className={styles.templateBtn}>
             🍓 Cargar Etapas de Envasado (Mezcla + Dosificación)
           </button>
         </div>
       </div>
       ```

3. BOTONERA Y PALETA INSTITUCIONAL MANNÁ:
   - Eliminar el azul `#2563EB` de toda la vista:
     * Botón `+ Agregar Etapa Manual`: Estilo secundario táctico (Fondo `#FFFFFF`, borde `1px solid #182622`, texto `#182622`, hover a `#F7F4EE`).
     * Botones de Plantilla Rápida (`[🥛 Tanque]` / `[🍓 Envasado]`): Fondo `#F7F4EE`, borde `#E5DFD5`, texto `#182622`, bordes suaves y feedback hover.
     * Botón `Guardar Receta`: Fondo Verde Bosque `#182622`, texto `#FFFFFF`, hover `#2C3E38`, esquinas `6px`, font-weight `700`.
     * Botón `Cancelar`: Fondo `#E5DFD5`, texto `#182622`.
   - Botón deshabilitado: Si faltan empaques o ingredientes obligatorios, `opacity: 0.5`, `cursor: not-allowed`, fondo `#A8A29E`.

4. SEMÁFORO FINANCIERO Y RESUMEN POKA-YOKE:
   - Asegurar que la cápsula inferior tenga buen padding y jerarquía, destacando el badge del semáforo (Verde si hay rentabilidad asegurada, Rojo si hay sobrecosto) y el total del batch en tipografía nítida y visible.

VERIFICACIÓN:
pnpm --filter web exec next lint --file src/app/catalog/recipes/components/RecipeModal.jsx
node --check apps/web/src/app/catalog/recipes/components/RecipeModal.jsx

CRITERIO DE FINALIZACIÓN:
- El producto aparece como primer campo obligatorio de la cabecera.
- La unidad de rendimiento se visualiza claramente como un valor no editable derivado del producto.
- Si no hay etapas, aparece el Empty State asistido con botones de plantilla incorporados.
- Se eliminan los botones azules y se adopta la paleta MANNÁ (#182622 y lino).
- Next lint y validación de sintaxis finalizan con código 0.

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE.

SALIDA:
Entrega únicamente:
- Archivos intervenidos:
- Mejoras ergonómicas implementadas:
- Resultado de comprobación lint:
- Estado:
