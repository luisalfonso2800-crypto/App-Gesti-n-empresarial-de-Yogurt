# AUDITORÍA TÉCNICA DEL MÓDULO PROVEEDORES (PRE-TEST E2E)

Fecha de auditoría: 23/09/2026  
Módulo evaluado: `/catalog/suppliers` (Directorio de Proveedores)  
Componentes inspeccionados: `apps/web/src/app/catalog/suppliers/`, `SupplierModal.jsx`, `useSupplierForm.js`, `SupplierFormFields.jsx`, `apps/api/prisma/schema.prisma`.

---

## 1. 🗺️ MAPA DE SELECTORES UI

| Campo | Etiqueta Visible | Atributo `name` | Tipo DOM | Selector Playwright Recomendado |
| :--- | :--- | :--- | :--- | :--- |
| **Razón Social** | Razón Social / Nombre * | `razonSocial` | `input[text]` | `page.locator('input[name="razonSocial"]')` |
| **NIT / Cédula** | NIT / Cédula * | `nit` | `input[text]` | `page.locator('input[name="nit"]')` |
| **Contacto** | Nombre de Contacto | `nombreContacto` | `input[text]` | `page.locator('input[name="nombreContacto"]')` |
| **Celular / Teléfono** | Teléfono / Celular * | `telefono` | `input[text]` | `page.locator('input[name="telefono"]')` |
| **Email** | Email | `email` | `input[email]` | `page.locator('input[name="email"]')` |
| **Dirección** | Dirección * | `direccion` | `input[text]` | `page.locator('input[name="direccion"]')` |
| **Observaciones** | Observaciones | `observaciones` | `textarea` | `page.locator('textarea[name="observaciones"]')` |
| **Estado Activo** | Proveedor Activo | `activo` | `input[checkbox]` | `page.locator('input[name="activo"]')` |

---

## 2. 🪟 DISPARADORES Y MODAL

- **Botón de Apertura en Tabla/Header:**
  - Selector: `page.getByRole('button', { name: /nuevo registro/i })` o `page.locator('button:has-text("Nuevo Registro")')`.
- **Encabezado del Modal (Heading):**
  - Modo Creación: `page.getByRole('heading', { name: /nuevo proveedor/i })`
  - Modo Edición: `page.getByRole('heading', { name: /editar proveedor/i })`
- **Botón de Guardar / Submit:**
  - Selector: `page.locator('button[title*="Guardar Proveedor" i], button:has-text("Guardar Proveedor")').first()`
  - En edición: `page.locator('button:has-text("Actualizar Proveedor")').first()`
- **Botón Cancelar / Cierre:**
  - Selector: `page.locator('button:has-text("Cancelar")')`

---

## 3. 🛡️ MATRIZ POKA-YOKE (FRONTEND VS BACKEND)

| Regla / Validación | Frontend (`useSupplierForm.js`) | Backend / BD (`schema.prisma` / Controller) | Comportamiento en UI ante Falla |
| :--- | :--- | :--- | :--- |
| **Razón Social Requerida** | `!formData.razonSocial?.trim()` | `nombre String @unique` | Bloquea submit, añade `"Razón Social (*) requerida"` |
| **UPPERCASE Automático** | Transforma a mayúsculas en `handleChange` para `razonSocial`, `nombreContacto`, `direccion`, `observaciones`. | Almacena el valor recibido | El input visualiza todo en mayúsculas automáticamente |
| **Máscara NIT / Cédula** | Formatea con puntos y guion (`900.123.456-7`). Limpia puntos al enviar payload (`900123456-7`). | `nitCedula String @unique` | Bloquea submit si está vacío o contiene caracteres inválidos |
| **Celular (10 Dígitos)** | Formatea con espacios (`300 123 4567`). Exige estrictamente 10 dígitos numéricos (`telefonoDigits.length < 10`). | `telefono String?` | Bloquea submit, muestra `"El celular debe tener 10 dígitos"` |
| **Email Válido** | Valida sintaxis `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` si tiene texto. Es opcional si está vacío. | `email String?` | Bloquea submit, muestra `"Ingrese un correo electrónico válido"` |
| **Dirección Requerida** | `!formData.direccion?.trim()` | `direccion String?` en BD, pero obligatorio en Frontend | Bloquea submit si está vacío |
| **Detección Duplicidad** | Captura error de unicidad del backend y muestra mensaje amigable. | `@unique` en `nombre` y `nitCedula`. | Muestra banner de error: `"Ya existe un proveedor registrado con este NIT / Cédula o Razón Social."` |

---

## 4. 🌐 RESUMEN DE ENDPOINTS API Y PAYLOADS

- **Base Endpoint:** `/api/v1/suppliers` (gestionado vía `apiClient`).
- **Endpoints:**
  - `GET /suppliers`: Listado de proveedores registrados.
  - `POST /suppliers`: Creación de nuevo proveedor.
  - `PATCH /suppliers/:id`: Edición de proveedor existente.
  - `PATCH /suppliers/:id/toggle-active`: Cambio de estado activo/inactivo.
- **Payload Enviado por Frontend (`POST /suppliers`):**
  ```json
  {
    "nombre": "LÁCTEOS EL PORVENIR S.A.S",
    "nitCedula": "900123456-7",
    "nombreContacto": "CARLOS GÓMEZ",
    "telefono": "3001234567",
    "email": "contacto@elporvenir.com",
    "direccion": "CALLE 45 # 12-34",
    "observaciones": "PROVEEDOR PRINCIPAL DE LECHE",
    "activo": true
  }
  ```
