TAREA CONTROLADA — SELECCIÓN ATÓMICA DE INSUMO Y SINCRONIZACIÓN INMEDIATA DE PACKAGING / COTIZACIÓN

OBJETIVO TÉCNICO:
Eliminar la condición de carrera producida por múltiples llamadas secuenciales a `updateDetalle` en la selección de insumos. Implementar una mutación de estado atómica `selectInsumo(rowId, insumo)` que precargue de inmediato empaque, contenido referencial, unidad de medida y cotización activa sin sobreescrituras ni caídas ciegas a `UNIDAD = 1`.

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js
- apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowInsumoSelector.jsx
- apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 EDICIONES, CERO BÚSQUEDAS CIEGAS):
- Modificar EXCLUSIVAMENTE los archivos indicados.
- Prohibido crear scripts temporales (`patch.js`, `test.js`).
- Respetar el límite de líneas de la arquitectura SRP (< 140 líneas por archivo).
- 0 estilos inline (`style={{}}`).

DIAGNÓSTICO DEL PROBLEMA:
1. `FormPhaseRowInsumoSelector.jsx` dispara hasta 7 llamadas independientes a `updateDetalle` en el mismo `onClick`.
2. La llamada para `insumo` lanza un `fetchLookupPrices` asíncrono, pero las llamadas inmediatamente posteriores (`empaque`, `empaqueTipo = UNIDAD`, `contenidoNeto = 1`) pisan el estado antes o después de la respuesta, dejando el input bloqueado y congelado en 1.
3. Si el insumo tiene ficha de catálogo (ej. `unidadBase: 'kg'`, `empaque: 'BOLSA'`, `contenidoReferencial: 25`), se ignoran sus valores base por sobreescribir `empaqueTipo = 'UNIDAD'`.

ACCIONES A EJECUTAR:

1. En `useFormPhaseData.js`:
   - Crear y exponer el handler atómico `selectInsumoRow(rowId, insumo)`:
     * Si `insumo` es null/vacío: resetear los campos asociados (`insumo: null`, `insumoSearch: ''`, `marca: ''`, `precioUnitario: 0`, `fromCotizacion: false`).
     * Resolver la presentación canónica de catálogo:
       - `unidadMedida`: `insumo.unidadBase || 'kg'`
       - `empaque`: `insumo.empaque || (['kg', 'g', 'L', 'ml'].includes(insumo.unidadBase) ? 'BOLSA' : 'UNIDAD')`
       - `empaqueTipo`: `insumo.empaque && insumo.empaque !== 'UNIDAD' ? 'OTRO' : (['kg', 'g', 'L', 'ml'].includes(insumo.unidadBase) ? 'OTRO' : 'UNIDAD')`
       - `contenidoNeto`: `Number(insumo.contenidoReferencial) > 0 ? Number(insumo.contenidoReferencial) : 1`
       - `marca`: `insumo.marca || ''`
     * En una **sola actualización de estado inmutable**, actualizar todos esos atributos en la fila objetivo.
     * Si la fila ya cuenta con `proveedor?.id`:
       - Ejecutar inmediatamente la consulta de cotización `GET /supplier-prices/lookup?idProveedor=...&idInsumo=...`.
       - Si retorna cotización válida, aplicar en esa misma resolución: `precioUnitario`, `contenidoNeto` (desde `cantidadEquivalenteBase` o `cantidadPresentacion`), `empaque` cotizado, `unidadMedida` y marcar `fromCotizacion: true`.

2. En `FormPhaseRowInsumoSelector.jsx`:
   - Reemplazar la ráfaga de 7 llamadas a `updateDetalle` por una única invocación:
     `selectInsumoRow(row.id, insumoSeleccionado)`

3. En `FormPhaseRowPackaging.jsx`:
   - Verificar que los selectores y campos de contenido/unidad lean directamente los valores actualizados de la fila sin forzar internamente `disabled` si `empaqueTipo === 'OTRO'`.

VERIFICACIONES DE CALIDAD:
1. `node --check apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js`
2. `node --check apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowInsumoSelector.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Al seleccionar un insumo desde el dropdown, se asignan de forma inmediata y visible su empaque, contenido real, unidad de medida y (si hay proveedor previo) su precio cotizado con el badge activo.
- No se producen estados intermedios ni sobreescrituras en falso.
- `verify-srp.js` pasa con 0 errores.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Archivos modificados y líneas resultantes.
- Confirmación de unificación atómica en `selectInsumoRow`.
- Resultado de verify-srp.js.
- Estado: [COMPLETADO / BLOQUEADO].