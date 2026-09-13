TAREA:
Corregir ReferenceError: activeProductIndex is not defined en DashboardPage

OBJETIVO:
1. En `apps/web/src/app/dashboard/page.jsx`:
   - Localizar el uso de `activeProductIndex` alrededor de la línea 2372 y dentro de la subfunción de renderizado `renderChannelPlant` (línea 2519).
   - Identificar si `activeProductIndex` corresponde a un estado faltante de selección (ej. `const [activeProductIndex, setActiveProductIndex] = useState(0);`) o si debe reemplazarse por el índice o estado real de selección de producto presente en el componente (como `selectedProductIndex`, `activeProduct`, o el `index` de una iteración `.map((prod, index) => ...)`).
   - Garantizar un fallback defensivo seguro (ej. `activeProductIndex ?? 0` o validación condicional) para evitar que el componente falle en caso de colecciones vacías de productos.

FUENTE DE VERDAD:
- `apps/web/src/app/dashboard/page.jsx`
- `AGENTS.md` (Reglas 0, 2, 13.1, 16.1, 38)

REGLA DE CONSULTA:
Lee exclusivamente `apps/web/src/app/dashboard/page.jsx` en el rango de líneas 2300 a 2550 y su sección de estados principales. Prohibido auditar el backend u otros módulos.

ALCANCE:

LEER:
- `apps/web/src/app/dashboard/page.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- `apps/web/src/app/dashboard/page.jsx`

NO MODIFICAR:
- backend (`apps/api/`).
- ningún otro módulo ni componente de catalog u operations.

INSTRUCCIONES:

1. LOCALIZAR LA REFERENCIA NO DEFINIDA:
   - Inspeccionar la función `renderChannelPlant` y la línea señalada en el stack trace (~2372).
   - Revisar qué estados de selección existen en `DashboardContent`:
     - Si falta declarar el estado de control del carrusel/tabs de productos de planta, agregarlo:
       ```javascript
       const [activeProductIndex, setActiveProductIndex] = useState(0);
       ```
     - Si la variable se llamaba de otra forma en el scope superior o proviene de un bucle, sincronizar la nomenclatura exacta.
   - Si se accede a un elemento por índice (ej. `products[activeProductIndex]`), aplicar encadenamiento opcional y fallback seguro para que no arroje error si el array está vacío:
     ```javascript
     const currentPlantProduct = plantProducts?.[activeProductIndex] || plantProducts?.[0] || null;
     ```

2. VALIDACIÓN DE COMPILACIÓN:
   - Verificar que no queden referencias huérfanas en el archivo.
   - Ejecutar el linter estático de Next.js para comprobar la resolución del error.

NO HACER:
- Prohibido usar `npx`.
- Prohibido usar TypeScript (`.ts`, `.tsx`).
- No alterar lógica de cálculo de métricas financieras del dashboard.
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- Al acceder a la ruta `/dashboard`, la vista renderiza completamente sin romper el renderizado de React con `ReferenceError`.
- La sección `renderChannelPlant` opera de manera tolerante ante listas de productos vacías o con elementos.
- `pnpm --filter web exec next lint --file src/app/dashboard/page.jsx` concluye con código de salida 0.

VERIFICACIÓN:
node --check apps/web/src/app/dashboard/page.jsx
pnpm --filter web exec next lint --file src/app/dashboard/page.jsx

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Causa identificada del ReferenceError:
- Solución aplicada en `apps/web/src/app/dashboard/page.jsx`:
- Resultado de comprobaciones (node check y lint):
- Estado: