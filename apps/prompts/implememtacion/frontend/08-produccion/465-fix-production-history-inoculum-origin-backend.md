TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Resolver en el backend de producción el verdadero origen del inóculo (Semielaborado vs Comercial) consultando la receta, el lote iniciador y los insumos consumidos, para que el histórico refleje fielmente la trazabilidad:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el método que consulta el histórico de órdenes en `apps/api/src/production/production.repository.js` (o servicio equivalente) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Resolución del Inóculo en la Consulta del Histórico:
   - Al consultar las órdenes de producción (`findMany` para histórico):
     * Incluir la relación con la receta (`receta: { include: { etapas: { include: { insumos: true } } } }`) y el lote iniciador si existe relación.
   - Al mapear cada orden para la respuesta:
     ```javascript
     // 1. Verificar si hay un lote físico de inóculo asignado:
     const loteInoculoCod = orden.loteIniciador?.codigoLote || orden.loteIniciadorId || orden.codigoLoteIniciador;
     
     // 2. Verificar en la receta o fórmula si el ingrediente de inoculación es Semielaborado (WIP):
     const insumoInoculo = orden.receta?.etapas?.flatMap(e => e.insumos || []).find(i => 
       i.categoria === 'INOCULO_WIP' || i.tipoItem === 'INOCULO_WIP' || /semi\s*elaborado|inocuo/i.test(i.nombre || '')
     );
     const esSemielaboradoPorNombre = /semi\s*elaborado/i.test(orden.receta?.nombre || orden.producto?.nombre || '');
     
     let inoculoTipo = 'COMERCIAL';
     let inoculoDetalle = 'Comercial';
     
     if (loteInoculoCod && loteInoculoCod !== 'INOC') {
       inoculoTipo = 'SEMIELABORADO';
       inoculoDetalle = loteInoculoCod;
     } else if (insumoInoculo || esSemielaboradoPorNombre) {
       inoculoTipo = 'SEMIELABORADO';
       inoculoDetalle = loteInoculoCod || 'Semielaborado';
     }
     
     orden.inoculoOrigenTipo = inoculoTipo;
     orden.inoculoOrigenLabel = inoculoDetalle;
     ```

2. Frontend (`ProductionHistoryTable.jsx`):
   - Consumir directamente `orden.inoculoOrigenTipo` y `orden.inoculoOrigenLabel`:
     * Si `orden.inoculoOrigenTipo === 'SEMIELABORADO'`:
       Renderizar badge esmeralda: `<span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-medium">🧫 {orden.inoculoOrigenLabel}</span>`
     * Si es `'COMERCIAL'`:
       Renderizar badge ámbar: `<span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">⚗ Comercial</span>`
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los lotes fabricados bajo fórmulas con iniciador semielaborado muestran la insignia verde "🧫 Semielaborado" o el código del lote interno correspondiente.
- Solo las recetas de iniciador virgen comercial conservan "⚗ Comercial".
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.