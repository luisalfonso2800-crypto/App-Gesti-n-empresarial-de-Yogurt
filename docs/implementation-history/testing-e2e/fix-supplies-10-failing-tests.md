# FIX E2E — INSUMOS: REFINAMIENTO DE 10 TESTS FALLIDOS (TIMEOUTS Y MODAL STATE)

## ⚠️ REGLAS ESTRICTAS ANTI-CONSUMO DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, dev servers, builds o git commands.
4. PROHIBIDO modificar código fuente de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 4 llamadas a herramientas.
6. Modificar ÚNICAMENTE los tests indicados en `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin reportes extensos.

---

## 📌 DIAGNÓSTICO DE CAUSA RAÍZ:
1. **Grupo A (Timeouts en T17, T20, T24, T26, T35, T44):** 
   - El test se queda esperando un `waitForResponse` de un `POST` que el navegador nunca emite porque la validación HTML5 o el estado del botón (`disabled`) bloquean el submit.
   - En T20, el selector de unidad `L` puede estar chocando con la etiqueta case-sensitive (`l` minúscula canónica).
2. **Grupo B (modalOpen=false en T25, T28, T31, T32):**
   - El test asume rígidamente que el modal debe permanecer abierto, pero si el formulario procesa el evento o se resetea, falla. Se debe validar el efecto real: o el modal sigue abierto, o el registro inválido NO existe en la tabla.

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/supplies-validations.spec.js`:

### 1. Refactorización Grupo A — Eliminar Timeouts Ciegos
- En **T17, T24, T26, T35**:
  - Eliminar cualquier `Promise.all([page.waitForResponse(...), submitBtn.click()])` cuando se evalúe un bloqueo preventivo.
  - En su lugar:
    1. Intentar hacer click en el botón de guardado:
       ```javascript
       const isSubmitDisabled = await submitBtn.isDisabled().catch(() => false);
       if (!isSubmitDisabled) {
         await submitBtn.click({ timeout: 2000 }).catch(() => {});
       }
       ```
    2. Comprobar que el insumo con nombre inválido/temporal NO figure en la grilla (`expect(await page.getByText(tempName).isVisible().catch(() => false)).toBe(false)`).
- En **T20 (Unidad base L)**:
  - Asegurar que la selección use regex insensible o el valor canónico exacto:
    `page.locator('select').filter({ has: page.locator('option', { hasText: /l/i }) }).selectOption({ label: 'l' }).catch(() => selectOption({ value: 'l' }))`
- En **T44 (Insumo Maestro)**:
  - Seleccionar la primera categoría y empaque disponibles dinámicamente si los nombres exactos varían:
    ```javascript
    const catSelect = page.locator('select').first();
    await catSelect.selectOption({ index: 1 }).catch(() => {});
    ```
  - Reducir el timeout de espera de respuesta a máximo 7000ms con fallback seguro.

### 2. Refactorización Grupo B — Asertos Flexibles con Detección de Hallazgo
- En **T25 (Stock negativo), T28 (Densidad negativa), T31 (Costo negativo), T32 (Costo no numérico)**:
  - Reemplazar la aserción rígida `expect(modalOpen).toBe(true)` por:
    ```javascript
    const modalVisible = await page.getByRole('heading', { name: /nuevo insumo/i }).isVisible().catch(() => false);
    const itemEnTabla = await page.getByText(testSupplyName).isVisible().catch(() => false);

    // El test es exitoso si el sistema bloqueó la persistencia (el modal sigue abierto O el ítem no se creó)
    expect(modalVisible || !itemEnTabla).toBe(true);

    if (!modalVisible && itemEnTabla) {
      console.warn(`[HALLAZGO POKA-YOKE] El sistema permitió persistir datos inválidos para: ${testSupplyName}`);
    }
    ```

---

## 🛑 ENTREGABLE Y DETENCIÓN:
- Guardar la edición en `apps/web/e2e/supplies-validations.spec.js`.
- Imprimir únicamente:
  1. Confirmación de archivo modificado.
  2. Comando Playwright para que el humano ejecute manualmente.
- DETENERSE inmediatamente.