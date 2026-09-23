# FIX E2E — INSUMOS: REEMPLAZO EXACTO DE submitDisabled Y ASERCIÓN EN L186-191

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o explorar directorios ajenos.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO tocar código de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 2 llamadas a herramientas.
6. Modificar ÚNICAMENTE el bloque de aserción en `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar el reemplazo exacto, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 CAUSA TÉCNICA LOCALIZADA:
En la línea ~187 de `apps/web/e2e/supplies-validations.spec.js`:
```javascript
const submitDisabled = await submitBtn.isDisabled().catch(() => false);