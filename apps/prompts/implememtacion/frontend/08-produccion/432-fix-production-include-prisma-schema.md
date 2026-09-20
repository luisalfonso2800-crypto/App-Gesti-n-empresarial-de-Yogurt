TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir el `include` de `prisma.produccion.findUnique` en `apps/api/src/production/production.repository.js` para eliminar el campo inexistente `receta` que bloquea la liquidación de la orden:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo `production.repository.js` y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo indicado abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/production/production.repository.js`

INSTRUCCIONES TÉCNICAS:

1. En `apps/api/src/production/production.repository.js` (alrededor de las líneas 467-475):
   - Localizar la consulta:
     ```javascript
     const produccion = await prisma.produccion.findUnique({
       where: { id: targetId },
       include: {
         detalles: true,
         producto: true,
         receta: true,
       }
     });
     ```
   - Eliminar el campo `receta: true` del objeto `include`. Si se requiere información del producto o sus recetas, consultar únicamente relaciones válidas:
     ```javascript
     const produccion = await prisma.produccion.findUnique({
       where: { id: targetId },
       include: {
         detalles: true,
         producto: {
           include: { presentacion: true }
         },
         lotes: true
       }
     });
     ```
   - Asegurar que la transacción proceda con el descuento de inventario y la creación de los dos lotes (comercial de 15 L y semielaborado WIP de 4 L) sin referencias a `produccion.receta`.
   - Respetar el límite de líneas SRP.

VERIFICACIÓN:
1. `node --check apps/api/src/production/production.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La consulta `prisma.produccion.findUnique` ejecuta sin errores de esquema.
- Al confirmar la liquidación, se completa la orden exitosamente.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.