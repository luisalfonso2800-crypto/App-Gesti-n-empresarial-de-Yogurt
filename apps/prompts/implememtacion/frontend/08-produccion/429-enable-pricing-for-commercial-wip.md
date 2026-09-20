TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Permitir el ingreso de Precio de Venta y Margen Objetivo en productos Base Intermedia / Tanque (WIP) cuando el canal de venta incluya comercialización directa o mixta:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo del formulario/modal de productos (`ProductModal.jsx` o su subcomponente de campos de precio/margen) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. En el archivo responsable de renderizar los inputs de `precioVenta` y `margenObjetivo`:
   - Evaluar si los campos de precio deben ser visibles:
     ```javascript
     const isPureInternalPlant = formData.canalVenta === 'USO_INTERNO' || formData.canalVenta === 'PLANTA';
     const showPricingFields = !isWip || !isPureInternalPlant || formData.canalVenta?.includes('MIXTO') || formData.canalVenta?.includes('VENTA');
     ```
   - Asegurar que cuando `showPricingFields` sea verdadero:
     * Se rendericen los inputs de `PRECIO DE VENTA ($)` y `MARGEN OBJETIVO (%)`.
     * No se limpien a 0 si el usuario cambia entre pestañas o selecciona el canal 'Mixto (Base de Planta + Venta Directa)'.
   - Si el canal es estrictamente `Solo Planta / Transformación (Uso Interno)`, se puede mostrar la leyenda informativa: "Exclusivo para consumo interno de planta. No genera precio al público".
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx` (o archivo modificado)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- En la pestaña "Base Intermedia / Tanque (WIP)", al seleccionar "Mixto (Base de Planta + Venta Directa)", se hacen visibles los campos de Precio de Venta y Margen Objetivo.
- Los valores ingresados se guardan y persisten al editar el producto.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.