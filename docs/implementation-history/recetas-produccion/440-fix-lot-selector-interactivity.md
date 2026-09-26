TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Hacer 100% interactivos y clicables los botones de "Mezclar FEFO" y "Lote Único" en el componente de asignación de inóculo de producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente donde reside la fila de asignación (ej. `ProductionBomTable.jsx` o subcomponente de asignación) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` (o componente correspondiente)

INSTRUCCIONES TÉCNICAS:

1. En el render de las pastillas de "Asignación de Cepa":
   - Desacoplar completamente cualquier `<select>` de dentro de etiquetas `<label>`.
   - Utilizar botones o divs interactivos con `onClick` explícito:
     ```jsx
     {/* Opción A: Mezclar FEFO */}
     <button
       type="button"
       onClick={() => onCambiarEstrategia?.({ modo: 'MEZCLA' })}
       className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
         estrategia?.modo === 'MEZCLA'
           ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30'
           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
       }`}
     >
       <span>⚡ Mezclar FEFO:</span>
       <span className="font-normal">{resumenMezcla}</span>
     </button>

     {/* Opción B: Lote Único */}
     <div
       onClick={() => onCambiarEstrategia?.({ modo: 'LOTE_UNICO', idLote: selectedLotId })}
       className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
         estrategia?.modo === 'LOTE_UNICO'
           ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-400/30'
           : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
       }`}
     >
       <span>🎯 Lote Único:</span>
       <select
         value={selectedLotId}
         onClick={(e) => e.stopPropagation()}
         onChange={(e) => {
           e.stopPropagation();
           onCambiarEstrategia?.({ modo: 'LOTE_UNICO', idLote: e.target.value });
         }}
         className="bg-transparent border-0 text-xs font-semibold text-slate-800 focus:ring-0 p-0 cursor-pointer"
       >
         {lotesCompletos.map(l => (
           <option key={l.id} value={l.id}>
             {l.codigo || l.numero || l.id.slice(0, 8)} ({Number(l.cantidadActual || l.stockActual) * 1000}g)
           </option>
         ))}
       </select>
     </div>
     ```
   - Asegurar que el estado `estrategia` (`modo` e `idLote`) se actualice en el estado del formulario principal del modal.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al hacer clic sobre "Mezclar FEFO" se activa visualmente la opción de mezclar.
- Al hacer clic sobre "Lote Único" se activa visualmente la opción de lote único y permite cambiar el lote en el selector sin recargas ni bloqueos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.