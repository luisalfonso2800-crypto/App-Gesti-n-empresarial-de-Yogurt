# TESTS E2E — MÓDULO COMPRAS: SUITE MODULAR COMPLETA E IDEMPOTENTE (LOW QUOTA)

## ⚠️ REGLAS ESTRICTAS DE ULTRA-AHORRO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds de Next.js, dev servers o comandos de git.
4. PROHIBIDO modificar código fuente de producción (`apps/web/src`, `apps/api/src`).
5. PROHIBIDO alterar suites previas (`presentations`, `supplies`, `suppliers`).
6. LÍMITES DUROS: Máximo 3 lecturas directas (`Read`), exactamente 8 archivos a crear (2 helpers + 6 specs), máximo 12 llamadas a herramientas en total.
7. LÍMITE DE TAMAÑO: Ningún spec debe exceder 150 líneas ni usar bucles dinámicos `for (const ... of ...)`.
8. Al terminar de crear los archivos, DETENERSE de inmediato.

---

## 📌 CONTEXTO AUDITADO (FUENTES DE VERDAD)
- **Ruta UI Listado:** `/operations/purchases`
- **Ruta UI Formulario Directo:** `/operations/purchases/new?mode=direct`
- **Botones y Controles Principales:**
  * Apertura: `button:has-text("Nueva Compra Directa")`
  * Gestión: `button:has-text("Crear / Gestionar Lista")`
  * Formulario Acciones: `button:has-text("+ Añadir Fila")`, `button:has-text("Consultar Stock")`, `button:has-text("Limpiar Borrador")`, `button:has-text("Volver a Compras")`
  * Submit: `button:has-text("Guardar y Registrar Compra")` (Disabled si filas === 0 o incompletas)
  * Drawer Stock: `h2:has-text("Consultar Stock de Insumos")`, botón `button:has-text("+ Añadir a Compra")`
- **Contratos y Selectores:**
  * Flete: `input[name="fleteGlobal"]` o label `/flete.*costo adicional/i`
  * Fila ITEM: Selectores/autocompletes para `Proveedor`, `Insumo`, inputs para `Marca` (UPPERCASE), `Cantidad`, `Precio Unitario`, checkbox `Aplica IVA` (default 19%).
- **Endpoints Backend:**
  * `GET /api/v1/purchases`
  * `POST /api/v1/purchases` (201 Created tras liquidación transaccional)

---

## 🛠️ TAREAS DE CONSTRUCCIÓN

### T1. Lectura Quirúrgica Previa (Máximo 2 archivos)
Leer únicamente las firmas de importación en:
1. `apps/web/e2e/helpers/chain-state.js`
2. `apps/web/e2e/helpers/safe-visible.js`

---

### T2. Crear Helper `apps/web/e2e/helpers/purchase-form.js` (< 120 líneas)
Exportar:
- `goToPurchases(page)`: Navega a `/operations/purchases` con `domcontentloaded`.
- `openPurchaseForm(page)`: Click en "Nueva Compra Directa" y espera `waitForURL(/\/operations\/purchases\/new/)`.
- `addRow(page)`: Click en "+ Añadir Fila" y espera que aparezca un contenedor de fila (`.rowItem` o selector de fila) sin usar `waitForTimeout` ciego.
- `fillGlobalFlete(page, monto)`: Limpia y asigna valor usando `.fill(String(monto))`.
- `getPurchaseLocators(page)`: Mapa de selectores de cabecera, sticky bar, botones y totalizador.

---

### T3. Crear Helper `apps/web/e2e/helpers/purchase-helpers.js` (< 140 líneas)
Exportar funciones directas y de alta velocidad (usando `.fill()` y no `pressSequentially` para evitar latencia de 1.5s por campo):
- `fillRowItem(page, rowIndex, { proveedor, insumo, marca, cantidad, precio, empaque, unidad })`.
- `submitPurchase(page)`: Dispara click en "Guardar y Registrar Compra" sincronizado con `page.waitForResponse(resp => resp.url().includes('/api/v1/purchases') && resp.request().method() === 'POST')`.

---

