# AUDITORÍA TÉCNICA ESTRUCTURAL — MÓDULO COMPRAS (PRE-TEST E2E)

Fecha de auditoría: 23/09/2026  
Módulo: Operaciones / Compras (`/operations/purchases` y `/operations/purchases/new`)  
Alcance: Modelos de datos, controladores NestJS, componentes de página, drawer de stock, formularios dinámicos y matriz Poka-Yoke.

---

## 1. 📁 INVENTARIO DE ARCHIVOS AUDITADOS

| Capa | Archivo | Líneas | Responsabilidad Técnica |
| :--- | :--- | :--- | :--- |
| **Frontend Page** | `apps/web/src/app/operations/purchases/page.jsx` | 103 | Orquestador principal, listas activas, historial y empty state |
| **Frontend Hook** | `apps/web/src/app/operations/purchases/hooks/usePurchasesPageData.js` | ~160 | Carga de órdenes activas, compras históricas, agrupación y merge |
| **Frontend Comp** | `apps/web/src/app/operations/purchases/components/PurchasesHistoryTable.jsx` | 94 | Tabla histórica con acordeón de desglose y totales contables |
| **Frontend Comp** | `apps/web/src/app/operations/purchases/components/PurchasesActiveOrdersSection.jsx` | 110 | Tarjetas de órdenes en ruta, selección para fusión y acciones |
| **Frontend New** | `apps/web/src/app/operations/purchases/new/page.jsx` | 85 | Orquestador de fases (Fase 1: Checklist, Fase 2: Formulario Directo) |
| **Frontend New** | `apps/web/src/app/operations/purchases/new/components/FormPhase.jsx` | 133 | Contenedor principal de compra directa, flete, filas y resumen |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseStickyBar.jsx` | 91 | Barra superior fija: total en pesos y letras, disparador de guardado |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseFleteSection.jsx` | 50 | Campo de flete/costo adicional global con conversión a letras |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx` | 119 | Tarjeta orquestadora de fila de insumo con cálculo de IVA y totales |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowSelectors.jsx` | 88 | Autocomplete de proveedor y modal rápido de alta |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowInsumoSelector.jsx` | 143 | Autocomplete de insumo, precarga de cotización y modal rápido |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx` | 97 | Tipo de empaque, contenido neto y unidad de medida técnica |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowEconomics.jsx` | 85 | Cantidad de empaques, precio unitario, ingreso neto y subtotal |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowIvaSection.jsx` | 71 | Switch Aplica IVA, Tasa (%), precio incluye IVA y desglose base |
| **Frontend Part** | `apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx` | 131 | Drawer lateral reactivo con inventario en tiempo real y semáforos |
| **Frontend Hook** | `apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js` | 424 | Estado de filas LIFO, borrador en localStorage y submit a API |
| **Backend API** | `apps/api/src/purchases/purchases.controller.js` | 120 | Endpoints REST de compras y órdenes activas |
| **Backend API** | `apps/api/src/purchases/purchases.service.js` | 75 | Validación Zod y orquestación de llamadas |
| **Backend API** | `apps/api/src/purchases/purchases.repository.js` | 698 | Transacciones Prisma, kardex, recálculo CPP e inventario |
| **Backend Schema**| `apps/api/src/purchases/schemas/create-purchase.schema.js` | 38 | Esquema Zod de validación estricta de payloads de compra |
| **Backend Prisma**| `apps/api/prisma/schema.prisma` | 516 | Modelos `Compra`, `DetalleCompra`, `Inventario`, `Movimientos_Inventario` |

---

## 2. 📋 PÁGINA DE LISTADO (`/operations/purchases`)

- **Título Principal:** `h1.title` -> `"Compras"`.
- **Subtítulo:** `"Registro y control de órdenes de adquisición y consolidación de listas."`.
- **Botones de Acción en Cabecera:**
  - `"Crear / Gestionar Lista"`: Navega a `/catalog/supplier-prices`.
  - `"Nueva Compra Directa"`: Navega a `/operations/purchases/new?mode=direct`.
- **Estado Vacío (`AssistedEmptyState`):**
  - Título: `"Comienza registrando tu primera Compra"`.
  - Descripción: `"Registra entradas de insumos a bodega para abastecer la planta y actualizar Kardex."`.
  - Botón Acción: `"+ Nueva Compra"`.
- **Sección de Órdenes Activas (`PurchasesActiveOrdersSection`):**
  - Título: `"Listas Preparadas / En Ruta"`.
  - Tarjetas con: Código (`order.codigo`), Estado (`order.estado`), Título (`order.nombre`), Progreso (`Progreso: X / Y ítems procesados`).
  - Botones por tarjeta: `"Ver Lista"` (`router.push('/operations/purchases/new?orderId=...')`) y botón rojo con icono de basura (`setDeleteModalOpen`).
