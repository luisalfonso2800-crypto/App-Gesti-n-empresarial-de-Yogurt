TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Sanear el stock negativo corrupto (-11290 L) y los valores multimillonarios en Cava, corrigiendo la conversión dimensional L/g y blindando contra saldos negativos:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los archivos indicados.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`
2. `apps/api/src/inventory/inventory.repository.js` (o servicio de balance de cava)

INSTRUCCIONES TÉCNICAS:

1. Script / Rutina de Saneamiento Inmediato:
   - Recalcular el stock en cava de `YOGURT BASE INICIADOR YOGURT COMERCIAL` y `YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO`:
     * El stock debe ser la suma exacta de `cantidadActual` de sus lotes físicos reales no vencidos.
     * Si no hay lotes físicos con saldo, resetear el stock a 0 L y valorización a $0 (eliminar el -11290 L y los $3.424 millones irreales).

2. Blindaje Poka-Yoke en deducción de consumos (`production.repository.js`):
   - Conversión estricta de unidades:
     ```javascript
     let decrementoLts = Number(qtyConsumida);
     if (unidad === 'g' || unidad === 'ml') {
       decrementoLts = decrementoLts / 1000;
     }
     // Poka-Yoke: Jamás permitir que el stock quede en negativo
     const nuevoStock = Math.max(0, stockActual - decrementoLts);
     ```
   - En la liquidación de la orden:
     * Validar balance de masa: `cantInoculoReservado + cantDisponibleCava === volumenTotalObtenido`.
     * Nunca permitir que el inóculo reservado sea mayor o igual al volumen total producido.

3. Valorización Contable de Cava:
   - `valorizacionTotal = stockEnLitros * costoUnitarioPorLitro`.
   - Si el insumo está valorizado por gramo, multiplicar por 1000 para obtener el costo por litro antes de computar la cava.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node --check apps/api/src/inventory/inventory.repository.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pestaña Cava muestra stock >= 0 L en todos los productos sin saldos negativos.
- Los valores monetarios de cava vuelven a rangos normales coherentes con el costo de producción.
- No se pueden generar reservas de inóculo mayores a la producción real.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.