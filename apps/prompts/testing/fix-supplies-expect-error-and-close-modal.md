# FIX E2E — INSUMOS: CORRECCIÓN DE expectError Y BLINDAJE DE closeModal

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o explorar directorios ajenos.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO tocar código de producción en `apps/web/src` o `apps/api/src`.
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 3 llamadas a herramientas.
6. Editar ÚNICAMENTE `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 DIAGNÓSTICO EXACTO:
1. En `validationCases`, los casos que verifican rechazo de entradas inválidas tienen asignado `expectError: false`, provocando que el test caiga en un `else` trivial (`expect(true).toBe(true)`) e intente cerrar de inmediato el modal.
2. La rutina `closeModal` ejecuta `cancelBtn.click()` sin parámetros de escape. Si la UI muestra un diálogo de confirmación por descarte de cambios o un overlay reactivo, la promesa de click queda bloqueada hasta agotar el timeout global del runner.

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/supplies-validations.spec.js`:

### 1. Actualizar `expectError` en el arreglo `validationCases`:
Localizar el array de casos de prueba y cambiar `expectError: false` a `expectError: true` en los siguientes IDs:
- `T17` (Empaque sin selección)
- `T20` (Unidad base L)
- `T24` (Unidad base vacía)
- `T25` (Stock mínimo negativo)
- `T26` (Stock mínimo no numérico)
- `T28` (Densidad negativa)
- `T31` (Costo base negativo)
- `T32` (Costo base no numérico)
- `T35` (Solo nombre sin obligatorios)

*(Conservar intactos los casos que sean happy paths o valores válidos legítimos con `expectError: false`)*.

### 2. Blindar definitivamente la función `closeModal`:
Reemplazar la función `closeModal` por una rutina no bloqueante con `force: true`, `timeout` corto y escape por tecla `Escape`:
```javascript
async function closeModal(page) {
  try {
    const cancelBtn = page.getByRole('button', { name: /cancelar/i });
    if (await safeIsVisible(cancelBtn, 800)) {
      await cancelBtn.click({ timeout: 1500, force: true }).catch(() => {});
    } else {
      // Fallback si el botón está cubierto o inaccesible
      await page.keyboard.press('Escape').catch(() => {});
    }
  } catch {
    // Continuar si el modal ya cerró
  }
  await page.waitForTimeout(250).catch(() => {});
}