TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Subsanar el error de Prisma en `production.repository.js` alrededor de la línea 695 al descontar el inventario de insumos consumidos durante la liquidación de la orden de producción:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/production/production.repository.js` alrededor de las líneas 685-715 y el schema de `Insumo` / `InventarioInsumo` en `apps/api/prisma/schema.prisma`.
- Modificar EXCLUSIVAMENTE `apps/api/src/production/production.repository.js`.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Inspeccionar y Corregir la Actualización de Stock de Insumos:
   - Revisar la entidad encargada del stock de insumos (`Insumo` vs `InventarioInsumo`):
     * Si el modelo `Insumo` no tiene `stockActual`, verificar si el campo es `stock` o si el inventario se gestiona mediante `this.prisma.inventarioInsumo.update(...)` o `upsert(...)`.
     * Validar que la cláusula `where` use el identificador exacto (`id: insumoId` o `insumoId: insumo.id`).
     * Asegurar que `stockFinal` sea un valor numérico seguro (`Math.max(0, stockFinal)`).
   - Envolver la deducción dentro de la transacción existente (`tx` o `prisma`) de forma resiliente:
     ```javascript
     // Asegurar compatibilidad con el schema de Insumo/Inventario:
     if (insumo) {
       // Si el modelo Insumo tiene stock:
       await tx.insumo.update({
         where: { id: insumo.id },
         data: { stockActual: Math.max(0, stockFinal) } // o el nombre exacto de la columna según schema.prisma
       });
     }
     ```
   - Respetar el límite de líneas SRP (< 135 líneas o función atómica).

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La modal de liquidación de producción procesa el botón "Confirmar Liquidación y Entrada a Stock" con éxito.
- Los consumos de materias primas (ej. Leche Entera, Yogur Griego) se descuentan sin excepciones de Prisma.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
