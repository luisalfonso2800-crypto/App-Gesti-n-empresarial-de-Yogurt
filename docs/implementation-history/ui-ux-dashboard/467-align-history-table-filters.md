TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Alinear horizontalmente en una sola fila el buscador de texto y el selector de canal de venta en la cabecera de `ProductionHistoryTable.jsx`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez la cabecera de `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx` y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Estructura Flexbox de la Cabecera de Filtros:
   - Envolver el input de búsqueda y el `<select>` de canales en un contenedor horizontal responsivo:
     ```jsx
     <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border-b border-slate-200">
       <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
         {/* Input de Búsqueda */}
         <div className="relative w-full max-w-xs">
           <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
           <input
             type="text"
             placeholder="Buscar por lote o producto..."
             className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 w-full focus:ring-1 focus:ring-emerald-500"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>

         {/* Selector de Canal */}
         <select
           className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:ring-1 focus:ring-emerald-500"
           value={selectedChannel}
           onChange={(e) => setSelectedChannel(e.target.value)}
         >
           <option value="ALL">Todos los Canales</option>
           <option value="SOLO_PLANTA">🏭 Solo Planta</option>
           <option value="MIXTO">🔄 Mixto</option>
           <option value="COMERCIAL">🏪 Comercial (B2B/B2C)</option>
         </select>
       </div>

       {/* Contador de Lotes */}
       <span className="text-xs text-slate-500 whitespace-nowrap">
         Mostrando {filteredOrders.length} de {orders.length} lotes procesados
       </span>
     </div>
     ```
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El buscador y el selector de canal quedan alineados en una sola barra superior compacta y limpia.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.