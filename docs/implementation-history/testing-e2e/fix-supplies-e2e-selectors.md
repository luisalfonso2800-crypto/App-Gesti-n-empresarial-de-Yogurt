# FIX E2E — INSUMOS: ALINEACIÓN EXACTA DE SELECTORES CON LA UI REAL

## ⚠️ REGLAS ESTRICTAS ANTI-CONSUMO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds o comandos git.
4. PROHIBIDO modificar código fuente de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Máximo 3 lecturas de archivo, exactamente 1 edición, máximo 6 llamadas a herramientas.
6. Al reemplazar los selectores: DETENERSE inmediatamente sin reportes extensos.

---

## 📌 CONTEXTO DE LA INTERFAZ REAL (MODAL "NUEVO INSUMO")
Basado en la captura real del modal `SupplyModal.jsx`, los selectores válidos son:
- **Disparador del modal:** Botón con texto `/nuevo insumo/i` o `+ Nuevo Insumo`
- **Título del modal:** `Nuevo Insumo`
- **Nombre:** No tiene `<label>` accesible directo; usar `page.getByPlaceholder(/ej:\s*leche entera/i)`
- **Categoría:** `page.getByRole('combobox').filter({ hasText: /seleccione categor[ií]a/i })` o select cuyo option inicial contenga `Seleccione categoría`
- **Marca:** `page.getByLabel(/marca/i)` o input debajo de texto "MARCA *"
- **Empaque:** Select con opción inicial `Seleccione empaque` o `page.getByLabel(/empaque/i)`
- **Contenido por empaque:** Input numérico con placeholder `/ej:\s*1000/i` o label que contiene `/contenido/i`
- **Unidad Base:** Select con opción inicial `Seleccione unidad` o `page.getByLabel(/unidad base/i)`
- **Stock Mínimo:** `page.getByLabel(/stock m[ií]nimo/i)` (acepta asterisco)
- **Densidad:** `page.getByLabel(/densidad/i)` (si está presente) o input numérico adyacente a "DENSIDAD"
- **Costo Base Referencial:** `page.getByLabel(/costo base referencial/i)` o `page.getByPlaceholder('0')` en la sección de costo
- **Observaciones:** `page.getByLabel(/observaciones/i)` o `textarea` / input correspondiente
- **Botón de guardado:** Botón visible con texto `/guardar/i` o `/crear insumo/i` o `/guardar insumo/i`

---

## 🛠️ TAREA ÚNICA:

Modificar el archivo:
`apps/web/e2e/supplies-validations.spec.js`

1. **Corregir los localizadores de inputs:**
   - Reemplazar cualquier `getByLabel('Nombre del Insumo')` o `getByLabel(/nombre/i)` estricto por:
     `page.getByPlaceholder(/ej:\s*leche entera/i)`
   - Reemplazar selectores rígidos de selects para usar coincidencia insensible a mayúsculas y acentos:
     * Categoría: `page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione categor[ií]a/i }) })` (o helper similar robusto).
     * Unidad Base: `page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione unidad/i }) })`.
     * Empaque: `page.locator('select').filter({ has: page.locator('option', { hasText: /seleccione empaque/i }) })`.
   - Asegurar que los inputs numéricos utilicen `page.getByLabel(/marca/i)`, `page.getByLabel(/stock m[ií]nimo/i)`, `page.getByLabel(/costo base/i)`.
   - Asegurar que el click de guardado use:
     `page.getByRole('button', { name: /(guardar|crear)/i })`.

2. **Mantener la lógica de asertos intacta:**
   - NO alterar el flujo de los tests (validaciones, bloque de duplicidad y test maestro).
   - NO alterar el bloque `beforeAll` ni `afterAll`.

---

## 🛑 ENTREGABLE Y DETENCIÓN:
- Guardar los cambios en `apps/web/e2e/supplies-validations.spec.js`.
- Imprimir únicamente:
  1. Confirmación de archivo actualizado.
  2. Comando Playwright para que el humano ejecute manualmente.
- DETENERSE inmediatamente.