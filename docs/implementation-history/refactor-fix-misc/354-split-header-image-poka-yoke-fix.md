TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 5 TOOL CALLS EN TOTAL):
Implementar el layout Split Header en la cabecera de recetas (`RecipeHeaderFields.jsx`), restaurando la imagen del producto a tamaño completo (~180px) como control visual, compactando los campos técnicos en grid 2x2, integrando las plantillas de tipo de receta y corrigiendo la precarga/validación Poka-Yoke de Temperatura Objetivo (`OBJ`).

CLÁUSULA DE BLOQUEO ANTI-CONSUMO DE CUOTA (REGLA MAESTRA 07):
1. PROHIBICIÓN ABSOLUTA DE BÚSQUEDAS: Queda terminantemente prohibido usar `Search`, `Find`, `Grep`, `ripgrep` o comandos de exploración en bash (`dir /s`, `find`).
2. POLÍTICA DE LECTURA ÚNICA (SINGLE-READ ONLY): Está prohibido leer (`Read`) un archivo más de una vez. Lee una sola vez, conserva el contexto en memoria y edita inmediatamente. Si intentas releer un archivo ya abierto, DETENTE.
3. ALCANCE CERRADO: No leas archivos fuera de la lista explícita de este prompt. Toda la información necesaria está provista aquí.

RUTAS EXACTAS DE ARCHIVOS A INTERVENIR (MODIFICACIÓN DIRECTA):
- Archivo 1: `apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
- Archivo 2: `apps/web/src/app/catalog/recipes/components/parts/RecipeStageParametersCards.jsx`
- Archivo 3: `apps/web/src/app/catalog/recipes/components/recipe-modal.module.css`

OBJETIVO TÉCNICO:

1. Split Header en `RecipeHeaderFields.jsx` y `recipe-modal.module.css`:
   - Reemplazar la disposición vertical por un contenedor con CSS Grid de 2 columnas (`grid-template-columns: 1fr 190px; gap: 16px; align-items: start;`).
   - Columna Izquierda (Datos Técnicos en Grid 2x2):
     * Fila 1: `Producto a Fabricar` (50%) + `Nombre Técnico de la Receta` (50%).
     * Fila 2: `Cantidad Rendimiento Base` (25%) + `Unidad de Medida` (25%) + Selector compacto de Tipo/Plantilla (50% — Base Láctea, Empaque, Fruta).
     * Enlace sutil al pie: `[+ Agregar notas u observaciones técnicas]`.
   - Columna Derecha (Ficha Visual de Control Poka-Yoke):
     * Tarjeta con borde sutil y fondo neutro.
     * Imagen de producto a tamaño generoso: `width: 100%; height: 130px; object-fit: cover; border-radius: 8px;`.
     * Etiqueta inferior con el nombre o código del producto seleccionado en tipografía técnica de 11px.

2. Corrección Poka-Yoke en `RecipeStageParametersCards.jsx`:
   - Al cargar o editar la etapa, si `tempObj === 0` o `tempObj === ''` pero existen `tempMin` y `tempMax`:
     * Precargar automáticamente el promedio: `(Number(tempMin) + Number(tempMax)) / 2`.
   - Validación visual inmediata: Si `tempObj < tempMin` o `tempObj > tempMax`, aplicar la clase `.inputErrorBorder` (`border: 1px solid #EF4444; background-color: #FEF2F2;`) y mostrar el microtexto: *"El objetivo debe estar entre MÍN y MÁX"*.

3. Limpieza de Cabecera en `RecipeModal.jsx`:
   - Asegurar que los botones `[Cancelar]` y `[Finalizar y Resumir]` existan ÚNICAMENTE en la barra flotante sticky inferior (`RecipeBalanceFooter`), eliminando cualquier duplicado en la parte superior.

4. Restricciones Técnicas:
   - Mantener límite SRP (< 135 líneas por componente).
   - Estilos 100% en CSS Modules (sin inline styles).
   - Validar sintaxis con `node --check`.
   - Ejecutar: `node .agents/scripts/verify-srp.js`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/modal-parts/RecipeHeaderFields.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La cabecera ocupa ~140px verticales en pantalla dividida (datos a la izquierda, foto completa a la derecha).
- El campo OBJ de temperatura no aparece en 0.0 y valida rangos en tiempo real con bordes rojos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Tras verificar el guardián de código, DETENTE inmediatamente. No ejecutes acciones adicionales.