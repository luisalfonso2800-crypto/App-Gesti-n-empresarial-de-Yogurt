# AUDITORÍA DE MODALES Y FORMULARIOS EMERGENTES (FRONTEND)

**Fecha:** 2026-09-12  
**Alcance:** `apps/web/src/`  
**Referencia Normativa:** AGENTS.md (Bloque VI - Modales Inteligentes, UX de Entradas y Resiliencia)

---

### 1. Inventario Consolidado de Modales

| Archivo / Componente | Ruta | Origen de Estilos | Campos Clave | Cumplimiento AGENTS.md |
| :--- | :--- | :--- | :--- | :--- |
| **SupplierModal** | `apps/web/src/components/catalog/SupplierModal.jsx` | `SmartModal` (`.module.css` + inline) | `razonSocial`, `nit`, `telefono`, `direccion`, `email` | **100% Conforme** (Poka-Yoke, UPPERCASE, máscara teléfono `XXX XXX XXXX`, NIT, feedback inline y botón contextual) |
| **SupplyModal** | `apps/web/src/components/catalog/SupplyModal.jsx` | `SmartModal` (`.module.css` + `SmartSelect`) | `nombre`, `categoria`, `subcategoria`, `marca`, `unidadBase`, `stockMinimo`, `costoBase` | **80% Parcial** (Resumen Poka-Yoke y `montoATextoPesos` activos; falta `style={{ textTransform: 'uppercase' }}` en inputs y feedback visual contextual en botón) |
| **SupplierPriceModal** | `apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx` | `SmartModal` (`.module.css` + `SmartSelect`) | `idInsumo`, `idProveedor`, `presentacionCompra`, `cantidadPresentacion`, `precioCompra`, `costoUnidadBase` | **75% Parcial** (Moneda en tiempo real, `montoATextoPesos` y cálculo inverso; carece de UPPERCASE y botón estilizado con `title` contextual) |
| **ProductModal** | `apps/web/src/app/catalog/products/components/ProductModal.jsx` | `SmartModal` (`.module.css` + `SmartSelect`) | `nombre`, `idPresentacion`, `categoria`, `canalVenta`, `precioVenta`, `margenObjetivo` | **80% Parcial** (Moneda en tiempo real, `montoATextoPesos` y resumen Poka-Yoke; carece de UPPERCASE en inputs y botón con cursor/title contextual) |
| **PresentationModal** | `apps/web/src/app/catalog/presentations/components/PresentationModal.jsx` | `SmartModal` (`.module.css` + `SmartSelect`) | `nombre`, `cantidadOz`, `cantidadMl`, `tipoEnvase` | **75% Parcial** (Validación no-negativos y resumen volumétrico; carece de UPPERCASE y botón con opacidad/cursor contextual) |
| **SaleModal** | `apps/web/src/app/commercial/sales/components/SaleModal.jsx` | `SmartModal` (`.module.css` + `SmartSelect`) | `idCliente`, `detalles` (productos, cantidades, precios), `fechaVenta`, `valorPagado` | **85% Parcial** (Balance previo, control reactivo de stock en cava y `montoATextoPesos`; carece de UPPERCASE y botón con feedback de campos faltantes) |
| **ClientsModal** *(Inlined)* | `apps/web/src/app/commercial/clients/page.jsx` | `SmartModal` (`SmartModal.module.css`) | `nombre`, `tipoCliente`, `canal`, `contacto`, `telefono`, `direccion`, `diasCredito` | **65% Parcial** (Resumen Poka-Yoke activo; carece de UPPERCASE, máscara `XXX XXX XXXX` en teléfono y validación integral antes de guardar) |
| **ExpensesModal** *(Inlined)* | `apps/web/src/app/commercial/expenses/page.jsx` | `SmartModal` (`SmartModal.module.css`) | `fecha`, `periodo`, `categoria`, `tipoGasto`, `descripcion`, `valor` | **75% Parcial** (Moneda en vivo, `montoATextoPesos` y cápsula resumen; carece de UPPERCASE en descripción/periodo y título contextual en botón) |
| **PaymentsModal** *(Inlined)* | `apps/web/src/app/commercial/payments/page.jsx` | `SmartModal` (`SmartModal.module.css`) | `fechaPago`, `idCliente`, `idVenta`, `valorPagado`, `metodoPago` | **70% Parcial** (Moneda en vivo, `montoATextoPesos` y alerta de saldo excedido; carece de cápsula verde resumen y botón con title de campos faltantes) |
| **SimulatorModal / AlarmModal** *(Inlined)* | `apps/web/src/app/dashboard/page.jsx` | `SmartModal` / SCADA Overlay (`Dashboard.module.css`) | `diasProyeccion`, `producto`, telemetría de lotes | **Informativo** (Modales de solo lectura y simulación analítica táctica; no realizan mutaciones directas de catálogos) |
| **EditListNameModal & DeleteListModal** | `apps/web/src/app/operations/purchases/page.jsx` | Legacy `Modal` (`modal.module.css`) | `nombre` (código de orden) | **40% No Conforme** (No utilizan `SmartModal`; carecen de confirmación Poka-Yoke contra cierre accidental y banner de error tipificado) |
| **Header Action Modals** (Editar/Descartar) | `apps/web/src/components/shell/Header.jsx` | Legacy `Modal` (`modal.module.css`) | `nombre` de orden de compra | **40% No Conforme** (Uso de contenedor legacy `<Modal>` en lugar del estándar `SmartModal`) |
| **MoveItemModal** | `apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx` | Legacy `Modal` (`modal.module.css`) | `targetOrderId` | **40% No Conforme** (Modal utilitario de movimiento rápido basado en `<Modal>` tradicional) |
| **SelectTargetListModal** | `apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx` | Legacy `Modal` (`modal.module.css`) | Selección de lista de compras | **40% No Conforme** (Diálogo selector de destino montado sobre `<Modal>` legacy) |
| **RecipeModal** *(Pseudo-Modal)* | `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx` | `recipes.module.css` | `nombre`, `idProducto`, `rendimientoBase`, etapas | **Especial** (A pesar del sufijo `Modal`, renderiza un editor de pantalla completa integrado en la página) |
| **ProductionModal** *(Pseudo-Modal)* | `apps/web/src/app/operations/production/components/ProductionModal.jsx` | `production.module.css` | `selectedRecipeId`, `cantidadPlanificada`, BOM | **Especial** (Renderiza vista embebida de orden/simulación BOM a página completa) |

