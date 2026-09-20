TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir la invocación de `prisma.producto.update()` para eliminar los campos calculados/virtuales (`stockLitros`, `stockCava`, `stockActual`) del payload que bloquean la edición del producto:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo de actualización de productos (`apps/api/src/products/products.repository.js` o `products.service.js` en el método `update`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js` (o donde se ejecute `this.prisma.producto.update`)

INSTRUCCIONES TÉCNICAS:

1. En el método de actualización (`update(id, data)`):
   - Desestructurar o limpiar `data` antes de enviarla a Prisma:
     ```javascript
     const {
       stockLitros,
       stockCava,
       stockActual,
       inventario,
       recetas,
       presentacion,
       lotes,
       ...cleanData
     } = data;
     ```
   - Invocar la actualización únicamente con campos persistentes del modelo `Producto`:
     ```javascript
     return await this.prisma.producto.update({
       where: { id },
       data: cleanData
     });
     ```
   - Si `cleanData.precio` o campos numéricos vienen como string, asegurar su casteo a `Number` o `Decimal` según el schema.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El formulario "Editar Producto" guarda los cambios exitosamente sin error de Prisma por campos desconocidos.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.