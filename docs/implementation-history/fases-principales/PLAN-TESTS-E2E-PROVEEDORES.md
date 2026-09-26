# 📋 ESTRUCTURA Y PLAN DE PRUEBAS E2E — MÓDULO PROVEEDORES

## 🎯 OBJETIVO
Garantizar la cobertura exhaustiva, robusta y modular del módulo de **Proveedores** (`/catalog/suppliers`) mediante suites independientes que cumplan los límites arquitecturales del proyecto:
- Menos de 150 líneas por archivo `.spec.js`.
- Máximo 15 tests por archivo.
- Tests explícitos (sin bucles dinámicos).
- Cumplimiento de Poka-Yoke (NIT, teléfono de 10 dígitos, email válido, campos requeridos en mayúsculas).

---

## 🏛️ ARQUITECTURA DE SUITES MODULARES

### 📁 Carpeta de Tests: `apps/web/e2e/suppliers/`
1. **`suppliers-basics.spec.js`** (T01-T10):
   - Carga inicial del catálogo de proveedores (título, botón "+ Nuevo Proveedor", tabla/empty state).
   - Apertura y cierre del modal (`Nuevo Proveedor`).
   - Validación Poka-Yoke: Campos obligatorios vacíos (`razonSocial`, `nit`, `telefono`, `direccion`).
   - Transformación automática a mayúsculas (UPPERCASE) en `razonSocial`, `nombreContacto`, `direccion`.
   - Sanitización contra inyecciones XSS / scripts.

2. **`suppliers-validations.spec.js`** (T11-T20):
   - Validación de formato NIT / Cédula (máscaras y dígitos).
   - Validación Poka-Yoke de Celular/Teléfono (debe tener exactamente 10 dígitos).
   - Validación de formato de correo electrónico (sintaxis válida vs inválida).
   - Manejo de textarea de observaciones y checkbox de estado activo.

3. **`suppliers-duplicates.spec.js`** (T21-T30):
   - Detección de duplicidad por NIT (evitar doble registro).
   - Detección de duplicidad por Razón Social.
   - Mensajes de error claros al usuario sin cuelgues ni falsos positivos.

4. **`suppliers-chain.spec.js`** (T31):
   - Registro de Proveedor Maestro para la **Cadena de Valor** (`E2E_CHAIN_SUPPLIER_LACTEOS`).
   - Captura del ID generado y persistencia en `chain-state.js` para consumo en Compras / Recepción de Materia Prima.

---

## 🛠️ HELPERS DEDICADOS: `apps/web/e2e/helpers/supplier-modal.js`
- `openSupplierModal(page)`: Abre el modal y espera a que sea visible.
- `closeSupplierModal(page)`: Cierre seguro del modal (botón cancelar / ESC).
- `getSupplierLocators(page)`: Retorna locators precisos por atributo `name` y roles específicos:
  - `razonSocialInput: page.locator('input[name="razonSocial"]')`
  - `nitInput: page.locator('input[name="nit"]')`
  - `contactoInput: page.locator('input[name="nombreContacto"]')`
  - `telefonoInput: page.locator('input[name="telefono"]')`
  - `emailInput: page.locator('input[name="email"]')`
  - `direccionInput: page.locator('input[name="direccion"]')`
  - `observacionesInput: page.locator('textarea[name="observaciones"]')`
  - `activoCheckbox: page.locator('input[name="activo"]')`
  - `submitBtn: page.locator('button[title*="Guardar Proveedor" i], button:has-text("Guardar Proveedor")')`
  - `cancelBtn: page.locator('button:has-text("Cancelar")')`

---

## 🚦 COMANDOS DE EJECUCIÓN
```bash
# Ejecutar toda la suite modular de proveedores
pnpm --filter web exec playwright test suppliers/ --reporter=list

# Verificar cumplimiento de límites arquitecturales
pnpm --filter web run test:e2e:lint
```
