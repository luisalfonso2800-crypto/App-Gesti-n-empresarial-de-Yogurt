# FIX E2E — INSUMOS: ELIMINACIÓN DE waitForResponse COLGADOS Y TIMEOUTS INFINITOS

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o explorar directorios.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o git commands.
4. PROHIBIDO modificar código fuente de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 4 llamadas a herramientas.
6. Editar ÚNICAMENTE el archivo de pruebas `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 CAUSA RAÍZ A ERRADICAR:
El uso de `page.waitForResponse(...)` en tests de validación negativa donde el navegador o React bloquean el submit antes de emitir la petición HTTP. Esto deja promesas pendientes que disparan el timeout por defecto de 300s (5 minutos).

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/supplies-validations.spec.js`:

### 1. Refactorización de Tests de Validación Negativa (T17, T24, T26, T35):
- Eliminar de raíz cualquier `page.waitForResponse()`.
- Reemplazar por verificación reactiva de UI:
  ```javascript
  const submitBtn = page.getByRole('button', { name: /(guardar|crear)/i });
  const isInitiallyDisabled = await submitBtn.isDisabled().catch(() => false);
  
  if (!isInitiallyDisabled) {
    await submitBtn.click({ timeout: 2000 }).catch(() => {});
  }
  
  await page.waitForTimeout(400);

  const modalOpen = await page.getByRole('heading', { name: /nuevo insumo/i }).isVisible().catch(() => false);
  const submitDisabled = await submitBtn.isDisabled().catch(() => false);
  
  // Pasa si el modal sigue abierto bloqueando la persistencia o el botón quedó inhabilitado
  expect(modalOpen || submitDisabled).toBe(true);