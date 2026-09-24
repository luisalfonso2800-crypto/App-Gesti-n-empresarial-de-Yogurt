# AUDITORÍA TÉCNICA: POKA-YOKE EMPAQUE / CONTENIDO / UNIDAD EN COMPRAS

**Fecha:** 2026-09-24  
**Módulos auditados:** Backend (`supplier-prices`), Frontend Compras (`purchases/new`).  
**Objetivo:** Identificar la brecha en cotizaciones Insumo + Proveedor y el riesgo operativo de ingreso de inventario con factor 1 en insumos medibles/pesables.

---

## 1. Análisis del Backend (`apps/api/src/supplier-prices/`)

### Existencia del endpoint de cotizaciones por Insumo + Proveedor
- **Estado actual:** El controlador [`supplier-prices.controller.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/api/src/supplier-prices/supplier-prices.controller.js) cuenta con `GET /supplier-prices`, `GET /supplier-prices/active` y `GET /supplier-prices/:id`.
- **Brecha identificada:** No existe un endpoint directo `GET /supplier-prices/lookup?idProveedor=...&idInsumo=...` para consultar de forma atómica y precisa las cotizaciones activas de un par (Proveedor, Insumo).
- **Modelo Prisma (`PrecioProveedor`):**
  - Campos disponibles:
    - `id` (UUID)
    - `idInsumo` (FK Insumo)
    - `idProveedor` (FK Proveedor)
    - `presentacionCompra` (String, ej. "BULTO 25 KG", "BOLSA 500 G", "UNIDAD")
    - `cantidadPresentacion` (Decimal)
    - `unidadPresentacion` (String, ej. "kg", "g", "L", "ml", "und")
    - `cantidadEquivalenteBase` (Decimal, ej. 500 para bolsa de 500g si la unidad base es g, o 25 si es kg)
    - `precioCompra` (Decimal)
    - `costoUnidadBase` (Decimal)
    - `tieneIva`, `porcentajeIva`, `precioIncluyeIva`, `costoBaseSinIva`
    - `activo` (Boolean)
    - `fechaRegistro` (DateTime)

---

## 2. Análisis del Frontend (`apps/web/src/app/operations/purchases/new/`)

### Comportamiento actual
- El formulario de compras permite registrar filas manuales o desde el stock.
- En [`FormPhaseRowPackaging.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx), al elegir `empaqueTipo === 'UNIDAD'`, se deshabilitan el contenido neto (dejándolo en '1') y la unidad de medida, asumiendo '1 und'.
- En [`FormPhaseRowInsumoSelector.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowInsumoSelector.jsx), si ya se había seleccionado un proveedor, intenta pre-cargar de `supplierPrices` (array global cargado en página), pero si se selecciona el insumo primero o si hay múltiples cotizaciones, la sincronización es estática o incompleta.

### Brecha Operativa (El Problema Poka-Yoke)
1. **Peligro de Factor 1 en graneles/líquidos:** Si el operador compra leche, fruta o azúcar (con unidad base `kg`, `g`, `L` o `ml`) y deja empaque `UNIDAD` con contenido `1`, el kardex sumará solo 1 gramo o 1 mililitro en vez de los 500g, 1000ml o 25kg reales.
2. **Inconsistencia Empaque ≠ UNIDAD con Contenido = 1:** Si se selecciona `BULTO` o `BOLSA` pero el contenido queda en `1`, suele ser un descuido del operador.
3. **Ausencia de feedback en vivo:** El operador no ve claramente cuánto impactará físicamente en bodega antes de confirmar la compra.

---

## 3. Plan de Implementación en 5 Capas

### Backend
1. **Repository:** Agregar `findBySupplierAndSupply(idProveedor, idInsumo)` en `SupplierPricesRepository` filtrando por `idProveedor`, `idInsumo` y `activo: true`, ordenado por `fechaRegistro: 'desc'`.
2. **Service:** Exponer `lookup(idProveedor, idInsumo)` validando la presencia de ambos parámetros.
3. **Controller:** Exponer `GET /supplier-prices/lookup` recibiendo query params `idProveedor` e `idInsumo`.

### Frontend
1. **Capa 1 (Autocompletado Único):** Al cambiar proveedor o insumo en `useFormPhaseData.js` o en el selector, si existe exactamente 1 cotización activa, poblar automáticamente `empaqueTipo`, `empaque`, `contenidoNeto`, `unidadMedida` y `precioUnitario`.
2. **Capa 2 (Múltiples Cotizaciones):** Si existen múltiples cotizaciones ($N > 1$), almacenar las presentaciones disponibles en la fila para desplegar un selector rápido ("Presentaciones habituales").
3. **Capa 3 (Alerta Poka-Yoke UNIDAD + Contenido = 1):** Si la unidad base es `kg`, `g`, `L`, `ml` y el empaque es `UNIDAD` con contenido `1`, mostrar advertencia ámbar explicativa.
4. **Capa 4 (Preview interactivo de Impacto):** Mostrar cálculo explícito en bodega: `✦ Impacto en Bodega: [empaques] × [contenidoNeto] [unidad] = +[totalNeto] [unidad]`.
5. **Capa 5 (Alerta Empaque ≠ UNIDAD + Contenido = 1):** Si el empaque es `BOLSA`, `BULTO`, `CAJA`, `BIDÓN`, `CANASTILLA` pero el contenido es `1`, desplegar alerta de verificación.

---
Auditoría completada de forma quirúrgica bajo límites de cuota y presupuesto.
