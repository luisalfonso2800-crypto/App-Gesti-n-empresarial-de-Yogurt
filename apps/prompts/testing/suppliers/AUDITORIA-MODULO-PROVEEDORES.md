# AUDITORÍA DEL MÓDULO PROVEEDORES (PRE-TEST E2E) — MODO LOW QUOTA

## ⚠️ REGLAS ESTRICTAS DE CONSUMO DE QUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. MODO SOLO LECTURA: PROHIBIDO modificar o crear archivos de código (`.js`, `.jsx`, `.ts`, `.prisma`).
3. PROHIBIDO lanzar subagentes o búsquedas recursivas abiertas.
4. PROHIBIDO ejecutar Playwright, dev servers, builds o comandos git.
5. LÍMITES DUROS: Máximo 6 lecturas de archivo, exactamente 1 archivo creado (el informe), máximo 8 llamadas a herramientas.
6. Al guardar el informe Markdown, DETENERSE inmediatamente sin texto redundante en consola.

---

## 📌 OBJETIVO TÉCNICO:
Inspeccionar los componentes de UI, el contrato de API y el modelo de datos de **Proveedores** para extraer selectores exactos, estados de error y reglas Poka-Yoke antes de construir la suite de pruebas E2E modular.

---

## 🛠️ TAREAS DE INSPECCIÓN:

### T1. Localización y Lectura de UI (Frontend)
Leer puntualmente:
1. `apps/web/src/app/catalog/suppliers/page.jsx` (o ruta equivalente de la página del catálogo).
2. El componente del modal: buscar directamente `SupplierModal.jsx` (en `apps/web/src/components/catalog/`).
- Extraer:
  - Título del modal (`heading`).
  - Botón de apertura en la tabla (texto exacto: ej. "Nuevo Registro", "+ Nuevo Proveedor").
  - Todos los inputs/selects: `name`, `id`, `placeholder`, labels accesibles.
  - Botones de acción: texto exacto de Confirmar/Guardar y Cancelar.

### T2. Inspección del Backend y Contrato de Validación
Leer puntualmente:
1. El controlador o router del módulo proveedores en `apps/api/src/` (identificar endpoints `GET`, `POST`, `PUT`, `DELETE`).
2. El schema de validación asociado (Zod, Joi o DTO de Nest/Express).
- Extraer:
  - Validaciones estrictas: formato de NIT/RUT, teléfono, correo electrónico.
  - Reglas de duplicidad: si valida NIT único o Razón Social única con error 409/400.
  - Parámetros comerciales: días de crédito, retenciones o campos de IVA.

### T3. Inspección del Modelo de Datos (Prisma)
Leer la sección del modelo `Proveedor` / `Supplier` en `prisma/schema.prisma` (o `packages/database/prisma/schema.prisma`):
- Extraer campos requeridos vs opcionales, tipos de datos y constraints `@unique`.

---

## 🛑 ENTREGABLE Y DETENCIÓN:
Generar el informe técnico en:  
`apps/prompts/testing/AUDITORIA-PROVEEDORES.md`

### Estructura obligatoria del informe:
1. **Mapa de Selectores UI:** Tabla con `Campo`, `Tipo de elemento`, `Selector Playwright recomendado` (priorizando `getByRole`, `getByLabel` o `locator('input[name="..."]')`).
2. **Disparadores y Modales:** Texto exacto del botón de alta y del heading del modal.
3. **Matriz Poka-Yoke:** Lista de validaciones frontend vs backend (formatos de NIT, unicidad, longitudes).
4. **Resumen de Endpoints API:** URLs exactas y payloads esperados.

DETENCIÓN:  
Al guardar el informe Markdown, DETENTE inmediatamente.