TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Crear la suite de pruebas E2E exhaustiva en Playwright (`apps/web/e2e/all-modules-exhaustive.spec.js`) que recorra todos los 14 módulos del menú lateral, testeando la robustez de todos los botones, abriendo cada uno de los 24 modales/drawers identificados en la auditoría, forzando errores de validación (inputs negativos, vacíos) y transfiriendo datos válidos de un módulo al siguiente para probar el flujo de negocio integral:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- Crear EXCLUSIVAMENTE el archivo de prueba indicado abajo sin modificar código funcional.

ARCHIVO A CREAR:
`apps/web/e2e/all-modules-exhaustive.spec.js`

MAPA COMPLETO DE MÓDULOS, MODALES Y BOTONES A PROBAR EN CASCADA:

=== BLOQUE 1: CATÁLOGOS ===
1. Presentaciones (/catalog/presentations):
   - Botón: "Nueva Presentación" -> Abre `PresentationModal`.
   - Test Fuzzing: Enviar vacío, enviar cantidadOz: -5, texto en cantidadMl.
   - Botones Internos: Probar botón "X" y botón "Cancelar".
   - Flujo Válido: Crear "ENVASE PET 500 ML", Oz: 16.9, Ml: 500. Probar botón "Editar" en fila y cancelar.

2. Insumos (/catalog/supplies):
   - Botón: "Nuevo Insumo" -> Abre `SupplyModal`.
   - Test Fuzzing: Enviar sin nombre ni unidadBase, costo negativo. Probar botón "X" y "Cancelar".
   - Flujo Válido: Crear insumos canónicos con unidades reales:
     * "LECHE CRUDA DE VACA" (L)
     * "CULTIVO YOGURT TERMOFILO" (Gramos)
     * "ENVASE PET 500 ML" (asociado a la presentación creada, Unidad).
   - Botón de fila: Probar botón "Eliminar" -> Valida que abra `ConfirmDeleteModal` y cerrarlo con "Cancelar".

3. Proveedores (/catalog/suppliers):
   - Botón: "Nuevo Proveedor" -> Abre `SupplierModal`.
   - Test Fuzzing: Enviar sin nombre ni documento fiscal. Probar cierre modal.
   - Flujo Válido: Crear proveedor "HACIENDA LACTEA SAS" con teléfono y correo válidos.

4. Precios de Proveedor (/catalog/supplier-prices):
   - Botón: "Asignar Precio" -> Abre `SupplierPriceModal`.
   - Encadenamiento: Seleccionar el proveedor "HACIENDA LACTEA SAS" y el insumo "LECHE CRUDA DE VACA".
   - Test Fuzzing: Precio negativo (-100).
   - Flujo Válido: Fijar precio compra $2.600 / L. Probar botón "Mover Lista" -> Abre `MoveListModal` y cancelarlo.

5. Productos (/catalog/products):
   - Botón: "Nuevo Producto Comercial" -> Abre `ProductModal`.
   - Test Fuzzing: Precio venta 0 o negativo, margen inconsistente. Probar cancelar.
   - Flujo Válido: Crear "YOGURT FRESA 500ML", categoría "LACTEOS", asociarlo al envase "ENVASE PET 500 ML", fijar Precio Venta $7.500 y Precio Mayorista $6.200.

6. Recetas (/catalog/recipes):
   - Botón: "Nueva Receta" -> Abre `RecipeModal`.
   - Test Fuzzing: Guardar sin ingredientes o rendimiento base <= 0.
   - Flujo Válido: Enlazar con el producto creado ("YOGURT FRESA 500ML").
     * Wizard interno: Abrir `PackagingWizardModal` y verificar asignación de envase.
     * Agregar ingredientes: Seleccionar "LECHE CRUDA DE VACA" (0.5 L) y "CULTIVO YOGURT TERMOFILO" (2 g).
     * Validar que la unidad de rendimiento se establezca estrictamente en "Unidades". Rendimiento: 10 Unidades.

