# FIX E2E — INSUMOS: ERRADICACIÓN TOTAL DE isVisible DESPROTEGIDO EN HELPERS Y TESTS

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o explorar directorios ajenos.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO tocar código de producción en `apps/web/src` o `apps/api/src`.
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 3 llamadas a herramientas.
6. Editar ÚNICAMENTE `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 CAUSA EXACTA DEL FALLO:
En la función helper `closeModal` (~línea 59):
```javascript
const cancelBtn = page.getByRole('button', { name: /cancelar/i });
if (await cancelBtn.isVisible()) {
  await cancelBtn.click();
}