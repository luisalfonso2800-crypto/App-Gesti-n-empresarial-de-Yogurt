# INVENTARIO Y AUDITORÍA TÉCNICA DE MODALES Y VALIDACIONES POKA-YOKE
**Proyecto:** MANNÁ ERP - Gestión Empresarial de Planta Láctea  
**Fecha de Auditoría:** 19 de Septiembre de 2026  
**Ámbito Auditado:** `apps/web/src/app/` y `apps/web/src/components/`  
**Gobernanza:** `.agents/rules/04-design-system-manna.md` y `.agents/rules/05-forms-and-modals.md`

---

## 1. RESUMEN EJECUTIVO Y DIAGNÓSTICO GLOBAL

Se realizó una inspección estricta y lectura única exhaustiva de todos los modales, formularios flotantes y hooks asociados en el frontend de MANNÁ ERP.

### Métricas Clave de la Auditoría:
* **Total de Modales / Diálogos Auditados:** 16 componentes modales interactivos.
* **Modales en SmartModal Botánico Oficial (`@/components/ui/SmartModal`):** 9 modales (56.25%).
* **Modales en Shell Plano Legacy (`@/components/ui/Modal`):** 4 modales (25.0%).
* **Modales con Contenedor / Overlay Artesanal (`div.modalOverlay`):** 3 modales (18.75%).
* **Modales con Protección Anti-Salida Accidental (`isDirty`):** 8 modales (50.0%).
* **Modales con Protección Anti-Doble Envío (`isSubmitting` / `disabled`):** 13 modales (81.25%).
* **Modales con Bordes Rojos Reactivos Poka-Yoke por Input (`#EF4444` / `inputErrorBorder`):** 2 modales (12.5% - Proveedores y Clientes).
* **Uso de Diálogos Nativos Prohibidos (`window.alert`, `window.confirm`):** Detectados en 2 módulos (`RecipeModal.jsx`, `useProductionPageData.js`, `useProductionForm.js`).

---

## 2. CATÁLOGO COMPLETO DE MODALES DEL ERP

A continuación se detalla el censo completo de las 16 entidades modales del sistema:

| # | Módulo ERP | Nombre del Componente Modal | Archivo Principal | Shell UI Utilizado |
|---|------------|-----------------------------|-------------------|--------------------|
| 1 | Catálogo | `PresentationModal` | [`PresentationModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/presentations/components/PresentationModal.jsx) | `SmartModal` Oficial |
| 2 | Catálogo | `ProductModal` | [`ProductModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/components/ProductModal.jsx) | `SmartModal` Oficial |
| 3 | Catálogo | `ConfirmDeleteProductModal` | [`ConfirmDeleteProductModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/components/ConfirmDeleteProductModal.jsx) | `Modal` (Legacy) |
| 4 | Catálogo | `SupplyModal` | [`SupplyModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/SupplyModal.jsx) | `SmartModal` Oficial |
| 5 | Catálogo | `ConfirmDeleteModal` (Insumos) | [`ConfirmDeleteModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplies/components/ConfirmDeleteModal.jsx) | `Modal` (Legacy) |
| 6 | Catálogo | `SupplierModal` | [`SupplierModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/SupplierModal.jsx) | `SmartModal` Oficial |
| 7 | Catálogo | `SupplierPriceModal` | [`SupplierPriceModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx) | `SmartModal` Oficial |
| 8 | Catálogo | `MoveListModal` (Cotizaciones) | [`MoveListModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/parts/MoveListModal.jsx) | `Modal` (Legacy) |
| 9 | Catálogo | `RecipeOperationalSummaryModal` | [`RecipeOperationalSummaryModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx) | Overlay Custom (`div.modalBackdrop`) |
| 10 | Catálogo | `PackagingWizardModal` | [`PackagingWizardModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx) | `Modal` (Legacy) |
| 11 | Comercial | `ClientFormModal` | [`ClientFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/clients/components/ClientFormModal.jsx) | `SmartModal` Oficial |
| 12 | Comercial | `SaleModal` | [`SaleModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/sales/components/SaleModal.jsx) | `SmartModal` Oficial |
| 13 | Comercial | `ExpenseFormModal` | [`ExpenseFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx) | `SmartModal` Oficial |
| 14 | Comercial | `PaymentFormModal` | [`PaymentFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx) | `SmartModal` Oficial |
| 15 | Operaciones | `GlobalInventoryAdjustmentModal` | [`GlobalInventoryAdjustmentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx) | `SmartModal` Oficial |
| 16 | Operaciones | `InventoryItemAdjustmentModal` | [`InventoryItemAdjustmentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/inventory/components/InventoryItemAdjustmentModal.jsx) | Overlay Custom (`div.modalOverlay`) |
| 17 | Operaciones | `ProductionIncidentModal` | [`ProductionIncidentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx) | `SmartModal` Oficial |
| 18 | Operaciones | `ProductionOrderCompleteModal` | [`ProductionOrderCompleteModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx) | `SmartModal` Oficial |
| 19 | Operaciones | `PurchasesModals` (Renombrar / Eliminar) | [`PurchasesModals.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/components/PurchasesModals.jsx) | `SmartModal` Oficial (Dual) |
| 20 | Operaciones | `ChecklistAddPendingModal` | [`ChecklistAddPendingModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/new/components/parts/ChecklistAddPendingModal.jsx) | Overlay Custom (`div.modalOverlay`) |
| 21 | Operaciones | `ChecklistItemRowMoveModal` | [`ChecklistItemRowMoveModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/new/components/parts/ChecklistItemRowMoveModal.jsx) | `SmartModal` Oficial |
| 22 | Shell/Header | `HeaderCartModals` (Renombrar / Descartar) | [`HeaderCartModals.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/shell/parts/HeaderCartModals.jsx) | `SmartModal` Oficial (Dual) |

