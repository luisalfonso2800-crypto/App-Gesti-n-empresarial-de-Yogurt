TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Subsanar el error de Prisma "Unknown field `costoEstandar` for select statement on model `Producto`" en `sales.repository.js`:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/api/src/sales/sales.repository.js` alrededor de la línea 10-25 y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/sales/sales.repository.js`

INSTRUCCIONES TÉCNICAS:

1. Corregir el método `findAll()` en `sales.repository.js`:
   - Eliminar el campo inexistente `costoEstandar: true` del include/select de `producto`.
   - Ajustar la consulta:
     ```javascript
     const ventas = await this.prisma.venta.findMany({
       include: {
         cliente: {
           select: { id: true, nombre: true, tipoCliente: true, canal: true }
         },
         detalles: {
           include: {
             producto: {
               select: {
                 id: true,
                 nombre: true,
                 precioVenta: true,
                 precioMayorista: true
               }
             }
           }
         }
       },
       orderBy: { fechaVenta: "desc" }
     });
     ```
   - Al calcular el costo en el retorno:
     * Usar `d.costoUnitario || 0` (campo nativo del modelo `DetalleVenta`), o calcular `costoTotal: venta.detalles.reduce((acc, d) => acc + (Number(d.costoUnitario || 0) * d.cantidad), 0)`.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/sales/sales.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La vista de Ventas carga sin el error rojo de Prisma.
- Se muestran el Dashboard comercial de ventas y el historial con los nombres de clientes.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.
