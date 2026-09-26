TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la resolución de stock en cava en el endpoint/servicio que alimenta las tarjetas de "Productos Formulados Listos para Producir", sincronizándolo con el stock consolidado de Cava (71 Litros):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo donde se mapean las tarjetas formuladas (`apps/api/src/production/production.service.js` o `apps/api/src/recipes/recipes.repository.js`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.service.js` (o servicio que provee los productos formulados a producción)

INSTRUCCIONES TÉCNICAS:

1. Resolución Robusta del Stock en Cava:
   - Al iterar cada producto formulado/receta para calcular `stockCava` o `stockLitros`:
     * Obtener el stock no solo por el `id` estricto del producto de la receta, sino también buscando su contraparte en inventario de cava:
       ```javascript
       // Buscar por coincidencia de ID o por nombre base (removiendo sufijos de presentación/granel)
       const baseName = producto.nombre.replace(/\s*-\s*YOGURT A GRANEL/i, '').trim();
       
       // Buscar en inventario / productos de cava que coincidan con baseName
       const productoCava = await prisma.producto.findFirst({
         where: {
           OR: [
             { id: producto.id },
             { nombre: { contains: baseName, mode: 'insensitive' } }
           ],
           categoria: { in: ['BASES_LACTEAS', 'PRODUCTO_TERMINADO'] }
         },
         include: { inventario: true }
       });
       
       // Si el producto o su inventario tiene stock registrado (ej. 71 L):
       const stockReal = Number(productoCava?.inventario?.stockActual ?? productoCava?.stockActual ?? 0);
       ```
     * Si existen lotes físicos activos en `prisma.lote` asociados a cualquiera de los IDs coincidentes, tomar el mayor entre los lotes sumados y el stock del inventario.
     * Asignar `prod.stockLitros = stockReal` y `prod.stockCava = stockReal`.

2. Respuesta Frontend:
   - Asegurar que la propiedad enviada al frontend (`stockLitros` o `stockCava`) viaje con el valor real (71).
   - En el componente de tarjeta, renderizar: `En Cava: ${Number(item.stockLitros).toFixed(1)} L`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.service.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tarjeta de `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO` en Bitácora de Fabricación muestra `En Cava: 71.0 L`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.