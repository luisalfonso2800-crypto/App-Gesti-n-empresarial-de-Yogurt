TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar el cálculo de linaje generacional (F0 a F4), el bloqueo automático de reserva de inóculo en F4, y rediseñar la visualización genealógica en la tabla de Lotes:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js` (cálculo de generación F0..F4 y bloqueo de reserva en F4)
2. `apps/web/src/app/operations/lots/components/LotsTable.jsx` (o componente de la tabla de Lotes)

INSTRUCCIONES TÉCNICAS:

1. Backend (`production.repository.js`):
   - Al crear o liquidar una orden de producción:
     * Si la orden usa un `loteIniciadorId`:
       - Consultar la generación del lote padre (`padre.generacion || 0`).
       - Asignar al nuevo lote: `generacion = padre.generacion + 1`.
     * Si no tiene lote padre o es inóculo comercial virgen:
       - Asignar `generacion = 0`.
     * **Poka-Yoke Límite F4:**
       - Si `generacion >= 4`: forzar `litrosAReservar = 0`, rechazar cualquier intento de crear un lote hijo derivado (`tipoLote: 'SEMIELABORADO_WIP'`) y asignar el 100% del volumen a comercial/cava.
   - En la consulta de lotes (`findMany`):
     * Retornar `generacion`, `codigoLote`, y la cadena de ancestros (`linaje: ['COMERCIAL', 'LOTE_A', 'LOTE_B']`).

2. Frontend (`LotsTable.jsx` y modal de liquidación):
   - En el modal de liquidación (`ProductionOrderCompleteModal.jsx`):
     * Si el lote padre era F3 (lo que produce un F4):
       Deshabilitar el checkbox de reserva de inóculo mostrando aviso: "🚫 Generación F4 alcanzada: Límite de resiembra superado. No apto para inóculo."
   - En la tabla de Lotes (`LotsTable.jsx`):
     * Añadir columna o badge de linaje:
       - `F0`: `<span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-bold">F0 (Madre)</span>`
       - `F1..F3`: `<span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-bold">Pase ${gen}/4 (F${gen})</span>`
       - `F4`: `<span className="px-2 py-0.5 rounded text-xs bg-rose-100 text-rose-800 font-bold">F4 (Fin de Línea)</span>`
     * Mostrar debajo del código la ruta: `ancestro1 ➔ ancestro2 ➔ actual`.
     * Incluir filtro rápido: `[x] Ocultar agotados (0 L)`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/web/src/app/operations/lots/components/...`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Cada lote muestra su generación (F0 a F4) y su linaje claro.
- Un lote F4 queda estrictamente bloqueado para generar nuevos inóculos.
- Los lotes en 0 pueden ocultarse para limpiar la vista.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.