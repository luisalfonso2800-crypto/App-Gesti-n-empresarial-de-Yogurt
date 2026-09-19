TAREA CONTROLADA — ACCIÓN BIDIRECCIONAL (AÑADIR / QUITAR) EN DRAWER DE STOCK DE COMPRA DIRECTA

OBJETIVO TÉCNICO:
En `StockLookupDrawer.jsx`, reflejar en tiempo real si un insumo ya forma parte de las filas de compra activa:
1. Si el insumo YA está añadido en la compra:
   - Resaltar la tarjeta con un badge o estado visual "✓ En la orden".
   - Cambiar el botón de acción a "Quitar de Compra" (o "✕ Quitar").
   - Al pulsar "Quitar", remover la fila del formulario de compra y actualizar el estado inmediatamente.
2. Si el insumo NO está añadido:
   - Mantener el botón "+ Añadir a Compra".
   - Al pulsarlo, añadir la fila como hasta ahora y conmutar el botón a "Quitar".

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx
- apps/web/src/app/operations/purchases/new/components/FormPhase.jsx (o componente padre que pasa los ítems y callbacks)
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- PROHIBIDO realizar búsquedas globales (`Find`, `Search`).
- Leer únicamente `StockLookupDrawer.jsx`, `FormPhase.jsx` y su módulo CSS (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar CSS Modules.
- Respetar el límite de líneas SRP (< 145 líneas por archivo).
- Mantener JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `FormPhase.jsx` (o donde se instancie `StockLookupDrawer`):
   - Pasar como props al drawer:
     * `currentItems`: El arreglo actual de filas de la compra (`items`).
     * `onRemoveItem`: La función para eliminar una fila dado el `idInsumo` o `index` (`handleEliminarFila` o `handleRemoveByInsumoId`).

2. EN `StockLookupDrawer.jsx`:
   - Determinar si cada insumo está presente en la compra actual:
     ```javascript
     const isAlreadyAdded = (currentItems || []).some(
       (item) => (item.idInsumo || item.insumoId || item.id) === (supply.idInsumo || supply.id)
     );
     ```
   - En el renderizado de la tarjeta de cada insumo:
     * Si `isAlreadyAdded`:
       - Aplicar clase visual a la tarjeta (ej. `.itemCardAdded`).
       - Mostrar badge: `<span className={styles.badgeAdded}>✓ En compra</span>`.
       - Renderizar botón de retiro:
         ```jsx
         <button
           type="button"
           className={styles.btnRemoveFromDrawer}
           onClick={() => onRemoveItem(supply.idInsumo || supply.id)}
         >
           ✕ Quitar
         </button>
         ```
     * Si `!isAlreadyAdded`:
       - Mantener el botón estándar:
         ```jsx
         <button
           type="button"
           className={styles.btnAddFromDrawer}
           onClick={() => onAddSupply(supply)}
         >
           + Añadir a Compra
         </button>
         ```

3. EN `new-purchase.module.css`:
   - Definir los estilos para el estado añadido y el botón de remover:
     ```css
     .itemCardAdded {
       border-color: #A7F3D0;
       background-color: #F0FDF4;
     }

     .badgeAdded {
       background-color: #DCFCE7;
       color: #166534;
       font-size: 0.7rem;
       font-weight: 700;
       padding: 0.15rem 0.45rem;
       border-radius: 9999px;
       margin-left: 0.5rem;
     }

     .btnRemoveFromDrawer {
       background-color: #FEF2F2;
       color: #DC2626;
       border: 1px solid #FECACA;
       border-radius: 6px;
       font-weight: 600;
       font-size: 0.82rem;
       padding: 0.4rem 0.75rem;
       cursor: pointer;
       transition: background-color 0.15s ease;
     }

     .btnRemoveFromDrawer:hover {
       background-color: #FEE2E2;
     }
     ```

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Los insumos ya agregados muestran el badge "✓ En compra" y el botón "✕ Quitar" dentro del drawer.
- Al pulsar "✕ Quitar", la fila se elimina del formulario de compra y el botón vuelve a "+ Añadir a Compra".
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Estado reactivo añadido en: StockLookupDrawer.jsx
- Callback conectado en: FormPhase.jsx
- Resultado verify-srp.js: