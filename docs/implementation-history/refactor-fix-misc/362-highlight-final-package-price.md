TAREA CONTROLADA — JERARQUÍA VISUAL Y DESTACADO DEL PRECIO FINAL DE EMPAQUE EN TABLA DE PRECIOS

OBJETIVO TÉCNICO:
1. Resaltar visualmente la columna "Precio Empaque" para que sea el dato monetario protagonista y dominante de la fila (mayor tamaño tipográfico, peso negrita oscuro y microtexto "Total a pagar").
2. Corregir el bug de doble signo de pesos ("$$") en la columna "Base / IVA ($)" y atenuar su peso tipográfico para que funcione como desglose contable secundario y no opaque al precio final.

FUENTES DE VERDAD:
- apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
- apps/web/src/app/catalog/supplier-prices/supplier-prices.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas ciegas (`Find`, `Search`).
- Leer únicamente `PricesComparisonTable.jsx` y su archivo CSS module (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar exclusivamente CSS Modules.
- Respetar SRP (< 145 líneas en el componente JSX).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `PricesComparisonTable.jsx`:
   - Corregir el formateo para eliminar el doble símbolo de moneda:
     * Si `formatCurrency` ya incluye el prefijo "$", no anteponer "$" en el JSX (cambiar `$ {formatCurrency(...)}` por `{formatCurrency(...)}` o limpiar la duplicación).
   - En la celda de **Precio Empaque**:
     * Asignar una clase CSS destacada (ej. `className={styles.finalPriceCell}`).
     * Renderizar el monto en formato grande y sólido.
     * Añadir debajo un microtexto aclaratorio: `<span className={styles.finalPriceLabel}>(Total a pagar)</span>`.
   - En la celda de **Base / IVA ($)**:
     * Asignar una clase secundaria (ej. `className={styles.taxBreakdownCell}`) con tamaño y peso visual moderado.
     * Asegurar que el microtexto de IVA muestre un solo símbolo "$" limpio: `+ ${formatCurrency(montoIva)} (IVA ${porcentajeIva}%)`.

2. EN `supplier-prices.module.css`:
   - Definir los estilos de jerarquía:
     ```css
     .finalPriceCell {
       font-size: 1.15rem;
       font-weight: 800;
       color: #182622;
       line-height: 1.1;
     }

     .finalPriceLabel {
       display: block;
       font-size: 0.68rem;
       font-weight: 500;
       color: #64748B;
       margin-top: 0.2rem;
     }

     .taxBreakdownCell {
       font-size: 0.88rem;
       font-weight: 600;
       color: #475569;
     }
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- El precio de empaque sobresale con nitidez como el total real a pagar.
- Desaparece la doble denominación "$$" en la base e IVA.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Clases agregadas a supplier-prices.module.css:
- Formato corregido en: PricesComparisonTable.jsx
- Resultado verify-srp.js: