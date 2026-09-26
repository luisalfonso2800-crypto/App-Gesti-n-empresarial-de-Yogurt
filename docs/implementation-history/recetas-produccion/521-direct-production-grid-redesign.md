TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 EDICIONES DIRECTAS - PROHIBIDO LEER CSS O REVISAR MÚLTIPLES ARCHIVOS):
Transformar la sección "Productos Formulados Listos para Producir" del carrusel horizontal a una cuadrícula (grid) responsiva con buscador integrado e imágenes prominentes, interviniendo ÚNICAMENTE los 2 componentes ya identificados.

CLÁUSULA DE CONSUMO MÍNIMO (CERO BUCLES DE LECTURA):
- NO leas ni modifiques archivos `.css` o `.module.css`. Usa clases Tailwind existentes o estilos inline en JSX para evitar infracciones o bucles de verificación.
- Modifica EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`
2. `apps/web/src/app/operations/production/components/ProductionProductLaunchpadCard.jsx`

INSTRUCCIONES TÉCNICAS DIRECTAS:

1. Modificación en `ProductionProductLaunchpad.jsx`:
   - Agregar un estado local `searchTerm` con un `<input type="text" placeholder="Buscar producto formulado..." />` en la barra superior junto al título para filtrar la lista en tiempo real por nombre.
   - Eliminar el contenedor con clases de scroll horizontal (`overflow-x-auto` o flex horizontal).
   - Renderizar las tarjetas dentro de un contenedor en Grid con límite de altura y scroll vertical suave:
     `className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-80 overflow-y-auto pr-1"`
   - Mantener el componente por debajo de 130 líneas (SRP).

2. Modificación en `ProductionProductLaunchpadCard.jsx`:
   - Convertir la estructura interna de la tarjeta de fila horizontal a columna vertical:
     * Contenedor superior de imagen: altura fija (`h-28` o `h-32`), ancho completo (`w-full`), esquinas superiores redondeadas, centrado con `object-cover`. Si no hay imagen, mostrar icono o silueta neutral centrada.
     * Cuerpo inferior:
       - Nombre del producto legible en hasta 2 líneas (`line-clamp-2 min-h-[2.5rem] font-medium text-xs sm:text-sm`).
       - Rótulo de stock en Cava visible.
       - Botón "▶ Producir Lote" a ancho completo (`w-full py-1.5 text-xs font-semibold`) en la base de la tarjeta.
   - Conservar exactamente los mismos handlers y props (`onProduce`, selección de lote).
   - Mantener por debajo de 100 líneas (SRP).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionProductLaunchpad.jsx`
2. `node --check apps/web/src/app/operations/production/components/ProductionProductLaunchpadCard.jsx`
3. `pnpm run verify:srp`

CRITERIO DE FINALIZACIÓN:
- Se reemplaza el scrollbar horizontal por el grid responsivo con scroll vertical contenido y buscador.
- No se ejecutan lecturas repetitivas ni inspecciones de CSS adicionales.
- `verify-srp` retorna 0 infracciones.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
