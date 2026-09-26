TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Añadir configuración de precio mayorista (cantidad mínima y selector de descuento 20%, 30%, 40% o manual) en el formulario de Producto para productos comerciales y bases intermedias mixtas:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js` (o servicio donde se persisten los campos del producto)
2. `apps/web/src/app/catalogs/products/components/ProductFormModal.jsx` (o modal de crear/editar producto)

INSTRUCCIONES TÉCNICAS:

1. Modelo de Datos y Backend (`products.repository.js`):
   - Persistir en el producto los campos:
     * `precioMayorista`: Float/Int (opcional o default null).
     * `cantidadMinimaMayorista`: Float/Int (default 12).
     * `descuentoMayoristaPorcentaje`: Float (opcional).

2. Frontend (`ProductFormModal.jsx`):
   - Renderizar el bloque "Tarifa y Escala Mayorista" si:
     * Es `PRODUCTO_TERMINADO` / `Producto Comercial Envasado`, O
     * Es `BASE_WIP` pero con `canalVenta` diferente de `SOLO_PLANTA` (ej. `MIXTO`, `B2B`, `COMERCIAL_COMPLETO`).
   - Componentes del bloque:
     * Input `Cantidad Mínima Mayorista` (numérico, default 12).
     * Botones de descuento rápido: `[20%]`, `[25%]`, `[30%]`, `[40%]`.
       Al hacer clic en una píldora:
       `precioMayorista = Math.round(precioVenta * (1 - porcentaje / 100));`
     * Input `Precio Mayorista ($)` editable manualmente. Si el usuario escribe manualmente, desmarcar las píldoras de porcentaje.
     * Mensaje de ayuda en texto natural mostrando el valor por unidad y el porcentaje de rebaja.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalogs/products/components/...`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al crear/editar productos envasados o bases intermedias con canal mixto, se puede definir la cantidad mínima y el precio mayorista.
- Las píldoras de porcentaje (20%, 30%, etc.) calculan el precio en tiempo real.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.