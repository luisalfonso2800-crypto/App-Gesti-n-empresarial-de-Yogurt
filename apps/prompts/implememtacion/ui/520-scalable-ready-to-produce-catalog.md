TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Rediseñar la sección "Productos Formulados Listos para Producir" en `apps/web/src/app/operations/production/` para soportar un volumen alto de productos (escalabilidad a decenas de recetas) sin desplazar verticalmente las órdenes activas en planta:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- Modificar EXCLUSIVAMENTE el componente que renderiza la lista de productos listos para producir (ej. `ReadyToProduceSection.jsx`, `ProductionReadyList.jsx` o en la carpeta `components/` de producción).

INSTRUCCIONES DE DISEÑO Y ESCALABILIDAD:

1. Cabecera con Controles de Búsqueda y Filtro:
   - Mantener el título "Productos Formulados Listos para Producir" y el badge de cantidad ("X disponibles").
   - Agregar en la misma cabecera:
     * Campo de búsqueda rápida (`input text`) con icono de lupa para filtrar por nombre en tiempo real.
     * Selector compacto de categoría/tipo (Todos, Envasados, Bases/Tanque).
     * Botón para colapsar/expandir la sección (toggle acordeón), permitiendo ocultarla si el operario solo necesita monitorear los tanques activos.

2. Contenedor de Tarjetas con Límite Vertical (Scroll Contenido):
   - Eliminar el scrollbar horizontal (`overflow-x-auto`).
   - Disponer los productos en una cuadrícula responsiva:
     `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3`
   - Aplicar una altura máxima con scroll vertical suave (`max-h-80 overflow-y-auto pr-1`) para que, sin importar si hay 5 o 50 productos, la sección ocupe un espacio visual controlado y predecible.

3. Tarjeta de Producto Optimizada para Reconocimiento Visual:
   - Disposición vertical:
     * Imagen superior: Contenedor con altura fija (`h-28` o `h-32`), esquinas superiores redondeadas, fondo neutral, con `object-cover` centrado para identificar de inmediato la etiqueta y el envase.
     * Fallback con icono visible si no tiene imagen asignada.
     * Nombre del producto legible (`font-medium text-xs sm:text-sm line-clamp-2 min-h-[2rem]`).
     * Stock en Cava destacado (`📦 En Cava: X und` o `L`).
     * Botón "▶ Producir Lote" a ancho completo (`w-full py-1.5 text-xs font-semibold`).

4. Restricciones Técnicas:
   - Mantener intactas las props y los handlers de click (`onProduce`, selección de receta).
   - Respetar el límite de líneas SRP (< 135 líneas por archivo; modularizar si es necesario).

VERIFICACIÓN:
1. `node --check <archivo_modificado>`
2. `pnpm --filter web build`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- La vista permite buscar y filtrar productos al instante.
- Las imágenes son nítidas y de buen tamaño.
- La sección no empuja desmedidamente hacia abajo las órdenes activas de fabricación.
- `verify-srp` retorna 0 infracciones.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
