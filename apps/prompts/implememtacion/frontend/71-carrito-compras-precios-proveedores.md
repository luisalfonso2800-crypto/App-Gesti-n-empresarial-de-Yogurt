TAREA CONTROLADA — LISTA DE COMPRAS TEMPORAL (CARRITO) EN PRECIOS DE PROVEEDORES

OBJETIVO
Transformar la acción "Comprar" en `apps/web/src/app/catalog/supplier-prices/` en una selección para lista de compra:
1. Al hacer clic en "Comprar", agregar el insumo a una lista/carrito de compras temporal persistido en estado local/sessionStorage.
2. Manejar exclusividad de selección:
   - NO permitir añadir el mismo insumo más de una vez si corresponde al mismo proveedor (cambiar el botón a estado deshabilitado: "✓ Añadido").
   - SI permitir añadir el mismo insumo si proviene de un proveedor diferente (cotización o alternativa distinta).
3. Mostrar un indicador flotante o barra superior con el conteo de ítems seleccionados y un botón "Ir a Compras (X)" para transferirlos a la orden de compra.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/catalog/supplier-prices/page.jsx
- apps/web/src/app/catalog/supplier-prices/supplier-prices.module.css

REGLAS TÉCNICAS OBLIGATORIAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. El estado de la lista debe identificarse de forma única mediante la combinación `idInsumo + '_' + idProveedor` (o `idPrecioProveedor`).

ALCANCE PUNTUAL

1. Estado del Carrito / Lista de Compra:
   - Crear un estado `selectedForPurchase` (guardado en React State y opcionalmente sincronizado con `sessionStorage`).
   - Cada elemento guardará: `{ idPrecio, idInsumo, nombreInsumo, idProveedor, nombreProveedor, presentacion, precioCompra, costoUnidadBase }`.

2. Reglas de Validación al Hacer Clic en "Comprar":
   - Evaluar si el `idPrecio` específico (mismo insumo + mismo proveedor) ya está en `selectedForPurchase`.
   - Si YA está presente: no duplicar.
   - Si NO está presente: agregarlo a la lista.
   - Si el insumo ya existe en la lista pero pertenece a OTRO proveedor, se permite la adición normalmente.

3. Comportamiento Visual del Botón:
   - Si la fila actual ya se encuentra añadida:
     * El botón debe mostrarse en tono verde tenue o deshabilitado con el texto "✓ Añadido".
     * Ofrecer opción de clic para remover ("Quitar") o mantenerlo deshabilitado para evitar duplicaciones accidentales.
   - Si no está añadida:
     * Botón regular "Comprar".

4. Barra Flotante / Badge de Lista de Compra:
   - Cuando haya al menos 1 ítem en la lista, mostrar en la parte superior o inferior fija:
     * Texto: "X insumos seleccionados para compra".
     * Botón "Vaciar lista".
     * Botón principal "Continuar a Orden de Compra" que redirija a `/operations/purchases/new` transmitiendo los ítems seleccionados (vía URL query params o `sessionStorage`).

VALIDACIÓN
- Comprobar que `pnpm --filter web build` compile con código 0 sin errores de estilos ni de imports.

FORMATO DE CIERRE
Entregar exclusivamente el reporte estándar indicando estado, componentes ajustados y confirmación de build limpio.