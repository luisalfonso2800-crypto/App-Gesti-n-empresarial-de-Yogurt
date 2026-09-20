TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la inicialización del modal de producto al entrar en edición para que los productos tipo Base Intermedia (WIP) se abran en la pestaña "Base Intermedia / Tanque (WIP)" y no se conviertan por error en productos comerciales:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez el archivo del formulario/modal de producto (`ProductModal.jsx` o su hook `useProductForm.js` / `useProductModal.js`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. En el archivo responsable del estado y carga de edición del producto (ej. `apps/web/src/app/catalog/products/components/ProductModal.jsx` o su hook correspondiente):
   - Al recibir los datos del producto a editar (`product` / `initialData`):
     * Evaluar si es producto WIP:
       ```javascript
       const isWip = Boolean(
         product?.tipo === 'INTERMEDIO_WIP' ||
         product?.categoria === 'BASES_LACTEAS' ||
         product?.categoria === 'PREMEZCLAS_PLANTA' ||
         product?.canalVenta === 'USO_INTERNO' ||
         product?.canalVenta === 'PLANTA' ||
         product?.presentacion?.nombre?.toUpperCase().includes('GRANEL')
       );
       ```
     * Asegurar que el estado del tab (ej. `activeTab`, `isWipMode` o `selectedType`) se establezca en el modo `WIP` si `isWip` es verdadero.
     * Cargar la presentación, categoría y canal originales del producto sin sobrescribirlos con los valores comerciales por defecto.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductModal.jsx` (o archivo modificado)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al hacer clic en "Editar" sobre cualquier base láctea o producto semielaborado, el modal se abre con el botón "Base Intermedia / Tanque (WIP)" activo.
- Los selectores conservan la categoría de planta, presentación a granel y canal de uso interno sin cambiarse a comerciales.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.