- **Tabla Histórica (`PurchasesHistoryTable`):**
  - Columnas: `Lista / Identificador`, `Fecha`, `Ítems`, `Total ($)`, `Estado`.
  - Estados soportados en Badge: `"Completada"` (`status="active"`) o `"En Ruta / Parcial"` (`status="warning"`).

---

## 3. 📝 FLUJO "NUEVA COMPRA DIRECTA" (`FormPhase`)

- **Título en Barra Fija (`FormPhaseStickyBar`):**
  - En modo directo: `"Nueva Compra Directa"`.
  - En modo checklist/ruta: `"Registro de Compras Adicionales (En Ruta) — [Código]"`.
- **Botones de Navegación y Acción:**
  - `"← Volver a Compras"` (modo directo) / `"← Volver a Checklist"` (modo orden).
  - `"🗑️ Limpiar Borrador"`: Elimina borrador local y resetea filas.
  - `"📦 Consultar Stock"`: Abre el drawer lateral `StockLookupDrawer`.
  - `"+ Añadir Fila"`: Inserta una fila en blanco al inicio (orden LIFO).
  - `"Guardar y Registrar Compra"`: Disparador del submit con validación estricta.
- **Campos Globales de Cabecera:**
  - `Flete / Costo adicional global ($)`: Input numérico con máscara de miles y conversión automática a letras (`montoATextoPesos`).
  - Microtexto: `"Transportes, domicilios o lo que costó ir a buscar estos productos"`.

---

## 4. 🛒 FILA DE ÍTEM DE COMPRA (`FormPhaseRowItem`)

Cada tarjeta de fila renderiza los siguientes controles y selectores:

1. **Proveedor (`FormPhaseRowSelectors`):**
   - Input de texto con autocomplete reactivo.
   - Opción destacada: `"+ Nuevo Proveedor"` (abre `SupplierModal` flotante).
   - Botón `✕` para limpiar selección.
2. **Insumo (`FormPhaseRowInsumoSelector`):**
   - Input de texto para búsqueda de insumo.
   - Opción destacada: `"+ Nuevo Insumo"` (abre `SupplyModal` flotante).
   - Badge meta: `Unidad: [unidadBase] | Mín: [stockMinimo]`.
   - Autoselección inteligente: si el insumo tiene cotización registrada con el proveedor, precarga empaque, contenido neto y precio unitario.
3. **Empaque y Medida (`FormPhaseRowPackaging`):**
   - `Marca`: Input en mayúsculas sanitizadas.
   - `EmpaqueTipo`: Select con opciones (`UNIDAD`, `BOLSA / PAQUETE`, `CAJA`, `BULTO / SACO`, `BOTELLA / FRASCO`, `BIDÓN / GARRAFA`, `CANASTILLA`, `ENVASE`, `OTRO`).
   - `ContenidoNeto`: Input numérico (deshabilitado si empaque es `UNIDAD`).
   - `UnidadMedida`: Select con opciones (`ml`, `L`, `g`, `kg`, `oz`, `Unidades`).
4. **Valores Económicos (`FormPhaseRowEconomics`):**
   - `Cant. Empaques`: Input de número entero formateado.
   - `Precio Unitario ($)`: Input monetario con lectura en letras.
   - Panel de Cálculo en Vivo:
     - `Ingreso Neto`: `empaques * contenidoNeto` en unidad de medida.
     - `Subtotal`: `empaques * precioUnitario` (ajustado por IVA).
5. **Configuración de IVA (`FormPhaseRowIvaSection`):**
   - Checkbox: `"Aplica IVA"`.
   - Input numérico: `"Tasa: [X] %"`.
   - Select de régimen: `"Precio incluye IVA"` (`INCLUIDO`) vs. `"IVA adicional (+)"` (`ADICIONAL`).
   - Desglose contable visible: `Base: $X | IVA (19%): $Y | Subtotal: $Z`.
6. **Resumen al pie de fila:**
   - Cadena descriptiva: `"✦ Resumen: Comprando X [empaques] de Y [unidad] cada una. Ingresarán Z [unidad] de [insumo] a bodega por $Total."`.

---

## 5. 📦 DRAWER "CONSULTAR STOCK DE INSUMOS" (`StockLookupDrawer`)

