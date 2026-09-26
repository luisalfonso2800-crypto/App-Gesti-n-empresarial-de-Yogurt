TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Aplicar principio Poka-Yoke ergonómico a la fila de compra en `ChecklistItemRow.jsx` y `new-purchase.module.css`:
1. Etiquetar cada campo editable con prefijo/sufijo claro: el campo de cantidad debe indicar la unidad de empaque (ej: "8 envases"), y el campo de precio debe tener prefijo monetario institucional ("$ 7.600").
2. Contextualizar los valores de recepción con etiquetas legibles: "Entran: 2.640 g" y "Costo: $ 23,03 / g".
3. Incluir micro-encabezados sobre cada columna de la fila para que cualquier operador entienda inmediatamente qué significa cada valor.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx`
2. `apps/web/src/app/purchases/new/new-purchase.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ChecklistItemRow.jsx`:
   - Para la Columna de Cantidad:
     * Envolver el input en un contenedor con sufijo textual claro:
       `<div className={styles.inputWithUnit}><input type="number" value={cant} ... /> <span className={styles.inputUnitBadge}>{presentacionTipo || 'empaques'}</span></div>`
       (Ej: "8 envases" o "4 cajas").
   - Para la Columna de Precio:
     * Envolver en un contenedor con prefijo monetario:
       `<div className={styles.inputWithCurrency}><span className={styles.currencyPrefix}>$</span><input type="number" value={precio} ... /><span className={styles.pricePerUnit}>/ und</span></div>`
   - Para la Columna de Ingreso y Costo:
     * Dejar explícito el significado de ambos renglones:
       - Renglón 1: `<span className={styles.netReceiptLabel}>Entran: <strong>{Math.round(totalNeto).toLocaleString('es-CO')} {unidad}</strong></span>`
       - Renglón 2: `<span className={styles.unitCostLabel}>Costo: <strong>$ {costoBaseUnitario.toFixed(2)} / {unidad}</strong></span>`
   - En la cabecera / micro-labels superiores de columna:
     * Renderizar sobre cada bloque un micro-label de control: `CANTIDAD`, `PRECIO EMPAQUE`, `BODEGA`, `TOTAL COMPRA`.
   - Mantener el componente bajo 135 líneas (SRP).

2. En `new-purchase.module.css`:
   - Estilos para inputs con sufijos/prefijos Poka-Yoke:
     ```css
     .inputWithUnit, .inputWithCurrency {
       display: inline-flex;
       align-items: center;
       background: #FFFFFF;
       border: 1px solid #CBD5E1;
       border-radius: 6px;
       padding: 0 6px;
       height: 34px;
       gap: 4px;
     }
     .inputUnitBadge, .pricePerUnit {
       font-size: 11px;
       font-weight: 600;
       color: #64748B;
       white-space: nowrap;
     }
     .currencyPrefix {
       font-size: 13px;
       font-weight: 700;
       color: #1F2937;
     }
     .netReceiptLabel {
       font-size: 12px;
       color: #1F2937;
       display: block;
     }
     .unitCostLabel {
       font-size: 11px;
       color: #059669;
       display: block;
       margin-top: 2px;
     }
     .columnMicroLabel {
       font-size: 10px;
       font-weight: 700;
       color: #94A3B8;
       text-transform: uppercase;
       letter-spacing: 0.05em;
       margin-bottom: 4px;
       display: block;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Ningún número queda aislado sin etiqueta ni unidad (el 8 indica "envases", 7600 muestra "$ ... / und").
- La recepción en bodega y el costo unitario están explícitamente rotulados con "Entran:" y "Costo:".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.