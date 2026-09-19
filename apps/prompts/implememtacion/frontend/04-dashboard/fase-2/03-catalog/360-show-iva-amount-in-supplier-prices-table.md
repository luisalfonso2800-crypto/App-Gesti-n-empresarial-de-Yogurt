TAREA CONTROLADA — VISUALIZACIÓN DEL VALOR MONETARIO DEL IVA EN TABLA DE PRECIOS DE PROVEEDORES

OBJETIVO TÉCNICO:
Modificar la columna "Base s/IVA" en `PricesComparisonTable.jsx` para que muestre de forma clara y simultánea tanto la base neta antes de impuesto como el monto exacto en pesos del IVA liquidado (ej: Base: $4.412 con subtítulo + $838 IVA 19%).

FUENTES DE VERDAD:
- apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx
- apps/web/src/app/catalog/supplier-prices/supplier-prices.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido hacer búsquedas globales (`Find`, `Search`).
- Leer únicamente `PricesComparisonTable.jsx` y su respectivo archivo CSS (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules.
- Respetar el límite de líneas SRP (< 145 líneas en JSX).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. En `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`:
   - En el encabezado de la tabla (<thead>), renombrar la columna "Base s/IVA" por:
     `Base / IVA ($)` o `Base e IVA`.
   - En el cuerpo de la tabla (<tbody>), calcular de forma reactiva y defensiva el monto del IVA:
     ```javascript
     const precioEmpaque = Number(row.precioCompra || row.precio || 0);
     const tieneIva = row.tieneIva ?? true;
     const porcentajeIva = Number(row.porcentajeIva || 19);
     const precioIncluyeIva = row.precioIncluyeIva ?? true;

     let baseSinIva = Number(row.costoBaseSinIva || 0);
     let montoIva = Number(row.montoIva || 0);

     if (baseSinIva <= 0 && precioEmpaque > 0) {
       if (!tieneIva) {
         baseSinIva = precioEmpaque;
         montoIva = 0;
       } else if (precioIncluyeIva) {
         baseSinIva = precioEmpaque / (1 + (porcentajeIva / 100));
         montoIva = precioEmpaque - baseSinIva;
       } else {
         baseSinIva = precioEmpaque;
         montoIva = precioEmpaque * (porcentajeIva / 100);
       }
     } else if (montoIva <= 0 && tieneIva && baseSinIva > 0) {
       montoIva = precioEmpaque - baseSinIva;
     }
     ```
   - Renderizar en la celda correspondiente:
     * El valor de la base principal formateado (ej. `$ 4.412`).
     * Un microtexto debajo del valor principal con clase CSS dedicada:
       - Si tiene IVA: `+ $ {formatCurrency(montoIva)} (IVA {porcentajeIva}%)` en color atenuado (#475569 o #059669).
       - Si es exento: `$ 0 (Exento)` en color neutro (#94A3B8).

2. En `apps/web/src/app/catalog/supplier-prices/supplier-prices.module.css` (o css correspondiente):
   - Agregar si no existe la clase para el microtexto secundario:
     ```css
     .ivaSubtext {
       display: block;
       font-size: 0.72rem;
       font-weight: 500;
       color: #64748B;
       margin-top: 0.15rem;
     }
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- La tabla muestra la base neta y el monto exacto del IVA para cada cotización.
- Para Cereza muestra Base: $4.412 y + $838 (IVA 19%).
- Para Azúcar muestra Base: $2.773 y + $527 (IVA 19%).
- 0 infracciones en verify-srp.js.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Formato de IVA implementado en: PricesComparisonTable.jsx
- Resultado verify-srp.js: