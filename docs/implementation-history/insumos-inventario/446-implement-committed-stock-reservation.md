TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar la reserva de stock comprometido para insumos de bodega y semielaborados WIP durante órdenes en proceso, impidiendo lanzar producciones con insumos fantasma:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.service.js` (cálculo de disponibilidad neta = físico - comprometido)
2. `apps/api/src/production/production.repository.js` (gestión de stock comprometido en creación/liquidación)

INSTRUCCIONES TÉCNICAS:

1. Backend (`production.service.js`):
   - Al calcular la disponibilidad de insumos para validar un nuevo lote o mostrar el BOM:
     * Consultar la sumatoria de insumos requeridos por todas las órdenes activas en estado `EN_PROCESO`, `PLANIFICADA` o `EN_FERMENTACION`:
       `stockComprometido = sum(detalleProduccion.cantidadTeorica)` para ese insumo o lote WIP en órdenes no finalizadas.
     * Calcular `stockDisponible = Math.max(0, stockFisico - stockComprometido)`.
     * Utilizar `stockDisponible` como la cifra de cotejo para determinar si el insumo es "Suficiente" o "Insuficiente".
     * Si `stockDisponible < reqTeorico`, bloquear el lanzamiento de la nueva orden marcándola como insuficiente.

2. Liquidación y Cierre (`production.repository.js`):
   - Al ejecutar `completeProduction()`:
     * El descuento físico de bodega y de lotes WIP (`Lote.cantidadActual`) se realiza sobre el inventario físico real.
     * Al pasar la orden a `FINALIZADA` o `LIQUIDADA`, sus insumos dejan de sumar al `stockComprometido`.
   - Si una orden en proceso se cancela, su stock comprometido se desliga inmediatamente.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.service.js`
2. `node --check apps/api/src/production/production.repository.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al tener una orden activa en planta, sus insumos requeridos quedan retenidos/comprometidos.
- Una nueva orden evaluará únicamente el stock remanente libre; si no alcanza, no permite su creación.
- No se pueden generar órdenes simultáneas que compartan insumos que no existen físicamente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.