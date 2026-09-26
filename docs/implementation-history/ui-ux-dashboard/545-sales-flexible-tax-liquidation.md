TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 3 ARCHIVOS EDITADOS - CERO BUCLES DE LECTURA):
Implementar la liquidación tributaria flexible de ventas en frontend y backend, incorporando el switch "Liquidar con IVA", el desglose de base imponible e impuestos en el modal de ventas, y su persistencia en base de datos.

ARCHIVOS A INTERVENIR:
1. `apps/web/src/app/commercial/sales/hooks/useSaleForm.js` (Lógica de cálculo y switch de IVA)
2. `apps/web/src/app/commercial/sales/components/SaleModal.jsx` (o subcomponente de resumen/formulario de venta)
3. `apps/api/src/sales/sales.repository.js` (Persistencia transaccional de campos tributarios en Venta y DetalleVenta)

INSTRUCCIONES TÉCNICAS:

1. Frontend Hook (`useSaleForm.js`):
   - Agregar estado `aplicaIva` (boolean, por defecto `false` para no imponer IVA a pequeñas empresas/régimen simple).
   - En el cálculo de totales (`totals`):
     * Si `aplicaIva === false`:
       - `subtotal = suma(cant * precio)`
       - `baseImponible = subtotal`
       - `ivaTotal = 0`
       - `totalVenta = subtotal`
     * Si `aplicaIva === true`:
       - Calcular por cada ítem según su producto (`tipoImpuesto`, `tarifaIva`, `precioIncluyeIva`):
         * Si producto es GRAVADO (tarifa > 0):
           Si `precioIncluyeIva`:
             `baseLinea = (precio * cant) / (1 + tarifa/100)`
             `ivaLinea = (precio * cant) - baseLinea`
           Si no incluye:
             `baseLinea = precio * cant`
             `ivaLinea = baseLinea * (tarifa/100)`
         * Si es EXENTO/EXCLUIDO: `baseLinea = precio * cant`, `ivaLinea = 0`.
       - `baseImponible = suma(baseLinea)`
       - `ivaTotal = suma(ivaLinea)`
       - `totalVenta = baseImponible + ivaTotal`
   - Enviar en el payload del POST `/sales`: `aplicaIva`, `subtotal`, `baseImponible`, `ivaTotal`, `totalVenta`, y en cada detalle: `tarifaIva`, `baseGravable`, `montoIva`.

2. Frontend UI (`SaleModal.jsx` / componentes asociados):
   - En la sección superior del formulario, añadir un switch/toggle visual limpio:
     `[ ] Liquidar con IVA (Factura Gravada)`
   - En la tarjeta "Resumen de Liquidación":
     * Si `aplicaIva` está activo, desglosar:
       - Subtotal Base: `$ XX.XXX`
       - IVA discriminado: `$ XX.XXX`
       - Total a Cobrar: `$ XX.XXX`
     * Si está apagado, mostrar el resumen estándar simplificado.
   - Respetar el límite arquitectural SRP (< 130 líneas por componente).

3. Backend (`sales.repository.js`):
   - En `createWithTransaction`:
     * Extraer los campos `aplicaIva`, `subtotal`, `descuentoTotal`, `baseImponible`, `ivaTotal` e insertarlos en la creación de `Venta`.
     * En el mapeo de `DetalleVenta`, persistir `tarifaIva`, `baseGravable` y `montoIva` por cada ítem.
     * Garantizar que `saldoPendiente` se calcule siempre sobre el `totalVenta` final liquidado.

VERIFICACIÓN:
1. `node --check apps/api/src/sales/sales.repository.js`
2. `node .agents/scripts/verify-srp.js`
3. `pnpm --filter api build`
4. `pnpm --filter web build`

CRITERIO DE FINALIZACIÓN:
- El modal permite activar o desactivar el IVA según la necesidad comercial.
- Al activar IVA, calcula y desglosa la base gravable y el impuesto correspondiente en pantalla.
- La venta se persiste con su desglose tributario en base de datos sin alterar los costos de recetas ni bodega.
- Verificación SRP y builds en código 0.

DETENCIÓN:
Al validar sintaxis y verificar compilación limpia, DETENTE inmediatamente.