### T4. Crear `apps/web/e2e/purchases/purchases-basics.spec.js` (~8 tests, < 140 líneas)
Idempotente con `cleanupByPrefix(request, 'purchases', 'E2E_')`.
- T01: Título "Compras" en `/operations/purchases`.
- T02: Estado vacío con botón disponible.
- T03: Click "Nueva Compra Directa" navega a la URL correcta.
- T04: Presencia de botones de cabecera y sticky bar.
- T05: "+ Añadir Fila" agrega un elemento al DOM.
- T06: Añadir múltiples filas (3) incrementa la cuenta.
- T07: "Limpiar Borrador" resetea la lista.
- T08: "Volver a Compras" navega de regreso a `/operations/purchases`.

---

### T5. Crear `apps/web/e2e/purchases/purchases-validation.spec.js` (~10 tests, < 140 líneas)
- T09: Botón Guardar `disabled` sin filas añadidas.
- T10: Toast/alerta "falta seleccionar insumo" al intentar guardar incompleto.
- T11: Bloqueo si cantidad <= 0.
- T12: Bloqueo si precio <= 0.
- T13: Bloqueo por falta de proveedor en compra directa.
- T14: Fila con borde de advertencia/incompleto si no está configurada.
- T15: Botón habilitado al completar todos los campos obligatorios.
- T16: Happy path de registro con retorno 201 Created.
- T17: Compra visible en la tabla histórica.
- T18: Verificación de estado o badges de la compra.

---

### T6. Crear `apps/web/e2e/purchases/purchases-totals.spec.js` (~6 tests, < 130 líneas)
- T19: Cálculo de ingreso neto físico a bodega (empaques × contenidoNeto).
- T20: Subtotal de línea (empaques × precioUnitario).
- T21: Discriminación del 19% de IVA aplicada según check.
- T22: Suma de flete global reflejada en el total acumulado.
- T23: Conversión de total a letras en la barra fija (sticky bar).
- T24: Desglose numérico coherente Base / IVA / Total.

---

### T7. Crear `apps/web/e2e/purchases/purchases-stock.spec.js` (~5 tests, < 120 líneas)
- T25: Click "Consultar Stock" abre el Drawer lateral.
- T26: Drawer renderiza tarjetas de insumos con stock actual.
- T27: Buscador reactivo filtra los insumos por texto.
- T28: "+ Añadir a Compra" inserta la fila en el formulario con estado pendiente de configurar.
- T29: "✕ Quitar" o cambio de estado reactivo en el drawer.

---

### T8. Crear `apps/web/e2e/purchases/purchases-poka-yoke.spec.js` (~4 tests, < 120 líneas)
*(Aquí SÍ se valida interacción de tipeo con pressSequentially)*
- T30: Campo Marca transforma minúsculas a MAYÚSCULAS automáticamente.
- T31: Sanitización de caracteres prohibidos en Marca.
- T32: Input de flete rechaza caracteres alfabéticos/especiales y solo conserva dígitos.
- T33: Persistencia y recuperación del borrador en `localStorage`.

---

### T9. Crear `apps/web/e2e/purchases/purchases-chain.spec.js` (1 test maestro, < 90 líneas)
- T34: Crear Compra Maestra E2E para abastecer la cadena de valor (5 unidades de Leche Entera).
- Capturar ID persistido mediante respuesta de red o fallback `GET`.
- Guardar estado en `.test-data/purchases.json` mediante `saveChainState`.

---

## 🛑 CRITERIO DE DETENCIÓN
- 2 helpers creados en `apps/web/e2e/helpers/`.
- 6 specs creados en `apps/web/e2e/purchases/`.
- CERO ejecuciones de tests, cero commits y cero modificaciones fuera del alcance.
- DETENTE inmediatamente tras generar el último archivo.

## 📋 REPORTE DE SALIDA (ESTRICTO)
Responde ÚNICAMENTE con:
• Lista de archivos creados y líneas resultantes de cada uno.
• Total de tests implementados (~34 tests).
• Comando exacto para que el operador humano valide la suite:
`pnpm --filter web exec playwright test purchases --reporter=list --timeout=20000`