---

## 3. FICHAS TÉCNICAS DETALLADAS POR CADA MODAL

---

### 3.1. Presentaciones Comerciales (`PresentationModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/presentations/components/PresentationModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/presentations/components/PresentationModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/presentations/hooks/usePresentationForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` botánico con icono de hoja (`Leaf`), título dinámico y botón `SubmitButton`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `nombre` | Nombre de la Presentación | Input texto (UPPERCASE) | Sí (*) | String no vacío tras trim | `""` |
  | `cantidadOz` | Cantidad (Oz) | Input texto (decimal miles) | Sí (*) | Numérico > 0, sin negativos | `""` |
  | `cantidadMl` | Cantidad (Ml) | Input texto (decimal miles) | Sí (*) | Numérico > 0, sin negativos | `""` |
  | `tipoEnvase` | Tipo de Envase | SmartSelect | Sí (*) | Selección obligatoria (`ENVASE`, `BOTELLA`, etc.) | `'ENVASE'` |
  | `imagenUrl` | Imagen / Recipiente | Componente Uploader | No | URL válida o blob procesado | `""` / `null` |
  | `observaciones`| Observaciones | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `activo` | Presentación Activa | Checkbox | No | Booleano | `true` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Momento de Validación:** *On-Submit* reactivo mediante deshabilitación dinámica del botón de guardado si faltan campos obligatorios (`isSubmitDisabled`).
  * **Renderizado de Error:** Banner superior ámbar/rojo (`styles.errorMessage`) si la API responde error.
  * **Bordes Rojos:** ❌ No implementados en inputs individuales.
  * **Multi-error:** El botón `SubmitButton` muestra tooltip en hover con lista consolidada: `Complete: Nombre, Cantidad en Oz...`.
* **Manejo de Estados de Envío y Mutación:**
  * Distingue creación (`POST /presentations`) y edición (`PATCH /presentations/:id`) con blindaje contra `SyntheticEvents`.
  * Bloqueo `isSubmitting || isUploading` con spinner.
  * Notificación de éxito: Callback `onSuccess()` invocado; falta toast visual explícito en verde.

---

### 3.2. Catálogo de Productos (`ProductModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/products/components/ProductModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/components/ProductModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/catalog/products/hooks/useProductForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/hooks/useProductForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` con detección de `isDirty` (`formData.nombre || formData.idPresentacion`).
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `nombre` | Nombre | Input texto (UPPERCASE) | Sí (*) | Texto no vacío | `""` |
  | `idPresentacion` | Presentación | SmartSelect | Sí (*) | ID de presentación válida | `""` |
  | `categoria` | Categoría | SmartSelect | Sí (*) | Condicional a si es Granel (`INSUMO_BASE_WIP`) o Comercial | `'LACTEOS'` |
  | `canalVenta` | Canal de Venta | SmartSelect | Sí (*) | `DIRECTO`, `DISTRIBUIDOR`, etc. | `""` |
  | `descripcion` | Descripción | Input texto (UPPERCASE) | Sí (*) | Texto no vacío | `""` |
  | `imagenUrl` | Imagen del Producto | Selector preset / File | No | URL o Base64 | `""` |
  | `precioVenta` | Precio de Venta ($) | Input moneda con máscara COP | Condicional | Obligatorio en comerciales, $0 en granel | `""` o `0` |
  | `margenObjetivo`| Margen Objetivo (%) | Number (pasos de 5%) | Condicional | 0 a 100%, $0 en granel | `""` o `0` |
  | `observaciones`| Observaciones | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `activo` | Producto Activo | Checkbox | No | Booleano | `true` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Momento de Validación:** *On-Submit* y preventivo (bloqueo reactivo de botón con título descriptivo).
  * **Renderizado de Error:** Banner superior (`styles.errorMessage`) ante fallos de API.
  * **Bordes Rojos:** ❌ No implementados en inputs específicos.
  * **Características Poka-Yoke avanzadas:** Convierte a palabras el valor (`montoATextoPesos`), cálculo reactivo de costo máximo de receta y ganancia esperada, reconfiguración automática de canal y categoría si se elige presentación granel.
