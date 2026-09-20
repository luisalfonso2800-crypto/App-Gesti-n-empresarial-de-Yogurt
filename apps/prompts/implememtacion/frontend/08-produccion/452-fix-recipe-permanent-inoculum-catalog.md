TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Garantizar que el ítem maestro "🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)" esté SIEMPRE disponible en el selector de formulación de recetas, independientemente de que existan o no existencias físicas en la cava:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/products/products.repository.js` (en `findIntermediates`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `findIntermediates()` de `products.repository.js`:
   - Asegurar que la categoría `Iniciadores y Cepas (Inóculo WIP)` incluya de forma estática/permanente el ítem maestro estándar:
     ```javascript
     const itemInoculoMaestro = {
       id: 'INOCULO_BASE_WIP', // ID persistente del producto maestro inóculo
       nombre: '🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)',
       tipoItem: 'INOCULO_WIP',
       categoria: 'INOCULO_WIP',
       unidadMedida: 'g',
       unidad: 'g'
     };
     ```
   - Si no existen lotes físicos en `prisma.lote` con `tipoLote: 'SEMIELABORADO_WIP'`, DE TODAS FORMAS retornar `itemInoculoMaestro` en el array de inóculos disponibles para recetas.
   - Jamás dejar la categoría vacía por falta de inventario físico momentáneo.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir el selector de ingredientes en cualquier etapa de Recetas, la sección "Iniciadores y Cepas (Inóculo WIP)" contiene siempre la opción "🧫 CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)".
- Permite seleccionar el inóculo y guardar la receta aunque el inventario de semielaborados esté en cero.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.