TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer visible el lote de inóculo reservado y el desglose de volumen tanto en la Bitácora de Fabricación como en la pantalla de Trazabilidad de Lotes:
1. En la tarjeta de la Bitácora (`ProductionOrderCard.jsx`): Si la orden tiene registrada reserva de inóculo o un lote hijo en base de datos, desglosar "Disponible para Envasar: X L" e "Iniciador Guardado: Y L (Código Lote Hijo)".
2. En la vista de Trazabilidad de Lotes (`LotsView.jsx` o componente de tabla de lotes y su servicio): Permitir listar los lotes tipo `SEMIELABORADO_WIP` (Inóculos) mostrando su badge identificador "🧫 Iniciador Interno", su lote padre de origen, unidad ("Litros") y costo unitario formateado en moneda entera COP ($ 4.390).

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo indicado y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx` (o donde se renderiza el lote en la bitácora)
2. `apps/web/src/app/inventory/lots/components/LotsTable.jsx` (o vista de la tabla de Trazabilidad de Lotes)

INSTRUCCIONES TÉCNICAS:

1. En `ProductionOrderCard.jsx`:
   - Verificar si `order.reservaInoculo?.cantidad > 0` o si existen `order.lotesHijos?.length > 0`:
     * Si existe inóculo:
       - Calcular: `volumenEnvasar = order.cantidadReal - (order.reservaInoculo?.cantidad || order.lotesHijos[0]?.cantidadInicial)`.
       - Renderizar dos bloques visuales claros:
         1. `🥛 Disponible para Envasar`: `{volumenEnvasar} Litros`.
         2. `🧫 Iniciador Guardado`: `{volumenInoculo} Litros ({codigoLoteHijo})`.
     * Si no hubo división: mantener el bloque único tradicional `{volumenReal} Litros obtenidos`.
   - Formatear números enteros sin decimales superfluos.
   - Respetar límite estricto SRP (< 135 líneas).

2. En `LotsTable.jsx` (Trazabilidad de Lotes):
   - Asegurar que la consulta incluya o muestre los lotes derivados de producción (`tipoLote === 'SEMIELABORADO_WIP'` o inóculos).
   - En la fila del lote:
     * Si es inóculo, mostrar badge distintivo: `<span className={styles.badgeInoculum}>🧫 INICIADOR (Hijo de {lote.lotePadre?.codigo || 'Lote'})</span>`.
     * En "Unidades Restantes": concatenar la unidad de medida (`{lote.cantidadActual} Litros` o `g`, nunca solo `5 / 5`).
     * En "Costo U.": formatear como moneda entera COP institucional: `$ ${Math.round(lote.costoUnitario).toLocaleString('es-CO')}` (ej: `$ 4.390` en vez de `$4389,58`).
   - Respetar límite estricto SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La bitácora desglosa claramente cuánto quedó para envasar y cuánto se apartó como iniciador.
- La tabla de trazabilidad muestra el lote de inóculo con su procedencia, unidad ("Litros") y costo unitario sin decimales.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.