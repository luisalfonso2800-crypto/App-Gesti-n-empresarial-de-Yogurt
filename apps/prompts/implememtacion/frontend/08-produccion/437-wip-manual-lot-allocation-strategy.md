TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Implementar el selector interactivo de decisión para el operario cuando un lote de inóculo WIP no alcance a cubrir la dosis requerida en la orden de producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a modificar.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/operations/production/components/ProductionBomTable.jsx` (o componente de tabla de formulación de la orden)
2. `apps/api/src/production/production.repository.js` (o servicio de liquidación/consumo de producción)

INSTRUCCIONES TÉCNICAS:

1. Frontend (`ProductionBomTable.jsx` o modal de producción):
   - Al detectar que un insumo tipo 'INOCULO_WIP' o 'SEMIELABORADO_WIP' tiene múltiples lotes en cava y el lote más antiguo (FEFO) tiene un saldo menor al teórico requerido:
     * Renderizar debajo de la fila del inóculo un selector visual con dos opciones de decisión:
       a) "🔘 Mezclar lotes por FEFO": Desglosar la mezcla (ej. "Lote A: [saldo actual] g + Lote B: [faltante] g").
       b) "🔘 Usar lote único completo": Mostrar un dropdown con los lotes cuyo saldo sea >= cantidad requerida, para tomar el 100% de ese lote y dejar el lote anterior intacto.
     * Enviar en el payload de liquidación/creación:
       `asignacionInoculo: { modo: 'MEZCLA', lotes: [...] }` o `{ modo: 'LOTE_UNICO', idLote: '...' }`.
   - Respetar el límite de líneas SRP (< 135 líneas).

2. Backend (`production.repository.js`):
   - En el proceso de liquidación y deducción de stock:
     * Respetar obligatoriamente la decisión enviada desde el frontend:
       - Si `modo === 'LOTE_UNICO'`: Descontar el 100% del requerimiento del lote especificado por el operario. NO tocar el lote anterior.
       - Si `modo === 'MEZCLA'`: Descontar el saldo remanente del primer lote hasta dejarlo en 0 y descontar la diferencia del segundo lote indicado.
     * Registrar en la trazabilidad de la producción exactamente qué lotes intervinieron.

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionBomTable.jsx`
2. `node --check apps/api/src/production/production.repository.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El sistema nunca decide de forma automática si mezcla lotes o no; la interfaz solicita la decisión al operario.
- Si el operario elige lote único, el saldo del lote viejo no se toca.
- Si elige mezclar, se descuentan las fracciones exactas de ambos lotes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.