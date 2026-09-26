# Auditoría Estructural y Mapeo de Modales del Módulo de Producción

> **Documento:** Auditoría técnica estática del frontend y backend del Módulo de Producción  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/web/src/app/operations/production/` y `apps/api/src/production/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Inventario de Modales y Drawers

| Componente | Archivo Fuente | Botón Disparador | Selectores Accesibles / Identificadores | Acciones Internas |
| :--- | :--- | :--- | :--- | :--- |
| **Modal de Planificación de Producción** | `apps/web/src/app/operations/production/components/ProductionPlanningModal.jsx` (contiene `ProductionOrderCreator.jsx`) | Botón superior `+ Nueva Producción` en cabecera principal, o botón `Planificar` en tarjetas del launchpad. | - `button:has-text("+ Nueva Producción")`<br>- `.modalOverlay[role="dialog"]`<br>- Botón de cierre: `button[title="Cerrar"]` o `button[aria-label="Cerrar modal"]` | - **Cancelar:** `button:has-text("Cancelar Formulario")`<br>- **Guardar:** `button:has-text("Guardar como Planificada")`<br>- **Iniciar:** `button:has-text("Iniciar Fabricación Inmediata")` |
| **Modal de Liquidación y Finalización** | `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx` | Botón `Finalizar / Liquidar` en tarjetas de orden (`ProductionOrderCard.jsx`) con estado activo. | - `button:has-text("Finalizar")` o `button:has-text("Liquidar")`<br>- `SmartModal[title^="Finalizar y Liquidar:"]` | - **Cancelar:** `button:has-text("Cancelar")`<br>- **Confirmar:** `button:has-text("Confirmar Liquidación")` |
| **Modal de Reporte de Incidencias / Paro** | `apps/web/src/app/operations/production/components/ProductionIncidentModal.jsx` | Botón o enlace de reporte de incidentes en la orden de producción. | - `button[title*="Incidencia"]`<br>- `SmartModal[title="⚠ Reportar Incidencia / Paro de Lote"]` | - **Cancelar:** `button:has-text("Cancelar")`<br>- **Registrar:** `button:has-text("Registrar Paro de Lote")` |

---

## 2. Campos y Validaciones de Entrada (Poka-Yoke)

### 2.1 Formulario de Planificación (`ProductionOrderCreator.jsx` + `ProductionBomSection.jsx`)
* **Select Receta / Producto:**
  - Selector: `select.selectProminent` (`<select value={selectedRecipe}>`)
  - Placeholder / default: `"Seleccione una receta activa..."`
  - Validaciones: Si no hay receta seleccionada, no se despliega la sección BOM ni los botones de guardado. Si hay productos huérfanos sin receta, muestra el aviso `.orphanRecipeSelectNotice` con enlace a `/catalog/recipes`.
* **Input Cantidad Planificada:**
  - Selector: `input[type="number"].inputProminent`
  - Atributos: `min="0.01"`, `step="any"`, `placeholder="0"`
  - Poka-Yoke: En `onBlur`, si el valor está vacío o `<= 0`, se restablece al `rendimientoBase` de la receta.
* **Cálculo Dinámico de BOM y Redondeo de Empaques:**
  - Redondeo estricto hacia arriba (`Math.ceil`) para familias de unidades discretas (`UNIDAD`, `UND`, `PZA`, `VASO`, `BOTELLA`, `TAPA`, `ETIQUETA`), garantizando que no se fraccionen materiales de empaque.
  - Para materias primas a granel (leche, azúcar, fruta), preserva precisión decimal (`Number(reqTeorico.toFixed(4))`).
* **Bloqueo Visual de Botones de Guardado:**
  - `Guardar como Planificada`: `disabled={!qty || Number(qty) <= 0}`.
  - `Iniciar Fabricación Inmediata`: `disabled={hasAnyShortage || !qty || Number(qty) <= 0}`.
  - Si hay faltantes (`hasAnyShortage`), se bloquea el inicio inmediato y se muestra el banner de advertencia: `⚠️ Faltan insumos en bodega para iniciar el lote inmediatamente`.

### 2.2 Formulario de Liquidación (`ProductionOrderCompleteModal.jsx`)
* **Cantidad / Volumen Obtenido:**
  - Selector: `input[type="number"].inputTableQty`
  - Atributos: `min="0.1"`, `step="0.1"`
* **Fecha de Vencimiento:**
  - Selector: `input[type="date"].expiryDateInput`
  - Atributos: `min={hoyStr}` (no permite fechas pasadas)
  - Cálculo automático de días de vida útil según ficha técnica del producto.
* **Reserva de Inóculo (Poka-Yoke exclusivo para bases intermedias WIP):**
  - Checkbox: `input[type="checkbox"]` ("Reservar fracción para próximo cultivo iniciador (Inóculo)").
  - Bloqueo F4: Si la orden tiene `generacionPadre >= 3`, se bloquea el checkbox y se muestra la alerta `🚫 Generación F4 alcanzada: Límite de resiembra superado. No apto para inóculo`.
  - Validación de saldo: La reserva debe ser `> 0` y `<= volTotal`. De lo contrario se muestra error y se deshabilita la confirmación.
