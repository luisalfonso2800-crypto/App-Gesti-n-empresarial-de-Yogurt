# TAREA CONTROLADA — BUSCADOR Y FILTROS EN EL BANNER DE HUÉRFANOS (FASE B)

OBJETIVO TÉCNICO:
En `apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx` y su módulo CSS:
1. Incorporar una barra de herramientas (`.orphanToolbar`) arriba del grid de tarjetas con:
   - Input de búsqueda reactiva por nombre o código de producto.
   - Select de filtrado por tipo: "Todos (X)", "Comercial" y "WIP / Tanque".
2. Mostrar un mensaje vacío informativo si la búsqueda no arroja coincidencias.
3. CERO alteraciones a la tarjeta visual ya corregida ni al botón `+ Crear Receta`.
4. CERO modificaciones a backend ni a `page.jsx`.

FUENTES DE VERDAD (MÁXIMO 2 LECTURAS):
- `apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx`
- `apps/web/src/app/catalog/recipes/recipes.module.css` (o CSS module asociado)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 2 LECTURAS, EXACTAMENTE 2 EDICIONES):
- Modificar EXCLUSIVAMENTE los 2 archivos indicados.
- Respetar SRP (componente ≤ 150 líneas).
- CSS Modules puro (prohibido `style={{}}` inline).
- Código 100% JavaScript (.jsx, .js).

ACCIONES ESPECÍFICAS:

1. En `OrphanProductsBanner.jsx`:
   - Importar `useState` de React.
   - Declarar los estados locales de filtrado:
     ```javascript
     const [searchTerm, setSearchTerm] = useState('');
     const [tipoFilter, setTipoFilter] = useState('TODOS');
     ```
   - Filtrar `orphanProducts` en memoria respetando el helper `esWIP` existente:
     ```javascript
     const filteredProducts = (orphanProducts || []).filter((p) => {
       const term = searchTerm.trim().toLowerCase();
       const matchSearch =
         !term ||
         p.nombre?.toLowerCase().includes(term) ||
         p.codigo?.toLowerCase().includes(term);

       const isWip = esWIP(p);
       const matchTipo =
         tipoFilter === 'TODOS' ||
         (tipoFilter === 'WIP' && isWip) ||
         (tipoFilter === 'COMERCIAL' && !isWip);

       return matchSearch && matchTipo;
     });
     ```
   - Renderizar la barra de herramientas directamente arriba de `.orphanGrid`:
     ```jsx
     <div className={styles.orphanToolbar}>
       <input
         type="search"
         placeholder="Buscar por nombre o código..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className={styles.orphanSearch}
         aria-label="Buscar producto huérfano"
       />
       <select
         value={tipoFilter}
         onChange={(e) => setTipoFilter(e.target.value)}
         className={styles.orphanFilter}
         aria-label="Filtrar por tipo"
       >
         <option value="TODOS">Todos ({orphanProducts?.length || 0})</option>
         <option value="COMERCIAL">Comercial</option>
         <option value="WIP">WIP / Tanque</option>
       </select>
     </div>
     ```
   - Reemplazar el mapeo de `orphanProducts.map(...)` por `filteredProducts.map(...)`.
   - Si `filteredProducts.length === 0`, renderizar:
     ```jsx
     <div className={styles.orphanEmpty}>
       No hay productos que coincidan con la búsqueda "{searchTerm}".
     </div>
     ```

2. En el archivo CSS Module (`recipes.module.css`):
   - Agregar los estilos limpios de la barra de herramientas:
     ```css
     .orphanToolbar {
       display: flex;
       gap: 0.75rem;
       margin: 0.85rem 0;
       align-items: center;
     }

     .orphanSearch {
       flex: 1;
       padding: 0.5rem 0.85rem;
       border: 1px solid #d1d5db;
       border-radius: 6px;
       font-size: 0.85rem;
       color: #182622;
       background: #ffffff;
       outline: none;
       transition: border-color 0.15s ease;
     }

     .orphanSearch:focus {
       border-color: #166534;
     }

     .orphanFilter {
       padding: 0.5rem 0.85rem;
       border: 1px solid #d1d5db;
       border-radius: 6px;
       font-size: 0.85rem;
       color: #182622;
       background: #ffffff;
       cursor: pointer;
       outline: none;
     }

     .orphanFilter:focus {
       border-color: #166534;
     }

     .orphanEmpty {
       text-align: center;
       padding: 2rem 1rem;
       color: #64748b;
       font-size: 0.88rem;
       font-style: italic;
       background: #f8fafc;
       border-radius: 6px;
       border: 1px dashed #cbd5e1;
     }
     ```

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Buscador funcional en vivo.
- Filtro dropdown reactivo ("Todos", "Comercial", "WIP").
- Conteo dinámico en la opción "Todos".
- `verify-srp.js` retorna código 0.
- DETENTE inmediatamente tras reportar.

REPORTE REQUERIDO:
- Archivos modificados y líneas totales.
- Verificación con código 0.
- Estado: [COMPLETADO / BLOQUEADO].
