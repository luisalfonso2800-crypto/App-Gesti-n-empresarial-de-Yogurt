TAREA:
Incorporar campos Marca y Costo Base en el modal de Nuevo Insumo, persistencia en API y auto-poblado en compra directa.

OBJETIVO:
1. Asegurar que el backend (Prisma, DTOs y Servicio de Insumos/Supplies) reciba y persista `marca` y `costoBase` (o `costoReferencial`).
2. Agregar los campos "Marca" y "Costo Base ($)" en el modal "Nuevo Insumo".
3. Al crear o seleccionar el insumo en una fila de compra directa, poblar automáticamente `fila.marca` y `fila.precioUnitario` con dicho costo base, manteniendo el campo editable.

FUENTE DE VERDAD:
- `apps/api/prisma/schema.prisma`
- `apps/web/src/app/operations/purchases/new/page.jsx`

REGLA DE CONSULTA:
Consulta `apps/api/src/` únicamente en el módulo de insumos (`supplies` o `insumos`) para verificar DTOs y servicio. No realices exploraciones fuera de este alcance.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma` (modelo `Supply` o `Insumo`)
- `apps/api/src/modules/supplies/` (o módulo equivalente de insumos: DTO, Controller, Service)
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/catalog/supplies/page.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- Archivos del módulo de Insumos en `apps/api/` (DTO/Service solo si no aceptan o persisten `marca` o `costoBase`).
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/catalog/supplies/page.jsx` (asegurar renderizado de las columnas Marca y Costo Ref. Base)

NO MODIFICAR:
- Ningún archivo de autenticación, ventas, dashboard ni otros módulos.

INSTRUCCIONES:

1. VERIFICACIÓN Y PERSISTENCIA EN BACKEND:
   - Comprueba en `apps/api/prisma/schema.prisma` el nombre exacto de los campos de marca y costo base en el modelo de insumos (ej. `marca`, `costoBase`, `costoReferencial`).
   - Verifica que el DTO de creación (`create-supply.dto.ts` o equivalente) admita `marca` (string opcional) y `costoBase` / `costoReferencial` (número opcional).
   - Verifica que el servicio persista ambos valores en la base de datos al invocar el endpoint POST.

2. MODAL "NUEVO INSUMO" EN `apps/web/src/app/operations/purchases/new/page.jsx`:
   - Agrega al estado `nuevoInsumo` las propiedades: `marca: ''` y `costoBase: ''`.
   - Incorpora en el formulario del modal el campo de texto "Marca":
     ```jsx
     <div>
       <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#182622', marginBottom: '0.35rem' }}>
         Marca
       </label>
       <input
         type="text"
         placeholder="Ej: Alpina, Colanta, Genérico..."
         value={nuevoInsumo.marca || ''}
         onChange={(e) => setNuevoInsumo({ ...nuevoInsumo, marca: e.target.value })}
         style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem' }}
       />
     </div>
     ```
   - Incorpora el campo "Costo Base / Referencia ($)" con máscara numérica sin decimales:
     ```jsx
     <div>
       <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#182622', marginBottom: '0.35rem' }}>
         Costo Base Referencial ($)
       </label>
       <input
         type="text"
         inputMode="numeric"
         placeholder="0"
         value={nuevoInsumo.costoBase ? Number(nuevoInsumo.costoBase).toLocaleString('es-CO') : ''}
         onChange={(e) => {
           const val = e.target.value.replace(/\D/g, '');
           setNuevoInsumo({ ...nuevoInsumo, costoBase: val ? parseInt(val, 10) : '' });
         }}
         style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #D6D3D1', fontSize: '0.85rem', textAlign: 'right' }}
       />
     </div>
     ```
   - Asegura que al enviar el POST de creación del insumo se transmitan `marca` y `costoBase`.

3. VINCULACIÓN REACTIVA A LA FILA DE COMPRA:
   - Al completar la creación del nuevo insumo y cerrarse el modal con éxito:
     - Asigna automáticamente el nuevo insumo a la fila activa.
     - Asigna `fila.marca = insumoCreado.marca || ''`.
     - Asigna `fila.precioUnitario = insumoCreado.costoBase || insumoCreado.costoReferencial || 0`.
     - El campo `Precio Unitario ($)` en la fila debe quedar completamente editable por el operador.
   - Aplica este mismo auto-completado cuando el usuario seleccione un insumo existente desde el buscador/autocompletar de insumos.

4. VISTA DE CATÁLOGO (`apps/web/src/app/catalog/supplies/page.jsx`):
   - Confirma que la tabla de insumos visualice `item.marca || 'N/A'` en la columna "Marca".
   - Confirma que visualice `$ ${Number(item.costoBase || item.costoReferencial || 0).toLocaleString('es-CO')}` en la columna "Costo Ref. (Base)".

NO HACER:
- No ejecutar `git checkout` ni descartar cambios locales.
- No crear scripts temporales (`patch*.js`, `fix*.js`, `.tmp`).
- No bloquear la edición manual del campo Precio Unitario en la fila de compra.
- No alterar el layout 100vh ni los estilos corporativos MANNÁ.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- El modal "Nuevo Insumo" contiene y envía los campos Marca y Costo Base.
- La API almacena ambos datos en PostgreSQL sin errores de validación.
- Al seleccionar o registrar el insumo en compras, el precio unitario se inicializa con el costo base y permite modificación manual.
- En `/catalog/supplies` la tabla muestra la marca y el costo referencial formateado.
- La compilación de API y Web concluye sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
```powershell
pnpm --filter api build
pnpm --filter web build --no-lint