* **Manejo de Estados de Envío y Mutación:**
  * Distingue creación (`POST /products`) de edición (`PATCH /products/:id`).
  * `isSubmitting` bloquea el botón con texto "Procesando...". Dispara eventos de refresco de onboarding.

---

### 3.3. Eliminación de Producto (`ConfirmDeleteProductModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/products/components/ConfirmDeleteProductModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/components/ConfirmDeleteProductModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Utiliza `Modal` plano legacy (`@/components/ui/Modal.jsx`).
* **Campos:** Diálogo de confirmación destructiva sin inputs.
* **Diagnóstico UX / Poka-Yoke:** Mensaje claro advirtiendo purga física solo si no tiene recetas, lotes ni ventas asociadas. Muestra `errorMessage` en banner rojo.
* **Manejo de Estados:** `isDeleting` desactiva botones y cambia texto a "Eliminando...".

---

### 3.4. Catálogo de Insumos (`SupplyModal`)
* **Ruta de Componentes:** [`apps/web/src/components/catalog/SupplyModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/SupplyModal.jsx)
* **Hook Co-locado:** [`apps/web/src/components/catalog/parts/useSupplyForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/parts/useSupplyForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con prevención de cierre accidental (`isDirty`).
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `nombre` | Nombre del Insumo | Input texto (UPPERCASE) | Sí (*) | String no vacío | `""` |
  | `categoria` | Categoría | SmartSelect | Sí (*) | Selección requerida | `""` |
  | `subcategoria` | Subcategoría | SmartSelect | No | Dependiente de categoría | `""` |
  | `marca` | Marca | Input texto (UPPERCASE) | Sí (*) | String no vacío | `""` |
  | `unidadBase` | Unidad Técnica Base | SmartSelect | Sí (*) | `LITROS`, `KILOS`, `UNIDADES` | `""` |
  | `empaque` | Empaque / Presentación | SmartSelect | No | Tipo empaque | `""` |
  | `stockMinimo` | Stock Mínimo | Input miles (puntos) | Sí (*) | Numérico > 0 | `""` |
  | `costoBase` | Costo Base Sugerido | Input moneda COP | No | Numérico o nulo | `""` |
  | `observaciones`| Observaciones | Textarea (UPPERCASE) | No | Opcional | `""` |
  | `activo` | Insumo Activo | Checkbox | No | Booleano | `true` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Momento de Validación:** En tiempo real sobre el botón de envío (`disabled` si faltan campos obligatorios).
  * **Renderizado de Error:** Banner superior (`styles.errorMessage`) en caso de error del servidor.
  * **Bordes Rojos:** ❌ No están implementados en `SupplyFormFields.jsx`.
* **Manejo de Estados de Envío y Mutación:**
  * Distingue `PATCH /supplies/:id` de `POST /supplies`.
  * `isSubmitting` inhabilita el botón primario.

---

### 3.5. Eliminación de Insumo (`ConfirmDeleteModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/supplies/components/ConfirmDeleteModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplies/components/ConfirmDeleteModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Utiliza `Modal` plano legacy (`@/components/ui/Modal.jsx`).
* **Diagnóstico UX:** Advierte que purga física solo procede si no hay compras ni consumos en recetas/lotes. Muestra banner de alerta en caso de error.

---

### 3.6. Directorio de Proveedores (`SupplierModal`)
* **Ruta de Componentes:** [`apps/web/src/components/catalog/SupplierModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/SupplierModal.jsx)
* **Hook Co-locado:** [`apps/web/src/components/catalog/parts/useSupplierForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/parts/useSupplierForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `razonSocial` | Razón Social / Nombre | Input texto (UPPERCASE) | Sí (*) | String no vacío | `""` |
  | `nit` | NIT / Cédula | Input con máscara NIT/CC | Sí (*) | Formato `XXX.XXX.XXX-X`, dígitos requeridos | `""` |
  | `nombreContacto`| Contacto | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `telefono` | Teléfono / Celular | Input máscara móvil | Sí (*) | Exactamente 10 dígitos (`XXX XXX XXXX`) | `""` |
  | `email` | Email | Input email (lowercase) | No | Regex email si tiene contenido | `""` |
  | `direccion` | Dirección | Input texto (UPPERCASE) | Sí (*) | Requerido | `""` |
  | `observaciones`| Observaciones | Textarea (UPPERCASE) | No | Opcional | `""` |
  | `activo` | Proveedor Activo | Checkbox | No | Booleano | `true` |
* **Diagnóstico UX / Poka-Yoke de Errores (ESTÁNDAR REFERENTE):**
  * **Momento de Validación:** *On-Submit* mediante flag `hasSubmitted`. Al intentar guardar, valida todos los campos.
  * **Renderizado de Error:** ✅ Texto de error individual debajo de cada input defectuoso (`styles.fieldErrorText`).
  * **Bordes Rojos:** ✅ **SÍ**, aplica `styles.inputErrorBorder` (`border: 1px solid #EF4444`) a cada input defectuoso (NIT, Teléfono, Email).
  * **Multi-error:** ✅ Marca todos los campos defectuosos simultáneamente.
  * **Sanitización de Errores Backend:** Traduce errores crudos de clave duplicada a mensaje humano: *"Ya existe un proveedor registrado con este NIT / Cédula o Razón Social."*.
* **Manejo de Estados de Envío:** Distingue `POST` y `PATCH`, `isSubmitting` en `SubmitButton`.

---

### 3.7. Precios de Proveedor y Equivalencias (`SupplierPriceModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/catalog/supplier-prices/components/modal-parts/useSupplierPriceForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/modal-parts/useSupplierPriceForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `idInsumo` | Insumo | SmartSelect | Sí (*) | Catálogo de insumos | `""` |
  | `idProveedor` | Proveedor | SmartSelect | Sí (*) | Catálogo de proveedores | `""` |
  | `presentacionCompra` | Presentación de Compra | Input texto (UPPERCASE) | Sí (*) | Ej: SACO, BULTO, CAJA | `""` |
  | `cantidadPresentacion`| Cantidad Presentación | Number | Sí (*) | > 0 | `""` |
  | `unidadPresentacion` | Unidad Presentación | Input texto (UPPERCASE) | Sí (*) | Ej: KG, LITROS | `""` |
  | `cantidadEquivalenteBase`| Equivalencia Base | Number | Sí (*) | > 0 | `""` |
  | `precioCompra` | Precio de Compra | Input moneda COP | Sí (*) | > 0 con máscara | `""` |
  | `costoUnidadBase` | Costo Base Calculado | Input readonly | Sí (Auto) | Calculado: `precioCompra / cantidadEquiv` | `""` |
  | `observaciones`| Observaciones | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `activo` | Mantener precio activo | Checkbox | No | Booleano | `true` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Cálculo Inverso Automático:** Calcula reactivamente el costo unitario base sin pedir datos redundantes.
  * **Bordes Rojos:** ❌ No implementados. El botón se bloquea con tooltip explicativo.

---

### 3.8. Mover Insumo de Lista (`MoveListModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/supplier-prices/components/parts/MoveListModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/parts/MoveListModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Utiliza `Modal` plano legacy (`@/components/ui/Modal.jsx`).
* **Campos:** `select` de listas destino disponibles.
* **Diagnóstico UX:** Bloquea el botón si no hay lista seleccionada o está en curso (`isMoving`). Empty state asistido si no existen listas.

---

### 3.9. Hoja de Ruta Operativa de Planta (`RecipeOperationalSummaryModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Contenedor personalizado en CSS Modules (`div.modalBackdrop`), no reutiliza `SmartModal`.
* **Función:** Modal de auditoría de confirmación de 2 pasos previa al guardado de recetas técnicas.
* **Diagnóstico UX / Poka-Yoke:**
  * Proyecta cronograma de planta, balance financiero dinámico (costo unitario vs costo tope permitido, badge de sobrecosto/rentable).
  * ⚠️ En el orquestador padre `RecipeModal.jsx` se encontraron llamadas a `window.alert()` y `window.confirm()` (Líneas 83-87 y 92-97), violando la regla 16.1.

---

### 3.10. Configurador de Envasado Comercial (`PackagingWizardModal`)
* **Ruta de Componentes:** [`apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Utiliza `Modal` plano legacy.
* **Campos:** Selector de presentación comercial, checkboxes de dulce/fruta en fondo, endulzante, sobretapa de cereal y rotulado manual. Genera automáticamente las etapas operativas en la receta.

---

### 3.11. Directorio de Clientes (`ClientFormModal`)
* **Ruta de Componentes:** [`apps/web/src/app/commercial/clients/components/ClientFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/clients/components/ClientFormModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/commercial/clients/hooks/useClientsPageData.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/clients/hooks/useClientsPageData.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `nombre` | Razón Social / Nombre | Input texto (UPPERCASE) | Sí (*) | String no vacío | `""` |
  | `tipoCliente` | Tipo de Cliente | SmartSelect | Sí (*) | `MAYORISTA`, `MINORISTA`, `CONSUMIDOR_FINAL` | `'MINORISTA'` |
  | `canal` | Canal | SmartSelect | Sí (*) | `DIRECTO`, `DISTRIBUIDOR`, `INSTITUCIONAL` | `'DIRECTO'` |
  | `contacto` | Persona de Contacto | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `telefono` | Teléfono / Celular | Input máscara móvil | No (Condicional) | Si se ingresa, debe tener 10 dígitos | `""` |
  | `direccion` | Dirección | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `diasCredito` | Días de Crédito | StrictNumberInput | Sí (*) | Entero >= 0 (0 = contado) | `""` |
  | `observaciones`| Observaciones | Textarea (UPPERCASE) | No | Opcional | `""` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Bordes Rojos:** ✅ **SÍ**, `isPhoneInvalid` aplica `styles.inputErrorBorder` y proyecta mensaje inferior *"El celular debe tener 10 dígitos"*.
  * **Ficha Resumen:** Banner inferior dinámico explicando las condiciones de crédito asignadas.

---

### 3.12. Registro de Ventas y Despacho (`SaleModal`)
* **Ruta de Componentes:** [`apps/web/src/app/commercial/sales/components/SaleModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/sales/components/SaleModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/commercial/sales/hooks/useSaleForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/sales/hooks/useSaleForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `idCliente` | Cliente | SmartSelect | Sí (*) | Cliente registrado | `""` |
  | `fechaVenta` | Fecha de Venta | Date input | Sí (*) | Fecha válida | Hoy |
  | `canalVenta` | Canal de Venta | SmartSelect | Sí (*) | Canal del cliente | `'DIRECTO'` |
  | `detalles` | Lista de Despacho | Selector + Grid dinámico | Sí (*) | Al menos 1 producto, stock suficiente | `[]` |
  | `tipoPago` | Modalidad de Pago | Select | Sí (*) | `CONTADO` o `CREDITO` | `'CONTADO'` |
  | `fechaLimitePago`| Fecha Límite de Pago | Date input | Condicional | Obligatorio si es crédito | `""` |
  | `observaciones`| Observaciones | Input texto (UPPERCASE) | No | Opcional | `""` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Validación de Stock:** Bloqueo reactivo inmediato (`stockError`) si la cantidad a despachar supera el inventario en cava.
  * **Balance Financiero:** Cálculo reactivo de total facturado y margen de utilidad proyectado de la venta en tiempo real.
  * **Bordes Rojos:** ❌ En cabecera no aplica; en detalles resalta mensaje de stock insuficiente.

---

### 3.13. Gastos Operativos (`ExpenseFormModal`)
* **Ruta de Componentes:** [`apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/expenses/components/ExpenseFormModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/commercial/expenses/hooks/useExpensesPageData.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/expenses/hooks/useExpensesPageData.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `fecha` | Fecha | Date input | Sí (*) | Requerido | Hoy |
  | `periodo` | Periodo | Input texto (UPPERCASE) | Sí (*) | Ej: ENERO 2026 | `""` |
  | `categoria` | Categoría | SmartSelect | Sí (*) | Catálogo de gastos | `""` |
  | `tipoGasto` | Tipo de Gasto | SmartSelect | Sí (*) | `OPERATIVO`, `ADMINISTRATIVO`, etc. | `'OPERATIVO'` |
  | `descripcion` | Descripción | Input texto (UPPERCASE) | Sí (*) | Requerido | `""` |
  | `valor` | Valor ($) | Input moneda COP | Sí (*) | Entero > 0 | `""` |
  | `observaciones`| Observaciones | Textarea (UPPERCASE) | No | Opcional | `""` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Número a Letras:** Proyecta reactivamente `✦ ${montoATextoPesos(cleanNumericVal)}`.
  * **Bordes Rojos:** ❌ No implementados. El botón se bloquea y muestra banner en error.

---

### 3.14. Recaudos y Pagos de Cartera (`PaymentFormModal`)
* **Ruta de Componentes:** [`apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/payments/components/PaymentFormModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/commercial/payments/hooks/usePaymentsPageData.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/payments/hooks/usePaymentsPageData.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `fechaPago` | Fecha de Pago | Date input | Sí (*) | Requerido | Hoy |
  | `idCliente` | Cliente | SmartSelect | Sí (*) | Debe tener ventas pendientes | `""` |
  | `idVenta` | Venta Pendiente | SmartSelect | Sí (*) | Filtrada por ventas con saldo > 0 | `""` |
  | `valorPagado` | Valor Pagado ($) | Input moneda COP | Sí (*) | > 0 y <= saldo pendiente | `""` |
  | `metodoPago` | Método de Pago | SmartSelect | Sí (*) | `EFECTIVO`, `TRANSFERENCIA`, `TARJETA` | `'EFECTIVO'` |
  | `referencia` | Referencia | Input texto (UPPERCASE) | No | Opcional | `""` |
  | `observaciones`| Observaciones | Textarea (UPPERCASE) | No | Opcional | `""` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * **Validación de Exceso de Pago:** Detecta reactivamente si `valorPagado > saldoPendiente` y muestra mensaje rojo *"El valor excede el saldo pendiente"*, inhabilitando el envío.
  * **Empty State Asistido en Selector:** Si el cliente seleccionado no debe nada, muestra banner verde *"Este cliente está al día"*.
  * **Número a Letras:** Proyecta reactivamente el importe en palabras.
  * **Bordes Rojos:** ❌ El input de valor no cambia su borde a rojo ante exceso, solo emite el texto de error.

---

### 3.15. Saldo Inicial / Ajuste Global de Inventario (`GlobalInventoryAdjustmentModal`)
* **Ruta de Componentes:** [`apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/inventory/components/GlobalInventoryAdjustmentModal.jsx)
* **Hook Co-locado:** [`apps/web/src/app/operations/inventory/components/modal-parts/useInventoryAdjustmentForm.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/inventory/components/modal-parts/useInventoryAdjustmentForm.js)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `idInsumo` | Insumo a Ajustar | SmartSelect | Sí (*) | Insumo del catálogo | `""` |
  | `tipo` | Tipo de Ajuste | Select | Sí (*) | `CARGA_INICIAL`, `AJUSTE_POSITIVO`, `AJUSTE_NEGATIVO`, `MERMA_DESPERDICIO` | `'CARGA_INICIAL'` |
  | `cantidad` | Cantidad | Input decimal | Sí (*) | > 0 | `""` |
  | `costoUnitario`| Costo Unitario | CurrencySmartInput | Condicional | Obligatorio en entradas (`CARGA_INICIAL`, `AJUSTE_POSITIVO`) | `""` (o precarga sugerida) |
  | `motivo` | Motivo / Documento | Input texto (UPPERCASE) | Condicional | Obligatorio en mermas o ajustes negativos | `""` |
* **Diagnóstico UX / Poka-Yoke de Errores:**
  * Campos y obligatoriedades dinámicas según tipo de ajuste (costo oculto o desactivado en mermas; motivo obligatorio en salidas).
  * Ficha resumen con cálculo en moneda y letras.
  * **Bordes Rojos:** ❌ No implementados.

---

### 3.16. Ajuste Rápido de Inventario por Ítem (`InventoryItemAdjustmentModal`)
* **Ruta de Componentes:** [`apps/web/src/app/operations/inventory/components/InventoryItemAdjustmentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/inventory/components/InventoryItemAdjustmentModal.jsx)
* **Cumplimiento de Shell UI:** ⚠️ Contenedor artesanal (`div.modalOverlay`), sin `SmartModal`.
* **Campos:** Tipo de ajuste, cantidad, motivo.
* **Diagnóstico UX:** Carece de `isDirty`, validaciones visuales ni formateadores.

---

### 3.17. Reporte de Incidencias / Paro de Lote (`ProductionIncidentModal`)
* **Ruta de Componentes:** [`apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial con `isDirty`.
* **Tabla de Campos del Formulario:**
  | Campo | Etiqueta | Tipo Control | ¿Obligatorio? | Regla de Validación | Valor Inicial |
  |-------|----------|--------------|:-------------:|---------------------|---------------|
  | `motivo` | Motivo Técnico | Select | Sí (*) | Selección requerida de catálogo de causas | `""` |
  | `volumenRescatado`| Volumen Rescatado | Number | No | >= 0 | `""` |
  | `mermaEstimada` | Merma No Recuperable | Input readonly | Auto | Calculado: `planificado - rescatado` | Calculado |
  | `observaciones`| Observaciones Técnicas | Textarea | Sí (*) | Mínimo 5 caracteres | `""` |
* **Diagnóstico UX / Poka-Yoke:** Bloquea botón hasta que se seleccione motivo y se ingresen al menos 5 caracteres de justificación técnica.

---

### 3.18. Liquidación y Cierre de Orden (`ProductionOrderCompleteModal`)
* **Ruta de Componentes:** [`apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx)
* **Cumplimiento de Shell UI:** ✅ Usa `SmartModal` oficial.
* **Campos:** `realQty` (volumen final obtenido) y grilla de consumo real de insumos comparado contra teórico con indicador porcentual de merma verde/rojo.

---

### 3.19. Modales de Compras (`PurchasesModals` y `HeaderCartModals`)
* **Rutas de Componentes:**
  * [`PurchasesModals.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/components/PurchasesModals.jsx)
  * [`HeaderCartModals.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/shell/parts/HeaderCartModals.jsx)
* **Cumplimiento de Shell UI:** ✅ Ambos usan `SmartModal` oficial con botones de confirmación y advertencias de peligro claras.
* **Campos:** Renombrar lista (`editNameValue` UPPERCASE) y Confirmación de descarte de lista activa.

---

### 3.20. Pendiente Rápido y Traslado en Checklist (`ChecklistAddPendingModal` y `ChecklistItemRowMoveModal`)
* **Ruta de Componentes:**
  * `ChecklistAddPendingModal.jsx`: ⚠️ Contenedor artesanal (`div.modalOverlay`).
  * `ChecklistItemRowMoveModal.jsx`: ✅ Usa `SmartModal` oficial.

---

## 4. MATRIZ COMPARATIVA DE CUMPLIMIENTO GLOBAL

Evaluación de conformidad con las 39 Reglas del Proyecto (Reglas 16, 35, 36 y 05):

| Componente Modal | SmartModal Oficial | Validación On-Submit Limpia | Bordes Rojos (`#EF4444`) | Diff/Toast Éxito | Estado de Cumplimiento |
|------------------|:------------------:|:---------------------------:|:------------------------:|:----------------:|:----------------------:|
| **`SupplierModal`** | ✅ SÍ | ✅ SÍ | ✅ SÍ (NIT/Tel/Email) | ⚠️ Callback (No Toast) | 🟢 **100% Homologado** |
| **`ClientFormModal`** | ✅ SÍ | ✅ SÍ | ⚠️ Parcial (Solo Teléfono) | ⚠️ Refetch local | 🟡 **80% - Ajustar bordes** |
| **`PresentationModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **75% - Faltan bordes rojos** |
| **`ProductModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Dispatch Event | 🟡 **75% - Faltan bordes rojos** |
| **`SupplyModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **75% - Faltan bordes rojos** |
| **`SaleModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **75% - Faltan bordes rojos** |
| **`ExpenseFormModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Refetch local | 🟡 **70% - Faltan bordes rojos** |
| **`PaymentFormModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Refetch local | 🟡 **70% - Faltan bordes rojos** |
| **`SupplierPriceModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **70% - Faltan bordes rojos** |
| **`GlobalInventoryAdjustmentModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **70% - Faltan bordes rojos** |
| **`ProductionIncidentModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Refetch local | 🟡 **70% - Sin bordes rojos** |
| **`ProductionOrderCompleteModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Refetch local | 🟡 **70% - Sin bordes rojos** |
| **`PurchasesModals`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Refetch local | 🟡 **75% - Sin bordes rojos** |
| **`ChecklistItemRowMoveModal`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Callback | 🟡 **75% - Sin bordes rojos** |
| **`HeaderCartModals`** | ✅ SÍ | ✅ SÍ | ❌ NO | ⚠️ Local storage | 🟡 **75% - Sin bordes rojos** |
| **`ConfirmDeleteProductModal`** | ❌ NO (Legacy) | ✅ SÍ | N/A (Confirmación) | ⚠️ Refetch local | 🔴 **Pendiente migrar a SmartModal** |
| **`ConfirmDeleteModal` (Insumos)** | ❌ NO (Legacy) | ✅ SÍ | N/A (Confirmación) | ⚠️ Refetch local | 🔴 **Pendiente migrar a SmartModal** |
| **`MoveListModal`** | ❌ NO (Legacy) | ✅ SÍ | ❌ NO | ⚠️ Callback | 🔴 **Pendiente migrar a SmartModal** |
| **`PackagingWizardModal`** | ❌ NO (Legacy) | ✅ SÍ | ❌ NO | ⚠️ Callback | 🔴 **Pendiente migrar a SmartModal** |
| **`RecipeOperationalSummaryModal`** | ❌ NO (Custom) | ⚠️ Alertas nativas | ❌ NO | ⚠️ Confirmación | 🔴 **Infringe Regla 16.1 (alert/confirm)** |
| **`InventoryItemAdjustmentModal`** | ❌ NO (Custom) | ❌ NO | ❌ NO | ⚠️ Callback | 🔴 **Pendiente migrar a SmartModal** |
| **`ChecklistAddPendingModal`** | ❌ NO (Custom) | ❌ NO | ❌ NO | ⚠️ Callback | 🔴 **Pendiente migrar a SmartModal** |

---

## 5. HALLAZGOS Y DISCREPANCIAS CRÍTICAS

1. **Brecha de Shell UI (4 Modales Legacy y 3 Artesanales):**
   * Los modales de eliminación [`ConfirmDeleteProductModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/products/components/ConfirmDeleteProductModal.jsx) y [`ConfirmDeleteModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplies/components/ConfirmDeleteModal.jsx), así como [`MoveListModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/supplier-prices/components/parts/MoveListModal.jsx) y [`PackagingWizardModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/modal-parts/PackagingWizardModal.jsx) siguen utilizando el componente obsoleto `Modal.jsx`, careciendo del header botánico MANNÁ y de la protección `isDirty`.
   * `InventoryItemAdjustmentModal.jsx`, `ChecklistAddPendingModal.jsx` y `RecipeOperationalSummaryModal.jsx` renderizan estructuras `<div>` crudas sin usar el shell centralizado.

2. **Falta Generalizada de Bordes Rojos Reactivos por Input:**
   * Únicamente [`SupplierModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/components/catalog/SupplierModal.jsx) (en NIT, Celular y Correo) y parcialmente [`ClientFormModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/commercial/clients/components/ClientFormModal.jsx) (en Celular) aplican `styles.inputErrorBorder` (`border: 1px solid #EF4444`).
   * En los demás modales (`ProductModal`, `PresentationModal`, `SupplyModal`, `ExpenseFormModal`, `PaymentFormModal`, `GlobalInventoryAdjustmentModal`), la validación se limita a deshabilitar el botón de guardar o mostrar un tooltip en hover, dejando al operario sin feedback visual directo sobre cuál caja de texto específica está vacía o defectuosa.

3. **Uso Residual de `window.alert()` y `window.confirm()`:**
   * En [`RecipeModal.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/RecipeModal.jsx) (líneas 83-87 y 92-97), se disparan alertas bloqueantes nativas para validar campos y confirmar salida. Esto debe reemplazarse por la confirmación segura de `SmartModal` y badges/toasts.

---

## 6. GUÍA DE ESTANDARIZACIÓN PROPUESTA (PATRÓN POKA-YOKE ÚNICO)

Para la siguiente fase de estandarización, todos los modales del ERP deberán converger estrictamente en la siguiente estructura:

1. **Adopción Incondicional de `SmartModal`:**
   * Todos los contenedores deben importar `@/components/ui/SmartModal`.
   * Transmitir siempre `isDirty`, `isSubmitting` y el botón oficial `SubmitButton`.

2. **Patrón de Validación en 3 Capas (Poka-Yoke):**
   * **Capa 1 (Restricción de Entrada en Vivo):** Inputs de texto forzados a `.toUpperCase()`; números bloqueando el signo menos `-`; moneda formateada con separador de miles y convertida reactivamente a palabras (`montoATextoPesos`).
   * **Capa 2 (Borde Rojo Reactivo y Mensaje Atómico):**
     Introducir estado `hasSubmitted` en los hooks de formulario. Si `hasSubmitted && !formData.campoValido`, el input debe recibir automáticamente la clase `.inputErrorBorder` (`border-color: #EF4444 !important; background-color: #FEF2F2;`) y mostrar un `<span>` inferior con tipografía técnica de 11px en rojo indicando el requerimiento.
   * **Capa 3 (Bloqueo y Tooltip de Acción):**
     El botón de envío se deshabilita si existen errores y muestra en su `title` la lista de campos faltantes para que el operario sepa exactamente qué corregir.

3. **Feedback de Cierre con Notificación Toast:**
   * Al resolverse la mutación con éxito, todo modal debe cerrar su vista e invocar una notificación Toast en verde (Design System MANNÁ), eliminando cualquier llamada nativa o refresco mudo.
