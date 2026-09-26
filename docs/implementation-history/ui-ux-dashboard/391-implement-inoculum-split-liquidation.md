TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 TOOL CALLS EN TOTAL):
Implementar la división de lote (Split Batch) para reserva de cultivo iniciador / inóculo interno al liquidar órdenes de producción:
1. En Backend: Extender la transacción de liquidación en `production.repository.js` para admitir `reservaInoculo`, generando dos registros en `Lote` (Lote A: Inóculo/Semielaborado y Lote B: Lote Principal) y sus correspondientes movimientos de inventario respetando la genealogía (`idLotePadre`).
2. En Frontend: Enriquecer `FinalizeBatchModal.jsx` incorporando la sección de reserva de inóculo con balance de masa dinámico, código correlativo generado y validación Poka-Yoke.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- PROHIBIDO usar búsquedas recursivas (`Search`, `Find`, `Grep`).
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 3 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/web/src/app/production/components/FinalizeBatchModal.jsx`
3. `apps/web/src/app/production/production.module.css`

INSTRUCCIONES TÉCNICAS:

1. En `production.repository.js` (completeProduction):
   - Recibir `reservaInoculo: { activo, cantidad, codigoLoteHijo }` en el payload.
   - Calcular `costoUnitarioFabricacion = costoTotalLote / qtyProducida`.
   - Si `reservaInoculo?.activo && reservaInoculo.cantidad > 0`:
     * Cantidad principal: `qtyPrincipal = qtyProducida - reservaInoculo.cantidad`.
     * Crear Lote de Inóculo: `tipoLote: 'SEMIELABORADO_WIP'`, cantidad: `reservaInoculo.cantidad`, costo unitario correspondiente, `idLotePadre` referenciado a la producción/lote principal.
     * Crear Lote Principal con `qtyPrincipal`.
     * Registrar los movimientos de inventario asociados.
   - Si no hay reserva activa, mantener el flujo unitario existente.

2. En `FinalizeBatchModal.jsx`:
   - Mostrar sección colapsable o tarjeta destacada: "Reserva de Cultivo Iniciador (Inóculo)".
   - Toggle switch / Checkbox: `[✓] Reservar fracción para próximo cultivo iniciador`.
   - Campo numérico con sufijo claro: `[ Cantidad a Reservar ] Litros / Gramos`.
   - Micro-tarjeta de balance de masa en tiempo real:
     * `A granel / envasado: {volumenTotal - reserva} Litros`
     * `Cepa guardada: {reserva} Litros` → Etiqueta correlativa generada (ej: `LOT-...-INI`).
   - Poka-Yoke: Deshabilitar el botón de confirmación si `reserva >= volumenTotal` o si el valor es negativo.
   - Respetar estrictamente el límite SRP (< 135 líneas).

3. En `production.module.css`:
   - Añadir estilos limpios para la caja de reserva (`.inoculumCard`, `.splitBalanceBadge`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/production/components/FinalizeBatchModal.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al liquidar un Yogurt Base, el operador puede reservar una fracción de inóculo con un solo clic.
- El sistema divide el lote en base de datos conservando costo unitario y genealogía.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.