TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar la lógica inteligente de abastecimiento comercial al hacer clic en "+ Disparar Lista de Compra" desde la orden de producción (`ProductionOrderForm.jsx` y su servicio de compras):
1. Resolver proveedor preferente/último precio y presentación comercial de empaque desde el catálogo de tarifas/precios de insumos.
2. Calcular paquetes/empaques enteros usando redondeo hacia arriba (`Math.ceil(faltante / contenidoEmpaque)`), erradicando cantidades fraccionarias/decimales de compra.
3. Precargar en el Checklist de Compras el proveedor, la presentación (ej: "ENVASE x 330 g"), la cantidad de unidades enteras (ej: 1) y el precio de empaque real.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/production/components/ProductionOrderForm.jsx` (o hook/action que despacha la lista)
2. `apps/web/src/app/purchases/services/shoppingListService.js` (o servicio que genera el checklist de faltantes)

INSTRUCCIONES TÉCNICAS:

1. Al generar la lista de compras desde faltantes de producción:
   - Para cada insumo con `faltante > 0`:
     * Consultar la tarifa activa del insumo (`supplierPrices` o `preciosInsumos`):
       - Identificar `presentacionCompra` (ej: 330 g), `proveedor` (ej: "D1") y `precioEmpaque` (ej: 7600).
     * Si el insumo cuenta con tamaño de empaque comercial definido (`capacidadEmpaque > 0`):
       - `unidadesAComprar = Math.ceil(faltante / capacidadEmpaque);`
       - `cantidadTotalBodega = unidadesAComprar * capacidadEmpaque;`
       - `precioTotalEstimado = unidadesAComprar * precioEmpaque;`
     * Si no tiene presentación definida (fallback):
       - `unidadesAComprar = Math.ceil(faltante);`
   - Inyectar en el payload del checklist de compras:
     * `proveedorNombre`: nombre del proveedor asignado (ej: "D1").
     * `presentacionNombre`: nombre de la presentación (ej: "ENVASE x 330 g").
     * `cantidadSolicitada`: `unidadesAComprar` (entero sin decimales).
     * `precioEmpaque`: precio unitario del paquete.
     * `subtotal`: `precioTotalEstimado`.
2. En la navegación:
   - Abrir en nueva pestaña o redirigir directamente al Checklist de Compras (`/purchases/checklist?id=...` o modal activo) con los datos precargados.
3. Respetar estrictamente el límite SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/ProductionOrderForm.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Para un faltante de 86.67 g de Yogur Griego, la lista de compras solicita 1 envase de 330 g a D1 por $7.600 (no 86.666 g a $0 sin proveedor).
- La lista abre directamente en compras con los datos correctos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.