---

### 2. Modales Nuevos Detectados

*(Modales y diálogos localizados fuera del grupo canónico: `SupplierModal`, `SupplyModal`, `SupplierPriceModal`, `ProductModal`, `PresentationModal`, `SaleModal`, `ConfirmActionModal`)*:

1. **ClientsModal** (`apps/web/src/app/commercial/clients/page.jsx`): Formulario emergente para alta y configuración comercial de clientes y días de crédito.
2. **ExpensesModal** (`apps/web/src/app/commercial/expenses/page.jsx`): Formulario emergente para causación de egresos y gastos operativos/administrativos.
3. **PaymentsModal** (`apps/web/src/app/commercial/payments/page.jsx`): Formulario modal para registro de abonos y cancelación de ventas a crédito.
4. **SimulatorModal / AlarmModal** (`apps/web/src/app/dashboard/page.jsx`): Diálogos flotantes analíticos de simulación táctica de inventario y detalle de alarmas SCADA.
5. **EditListNameModal & DeleteListModal** (`apps/web/src/app/operations/purchases/page.jsx`): Diálogos modales auxiliares para renombrar y eliminar listas de compras activas.
6. **Header Action Modals** (`apps/web/src/components/shell/Header.jsx`): Modales de cabecera global para renombrar o descartar órdenes de compra en progreso.
7. **MoveItemModal** (`apps/web/src/app/operations/purchases/new/components/ChecklistItemRow.jsx`): Diálogo emergente para transferir insumos entre diferentes listas en ruta.
8. **SelectTargetListModal** (`apps/web/src/app/catalog/supplier-prices/components/PricesComparisonTable.jsx`): Diálogo emergente para canalizar precios al carrito de una lista específica.
9. **RecipeModal & ProductionModal** (`apps/web/src/app/catalog/recipes/...` y `production/...`): Componentes nombrados como `Modal` que operan como editores de pantalla completa.

---

### 3. Diagnóstico de Discrepancias Globales

- **Carencia de Mayúsculas Automáticas (`UPPERCASE` en `onChange` y `style={{ textTransform: 'uppercase' }}`):**
  - Presentan omisión total: `ClientsModal`, `ExpensesModal`, `ProductModal`, `PresentationModal`, `SupplierPriceModal` y modales legacy de compras/header.
  - Presenta omisión parcial: `SupplyModal` (aplica `.toUpperCase()` en estado, pero carece de `style={{ textTransform: 'uppercase' }}` visual en el DOM).
- **Carencia de Máscaras Activas (Teléfono / NIT):**
  - `ClientsModal`: El campo teléfono utiliza `StrictNumberInput` básico pero no aplica el formato en vivo `XXX XXX XXXX` ni valida longitud de 10 dígitos.
  - Modales legacy de listas: No poseen sanitización preventiva de códigos y nombres de listas.
- **Carencia de Resumen Poka-Yoke en Lenguaje Natural:**
  - `PaymentsModal`: Carece de la cápsula verde con detalle consolidado de cliente, venta imputada y nuevo saldo proyectado.
  - Modales secundarios de compras (`MoveItemModal`, `EditListNameModal`, `Header.jsx`): No muestran resumen previo del impacto de la acción.
- **Carencia de Banner de Error Dinámico de Backend:**
  - `SupplyModal` y `SupplierPriceModal`: Usan mensajes estáticos genéricos como `'Error al guardar'` en lugar de extraer la tipificación de error de la API (`err.response?.data?.message`).
  - Modales utilitarios basados en `Modal.jsx`: No capturan excepciones HTTP en banners visuales internos.
- **Carencia de Bloqueo Contextual en Botón de Guardado (`opacity: 0.5`, `cursor: 'not-allowed'`, `title`):**
  - Todos los modales evaluados excepto `SupplierModal` (`SupplyModal`, `ProductModal`, `PresentationModal`, `SupplierPriceModal`, `SaleModal`, `ClientsModal`, `ExpensesModal`, `PaymentsModal`) usan únicamente el booleano nativo `disabled`, pero carecen del estilo visual explícito (`opacity: 0.5`, `cursor: 'not-allowed'`) y del atributo `title` contextual que informe al usuario exactamente qué campos obligatorios o formatos faltan por corregir.
