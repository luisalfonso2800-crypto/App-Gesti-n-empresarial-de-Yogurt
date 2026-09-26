TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir el cálculo del costo unitario de la base láctea en el BOM de planificación de producción para que use el costo real por litro (ej. ~$3.407/L) y no el costo total o valor inflado ($3.406.667):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.service.js` (o servicio donde se calcula el BOM / estimación de costos)
2. `apps/api/src/inventory/inventory.service.js` (o migración/script de ajuste de costo unitario para la base intermedia)

INSTRUCCIONES TÉCNICAS:

1. Normalizar Costo Unitario de Insumos/Bases en BOM (`production.service.js`):
   - Al iterar los ingredientes de la receta para armar el BOM:
     * Si el ingrediente es una base interna (WIP/Cava), obtener el costo por litro real:
       ```javascript
       let costoLitro = Number(lote.costoUnitario || inventario.costoPromedio || base.costoUnitario || 0);
       // Si se detecta que el valor almacenado corresponde al lote completo y no al litro:
       if (costoLitro > 50000 && lote.cantidadInicial > 0) {
         costoLitro = costoLitro / Number(lote.cantidadInicial);
       }
       // Sanity check para bases lácteas si viene en cero o corrupto:
       if (costoLitro <= 0 || costoLitro > 50000) {
         costoLitro = 3400; // Valor de referencia estándar por litro de base de yogurt
       }
       ```
     * Calcular subtotal: `subtotal = reqTeorico * costoLitro;`
     * Costo total estimado: suma de los subtotales de materiales.
     * Costo unitario proyectado: `costoTotalEstimado / cantidadUnidades`.

2. Corregir Registro Corrupto en Base de Datos:
   - Normalizar el costo unitario del lote o producto base `YOGURT BASE INICIADOR YOGURT COMERCIAL (Base / WIP)` actualizando su campo `costoUnitario` a `3406.67` en lugar de `3406667`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.service.js`
2. `pnpm --filter api build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al abrir la planificación de 6 unidades de Fórmula - YOGURT PURO, el costo unitario de los 3 litros de base ronda los $3.407/L.
- El costo total estimado del lote de 6 unidades se sitúa en torno a $10.220 - $12.000 COP (y no diez millones).
- El costo unitario proyectado por unidad queda en ~$1.700 - $2.000 COP.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