* **Consumo Real vs Teórico:**
  - Tabla interactiva con inputs numéricos para ajustar el consumo real de cada insumo.
  - Desviación automática calculada en porcentaje (`badgeExceso`, `badgeAhorro`, `badgeExact`).

---

## 3. Mecanismo de Detección de Lote Padre (Genealogía WIP)

### 3.1 Identificación de Base Intermedia
* La UI detecta que un producto requiere base intermedia si algún ítem de la receta o del BOM cumple:
  - `item.idProductoIntermedio != null`
  - `item.tipoInsumo === 'BASE'` o `item.tipo === 'WIP'`
  - La categoría del insumo/producto pertenece a `BASES_LACTEAS` o `INTERMEDIO_WIP`.
* En `ProductionBomSection.jsx`, clasifica los faltantes en `faltantesWip` y `faltantesCompra`. Si falta base WIP, ofrece el botón directo `onGoToProduction` para producir la base faltante antes de envasar.

### 3.2 Selección y Asignación de Lote en Backend
* Durante la consulta de BOM (`GET /production/recipe-bom/:idReceta`), el backend ejecuta un escaneo FEFO (`fechaVencimiento: 'asc'`) sobre la tabla `Lote` buscando lotes con:
  - `tipoLote: 'SEMIELABORADO_WIP'` o `idProducto: det.idProductoIntermedio`
  - `cantidadDisponible: { gt: 0 }`
  - `estado: 'DISPONIBLE'`
* Al iniciar (`/start`) o liquidar (`/complete`), el backend descuenta el saldo del lote padre y vincula la relación jerárquica `lotePadreId` en el nuevo lote producido de producto terminado.

---

## 4. Contrato de Endpoints Backend (`apps/api/src/production/`)

| Endpoint | Método | Entrada / Parámetros | Respuestas HTTP | Validaciones Poka-Yoke & Errores |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/production/recipe-bom/:idReceta` | `GET` | Params: `idReceta`<br>Query: `cantidad`, `variantes` | `200 OK`<br>`404 Not Found` | Escala teóricamente el BOM, redondea empaques y calcula stock físico, comprometido y disponible de insumos y bases WIP. |
| `/api/v1/production` | `POST` | Body (`CreateProductionDto`):<br>- `idProducto` (UUID)<br>- `cantidadPlanificada` (> 0.01)<br>- `fechaProduccion` (Date ISO)<br>- `estado` ('PLANIFICADA', 'EN_PROCESO')<br>- `detalles` (Array con insumos/WIP) | `201 Created`<br>`400 Bad Request` | - `400` si `cantidadPlanificada <= 0` o NaN.<br>- `400` si `detalles` excede `stockDisponible` (Stock neto insuficiente para insumo o base intermedia). |
| `/api/v1/production/:id/start` | `POST` | Param: `id` (UUID de la orden) | `200 OK`<br>`400 Bad Request`<br>`404/500` | - Rechazo si la orden no está en estado `PLANIFICADA`.<br>- Rechazo si en el momento del arranque el stock físico en bodega es inferior al teórico requerido. |
| `/api/v1/production/:id/complete` | `PATCH` | Param: `id`<br>Body: `cantidadReal`, `detallesReales`, `reservaInoculo`, `fechaVencimiento` | `200 OK`<br>`400 Bad Request` | - Transacción atómica: descuenta inventario físico de insumos y lote padre WIP.<br>- Da entrada al nuevo lote en Kardex.<br>- Si hay reserva de inóculo, crea el sub-lote hijo `INOC-...` con herencia de generación. |
| `/api/v1/production` | `GET` | Ninguno | `200 OK` | Retorna listado de órdenes con sus lotes, detalles de consumo e histórico. |

---

## 5. Resumen de Hallazgos y Preparación para Tests

1. **Aislamiento Modular:** El módulo no tiene dependencias cruzadas rotas; implementa correctamente CSS Modules y componentes de tamaño moderado conforme al Guardián SRP.
2. **Poka-Yoke Doble Capa:**
   - **Frontend:** El botón `Iniciar Fabricación Inmediata` se deshabilita si hay faltantes en bodega o si la cantidad es `<= 0`.
   - **Backend:** `ProductionService.create` valida `stockDisponible` (físico menos comprometido) y lanza `BadRequestException` descriptiva si algún insumo o producto intermedio no alcanza.
3. **Flujo de Automatización E2E Sugerido:**
   - Test E2E 1: Apertura de modal con `+ Nueva Producción`, selección de receta sembrada, cálculo automático de BOM y guardado como `PLANIFICADA`.
   - Test E2E 2: Flujo de liquidación en `ProductionOrderCompleteModal` con entrada de producto y validación de lote generado.
