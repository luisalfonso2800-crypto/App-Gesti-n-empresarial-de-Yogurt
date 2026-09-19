TAREA CONTROLADA — INTERFAZ Y DESGLOSE CONTABLE DE IVA EN COMPRA DIRECTA Y ACORDEÓN DE COMPRAS

OBJETIVO TÉCNICO:
Implementar en el frontend los controles reactivos y la visualización completa del IVA para compras:
1. En cada fila de compra directa (`FormPhase.jsx`), permitir marcar/desmarcar IVA (activo por defecto), ajustar la tasa porcentual (por defecto 19%), alternar si el precio incluye IVA o si se calcula adicional, y mostrar el desglose (Base / IVA / Subtotal).
2. En la barra de liquidación y pie de página de `/operations/purchases/new`, mostrar el resumen de cuatro componentes: Subtotal Base sin IVA, Total IVA, Flete Global y Total a Pagar.
3. En el acordeón desplegable de `/operations/purchases`, proyectar los campos de IVA por ítem y el consolidado contable al pie del panel desplegado.

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/app/operations/purchases/page.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE TOOL BUDGET (NIVEL 1):
- PROHIBIDO ejecutar `Find`, `Search` o búsquedas ciegas.
- Modificar EXCLUSIVAMENTE los archivos de Compras indicados.
- Límite máximo de lecturas: 1 lectura por archivo a intervenir.
- Cero estilos en línea (`style={{}}`), utilizar exclusivamente CSS Modules.
- Respetar SRP (< 145 líneas por archivo de componente; modularizar en `modal-parts/` o subcomponentes si excede).
- No alterar TypeScript: mantener código nativo JavaScript (.jsx, .js).

ACCIONES A EJECUTAR:

1. En la fila de detalle de compra (`FormPhase.jsx`):
   - Inicializar el estado de cada ítem con:
     ```javascript
     tieneIva: true,
     porcentajeIva: 19,
     precioIncluyeIva: true
     ```
   - En la sección de precios y subtotales de la fila, incorporar:
     * Checkbox estilizado: `[✓] Aplica IVA` que conmuta `tieneIva`.
     * Campo numérico compacto para tasa porcentual: `Tasa: 19%` (editable si cambia en el futuro).
     * Toggle/selector: `[Precio incluye IVA / IVA adicional]` (default `true`).
   - Matemática reactiva de la fila:
     * Si `!tieneIva`:
       - `subtotalSinIva = precioUnitario * cantEmpaques`
       - `montoIva = 0`
       - `subtotalConIva = subtotalSinIva`
     * Si `tieneIva && precioIncluyeIva`:
       - `subtotalConIva = precioUnitario * cantEmpaques`
       - `subtotalSinIva = subtotalConIva / (1 + (porcentajeIva / 100))`
       - `montoIva = subtotalConIva - subtotalSinIva`
     * Si `tieneIva && !precioIncluyeIva`:
       - `subtotalSinIva = precioUnitario * cantEmpaques`
       - `montoIva = subtotalSinIva * (porcentajeIva / 100)`
       - `subtotalConIva = subtotalSinIva + montoIva`
   - Renderizar microtextos legibles en la fila:
     `Base: $XX.XXX | IVA (${porcentajeIva}%): $YY.YYY | Subtotal: $ZZ.ZZZ`

2. En el envío del formulario (`handleConfirmar` / `handleGuardarCompra`):
   - Adjuntar en cada ítem del array `items`:
     `{ ..., tieneIva, porcentajeIva, precioIncluyeIva, subtotalSinIva, montoIva, subtotal: subtotalConIva }`
   - En la cabecera enviada al backend, sumar y enviar:
     `totalSinIva`, `totalIva`, `flete` y `total`.

3. En el Resumen / Liquidación de `new/page.jsx` (o footer de `FormPhase.jsx`):
   - Sustituir la tarjeta plana de "TOTAL COMPRA: $0" por el panel estructurado:
     * `Subtotal Base (Sin IVA): $XX.XXX`
     * `IVA Consolidado: $YY.YYY`
     * `Flete Global: $FF.FFF`
     * `TOTAL COMPRA A PAGAR: $ZZ.ZZZ`

4. En la vista de Historial (`/operations/purchases/page.jsx`):
   - En la subtabla del acordeón expandido:
     * Agregar columnas: `Base`, `IVA (%)`, `IVA ($)` y `Subtotal`.
   - En el pie del acordeón (junto al Flete):
     * Mostrar `Subtotal sin IVA`, `Total IVA Discriminado` y `Total Factura`.

5. Verificaciones estáticas y de arquitectura:
   - `node --check apps/web/src/app/operations/purchases/new/components/FormPhase.jsx`
   - `node --check apps/web/src/app/operations/purchases/page.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Formulario de compras permite registrar insumos exentos y gravados en la misma transacción.
- Los cálculos de IVA y base son visibles en tiempo real sin requerir recargas.
- Acordeón histórico muestra claramente el desglose fiscal.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Controles de IVA implementados en: FormPhase.jsx
- Resumen consolidado adaptado en: new/page.jsx y purchases/page.jsx
- Resultado verify-srp.js: