TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la fórmula de costeo de bases intermedias e inóculos (WIP) en el BOM de Recetas para dividir entre 1.000 cuando la cantidad requerida esté expresada en gramos ('g') o mililitros ('ml'):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente/helper de costeo de recetas (`RecipeForm.jsx`, `RecipeCostSummary.jsx` o donde se computa `costoBasesIntermedias`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/recipes/components/RecipeCostSummary.jsx` (o componente/helper de cálculo de costos de receta)

INSTRUCCIONES TÉCNICAS:

1. En el cómputo de costos de insumos y bases intermedias del BOM:
   - Al calcular el subtotal por ingrediente/base:
     ```javascript
     let factorUnidad = 1;
     const unidad = String(item.unidad || item.unidadMedida || '').toLowerCase();
     
     // Si la receta usa 'g' o 'ml' y el insumo o base está valorizado por Litro o Kg:
     if (unidad === 'g' || unidad === 'ml') {
       factorUnidad = 0.001; // divide entre 1000
     }
     
     // Costo unitario por L/Kg:
     const costoUnitario = Number(item.costoUnitario || item.costoPromedio || item.precio || 0);
     const cantidad = Number(item.cantidadRequerida || item.cantidad || 0);
     const mermaFactor = 1 + (Number(item.mermaPorcentaje || 0) / 100);
     
     const subtotalItem = cantidad * factorUnidad * costoUnitario * mermaFactor;
     ```
   - Si se trata de `CULTIVO INICIADOR / INÓCULO LÁCTICO (WIP)` con costo promedio unitario registrado por litro (ej. ~$3.500 - $4.500/L), los 500 g deben costar:
     $500 \times 0.001 \times 4.000 = \$ 2.000$.
   - Recalcular `costoTotalBatch = costoMateriasPrimas + costoBasesIntermedias`.
   - Recalcular `costoUnitarioProyectado = costoTotalBatch / rendimientoCantidad`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check <archivo_modificado>`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Con 500 g de inóculo, el valor de "Bases intermedias (WIP)" baja de $58.271 a una cifra coherente (alrededor de$ 2.000 - $2.500). - Desaparece la falsa alerta roja de sobrecosto (+$ 18.054).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.