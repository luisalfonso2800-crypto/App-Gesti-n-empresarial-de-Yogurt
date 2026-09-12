TAREA:
Implementar botón de limpieza rápida en campo Proveedor y filtrado reactivo de Insumos en Compra Directa

OBJETIVO:
1. Incorporar un botón/ícono de limpiar (`✕`) visible únicamente cuando el campo "Proveedor" tenga un valor seleccionado, permitiendo resetear la selección con un solo clic sin tener que borrar manualmente el texto.
2. Al seleccionar un proveedor, filtrar automáticamente las opciones del selector/buscador de "Insumo" para mostrar prioritariamente los insumos que ese proveedor suministra (según el historial o lista de tarifas `SupplierPrice`), simplificando la selección al operador. Si el proveedor se limpia o está vacío, desplegar el catálogo completo de insumos activos.

FUENTE DE VERDAD:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` (o componente que renderiza la fila de compra)

REGLA DE CONSULTA:
Lee exclusivamente los archivos de la vista de Compra Directa en `apps/web/src/app/operations/purchases/new/`. No explores el backend ni otros módulos.

ALCANCE:

LEER:
- `apps/web/src/app/operations/purchases/new/page.jsx`
- `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` (o el componente donde reside la fila del ítem)
- `apps/web/src/app/operations/purchases/new/page.jsx` (si la lista de insumos o tarifas se propaga desde la página raíz)

NO MODIFICAR:
- Ningún endpoint ni servicio en `apps/api/`.
- Hojas de estilo globales.

INSTRUCCIONES:

1. BOTÓN DE LIMPIEZA RÁPIDA (CLEAR BUTTON) EN PROVEEDOR:
   - Envuelve el input de "Proveedor" en un contenedor relativo (`position: relative`) si aún no lo está.
   - Cuando el campo de proveedor contenga texto o un proveedor seleccionado:
     - Renderiza un botón o ícono `✕` posicionado a la derecha del input (`position: absolute; right: 8px; top: 50%; transform: translateY(-50%)`).
     - Al hacer clic en `✕`:
       - Restablece el valor del proveedor a vacío (`proveedor: ''`, `proveedorId: null`).
       - Si la fila ya tenía un insumo precargado que dependía estrictamente de ese proveedor, conserva el insumo o límpialo según convención de la fila sin disparar errores de renderizado.
       - Devuelve el foco al campo o déjalo listo para una nueva búsqueda.

2. FILTRADO REACTIVO DE INSUMOS POR PROVEEDOR:
   - Identifica el catálogo de tarifas/precios de proveedor precargado en la vista (`supplierPrices`, `preciosProveedor` o relación `supply.supplierPrices`).
   - Al abrir el desplegable o buscar en "Insumo":
     - Si la fila TIENE un proveedor seleccionado:
       - Filtra la lista de opciones para mostrar primero (o exclusivamente) los insumos asociados a ese proveedor en `SupplierPrice`.
       - Si no existen insumos previamente cotizados con ese proveedor, muestra la lista completa permitiendo seleccionar cualquier insumo con un aviso tenue: *"Mostrando todos los insumos (sin cotización previa para este proveedor)"*.
     - Si la fila NO TIENE proveedor seleccionado (o fue limpiado con el botón `✕`):
       - Muestra la lista completa de todos los insumos activos del catálogo.

3. PRECARGA DE TARIFA AL SELECCIONAR INSUMO FILTRADO:
   - Al elegir un insumo después de haber seleccionado al proveedor, precarga automáticamente en la fila:
     - Tipo de empaque y contenido unitario pactado con ese proveedor.
     - Precio unitario registrado en la tarifa para agilizar la digitación.

4. PRESERVAR REGLAS EXISTENTES:
   - Mantener intacto el cálculo de ingreso neto (`empaques × contenido unitario`), el subtotal, la conversión a letras con `montoATextoPesos` y la cápsula resumen de pie de tarjeta.

NO HACER:
- No bloquear la adición de nuevos insumos si un proveedor aún no los tiene registrados en su tarifario.
- No alterar las clases CSS existentes ni romper la disposición horizontal responsiva de los inputs.
- No crear scripts temporales (`patch*.js`, `fix*.js`).
- No ejecutar `git checkout`.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando:
- Al escribir o seleccionar un proveedor, aparece el botón `✕` dentro del input y, al presionarlo, el campo queda vacío inmediatamente.
- Con un proveedor elegido, el buscador/selector de insumos lista los insumos correspondientes a dicho proveedor.
- Al limpiar el proveedor, el selector de insumos vuelve a presentar el catálogo general.
- La compilación del frontend concluye sin errores.

VERIFICACIÓN:
Comprueba ejecutando:
pnpm --filter web build --no-lint

DETENCIÓN:
Al cumplir el criterio de finalización, DETENTE. No continúes con ninguna otra tarea.

SALIDA:
Entrega únicamente:
- Archivo(s) modificado(s):
- Líneas intervenidas:
- Resultado de compilación:
- Estado: