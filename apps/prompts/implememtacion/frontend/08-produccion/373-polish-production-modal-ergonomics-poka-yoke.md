TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Refactorizar el modal de "Planificar Nueva Orden" (`ProductionOrderModal.jsx` / `ProductionOrderForm.jsx` y su CSS) aplicando:
1. Contenedor de "Parámetros de Entrada" con layout dividido: campos a la izquierda e imagen del producto a la derecha.
2. Iconos de asistencia visual en KPIs y tabla BOM.
3. Representación en letras del Costo Total y Costo Unitario proyectados usando la utilidad de formateo de texto/letras.
4. Poka-Yoke de bloqueo en el botón "Iniciar Fabricación Inmediata" ante stock insuficiente.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee una sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/production/components/ProductionOrderForm.jsx` (o donde se renderiza el contenido del modal)
2. `apps/web/src/app/production/production.module.css` (o archivo CSS del modal de producción)

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderForm.jsx`:
   - Sección "PARÁMETROS DE ENTRADA":
     * Transformar el contenedor en un flex/grid de 2 columnas:
       - Columna izquierda (75% aprox.): Select `Receta / Producto` y campo numérico `Cantidad a Producir (Litros)`.
       - Columna derecha (25% aprox.): Caja con la miniatura/foto del producto (`producto.imagenUrl` o placeholder) con borde redondeado y nombre sutil al pie.
   - En las 4 tarjetas de KPI (Costo Total, Costo Unitario, Tiempo, Lote):
     * Incorporar iconos descriptivos: `💰 Costo Total Estimado`, `🏷️ Costo Unitario Proyectado`, `⏱️ Tiempo de Proceso`, `🔖 Lote Sugerido`.
     * Debajo de las cifras numéricas de Costo Total y Costo Unitario, incluir el microtexto en letras (utilizando el helper de conversión de moneda/letras existente en la app o un formateador textual en español, ej: "Trece mil ciento sesenta y nueve pesos").
   - En la tabla del BOM:
     * Cabeceras con iconografía: `📦 Insumo`, `📐 Req. Teórico`, `🏢 Stock Actual`, `💲 Subtotal`, `🚦 Estado`.
   - Poka-Yoke de Botón de Inicio:
     * Calcular `hasMissingStock = bomItems.some(item => item.faltante > 0)`.
     * Si `hasMissingStock`:
       - Deshabilitar el botón `Iniciar Fabricación Inmediata` (`disabled`, opacidad 45%).
       - Mostrar tooltip o microtexto de advertencia: `⚠️ Faltan insumos en bodega para iniciar el lote inmediatamente`.
       - Permitir únicamente `Guardar como Planificada` o `Cancelar`.
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En el archivo CSS:
   - Añadir estilos para el layout dividido (`.parametersSplitLayout`, `.productPreviewCard`, `.costInWords`).
   - `.costInWords`: `font-size: 11px; color: #64748B; font-style: italic; margin-top: 2px; text-transform: capitalize;`
   - `.productPreviewCard`: `border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: #FAF9F6;`

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta de parámetros muestra los campos a la izquierda y la imagen a la derecha.
- Los costos total y unitario muestran su valor numérico acompañado del texto en letras.
- Iconografía clara en KPIs y tabla.
- El botón de inicio inmediato se bloquea automáticamente si hay ingredientes faltantes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.