- **Disparador:** Botón `"📦 Consultar Stock"` en `FormPhaseStickyBar`.
- **Encabezado:** `"📦 Consultar Stock de Insumos"`.
- **Buscador:** Input con filtro reactivo por nombre, marca o categoría.
- **Tarjeta de Insumo (`StockLookupItemCard`):**
  - Muestra: Nombre, Categoría, Marca, Stock Actual y Stock Mínimo.
  - Semáforo visual: Verde (Stock óptimo) o Rojo (Bajo stock / Reabastecimiento).
  - Estado dinámico:
    - Si no está en la compra: Botón `"+ Añadir a Compra"`.
    - Si ya está agregado: Badge `"✓ En compra"` y botón `"✕ Quitar"`.
  - Al añadir desde stock, la fila se inserta arriba con bandera `isUnconfigured: true` y borde resaltado hasta que se completen proveedor, cantidad y precio.

---

## 6. 🛡️ MATRIZ POKA-YOKE Y REGLAS DE NEGOCIO

| Regla | Componente / Archivo | Comportamiento en UI ante Falla | Código HTTP Backend |
| :--- | :--- | :--- | :--- |
| **Mínimo 1 fila** | `FormPhaseStickyBar` / `useFormPhaseData.js` | Botón Guardar deshabilitado (`stickySaveBtnDisabled`), bloquea submit | 400 (`detalles debe contener al menos un insumo`) |
| **Insumo obligatorio** | `FormPhaseRowInsumoSelector` / `useFormPhaseData.js` | Fila marcada incompleta, toast de error: `"Fila X: falta seleccionar insumo"` | 400 (`idInsumo es requerido`) |
| **Proveedor obligatorio en directa** | `useFormPhaseData.js` | Toast: `"Para una compra directa, todas las filas deben tener un proveedor seleccionado."` | 400 |
| **Cantidad > 0** | `FormPhaseRowEconomics` / `useFormPhaseData.js` | Toast: `"Fila X: cantidad debe ser mayor a 0"` | 400 (`cantidad debe ser mayor a 0`) |
| **Precio > 0** | `FormPhaseRowEconomics` / `useFormPhaseData.js` | Toast: `"Fila X: precio debe ser mayor a $0"` | 400 (`precioUnitario debe ser >= 0`) |
| **Filas no configuradas** | `useFormPhaseData.js` | Borde rojo en tarjeta, toast: `"Hay insumos agregados desde stock pendientes de completar"` | Bloqueado en cliente |
| **Sanitización de Marca** | `FormPhaseRowPackaging` | Limpia caracteres especiales y fuerza UPPERCASE (`/[^a-zA-Z0-9 ]/g`) | N/A |
| **Flete no numérico** | `FormPhaseFleteSection` | Filtra todo lo que no sea dígito (`replace(/\D/g, '')`) | N/A |

---

## 7. 🌐 CONTRATOS DE BACKEND Y EFECTOS COLATERALES

### Rutas REST (`PurchasesController`):
- `GET /api/v1/purchases`: Lista todas las compras históricas con detalles e insumos.
- `GET /api/v1/purchases/orders/active`: Lista órdenes con estado `PENDIENTE` o `EN_PROCESO`.
- `POST /api/v1/purchases`: Registra una compra física directa o consolidada.
- `POST /api/v1/purchases/orders`: Crea una orden de compra o lista previa.
- `DELETE /api/v1/purchases/orders/:id`: Elimina una orden y sus ítems en cascada.

### Payload Registrado (`POST /api/v1/purchases`):
```json
{
  "esDirecta": true,
  "idOrden": null,
  "fechaCompra": "2026-09-23T23:25:00.000Z",
  "total": 350000,
  "totalSinIva": 294117.65,
  "totalIva": 55882.35,
  "fleteGlobal": 15000,
  "observaciones": "Compra Directa",
  "condicion": "CONTADO",
  "detalles": [
    {
      "idInsumo": "uuid-insumo-leche",
      "idProveedor": "uuid-proveedor-colanta",
      "cantidad": 10,
      "precioUnitario": 3200,
      "subtotal": 32000,
      "subtotalSinIva": 26890.76,
      "montoIva": 5109.24,
      "tieneIva": true,
      "porcentajeIva": 19,
      "precioIncluyeIva": true
    }
  ]
}
```

### Efectos Colaterales en Base de Datos (`PurchasesRepository.createWithTransaction`):
1. **Creación de `Compra`**: Se asigna consecutivo oficial (ej. `CMP-2026-0005`) y estado `COMPLETADO`.
2. **Creación de `DetalleCompra`**: Partidas individuales con desglose de IVA y subtotales.
3. **Actualización de `Inventario`**:
   - `cantidadActual`: Se suma la cantidad ingresada escalada según factor canónico (ej. `l -> ml` o `kg -> g`).
   - `costoPromedio`: Se recalcula mediante el Costo Promedio Ponderado (CPP) formal:
     `costoNuevo = ((stockAnterior * costoAnterior) + (cantidadComprada * precioUnitarioStock)) / stockNuevo`.
