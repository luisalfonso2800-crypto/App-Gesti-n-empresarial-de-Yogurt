TAREA CONTROLADA — COMPRAS INTEGRAL: VISTA CHECKLIST/IMPRESIÓN, FILTRADO EN CASCADA Y ALTA EN CALIENTE

OBJETIVO TÉCNICO EXACTO
Reestructurar la experiencia de Compras en `apps/web/src/app/operations/purchases/new/page.jsx` y su API para cubrir dos flujos secuenciales sin perder datos:
1. Flujo A (Preparación/Impresión): Si existen ítems en el carrito de compras (`sessionStorage`), renderizar primero una planilla tipo Checklist agrupada por proveedor con botón de impresión limpia (`window.print()`). Permitir marcar el estado de cada insumo ("Conseguido", "Agotado", "Proveedor no suministra más") y transferir los conseguidos al formulario de ingreso.
2. Flujo B (Matriz de Registro de Compra): Formulario directo de compra con autocompletado en cascada (Proveedor -> Insumos cotizados por ese proveedor), modales livianos de alta rápida ("+ Añadir Proveedor" y "+ Añadir Insumo"), campos comerciales editables (marca, presentación, precio, factor de empaque) y cálculo reactivo en unidad base.
3. Transacción atómica en Backend: `POST /purchases` debe persistir compra, detalle, movimientos de inventario (`ENTRADA_COMPRA`), actualización de stock en unidad base y actualización histórica en `Precios_Proveedores`.

FUENTES DE VERDAD OBLIGATORIAS
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- apps/web/src/components/ui/icons.jsx
- apps/api/src/purchases/purchases.repository.js
- apps/api/src/purchases/purchases.service.js
- apps/api/src/purchases/purchases.controller.js

REGLAS DE ARQUITECTURA
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TERMINANTEMENTE TypeScript.
2. CSS Modules exclusivo (.module.css). PROHIBIDO Tailwind.
3. Usar los iconos SVG exportados exclusivamente desde `apps/web/src/components/ui/icons.jsx`.
4. NO asumir campos libres sin validación: selectores interactivos con lista desplegable y búsqueda (`datalist` o componente de dropdown personalizado).

ESPECIFICACIÓN PUNTUAL DE IMPLEMENTACIÓN

FASE 1: VISTA CONDICIONAL SEGÚN ORIGEN (CHECKLIST O INGRESO DIRECTO)
En `apps/web/src/app/operations/purchases/new/page.jsx`:
- Si `sessionStorage.getItem('selectedForPurchase')` contiene elementos:
  * Mostrar pestaña/vista "1. Checklist de Compras en Campo".
  * Agrupar los ítems por `proveedorNombre`.
  * Mostrar tabla con columnas: Checkbox ("Conseguido"), Insumo, Presentación Cotizada, Cantidad Solicitada (input numérico editable), Precio Referencia, y Selector de Estado ("Conseguido" / "Agotado en Tienda" / "Proveedor ya no suministra").
  * Botón "Imprimir Lista de Compra": ejecuta `window.print()`.
  * Regla CSS `@media print`: ocultar barra lateral (Sidebar), barra superior (Header), botones de acción y advertencias. Mostrar solo la planilla con casillas para marcar a lápiz, insumo, cantidad y notas.
  * Botón principal "Continuar a Registro de Factura": pasa a la fase de ingreso llevando únicamente los insumos marcados como "Conseguido". Si un insumo se marcó como "Proveedor ya no suministra", emitir aviso o marcar para desactivar en catálogo.

FASE 2: SELECTOR DE PROVEEDOR CON FILTRADO EN CASCADA
- Campo Proveedor:
  * Input interactivo con desplegable de búsqueda filtrando sobre la lista de proveedores activos de la base de datos.
  * Botón contiguo o primera opción de la lista: "+ Añadir Nuevo Proveedor".
  * Al pulsar "+ Añadir Nuevo Proveedor", abrir un modal liviano que capture: Razón Social (requerido), NIT/Cédula, Teléfono, Persona de Contacto. Al guardar en modal, agregar al estado local de proveedores y dejarlo seleccionado automáticamente.
- Estado en cascada:
  * Al seleccionar un Proveedor con ID válido, consultar o filtrar la lista de precios cotizados de ese proveedor (`Precios_Proveedores`).
  * Los selectores de insumos de las filas de compra solo mostrarán inicialmente los insumos que ese proveedor suministra históricamente.

