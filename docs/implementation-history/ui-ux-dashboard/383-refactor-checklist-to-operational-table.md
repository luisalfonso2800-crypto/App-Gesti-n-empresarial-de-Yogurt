TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir la disposición visual en `ChecklistItemRow.jsx` y `new-purchase.module.css`:
1. Mover el subtotal de compra: retirarlo de debajo del input de precio unitario y colocarlo en su propia columna previa a las acciones, en tamaño grande ($ 60.800) con puntuación de miles.
2. Eliminar la pastilla estática duplicada que dice "✓ CONSEGUIDO", dejando únicamente el botón interactivo "✓ Conseguido".
3. Formatear con signos de puntuación/miles los números planos (precio con formato de moneda y gramos sin decimales ficticios: "2.640 g" en vez de "2640.0 g").

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx`
2. `apps/web/src/app/purchases/new/new-purchase.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `ChecklistItemRow.jsx`:
   - Debajo del input de precio unitario (`7600`):
     * REMOVER el microtexto `{Total: $...}`.
   - En la sección previa al botón de acción final:
     * Crear el contenedor de Subtotal Prominente (`.subtotalBlock`):
       - Cifra grande: `<span className={styles.subtotalAmount}>$ {subtotalEntero.toLocaleString('es-CO')}</span>`.
       - Leyenda en letras: `<span className={styles.subtotalTextWords}>{numeroATexto(subtotalEntero)} M/CTE</span>`.
   - En los estados/badges:
     * REMOVER completamente el tag/span `<span className={...}>✓ CONSEGUIDO</span>` que precede al botón.
     * Dejar únicamente el botón interactivo `<button className={styles.btnConseguido}>✓ Conseguido</button>` y el toggle de colapso `[ ∧ / ∨ ]`.
   - Formateo numérico:
     * Redondear la cantidad neta: `Math.round(totalNeto).toLocaleString('es-CO')} {unidad}` (ej: `2.640 g`).
   - Mantener el componente estrictamente bajo el límite SRP (< 135 líneas).

2. En `new-purchase.module.css`:
   - Ajustar el grid o flexbox de la fila para dar espacio a la columna del subtotal:
     ```css
     .subtotalBlock {
       display: flex;
       flex-direction: column;
       align-items: flex-end;
       justify-content: center;
       min-width: 140px;
       margin-right: 8px;
     }
     .subtotalAmount {
       font-size: 19px;
       font-weight: 800;
       color: #0F172A;
       line-height: 1.1;
     }
     .subtotalTextWords {
       font-size: 10.5px;
       color: #64748B;
       font-style: italic;
       text-align: right;
       text-transform: capitalize;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/purchases/new/components/ChecklistItemRow.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El subtotal ya no aparece apretado debajo del input, sino en tipografía grande al final de la fila antes del botón.
- Desaparece la pastilla duplicada de "CONSEGUIDO".
- Las cantidades netas muestran separadores de miles limpios sin decimales innecesarios.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.