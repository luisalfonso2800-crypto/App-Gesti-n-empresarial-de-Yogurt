TAREA CONTROLADA — HABILITACIÓN DE SCROLL Y CARGA COMPLETA EN DRAWER DE STOCK DE INSUMOS

OBJETIVO TÉCNICO:
1. Resolver el estado vacío en `StockLookupDrawer.jsx` para que cargue y liste todos los insumos disponibles en bodega cuando el buscador esté vacío.
2. Habilitar scroll vertical fluido (`overflow-y: auto`) en el contenedor de resultados para navegar entre todos los insumos sin recortar la pantalla.
3. Mantener fija la barra de búsqueda superior mientras se desplaza la lista.

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- Prohibido realizar búsquedas globales (`Find`, `Search`).
- Leer únicamente `StockLookupDrawer.jsx` y su módulo CSS (máximo 1 lectura por archivo).
- Cero estilos en línea (`style={{}}`), utilizar exclusivamente CSS Modules.
- Respetar el límite SRP (< 145 líneas por archivo de componente).
- JavaScript nativo (.jsx, .js). PROHIBIDO TypeScript.

ACCIONES A EJECUTAR:

1. EN `StockLookupDrawer.jsx`:
   - En la consulta inicial de datos (`useEffect`):
     * Consumir `/api/v1/supplies` (o `/api/v1/inventory`).
     * Asegurar compatibilidad de formato: si la respuesta es `{ data: [...] }` o array directo, extraer el arreglo de forma segura `Array.isArray(res) ? res : res.data || []`.
     * Filtrar localmente por texto (`searchTerm`) únicamente si este contiene caracteres:
       ```javascript
       const filteredSupplies = supplies.filter((s) => {
         if (!searchTerm?.trim()) return true;
         const q = searchTerm.toLowerCase();
         return (
           s.nombre?.toLowerCase().includes(q) ||
           s.marca?.toLowerCase().includes(q) ||
           s.categoria?.toLowerCase().includes(q)
         );
       });
       ```
   - En el maquetado:
     * El input de búsqueda se mantiene en la cabecera fija.
     * El cuerpo donde se mapea `filteredSupplies` debe usar la clase de scroll `.drawerListContainer`.

2. EN `new-purchase.module.css` (o CSS del drawer):
   - Configurar la estructura de scroll:
     ```css
     .drawerContent {
       display: flex;
       flex-direction: column;
       height: 100%;
       max-height: 100vh;
     }

     .drawerHeader {
       flex-shrink: 0;
       padding: 1.25rem 1.5rem;
       border-bottom: 1px solid #E5DFD5;
       background-color: #FFFFFF;
     }

     .drawerListContainer {
       flex: 1;
       overflow-y: auto;
       padding: 1rem 1.5rem;
       display: flex;
       flex-direction: column;
       gap: 0.75rem;
       overscroll-behavior: contain;
     }
     ```

3. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Al abrir el drawer sin escribir en el buscador, se muestran todos los insumos registrados.
- La lista tiene scroll vertical suave para navegar por todo el catálogo.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Carga y scroll habilitados en: StockLookupDrawer.jsx
- Clases CSS añadidas en: new-purchase.module.css
- Resultado verify-srp.js: