TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir en `ProductionHistoryTable.jsx` la visualización del inóculo origen real (lote interno vs comercial) y dinamizar las unidades de Total Obtenido y Destino Cava según la receta técnica:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx` y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Resolver Inóculo Origen Real:
   - Extraer el código del inóculo que usó la orden:
     ```javascript
     const inoculoCod = orden.loteInoculoOrigen || orden.codigoLoteInoculo || orden.loteIniciador?.codigoLote || orden.iniciadorLote || orden.iniciador;
     ```
   - Renderizado en la columna "INÓCULO ORIGEN":
     * Si `inoculoCod` existe y es diferente de 'INOC' o 'COMERCIAL':
       Mostrar badge verde/azul con el código del lote interno:
       `<span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800 font-mono">🧫 {inoculoCod}</span>`
     * Si no existe o proviene de inóculo externo virgen:
       `<span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">⚗ Comercial</span>`

2. Unidades Dinámicas (Total Obtenido y Destino Cava):
   - Obtener la unidad configurada en la orden o su receta:
     ```javascript
     const rawUnit = (orden.unidadMedida || orden.receta?.unidad || orden.unidad || '').toLowerCase();
     const esUnidad = rawUnit.includes('und') || rawUnit.includes('unidad') || orden.producto?.categoria === 'LACTEOS' || Boolean(orden.producto?.presentacionId);
     const unitLabel = esUnidad ? 'und' : (rawUnit.includes('kg') ? 'Kg' : 'L');
     ```
   - En las columnas "TOTAL OBTENIDO" y "DESTINO CAVA":
     * Reemplazar el `${valor} L` estático por `${valor} ${unitLabel}`.
     * La orden `69216240` debe mostrar `25 und` en lugar de `25 L`.

3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionHistoryTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Los lotes inoculados con semielaborados muestran el código de su lote madre (ej. 69216240, 08335A1C).
- Las órdenes de producto comercial envasado muestran `und` en lugar de `L`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.