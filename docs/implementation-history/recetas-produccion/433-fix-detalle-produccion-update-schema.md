TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la invocación de `prisma.detalleProduccion.update()` en `apps/api/src/production/production.repository.js` para usar únicamente los campos definidos en el schema de Prisma:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `apps/api/src/production/production.repository.js` alrededor de la línea 520 y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado.

INSTRUCCIONES TÉCNICAS:

1. En `apps/api/src/production/production.repository.js` (alrededor de las líneas 518-530):
   - Localizar el bloque de actualización de `detalleProduccion`:
     `await prisma.detalleProduccion.update(...)`
   - Asegurar que la cláusula `where` use el identificador correcto del detalle: `where: { id: detalle.id }`.
   - Asegurar que la cláusula `data` contenga exclusivamente los campos válidos del schema:
     ```javascript
     data: {
       cantidadRealUtilizada: Number(qtyReal),
       costoReal: Number(qtyReal * costoUnitarioInsumo)
     }
     ```
   - Eliminar cualquier campo no admitido por el schema (como `costoUnitario`, `costoTotal`, `subtotal`, etc.).
   - Respetar el límite de líneas SRP.

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La invocación a `prisma.detalleProduccion.update` se realiza con campos válidos sin error de Prisma.
- La liquidación de producción se completa exitosamente, creando los lotes y descontando los insumos consumidos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.