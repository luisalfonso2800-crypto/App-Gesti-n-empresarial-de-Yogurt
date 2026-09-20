TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Habilitar en tiempo real y persistir los campos de Precio de Venta y Escala Mayorista cuando una Base Intermedia (WIP) cambie su Canal de Venta a Mixto, B2B o Comercial Completo:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalogs/products/components/ProductModal.jsx` (o hook `useProductFormState.js` / `useProductForm.js`)
2. `apps/api/src/products/products.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Frontend (`ProductModal.jsx` / `useProductFormState.js`):
   - Definir la visibilidad reactiva de los precios:
     ```javascript
     const canalesConPrecio = ['MIXTO', 'B2B', 'B2C', 'COMERCIAL_COMPLETO'];
     const showPricingFields = 
       formData.tipoProducto === 'PRODUCTO_TERMINADO' || 
       canalesConPrecio.includes(formData.canalVenta);
     ```
   - Al cambiar el `<select>` de `canalVenta` a cualquiera de estas opciones comerciales, renderizar de inmediato:
     * `PRECIO DE VENTA ($)` y `MARGEN OBJETIVO (%)`
     * `ProductWholesaleSection` (Tarifa y Escala Mayorista)
   - Asegurar que al enviar el formulario (`onSubmit`), los valores `canalVenta`, `precioVenta`, `margenObjetivo`, `precioMayorista` y `cantidadMinimaMayorista` se incluyan en el payload sin importar que sea `BASE_WIP`.

2. Backend (`products.repository.js`):
   - En el método `update(id, data)` y `create(data)`:
     * Asegurar que `canalVenta`, `precioVenta`, `precioMayorista` y `cantidadMinimaMayorista` se asignen y persistan en la BD incluso si `tipoItem` o categoría es `BASE_WIP` o `BASES_LACTEAS`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalogs/products/components/...`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al cambiar el canal de venta de una Base Intermedia a "Comercial Completo" o "Mixto", se despliegan inmediatamente los campos de precio base y escala mayorista.
- Al pulsar guardar, la base de datos almacena el canal y los precios sin revertirse a Solo Planta.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.