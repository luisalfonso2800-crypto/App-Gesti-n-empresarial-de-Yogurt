TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Rediseñar visualmente la sección de selección de lotes WIP en la tabla BOM de producción para integrarla en una subfila completa (colSpan) con diseño limpio y eliminar el desfase vertical de las columnas:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `ProductionBomTable.jsx` (o subcomponente de fila BOM) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` (o componente de fila equivalente)

INSTRUCCIONES TÉCNICAS:

1. Reestructuración del Render de la Fila:
   - Mantener la fila principal `<tr>` con sus 7 columnas alineadas normalmente (`Insumo`, `Req. Teórico`, `Stock Actual`, `Costo Unit.`, `Subtotal`, `Faltante`, `Estado`).
   - Retirar el bloque de radios/selector de adentro del primer `<td>`.
   - Justo después del `<tr>` principal de la base WIP, renderizar condicionalmente una subfila:
     ```jsx
     <tr className="bg-slate-50/80 border-b border-slate-100">
       <td colSpan={7} className="px-4 py-2.5">
         <div className="flex items-center gap-4 text-xs">
           <span className="font-semibold text-slate-700 flex items-center gap-1.5">
             🧫 Asignación de Cepa:
           </span>
           {/* Contenedor flex horizontal de opciones */}
           <div className="flex items-center gap-3">
             <label className={`cursor-pointer px-3 py-1.5 rounded-md border text-xs font-medium flex items-center gap-2 transition-colors ${modo === 'MEZCLA' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
               <input type="radio" name="modoInoculo" value="MEZCLA" checked={modo === 'MEZCLA'} onChange={...} className="sr-only" />
               <span>⚡ Mezclar FEFO: {resumenMezcla}</span>
             </label>
             <label className={`cursor-pointer px-3 py-1.5 rounded-md border text-xs font-medium flex items-center gap-2 transition-colors ${modo === 'LOTE_UNICO' ? 'bg-sky-50 border-sky-500 text-sky-800' : 'bg-white border-slate-200 text-slate-600'}`}>
               <input type="radio" name="modoInoculo" value="LOTE_UNICO" checked={modo === 'LOTE_UNICO'} onChange={...} className="sr-only" />
               <span>🎯 Lote Único:</span>
               <select className="bg-transparent border-0 text-xs font-semibold focus:ring-0 p-0" value={selectedLotId} onChange={...}>
                 {/* opciones de lotes completos */}
               </select>
             </label>
           </div>
         </div>
       </td>
     </tr>
     ```
   - Formatear la leyenda de stock en cava a unidades legibles (ej. `12.0 kg disp.` o `12,000 g disp.`).
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionBomTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla de insumos mantiene todas sus cifras numéricas alineadas horizontalmente sin saltos ni espacios desfasados.
- La decisión de lote se visualiza en una banda horizontal limpia debajo del insumo en formato de pastillas seleccionables.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.