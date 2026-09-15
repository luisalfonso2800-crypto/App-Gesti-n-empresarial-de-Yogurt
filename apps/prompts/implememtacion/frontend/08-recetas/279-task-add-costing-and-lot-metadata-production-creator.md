TAREA:
Integrar costeo en vivo, desglose financiero del BOM y metadatos de trazabilidad de lote en el creador de órdenes de producción (`ProductionOrderCreator.jsx` / componentes co-locados).

OBJETIVO:
1. En `apps/web/src/app/operations/production/components/`:
   - **Tarjeta de Métricas Financieras y Operativas:** Añadir una barra o tarjetas de KPIs encima del BOM que proyecte:
     * Costo Total Estimado del Lote en COP (formato `$ 48.500`).
     * Costo Unitario Estimado por Litro/Unidad (`$ 4.409 COP / L`).
     * Tiempo Total de Proceso (sumatoria de tiempos estándar de las etapas de la receta: ej. `⏱ 8h 30m`).
     * Lote Sugerido automático (`LOT-[YYYYMMDD]-[SEQ]`).
   - **Columnas Financieras en la Tabla BOM:**
     * Agregar columna "Costo Unit." (último precio de compra del insumo).
     * Agregar columna "Subtotal Estimado" (`Req. Teórico * Costo Unitario`).
   - **Impacto Financiero de Faltantes:** Si hay faltante de insumos, mostrar en la alerta roja el costo estimado de la compra requerida para completar la tanda.
2. Extraer cálculos de costeo y formato a un helper o hook co-locado para mantener los componentes en < 150 líneas.
3. Estilos 100% en CSS Modules sin `style={{}}`.
4. Ejecutar `node .agents/scripts/verify-srp.js` con código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/05-forms-and-modals.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Lee y modifica exclusivamente los componentes co-locados de producción en `apps/web/src/app/operations/production/`.

ALCANCE:

LEER Y MODIFICAR:
- Componentes de creación de orden de producción en `apps/web/src/app/operations/production/components/`
- Hojas `.module.css` asociadas.

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. CÁLCULOS DE COSTEO:
   - Para cada insumo en `receta.bom`:
     `costoUnitario = insumo.ultimoPrecio || insumo.costoPromedio || 0`
     `subtotalInsumo = reqTeorico * costoUnitario`
   - `costoTotalLote = sumatoria(subtotalInsumo)`
   - `costoPorLitro = cantidadDeseada > 0 ? costoTotalLote / cantidadDeseada : 0`

2. TARJETA RESUMEN (`ProductionFinancialSummary.jsx` o similar):
   - Grid compacto de 4 tarjetas con fondo marfil (`#FAF8F5`), bordes suaves (`#E5DFD5`) y tipografía corporativa.
   - Proyección de moneda en COP limpia mediante helper centralizado.

3. TABLA BOM ACTUALIZADA:
   - Columnas: Insumo | Req. Teórico | Stock Actual | Costo Unit. | Subtotal | Faltante | Estado.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCreator.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Métricas de costo total, unitario y lote sugerido visibles y reactivas al modificar la cantidad a producir.
- `verify-srp.js` finaliza con código 0 y 0 infracciones.

DETENCIÓN:
Al validar los cambios y obtener código 0, DETENTE.

SALIDA:
- Componentes modificados / creados:
- Líneas de código:
- Resultado de verify-srp.js:
- Estado: