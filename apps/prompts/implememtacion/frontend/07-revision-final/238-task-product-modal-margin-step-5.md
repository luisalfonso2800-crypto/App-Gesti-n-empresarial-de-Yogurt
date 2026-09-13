OBJETIVO: Configurar el campo "MARGEN OBJETIVO (%)" en `ProductModal.jsx` (y su componente `StrictNumberInput.jsx`) para que los controles de incremento/decremento (flechas del teclado y spinner del input) aumenten/disminuyan estrictamente de 5 en 5 números enteros (0, 5, 10... 50, 55, 60), eliminando cualquier residuo decimal al presionar subir o bajar.

ARCHIVOS A INSPECCIONAR / MODIFICAR:
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `apps/web/src/components/ui/inputs/StrictNumberInput.jsx`

INSTRUCCIONES:

1. ATRIBUTO Y COMPORTAMIENTO DE PASO (STEP):
   - En `ProductModal.jsx`, asegurar que el input de `margenObjetivo` reciba explícitamente:
     `step={5}`, `min={0}`, `max={100}`.

2. SANITIZACIÓN Y SALTO DE 5 EN 5 EN STEPPING:
   - En `StrictNumberInput.jsx` (o directamente en el manejador del input):
     * Detectar los eventos de incremento/decremento nativo (flechas `ArrowUp` / `ArrowDown` o interacción de spinner).
     * Si el valor actual contiene decimales (ej. `50.03`) y el usuario presiona subir:
       - Redondear/truncar al múltiplo de 5 superior: `Math.min(100, Math.floor(Number(val) / 5) * 5 + 5)` ➔ salta directo a `55`.
     * Si presiona bajar:
       - Redondear/truncar al múltiplo de 5 inferior: `Math.max(0, Math.ceil(Number(val) / 5) * 5 - 5)` ➔ salta directo a `45`.
     * Si el valor ya es entero múltiplo de 5, sumar o restar 5 de forma limpia dentro del rango [0, 100].

3. PRESERVACIÓN:
   - Permitir que si el usuario desea escribir manualmente en el teclado un número específico pueda hacerlo, pero que cualquier interacción con las flechas o spinners fuerce el salto en enteros de 5 en 5.
   - Mantener la sincronización con la tarjeta de proyección financiera inferior.

VERIFICACIÓN:
`pnpm --filter web exec next lint --file src/app/catalog/products/components/ProductModal.jsx`

SALIDA: Reporte breve con el cambio aplicado, control de paso de 5 en 5 comprobado y linter con código 0.