=== BLOQUE 2: OPERACIONES ===
7. Compras (/operations/purchases y /operations/purchases/new):
   - Botón: "Nueva Compra" -> Abre flujo `/operations/purchases/new`.
   - Botón: "Ver Stock Insumos" -> Abre `StockLookupDrawer` (probar cierre).
   - Botón: "Agregar Pendiente" -> Abre `ChecklistAddPendingModal` (probar cancelar).
   - Flujo Válido: Crear orden de compra a "HACIENDA LACTEA SAS" por 50 Litros de Leche y 50 Envases. Guardar compra.

8. Inventario (/operations/inventory):
   - Pestañas: Recorrer "Insumos / Bodega", "Cava (Prod. Terminado)" y "Semielaborados (WIP)".
   - Botón: "Ajuste Global" -> Abre `GlobalInventoryAdjustmentModal` (probar inputs negativos y cancelar).
   - Botón fila: "Ajustar Item" -> Abre `InventoryItemAdjustmentModal` (probar cancelar).
   - Validar que las existencias de leche y envases comprados se encuentren en bodega con sus unidades exactas (L y Und).

9. Producción (/operations/production):
   - Botón: "Planificar Producción" -> Abre `ProductionPlanningModal`.
   - Encadenamiento: Seleccionar la receta "YOGURT FRESA 500ML", planificar lote por 10 Unidades.
   - Botón fila en orden activa: "Reportar Incidencia" -> Abre `ProductionIncidentModal` (cancelar).
   - Botón fila: "Finalizar y Liquidar Lote" -> Abre `ProductionOrderCompleteModal`.
   - Validación y Cierre: Comprobar que pida "UNIDADES" y liquidar 10 Unidades reales con fecha de vencimiento válida.

10. Lotes (/operations/lots):
    - Validar que aparezca en la lista el lote recién liquidado con estado "DISPONIBLE" y `cantidadDisponible = 10`.
    - Probar los filtros por producto y estado asegurando que no lance errores 404.

=== BLOQUE 3: COMERCIAL ===
11. Clientes (/commercial/clients):
    - Botón: "Nuevo Cliente" -> Abre `ClientFormModal`.
    - Test Fuzzing: Teléfono con letras, email inválido, campos vacíos. Cancelar.
    - Flujo Válido: Crear cliente "TIENDA YOGURT MARKET" (Canal: COMERCIAL, activo).

12. Ventas (/commercial/sales):
    - Botón: "Nueva Venta" -> Abre `SaleModal`.
    - Botón interno: "Nuevo Cliente Rápido" -> Abre `ClientFormModal` anidado (probar cancelar y volver al modal de venta).
    - Botón interno: "Agregar Productos desde Cava" -> Abre `SaleCavaCatalogDrawer`.
    - Validación: Encontrar la tarjeta del producto fabricado ("YOGURT FRESA 500ML"). Comprobar que diga "Stock Cava: 10 und" (o el remanente) y agregar 4 unidades al pedido.
    - Confirmar venta por 4 unidades asignada a "TIENDA YOGURT MARKET".
    - Botón fila en venta: "Despachar" -> Abre `SalesDispatchModal` y confirmar el despacho físico.

13. Pagos / Cobros (/commercial/payments):
    - Botón: "Registrar Pago" -> Abre `PaymentFormModal`.
    - Encadenamiento: Seleccionar la venta recién creada y registrar un abono/pago total (efectivo o transferencia).
    - Validar que la deuda de la venta disminuya o pase a estado "PAGADO".

14. Gastos (/commercial/expenses):
    - Botón: "Nuevo Gasto" -> Abre `ExpenseFormModal`.
    - Test Fuzzing: Monto negativo o categoría vacía. Cancelar.
    - Flujo Válido: Registrar gasto operacional "Servicios Públicos / Energía Cava" por $50.000.

VERIFICACIÓN:
1. `node --check apps/web/e2e/all-modules-exhaustive.spec.js`
2. `pnpm --filter web exec playwright test all-modules-exhaustive.spec.js`

CRITERIO DE FINALIZACIÓN:
- Los 14 módulos son visitados y validados.
- Los 24 modales/drawers abren, resisten inputs inválidos y cierran correctamente mediante sus botones cancelar/X.
- Los datos fluyen de forma encadenada desde el envase hasta el pago comercial sin corromper el estado.
- Reporte 100% verde en Playwright.

DETENCIÓN:
Al validar sintaxis y verificar ejecución de la prueba, DETENTE inmediatamente.
