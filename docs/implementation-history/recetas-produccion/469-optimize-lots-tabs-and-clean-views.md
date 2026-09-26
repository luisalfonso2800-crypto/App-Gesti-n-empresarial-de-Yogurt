TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Segmentar la vista de Trazabilidad de Lotes mediante pestañas operativas (Activos en Cava, Cepas Vivas, Histórico Agotados) y compactar el árbol de ancestros para eliminar la saturación visual:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `apps/web/src/app/operations/lots/page.jsx` (y su CSS si corresponde) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/lots/page.jsx`

INSTRUCCIONES TÉCNICAS:

1. Pestañas de Segmentación Operativa:
   - Implementar selector de pestañas antes de la tabla:
     * `🟢 En Existencia` (lotes con stockActual > 0). [Activa por defecto]
     * `🧫 Cepas Disponibles` (lotes tipo SEMIELABORADO_WIP o con reserva de inóculo > 0 y stock > 0).
     * `📁 Archivo / Agotados` (lotes con stockActual === 0 o estado descartado).
     * `Ver Todos`.
   - Mostrar el contador en cada pestaña (ej. `En Existencia (${activosCount})`).

2. Compactación de la Trazabilidad y Linaje:
   - En la columna "Lote / ID":
     * Mostrar el código principal en fuente monoespaciada en negrita (`font-mono text-sm font-bold`).
     * No volcar la lista entera de ancestros como texto largo en plano.
     * Si tiene ancestros, renderizar un indicador compacto:
       `<span className="text-[11px] text-slate-500 truncate max-w-[180px] block" title={linajeCompleto}>Origen: {padreDirecto || 'Madre Comercial'}</span>`
     * Al pasar el mouse (`title` o tooltip), mostrar la ruta completa `COMERCIAL ➔ ... ➔ ACTUAL`.

3. Corrección de Unidades en Saldo:
   - En la columna "Unidades Restantes":
     * Validar que no imprima `ml` si la presentación es comercial en envase (usar `und` o `L` según la receta/categoría).
     * Formato limpio: `${stockActual} / ${cantidadInicial} ${unidad}`.

4. Columna de Acciones:
   - Si el lote tiene `stockActual === 0`, no renderizar el botón rojo `Descartar` (mostrar un texto sutil `Agotado` o botón `Ver Ficha`).
   - El botón `Descartar` solo debe ser accesible para lotes con existencias físicas reales en cava.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/lots/page.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista por defecto muestra únicamente los lotes con saldo real en cava.
- Los lotes en cero quedan organizados en la pestaña "Archivo / Agotados".
- Se eliminan textos desbordados y se normalizan las unidades de saldo.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.