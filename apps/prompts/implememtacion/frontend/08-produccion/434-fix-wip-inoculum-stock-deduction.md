TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Asegurar que al liquidar una producción, los consumos de iniciadores/bases intermedias (WIP) descuenten automáticamente el stock del lote semielaborado correspondiente en la tabla `Lotes`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `apps/api/src/production/production.repository.js` alrededor del bucle de liquidación de consumos y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `completeProduction()` de `production.repository.js`:
   - Al procesar cada detalle de consumo real:
     * Verificar si el consumo corresponde a un producto intermedio/WIP (`detalle.idProductoIntermedio` o el producto es de tipo 'INTERMEDIO_WIP' / 'BASES_LACTEAS').
     * Si es un intermedio WIP, buscar el lote semielaborado activo en `prisma.lote` (`where: { idProducto: detalle.idProductoIntermedio, tipoLote: 'SEMIELABORADO_WIP' }`, ordenado por FEFO o el especificado en la orden).
     * Convertir la cantidad consumida si las unidades difieren:
       Si el detalle se consumió en 'g' y el lote está en litros, `consumoEnLitros = Number(qtyReal) / 1000`.
     * Descontar el saldo del lote semielaborado:
       ```javascript
       await prisma.lote.update({
         where: { id: loteWip.id },
         data: {
           cantidadActual: Math.max(0, Number(loteWip.cantidadActual) - consumoEnLitros)
         }
       });
       ```
     * Si el saldo restante llega a 0, actualizar opcionalmente su estado.
   - Para insumos estándar de bodega, mantener la deducción habitual sobre el inventario de insumos.
   - Respetar el límite de líneas SRP (< 135 líneas o límite modular del proyecto).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al liquidar consumos de inóculos WIP, el stock del lote en la Bitácora de Inventario (pestaña Semielaborados & Cepas WIP) se actualiza reflejando la resta exacta.
- En el caso actual, el lote `fad038d5` pasa de 3 Litros a 1.1 Litros (o la cantidad remanente según el consumo aplicado).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.