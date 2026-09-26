TAREA:
Corregir mapeo de "Presentación Compra" en Precios de Proveedores al registrar Compras Directas

OBJETIVO:
Corregir la lógica de auto-registro/actualización de tarifas en `SupplierPrice` (Precios de Proveedores) generada desde la Compra Directa para que el campo `presentacion` o `presentacionCompra` guarde el formato comercial del empaque (`EMPAQUE x CONTENIDO_UNITARIO UNIDAD`, ej: `BOLSA x 900 ml`), eliminando el error que concatena la cantidad comprada de la orden (`12 ml`, `1 g`).

FUENTE DE VERDAD:
- `apps/api/prisma/schema.prisma` (modelo `SupplierPrice` o `PrecioProveedor`)
- Módulo de compras en backend (`apps/api/src/modules/purchases/` o servicios asociados)
- Módulo de precios de proveedores en backend y frontend (`apps/api/src/modules/supplier-prices/`, `apps/web/src/app/catalog/supplier-prices/`)
- `apps/web/src/app/operations/purchases/new/page.jsx`

REGLA DE CONSULTA:
Lee exclusivamente los archivos vinculados a la persistencia de compras, tarifas de proveedor y el modal `SupplierPriceModal`. No explores ventas ni producción.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma` (modelo `SupplierPrice`, relaciones con `Supply` y `Supplier`)
- Servicio de compras donde se dispara la actualización/creación de tarifas (`purchases.service.js` o similar)
- `apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx` (o modal equivalente)
- `apps/web/src/app/catalog/supplier-prices/page.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- Servicio de compras en API (o controlador que ejecuta el upsert de tarifas)
- `apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx` (alineación de campos y formateo)
- `apps/web/src/app/catalog/supplier-prices/page.jsx` (si requiere ajustes de renderizado)

NO MODIFICAR:
- Fórmulas de flete global ni totales consolidados en Compra Directa.
- Esquema de base de datos (`schema.prisma`) salvo que falte una columna indispensable.

INSTRUCCIONES:

1. LOCALIZAR EL DESFASE DE MAPEO:
   - Busca en el backend (o en el handler de compras) la rutina que crea o actualiza `SupplierPrice` al completar una compra.
   - Identifica la propiedad asignada a `presentacion` o `presentacionCompra`:
     - Actualmente toma: `item.cantidad + ' ' + item.unidad` (generando `"12 ml"`, `"1 g"`).
     - Debe tomar la fórmula comercial:
       ```javascript
       const empaqueFormateado = (item.empaque || 'UNIDAD').toUpperCase();
       const contenido = Number(item.contenidoUnitario || 1);
       const unidad = item.unidadMedida || item.unidadBase || 'und';
       const presentacionComercial = `${empaqueFormateado} x ${contenido.toLocaleString('es-CO')} ${unidad}`;
       ```
       (Ejemplos resultantes: `"BOLSA x 900 ml"`, `"BOLSA x 500 g"`, `"ENVASE x 1.000 g"`).

2. CONSISTENCIA DE CAMPOS EN SUPPLIER PRICE:
   - Al registrar la tarifa del proveedor, asegura la persistencia coherente:
     - `presentacion`: `presentacionComercial` (ej. `"BOLSA x 900 ml"`).
     - `contenidoBase` / `equivalenteUnidadBase`: el contenido neto unitario (`item.contenidoUnitario`, ej. `900`).
     - `precioCompra`: el precio unitario pactado por ese empaque (`item.precioUnitario`, ej. `3090`).
     - `costoUnidadBase`: `precioCompra / contenidoUnitario` (ej. `3090 / 900 = 3.43` $/ml). Nunca calcularlo dividiendo entre la cantidad de empaques comprados.

3. ESTANDARIZACIÓN EN EL MODAL MANUAL (`SupplierPriceModal`):
   - Asegura que al crear o editar un precio de proveedor manualmente desde el catálogo:
     - El campo `PRESENTACIÓN COMPRA` sugiera mediante placeholder: `"Ej: BOLSA x 900 ml, BULTO x 25 kg"`.
     - El campo `EQUIVALENTE UNIDAD BASE` tome únicamente números limpios sin caracteres especiales.
     - El campo `PRECIO DE COMPRA ($)` no inicie en 0 fijo, aplique formato de miles automático y renderice la conversión a letras vía `montoATextoPesos`.
     - El `Costo Calculado (Unidad Base)` proyecte en tiempo real el valor unitario:
       $$\text{Costo Unidad Base} = \frac{\text{Precio de Compra}}{\text{Equivalente Unidad Base}}$$

4. CORRECCIÓN EN VISTA DE CATÁLOGO (`supplier-prices/page.jsx`):
   - La columna **Presentación Compra** debe mostrar la cadena comercial (`BOLSA x 900 ml`).
   - La columna **Contenido Base** debe mostrar el contenido unitario con su unidad (`900 ml`, `500 g`).
   - La columna **Precio Compra** debe mostrar el costo del empaque (`$3.090`, `$6.500`).
   - La columna **Costo Unidad Base** debe reflejar el costo real por gramo/mililitro (`$3.43 / ml`, `$13 / g`).

NO HACER:
- Prohibido usar `npx`.
- Prohibido introducir TypeScript (`.ts`, `.tsx`); usar exclusivamente JavaScript nativo.
- No modificar el cálculo de inventario ni el ingreso neto a bodega.
- No crear scripts temporales (`patch*.js`, `fix*.js`, `.tmp`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- Al registrar una compra directa, la tarifa en Precios de Proveedores se guarda con el formato comercial exacto (ej. `BOLSA x 900 ml`).
- El cálculo de `Costo Unidad Base` corresponde estrictamente al costo por mililitro o gramo de una sola unidad de empaque.
- `SupplierPriceModal` adopta las reglas de entrada sin ceros fijos y con moneda en palabras.
- La compilación en backend y frontend concluye sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter api build
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivo y función donde se corrigió la asignación de `presentacion`:
- Cambios realizados en `SupplierPriceModal`:
- Resultado de compilación:
- Estado: