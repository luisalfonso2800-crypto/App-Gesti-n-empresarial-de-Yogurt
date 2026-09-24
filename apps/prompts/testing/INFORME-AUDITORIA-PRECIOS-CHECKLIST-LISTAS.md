# INFORME DE AUDITORÍA FORENSE FULLSTACK: PRECIOS, CARRITO GLOBAL, CHECKLIST Y GESTIÓN DE LISTAS

**Fecha de Ejecución:** 2026-09-24  
**Entorno:** Fullstack (Next.js App Router + Express Node.js + Prisma ORM + PostgreSQL)  
**Alcance:** Módulos de Catálogo (`/catalog/supplier-prices`), Carrito Global Persistente (`Header.jsx`, `CartContext`), Checklist de Compras (`/operations/purchases/new`) y Tablero de Órdenes/Listas (`/operations/purchases`).  
**Objetivo:** Proporcionar la radiografía exacta del DOM, modelos de datos, estados reactivos y selectores estables para habilitar la suite E2E en Playwright sin ambigüedades.

---

## 1. MAPA DE RUTAS Y COMPONENTES

| Módulo / Fase | Ruta URL | Componente Principal | Subcomponentes Clave | Responsabilidad |
| :--- | :--- | :--- | :--- | :--- |
| **Precios Proveedores** | `/catalog/supplier-prices` | `PricesPageClient.jsx` | `PricesComparisonTable.jsx`<br>`PriceRow.jsx`<br>`PriceRowActions.jsx`<br>`PricesFilterBar.jsx`<br>`CartSidebar.jsx`<br>`SupplierPriceModal.jsx` | Visualización comparativa de cotizaciones, semáforos de stock, filtrado predictivo y apertura del modal de cotización. |
| **Submódulos Modal Precios** | Modal flotante en `/catalog/supplier-prices` | `SupplierPriceModal.jsx` | `SupplierPriceCombobox.jsx`<br>`SupplierPricePresentationFields.jsx`<br>`SupplierPriceEquivalenceFields.jsx`<br>`SupplierPriceTaxCard.jsx` | Cascada Poka-Yoke paso 1 a 6, pleca fija de unidad base, cálculo dual sin/con IVA y modal en caliente de insumos y proveedores. |
| **Carrito Global** | Shell Global (todas las rutas) | `Header.jsx` | `HeaderCartTrigger` (botón)<br>`CartModal.jsx` (modal multi-lista)<br>`CartContext.jsx` (`useCartState.js`) | Disparador global del carrito con badge de contador reactivo, selector de lista activa y sincronización cruzada. |
| **Tablero de Órdenes y Fusión** | `/operations/purchases` | `PurchasesPageClient.jsx` | `PurchasesActiveOrdersSection.jsx`<br>`PurchasesSummaryCards.jsx`<br>`PurchasesHistorySection.jsx` | Gestión de listas preparadas/en ruta, modo fusión de listas (`GitMerge`), renombrado rápido y redirección al checklist. |
| **Checklist Operativo (Fase 1)** | `/operations/purchases/new?orderId=...` | `ChecklistPhase.jsx` | `ChecklistItemRow.jsx`<br>`ChecklistItemRowMoveModal.jsx`<br>`ChecklistItemRowCommercial.jsx`<br>`ChecklistItemRowMotivos.jsx`<br>`ChecklistAddPendingModal.jsx`<br>`ChecklistPrintArea.jsx` | Ejecución en planta del checklist, marcado `CONSEGUIDO`/`NO_CONSEGUIDO`, descarte con motivo, cambio de lista en caliente y agregación de pendientes manuales. |

---

## 2. MATRIZ DE SELECTORES ESTABLES PARA PLAYWRIGHT

Para evitar fragilidad por hashing de CSS Modules (`.module.css`), a continuación se detalla la matriz de localización exacta basada en roles accesibles, etiquetas, atributos y combinaciones estables de clases:

### Foco A: Precios de Proveedores y Modal
- **Botón "+ Nueva Cotización":**  
  `role=button[name="Nueva Cotización"]` o `button:has-text("+ Nueva Cotización")`
- **Combobox Insumo (Paso 1):**  
  Input: `input[placeholder*="Seleccionar o buscar insumo..."]`  
  Botón de apertura: `button:has-text("▼")` adyacente  
  Opción Alta en Caliente: `div[role="option"]:has-text("+ Registrar Nuevo Insumo")`
- **Combobox Proveedor (Paso 2):**  
  Input: `input[placeholder*="Seleccionar o buscar proveedor..."]`  
  Opción Alta en Caliente: `div[role="option"]:has-text("+ Registrar Nuevo Proveedor")`
- **Selector Presentación (Paso 3):**  
  `select` dentro del bloque con etiqueta `"Presentación Comercial *"`  
  Opción especial: `option[value="OTRA..."]` -> Despliega input `input[placeholder*="Ej: TAMBOR, SACO"]`
- **Selector Unidad de Medida (Paso 4):**  
  `select` con opciones `kg`, `g`, `L`, `ml`, `und`
- **Input Cantidad Presentación (Paso 5) + Pleca:**  
  Input: `input[type="number"][placeholder="0.00"]` (en bloque "Contenido por Presentación")  
  Pleca fija a la derecha: `span` con clase `.plecaBadge` que contiene el texto de la unidad elegida (`kg`, `L`, etc.)
- **Lógica Tributaria y Precios (Paso 6):**  
  Checkbox Aplica IVA: `input[type="checkbox"]` en etiqueta `"Aplica IVA"`  
  Selector Tarifa IVA: `select` con valores `19`, `5`, etc.  
  Selector Modalidad Fiscal: `select` con `"PRECIO_INCLUYE_IVA"` / `"IVA_ADICIONAL"`  
  Input Precio de Compra: `input[type="text"][placeholder="$ 0"]`  
  Texto en Letras: Bloque con clase `.priceInWords` debajo del precio.  
  Tarjetas de Costo: Elementos con clases `.costBadge` / `.costBadgeSecondary` (Costo Sin IVA y Con IVA).
- **Botón Guardar Cotización:**  
  `button[type="submit"]:has-text("Guardar Cotización")`

### Foco B: Tabla de Cotizaciones y Carrito Global
- **Filtros Predictivos en Cabecera:**  
  `input[placeholder*="Buscar por nombre..."]`  
  `select` de categoría y estado
- **Botones por Fila de Cotización (`PriceRow`):**  
  Botón Añadir/Quitar de Lista: `button:has-text("Comprar")` (estado inactivo) o `button:has-text("En lista")` (estado activo con icono de remoción)  
  Botón Editar: `button[title="Editar cotización"]`  
  Botón Desactivar/Activar: `button[title="Desactivar cotización"]` / `button[title="Activar cotización"]`
- **Badges de Fila:**  
  Semáforo Stock: `span:has-text("Stock:")` + sub-badge `Bajo Mínimo` / `Abastecido`  
  Proveedor Habitual: `span:has-text("Habitual")`  
  Más Económico: `span:has-text("Más Económico")`  
  Cotización Antigua: `span:has-text("Cotización antigua")`
- **Barra Flotante Inferior de Compra:**  
  Contenedor: `div` con clase `.bottomPurchaseBar`  
  Texto de resumen: Contiene `"insumo(s) seleccionado(s) | Presupuesto preliminar: $"`  
  Botón Pasar a Fase Compra: `button:has-text("Ir a Fase de Compra")`
- **Disparador Carrito en Header Global:**  
  `button[aria-label="Abrir carrito de compras"]`  
  Contador badge reactivo: `span` con clase `.cartBadge` dentro de dicho botón.

### Foco C: Checklist de Compras (`/operations/purchases/new`)
- **Fila de Ítem (`ChecklistItemRow`):**  
  Contenedor de ítem: `.operationalRowWrapper`  
  Input Cantidad Empaques: `input[type="number"].inputCompact`  
  Input Precio Empaque: `input[type="number"].inputPriceCompact`  
  Botón "Conseguido": `button:has-text("Conseguido")`  
  Botón Desplegable Detalles: `button[title*="detalles"]`
- **Opciones Expandidas de Fila:**  
  Botón "Editar condiciones": `button:has-text("Editar condiciones")`  
  Botón "No Conseguido": `button:has-text("No Conseguido")`  
  Botón "Mover Lista": `button:has-text("Mover Lista")`
- **Bloque de Motivos de No Conseguido (`ChecklistItemRowMotivos`):**  
  Selector de motivo: `select.motivoSelect` (opciones: `"Agotado en punto de venta"`, `"Otro motivo (especificar)"`, etc.)  
  Input especificación: `input.motivoInput[placeholder*="Especifique el motivo..."]`  
  Botón Mantener en Lista: `button:has-text("Registrar motivo y mantener en lista")`  
  Botón Descartar: `button:has-text("Registrar motivo y descartar")`
- **Modal Añadir Pendiente Manual (`ChecklistAddPendingModal`):**  
  Botón disparador: `button:has-text("+ Añadir Pendiente")`  
  Input Nombre: `input[placeholder*="Azúcar morena"]`  
  Input Cantidad Estimada: `input[placeholder*="Ej: 10"]`  
  Botón Confirmar: `button:has-text("Añadir al Checklist")`
- **Área de Impresión Térmica / Ficha:**  
  Contenedor: `#print-checklist-area` / `.printSection`  
  Botón Imprimir: `button:has-text("Imprimir Checklist")`

### Foco D: Gestión y Fusión de Listas (`/operations/purchases`)
- **Sección Listas Preparadas:** `.activeOrdersSection`
- **Botón Iniciar Fusión:** `button:has-text("Fusionar Seleccionadas")`
- **Checkboxes de Selección:** `input[type="checkbox"].mergeCheckbox` en cada tarjeta `.orderCard`
- **Botón Confirmar Fusión:** `button:has-text("Confirmar Fusión")` (se activa al seleccionar ≥ 2 listas)
- **Botón Cancelar Fusión:** `button:has-text("Cancelar Fusión")`
- **Botón Ver Lista / Checklist:** `button:has-text("Ver Lista")` -> Redirige a `/operations/purchases/new?orderId=...`
- **Edición de Nombre de Lista:**  
  Botón lápiz: `button[title="Editar Nombre"]`  
  Modal input: `input[value="..."]` + botón guardar nombre.

---

## 3. CONTRATO DE INTEGRACIÓN, STORAGE Y CARRITO

```
┌────────────────────────────────────────────────────────┐
│                   CartContext.jsx                      │
│  - targetId: ID de Orden activa (o "GLOBAL")           │
│  - activeListId: ID persistente de la lista en trabajo │
│  - lists: Colección de listas en memoria / backend     │
└──────────────┬─────────────────────────┬───────────────┘
               │                         │
               ▼                         ▼
┌─────────────────────────┐   ┌───────────────────────────┐
│     CartSidebar.jsx     │   │      Header.jsx           │
│ - Vista rápida local    │   │ - Disparador global       │
│ - Presupuesto total     │   │ - Badge reactivo          │
│ - Botón "Crear Orden"   │   │ - Desplegable multi-lista │
└──────────────┬──────────┘   └─────────────┬─────────────┘
               │                            │
               └──────────────┬─────────────┘
                              ▼
        ┌───────────────────────────────────────────┐
        │   API Backend: /api/purchases/orders      │
        │   - GET  /active                          │
        │   - POST /merge                           │
        │   - POST /from-cart                       │
        │   - PATCH /:id/items/:itemId              │
        │   - DELETE /:id                           │
        └─────────────────────┬─────────────────────┘
                              ▼
        ┌───────────────────────────────────────────┐
        │       PostgreSQL (Prisma ORM)             │
        │   - Ordenes_Compra (id, codigo, nombre)   │
        │   - Orden_Compra_Items                    │
        │     (cantidad, precioEstimado, estadoItem)│
        │   - Precios_Proveedor                     │
        └───────────────────────────────────────────┘
```

### Contrato de Datos:
1. **Persistencia del Carrito:**
   - La estructura de ítems se maneja como arreglo reactivo dentro de `CartContext`.
   - Cada ítem almacena: `insumoId`, `proveedorId`, `presentacion`, `unidadMedida`, `cantidad`, `precioCompra`, `tieneIva`, `tasaIva`.
   - Las listas de compras persistentes se guardan en la tabla `Ordenes_Compra` con prefijo secuencial `ORD-YYYY-XXXX`.
2. **Sincronización Multi-Lista:**
   - Al cambiar `activeListId`, `CartContext` recarga los ítems de esa orden específica.
   - Si se agrega un ítem desde la tabla de precios sin tener orden abierta, se asocia al carrito rápido global y permite crear la orden con nombre personalizado.
3. **Manejo de Duplicados Cruzados:**
   - Si un insumo ya existe en la lista para un proveedor diferente o con distinta presentación, el sistema genera la bandera `duplicateWarning: "! Ya existe en otra orden activa"`.
   - En la fila del checklist se proyecta un badge ámbar `[!]` advirtiendo al operador.

---

## 4. MATRIZ POKA-YOKE POR FOCO

| Foco | Regla de Negocio / Restricción Poka-Yoke | Comportamiento en UI / Manejo de Error |
| :--- | :--- | :--- |
| **Foco A (Precios)** | Bloqueo secuencial estricto 1 a 1 | Input 2 (`Proveedor`) disabled hasta elegir `Insumo`. Presentación disabled hasta elegir Proveedor. Cantidad y Precio disabled hasta definir Unidad de Medida Base. |
| **Foco A (Precios)** | Cascada limpia hacia abajo | Si se limpia o cambia la Unidad de Medida, se limpian y deshabilitan automáticamente Cantidad de Presentación y Precios. |
| **Foco A (Precios)** | Reactividad fiscal (Aplica IVA) | Si `aplicaIva === false`, los campos Tasa IVA y Modalidad Fiscal se ocultan por completo; se renderiza solo "Costo Unitario Base". Si es `true`, Tasa precarga en 19% (nunca 0%) y se proyectan ambas tarjetas (Sin IVA y Con IVA). |
| **Foco B (Carrito)** | Prevención de órdenes vacías | Botón "Crear Orden" o "Ir a Fase de Compra" deshabilitado si el carrito tiene 0 ítems. |
| **Foco C (Checklist)** | Cantidad mínima operativa | El input de cantidad de empaques valida `min="1"`. En `onBlur`, si el valor es `< 1` o NaN, se reajusta automáticamente a `1`. |
| **Foco C (Checklist)** | Registro obligatorio de motivo | Al marcar un ítem como `NO_CONSEGUIDO`, el operador debe seleccionar un motivo del catálogo. Si selecciona "Otro motivo", el input de texto complementario se vuelve mandatorio antes de descartar. |
| **Foco D (Fusión)** | Límite mínimo de fusión | El botón "Confirmar Fusión" solo se habilita si hay al menos 2 listas seleccionadas mediante los checkboxes. |

---

## 5. SEEDS E IDS ESTABLES RECOMENDADOS PARA TESTS

Para asegurar que las pruebas E2E en Playwright se ejecuten contra fixtures deterministas sin colisión:

### Insumos Clave:
- `INS-TEST-001`: **Leche Entera Cruda** (Categoría: `LÁCTEOS`, Unidad Base: `L`, Stock Mínimo: `100`, Stock Actual: `150`)
- `INS-TEST-002`: **Cultivo Liofilizado para Yogurt** (Categoría: `FERMENTOS`, Unidad Base: `und`, Stock Mínimo: `20`, Stock Actual: `5` -> *Bajo Mínimo*)
- `INS-TEST-003`: **Azúcar Blanca Refinada** (Categoría: `ENDULZANTES`, Unidad Base: `kg`, Stock Mínimo: `50`, Stock Actual: `80`)

### Proveedores Clave:
- `PRV-TEST-001`: **Lácteos El Carmen S.A.S.** (NIT: `900.123.456-1`, Estado: `ACTIVO`)
- `PRV-TEST-002`: **Distribuidora BioIngredientes del Norte** (NIT: `901.654.321-2`, Estado: `ACTIVO`)
- `PRV-TEST-003`: **Envases Plásticos del Magdalena** (NIT: `890.765.432-3`, Estado: `ACTIVO`)

### Cotizaciones Semilla:
- `COT-TEST-001`: Leche Entera + Lácteos El Carmen (Bulto/Cantina 50 L a $120.000 COP, Aplica IVA: No, Habitual: `true`, Más Económico: `true`)
- `COT-TEST-002`: Azúcar Blanca + BioIngredientes (Saco 25 kg a $85.000 COP, Aplica IVA: Sí, 19%, Precio incluye IVA)

### Órdenes Semilla (Fusión y Checklist):
- `ORD-TEST-001`: Nombre `"Ruta de Compras Mayorista Norte"` (Estado: `PENDIENTE`, 3 ítems)
- `ORD-TEST-002`: Nombre `"Suministros de Empaque Semanal"` (Estado: `PENDIENTE`, 2 ítems)

---

## 6. HUECOS DETECTADOS Y HELPERS A CREAR EN PLAYWRIGHT

### Huecos Técnicos Detectados en el Código Actual:
1. **Ausencia de `data-testid` Explícitos:**  
   Varios componentes descansan en nombres de botones o clases CSS modulares. Aunque `role` y `placeholder` funcionan, se recomienda agregar helpers en el test runner para desacoplar de cambios estéticos.
2. **Formateo de Moneda Dinámico:**  
   Los campos de precio muestran máscara `$` y separador de miles con punto (`$ 120.000`). En Playwright, al escribir en el input numérico o con máscara, debe limpiarse el formateo previo para evitar que el cursor salte o registre ceros adicionales.
3. **Manejo de Diálogos Nativos Prohibidos:**  
   No existen llamadas a `window.confirm` ni `window.alert` (cumpliendo la regla del proyecto). Todas las confirmaciones se realizan vía modales (`SmartModal`, `ChecklistItemRowMoveModal`, `ChecklistAddPendingModal`).

### Helpers Recomendados a Implementar en `e2e/helpers/`:
1. `fillSupplierPriceForm(page, data)`:
   - Automatiza la selección en cascada respetando los tiempos de desbloqueo: abre combobox insumo, tipea, selecciona; abre combobox proveedor, tipea, selecciona; escoge presentación; escoge unidad de medida; llena cantidad; llena precio y configura IVA.
2. `toggleCartItem(page, insumoNombre)`:
   - Ubica la fila del insumo en `PricesComparisonTable` y activa el botón de compra verificando que la insignia del carrito en el header incremente en +1.
3. `executeOrderMerge(page, [orderCodeA, orderCodeB])`:
   - En `/operations/purchases`, activa el modo fusión, marca los dos checkboxes correspondientes y pulsa "Confirmar Fusión".
4. `markChecklistItemStatus(page, itemNombre, status, motivo)`:
   - En `/operations/purchases/new`, localiza el ítem, expande detalles, marca "No Conseguido", selecciona el motivo en el dropdown y confirma "Registrar motivo y mantener en lista".

---

**Fin del Informe de Auditoría Forense.**  
Listo para la construcción y ejecución automatizada de las pruebas E2E.
