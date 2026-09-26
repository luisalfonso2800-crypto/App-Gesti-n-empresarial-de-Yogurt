TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 ARCHIVO A MODIFICAR):
Agregar controles de carrusel/paginación (avanzar y retroceder de a 5-6 productos) en la sección "Productos Formulados Listos para Producir", manteniendo la estética de tarjeta vertical limpia lograda recientemente.

ARCHIVO A MODIFICAR:
`apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`

INSTRUCCIONES TÉCNICAS:

1. Estado de Paginación / Carrusel:
   - Definir constante de elementos por vista: `ITEMS_PER_PAGE = 5` o `6`.
   - Crear estado `const [currentPage, setCurrentPage] = useState(0)`.
   - Cuando el usuario use el buscador (`searchTerm`), resetear `currentPage` a 0.
   - Calcular:
     * `totalItems = filteredProducts.length`
     * `totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)`
     * `visibleProducts = filteredProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)`

2. Controles de Navegación en la Cabecera (junto al buscador):
   - A la derecha del input de búsqueda, renderizar controles compactos:
     * Botón anterior: `<button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}> ‹ </button>`
     * Indicador sutil de página: `<span className="text-xs text-slate-500 font-medium"> {currentPage + 1} / {totalPages || 1} </span>`
     * Botón siguiente: `<button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1}> › </button>`
   - Estilizar los botones con fondo neutro, borde suave y estado deshabilitado (`opacity-40 cursor-not-allowed`).

3. Renderizado de Tarjetas:
   - Mapear únicamente `visibleProducts.map(...)`.
   - Mantener el contenedor en grid:
     `style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.875rem' }}`
   - Eliminar el scroll vertical interior (`maxHeight` y `overflowY`) para que la fila se mantenga fija y despejada.

4. Restricción Arquitectural:
   - Mantener el componente por debajo de 125 líneas (SRP).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`
2. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Muestra una fila ordenada de productos.
- Si hay más elementos que el cupo visible, las flechas `‹` y `›` permiten rotar suavemente entre grupos de productos.
- `verify-srp` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
