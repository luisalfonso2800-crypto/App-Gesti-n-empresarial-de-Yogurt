TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Corregir el error de invocación de Prisma (`prisma.produccion.findUnique`) al liquidar la producción con reserva de inóculo:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx` (o hook de liquidación correspondiente)

INSTRUCCIONES TÉCNICAS:

1. En `apps/api/src/production/production.repository.js` (método `completeProduction`):
   - Validar que el identificador exista antes de invocar Prisma:
     ```javascript
     const targetId = id || data?.id || data?.idProduccion || data?.ordenId;
     if (!targetId) {
       throw new Error('Identificador de orden de producción no proporcionado o inválido');
     }
     ```
   - Verificar la cláusula `where` en `prisma.produccion.findUnique`:
     ```javascript
     const produccion = await prisma.produccion.findUnique({
       where: { id: targetId },
       include: { receta: true, detalles: true }
     });
     ```
   - Al registrar la reserva de inóculo (cuando `data.reservarInoculo` sea true):
     * Crear el lote de inóculo con `tipoLote: 'SEMIELABORADO_WIP'`.
     * Asignar la cantidad reservada (ej. 4 Litros) y heredar el costo unitario del batch.
     * Crear el lote remanente para disponibilidad/venta (ej. 15 Litros).

2. En el frontend (`ProductionOrderCompleteModal.jsx` o hook de liquidación):
   - Asegurar que al presionar "Confirmar Liquidación y Entrada a Stock":
     * Se envíe el `id` explícito de la producción tanto en la URL de la petición (`POST /production/:id/complete` o `PUT /production/:id/liquidate`) como en el cuerpo (`body.id`).
     * No enviar payloads con `id: undefined`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La liquidación de los 19 Litros (15 L venta + 4 L inóculo) se ejecuta sin errores de Prisma.
- Desaparece el diálogo nativo de alert con `Invalid prisma.produccion.findUnique()`.
- Se generan los dos lotes y se descuentan los 19.000 ml de leche y 1.900 g de cultivo iniciador.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.