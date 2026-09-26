# FIX E2E — INSUMOS: PREVENCIÓN DE TIMEOUTS MEDIANTE safeIsVisible

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO modificar código de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 4 llamadas a herramientas.
6. Editar ÚNICAMENTE `apps/web/e2e/supplies-validations.spec.js`.
7. Al terminar la edición, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 CAUSA TÉCNICA:
Llamadas a `await locator.isVisible()` sobre elementos inexistentes o locators con `.or()` agotan el timeout del test (15s) en lugar de retornar `false` de inmediato.

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/supplies-validations.spec.js`:

### 1. Definir helper no bloqueante en el encabezado
Inmediatamente después de los imports, declarar:
```javascript
/**
 * Evalúa visibilidad con timeout corto (1000ms) y captura de error
 * para evitar colgar el runner en elementos ausentes.
 */
async function safeIsVisible(locator, timeout = 1000) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}