FASE 3: MATRIZ DE FILAS DE INSUMOS (DETALLE Y CONVERSIÓN)
- Cada fila de insumo debe contar con:
  1. Selector de Insumo:
     - Muestra insumos asociados al proveedor seleccionado.
     - Botón / Opción "+ Registrar Nuevo Insumo": abre modal liviano con Nombre, Categoría (Materia Prima / Empaque), Unidad Base (Litros, Gramos, Kilogramos, Mililitros, Unidades) y Stock Mínimo. Al crearlo, se asigna a la fila actual.
  2. Unidad Base: Etiqueta de solo lectura que indica la unidad oficial del insumo (ej. "Kilogramos" o "Litros") para no confundir al operario.
  3. Stock Mínimo: Texto informativo tenue de solo lectura para referencia operativa.
  4. Marca: Selector con desplegable que lista marcas conocidas de insumos en base de datos, permitiendo escribir una marca nueva si no figura.
  5. Presentación de Compra: Texto comercial descriptivo (ej. "Bulto", "Paca", "Caja", "Galón", "Botella").
  6. Factor de Conversión (Contenido Base): Input numérico con la cantidad neta que contiene cada empaque en la unidad base (ej. si es Bulto y la unidad base es Kilogramos, ingresar 50).
  7. Selector de Unidad de Contenido: Dropdown con opciones [`kg`, `g`, `L`, `ml`, `Unidades`].
  8. Cantidad de Empaques: Número de bultos/cajas compradas (entero > 0).
  9. Precio de Compra por Empaque: Input numérico con el valor monetario pactado (precarga el último precio histórico si existe, pero 100% editable).
  10. Indicadores calculados reactivamente (en tiempo real):
      - Ingreso Neto a Bodega = `Cantidad Empaques * Contenido Base` (ej. "Entran 100 Kilogramos a bodega").
      - Costo Base Calculado = `Precio Empaque / Contenido Base` (ej. "$3000 / Kilogramos").
      - Subtotal de Fila = `Cantidad Empaques * Precio Empaque`.
  11. Botón eliminar fila con confirmación.
  12. Pestaña plegable por fila "Lote y Vencimiento": campos de texto para Lote del fabricante y Fecha de vencimiento (obligatorio si la categoría es Materia Prima).

FASE 4: TOTALES Y CIERRE DE COMPRA
- Barra o panel inferior de liquidación:
  * Consecutivo autogenerado legible `CMP-YYYY-XXXX`.
  * Fecha de compra.
  * Condición de Pago: Selector "Contado" / "Crédito". Si es crédito, input para "Días de Plazo".
  * Subtotal de Insumos acumulado en tiempo real.
  * Input opcional "Flete de Transporte / Acarreo" (se suma al total general).
  * Total Compra liquidado (solo lectura).
  * Botón "Confirmar y Asentar Compra" con estado de carga y validación estricta de que ninguna fila tenga cantidad <= 0 o precio <= 0.

FASE 5: BACKEND TRANSACCIONAL (`apps/api/src/purchases/`)
- Endpoint `POST /purchases`:
  * Envolver toda la persistencia en `prisma.$transaction`.
  * Si viene `esNuevoProveedor: true`, crear el registro en la tabla Proveedores dentro de la transacción.
  * Si alguna fila tiene `esNuevoInsumo: true`, crear el registro en Insumos dentro de la transacción.
  * Insertar cabecera `Compra` y renglones en `DetalleCompras`.
  * Incrementar stock físico en la tabla `Inventarios` calculando la cantidad neta en unidad base (`cantidadEmpaques * contenidoBase`).
  * Registrar movimiento en `Movimientos_Inventario` con tipo `ENTRADA_COMPRA` y referencia al consecutivo generado.
  * Ejecutar upsert/inserción en `Precios_Proveedores` para actualizar el precio del empaque comercial y el costo unitario base vigente.
  * Si la compra es a crédito, generar registro en cuentas por pagar (`Cuentas_Pagar` o tabla financiera correspondiente).

VALIDACIÓN OBLIGATORIA
1. Ejecutar compilación de frontend: `pnpm --filter web build`. Debe finalizar con código de salida 0 sin advertencias críticas ni errores de sintaxis.
2. Verificar que no se hayan introducido archivos `.ts` o `.tsx`.

FORMATO DE REPORTE DE SALIDA
Entregar únicamente el reporte estándar:
• ESTADO: Completado / Fallido
• COMPONENTES INTERVENIDOS: [lista de archivos]
• REGLAS IMPLEMENTADAS: Vista Checklist e impresión, Selector en cascada Proveedor->Insumos, Modales de alta rápida, Conversión comercial reactiva, Transacción atómica en Backend.
• CONFIRMACIÓN DE BUILD: Código de salida 0.