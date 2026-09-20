TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Asegurar que la deducción de inóculo por mezcla FEFO multi-lote seleccionada por el operario se transmita y ejecute efectivamente en la tabla `Lote` al liquidar la producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx` (o hook de liquidación `useProductionPageData.js`)
2. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Frontend (`ProductionOrderCompleteModal.jsx` / `useProductionPageData.js`):
   - Al confirmar la liquidación, capturar la estrategia de asignación definida en la orden (ej. `order.asignacionInoculo` o `estrategiaInoculo`):
     * Si la estrategia es 'MEZCLA', armar el array de deducción:
       `desgloseLotes: [{ idLote, litrosADescontar }, ...]`
     * Si la estrategia es 'LOTE_UNICO', enviar el lote único:
       `desgloseLotes: [{ idLote: selectedLotId, litrosADescontar: totalLitrosConsumidos }]`
   - Incluir `desgloseLotes` en el cuerpo de la petición enviada a la API.

2. Backend (`production.repository.js` en `completeProduction`):
   - Al procesar la deducción de inventario de semielaborados WIP:
     * Si `data.desgloseLotes` viene presente y contiene elementos:
       - Iterar sobre cada elemento:
         ```javascript
         for (const asignacion of data.desgloseLotes) {
           const cantLitros = Number(asignacion.litrosADescontar);
           if (cantLitros > 0 && asignacion.idLote) {
             await prisma.lote.update({
               where: { id: asignacion.idLote },
               data: {
                 cantidadActual: { decrement: cantLitros }
               }
             });
           }
         }
         ```
     * Si no viene `desgloseLotes`, aplicar el descuento FEFO automático sobre los lotes con saldo de ese semielaborado hasta agotar la cantidad consumida.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al liquidar con opción de Mezclar FEFO:
  * El lote `d620c865` descuenta sus 4 Litros (quedando en 0 L o cerrándose).
  * El lote `21357fa3` descuenta los 2 Litros restantes (pasando de 8 L a 6 L).
- La pestaña "Semielaborados & Cepas (WIP)" refleja los saldos descontados en tiempo real.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.