4. **Registro en `MovimientoInventario`**:
   - Tipo de movimiento: `ENTRADA_COMPRA`.
   - Motivo: `Entrada por compra [Consecutivo]`.
   - Se audita `stockAnterior` y `stockNuevo`.

---

## 8. 🗄️ MODELO PRISMA Y ESTADOS

```prisma
model Compra {
  id            String          @id @default(uuid()) @map("ID_Compra")
  idProveedor   String?         @map("ID_Proveedor")
  proveedor     Proveedor?      @relation(fields: [idProveedor], references: [id])
  idOrden       String?         @map("ID_Orden")
  orden         OrdenCompra?    @relation(fields: [idOrden], references: [id])
  fechaCompra   DateTime        @map("Fecha_Compra")
  estado        String          @map("Estado") // 'COMPLETADO', 'PARCIAL'
  total         Decimal         @map("Total") @db.Decimal(12, 2)
  totalSinIva   Decimal         @default(0) @map("Total_Sin_Iva") @db.Decimal(12, 2)
  totalIva      Decimal         @default(0) @map("Total_Iva") @db.Decimal(12, 2)
  observaciones String?         @map("Observaciones")
  detalles      DetalleCompra[]
}

model DetalleCompra {
  id               String     @id @default(uuid()) @map("ID_Detalle_Compra")
  idCompra         String     @map("ID_Compra")
  compra           Compra     @relation(fields: [idCompra], references: [id])
  idInsumo         String     @map("ID_Insumo")
  insumo           Insumo     @relation(fields: [idInsumo], references: [id])
  idProveedor      String?    @map("ID_Proveedor")
  proveedor        Proveedor? @relation(fields: [idProveedor], references: [id])
  cantidad         Decimal    @map("Cantidad")
  precioUnitario   Decimal    @map("Precio_Unitario") @db.Decimal(12, 2)
  subtotal         Decimal    @map("Subtotal") @db.Decimal(12, 2)
  tieneIva         Boolean    @default(true) @map("Tiene_Iva")
  porcentajeIva    Decimal    @default(19.0) @map("Porcentaje_Iva") @db.Decimal(5, 2)
  precioIncluyeIva Boolean    @default(true) @map("Precio_Incluye_Iva")
  montoIva         Decimal    @default(0) @map("Monto_Iva") @db.Decimal(12, 2)
  subtotalSinIva   Decimal    @default(0) @map("Subtotal_Sin_Iva") @db.Decimal(12, 2)
}
```

---

## 9. 🚀 FLUJO COMPLETO HAPPY-PATH (PASO A PASO E2E)

1. **Ingreso:** Navegar a `/operations/purchases`.
2. **Apertura:** Click en `"Nueva Compra Directa"`.
3. **Carga del Formulario:** La URL pasa a `/operations/purchases/new?mode=direct`. Se renderiza `FormPhase` con la barra fija.
4. **Inserción de Fila:** Click en `"+ Añadir Fila"`. Aparece la tarjeta del ítem.
5. **Selección de Proveedor:** En el input de proveedor escribir `Colanta`, seleccionar del dropdown.
6. **Selección de Insumo:** En el input de insumo escribir `Leche`, seleccionar del dropdown.
7. **Configuración de Empaque y Cantidades:**
   - Seleccionar empaque (ej. `BOLSA`).
   - Ingresar contenido neto (ej. `1000`) y unidad (`ml`).
   - Ingresar cantidad de empaques (ej. `10`).
   - Ingresar precio unitario (ej. `3200`).
8. **Configuración de IVA y Flete:**
   - Verificar cálculo de subtotal (`$32.000`).
   - En el campo flete global ingresar `5000`.
   - Total visualizado en sticky bar: `$37.000` con lectura en letras.
9. **Confirmación:** Click en `"Guardar y Registrar Compra"`.
10. **Sincronización:**
    - La API responde `201 Created` en `POST /api/v1/purchases`.
    - Redirección automática a `/operations/purchases`.
    - La compra recién creada encabeza la tabla en `PurchasesHistoryTable` con estado `Completada`.

---

## 10. ⚡ COMPORTAMIENTOS ESPECIALES DE SINCRONIZACIÓN

- **Borrador en `localStorage`:** Los cambios en `detalles` y `flete` se guardan automáticamente con debounce de 400ms bajo la clave `manna_direct_purchase_draft`. Al completar la compra o pulsar `"Limpiar Borrador"`, el storage es purgado de inmediato.
- **Botón Guardar:** Se deshabilita (`disabled={isSubmitting || detallesCount === 0}`) y cambia su texto a `"Guardando..."` para evitar envíos duplicados por doble click.
- **Notificaciones Toast:** Los mensajes de error o éxito usan el contenedor flotante con autocierre en 3500ms.
