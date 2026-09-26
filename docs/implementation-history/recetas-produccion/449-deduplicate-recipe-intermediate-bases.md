TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Limpiar y deduplicar el catálogo de "Bases Lácteas a Granel (WIP)" en el selector de recetas para mostrar única y exclusivamente los 2 productos reales de Cava, eliminando sufijos y variantes artificiales:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/products/products.repository.js` (en `findIntermediates`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `findIntermediates()` de `products.repository.js`:
   - Al consultar productos para la categoría `Bases Lácteas a Granel (WIP)`:
     * Consultar únicamente registros maestros de `prisma.producto` con categoría `BASES_LACTEAS` o `INTERMEDIO_WIP`.
     * NO concatenar textos de presentaciones ni duplicar filas por cada presentación (`(Base a Granel - Litros)`, `(YOGURT A GRANEL)`).
     * Normalizar los nombres removiendo cualquier sufijo entre paréntesis o guiones de presentación:
       `nombreLimpio = p.nombre.replace(/\s*\(.*?\)/g, '').replace(/\s*-\s*YOGURT A GRANEL/i, '').trim();`
     * Deduplicar la lista resultante por `nombreLimpio` (quedándose con el ID principal asociado al inventario de Cava).
     * Retornar un listado limpio donde cada base aparezca EXACTAMENTE UNA VEZ con su nombre estándar y unidad 'Litros' o 'L'.

2. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El selector en la vista de Recetas despliega exactamente 2 bases lácteas limpias sin duplicados ni sufijos repetitivos.
- Los IDs coinciden directamente con el inventario de Cava.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.