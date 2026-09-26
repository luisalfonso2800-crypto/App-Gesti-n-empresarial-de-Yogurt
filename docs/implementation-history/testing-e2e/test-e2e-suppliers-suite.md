# TEST E2E — MÓDULO PROVEEDORES: SUITE MODULAR COMPLETA E IDEMPOTENTE (LOW QUOTA)

## ⚠️ REGLAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos de git.
4. PROHIBIDO modificar código de producción (`apps/web/src`, `apps/api/src`).
5. PROHIBIDO alterar tests de otros módulos (`presentations`, `supplies`).
6. LÍMITES DUROS: Máximo 2 lecturas, exactamente 6 archivos a crear, máximo 8 llamadas a herramientas.
7. Al terminar de crear los archivos, DETENERSE inmediatamente sin reportes extensos.

---

## 📌 CONTEXTO AUDITADO (FUENTES DE VERDAD)
- **Ruta UI:** `/catalog/suppliers`
- **Botones de Apertura y Cierre:**
  * Abrir: `button:has-text("Nuevo Registro")`
  * Submit: `button[title*="Guardar Proveedor" i], button:has-text("Guardar Proveedor")`
  * Cancelar: `button:has-text("Cancelar")`
- **Locators de Formulario (por name):**
  * `razonSocial`: `input[name="razonSocial"]` (Requerido, UPPERCASE automático)
  * `nit`: `input[name="nit"]` (Requerido, máscara 900.123.456-7)
  * `telefono`: `input[name="telefono"]` (Requerido, 10 dígitos)
  * `direccion`: `input[name="direccion"]` (Requerido)
  * `email`: `input[name="email"]` (Opcional, pero si contiene texto valida formato)
  * `nombreContacto`: `input[name="nombreContacto"]` (Opcional)
  * `observaciones`: `textarea[name="observaciones"]` (Opcional)
  * `activo`: `input[name="activo"]` (Checkbox, default checked)
- **Endpoints Backend:**
  * `GET /api/v1/suppliers`
  * `POST /api/v1/suppliers` (409 Conflict ante duplicidad de NIT o Razón Social)
  * `PATCH /api/v1/suppliers/:id`
  * `PATCH /api/v1/suppliers/:id/toggle-active`
  * `DELETE /api/v1/suppliers/:id`

---

## 🛠️ ACCIONES A EJECUTAR

### T1. Lecturas Mínimas Previas
Leer **únicamente**:
1. `apps/web/e2e/helpers/chain-state.js`
2. `apps/web/e2e/helpers/safe-visible.js` (si existe)

---

### T2. Crear Helper `apps/web/e2e/helpers/supplier-modal.js`
Crear el archivo exportando:
- `openSupplierModal(page)`: Hace click en `Nuevo Registro` y espera visibilidad de `Nuevo Proveedor`.
- `closeSupplierModal(page)`: Hace click defensivo en `Cancelar` o presiona `Escape`.
- `getSupplierLocators(page)`: Devuelve el objeto con los locators exactos (`razonSocial`, `nit`, `nombreContacto`, `telefono`, `email`, `direccion`, `observaciones`, `activo`, `submitBtn`, `cancelBtn`).

---

### T3. Crear Helper `apps/web/e2e/helpers/supplier-form.js`
Crear el archivo exportando:
- `fillBaseFields(locators, timestamp)`: Llena con `pressSequentially` (delay 10ms) datos únicos con prefijo `E2E_TEST_SUPPLIER_` y NIT generado, asegurando campos obligatorios (`razonSocial`, `nit`, `telefono`, `direccion`).

---

### T4. Crear `apps/web/e2e/suppliers/suppliers-basics.spec.js` (< 140 líneas)
Suite idempotente serial de tests T01 a T12:
- `test.beforeAll`: Ejecutar `cleanupByPrefix(request, 'suppliers', 'E2E_')` y `clearChainState('suppliers')`.
- `beforeEach`: Navegar a `/catalog/suppliers` y abrir modal.
- `afterEach`: Cerrar modal si quedó abierto.
- Casos: Abrir modal, título correcto, cerrar con Cancelar, cerrar con Escape, creación exitosa (happy path), visibilidad en tabla, checkbox activo por defecto, conteo, filtrado por nombre, toggle activo/inactivo y cancelar edición.

---

### T5. Crear `apps/web/e2e/suppliers/suppliers-validation.spec.js` (< 140 líneas)
Suite idempotente serial de tests T13 a T24:
- Validar bloqueo por campos obligatorios vacíos (`razonSocial`, `nit`, `telefono`, `direccion`).
- Validar bloqueo por NIT inválido, teléfono < 10 dígitos o letras.
- Validar bloqueo por email inválido y aceptación de opcionales vacíos (`email`, `nombreContacto`, `observaciones`).

---

### T6. Crear `apps/web/e2e/suppliers/suppliers-poka-yoke.spec.js` (< 130 líneas)
Suite idempotente serial de tests T25 a T32:
- Validar auto-UPPERCASE en `razonSocial` vía `inputValue()`.
- Validar máscaras de NIT y formato con espacios en teléfono.
- Validar rechazo `409` por duplicidad exacta y duplicidad case-insensitive.
- Capturar banner amigable de error devuelto por la API.

---

### T7. Crear `apps/web/e2e/suppliers/suppliers-chain.spec.js` (< 100 líneas)
Suite de proveedor maestro para la cadena de valor:
- Crear proveedor maestro: `razonSocial: E2E_CHAIN_SUPPLIER_LACTEOS_${Date.now()}`, `nit: 900999888-7`, `direccion: CALLE CHAIN 456`.
- Capturar ID vía respuesta `POST` o fallback `GET`.
- Guardar estado en `.test-data/suppliers.json` mediante `saveChainState`.

---

## 🛑 CRITERIO DE TERMINACIÓN Y DETENCIÓN
- 2 helpers creados en `apps/web/e2e/helpers/`.
- 4 specs creados en `apps/web/e2e/suppliers/`.
- Todos los specs implementan idempotencia (`cleanupByPrefix`).
- DETENTE inmediatamente tras generar los 6 archivos. CERO commits y CERO comandos de test.

## 📋 REPORTE DE SALIDA (ESTRICTO)
Responde ÚNICAMENTE con:
• Lista de archivos creados.
• Resumen de tests por archivo (Total ~35 tests).
• Comando exacto para que el operador humano valide la idempotencia ejecutando dos veces:
`pnpm --filter web exec playwright test suppliers --reporter=list --timeout=20000`