# FIX E2E — INSUMOS: PRECISIÓN DE submitBtn (RESOLUCIÓN DE CONFLICTO DE MATCHES Y CLICKS)

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o explorar directorios.
3. PROHIBIDO ejecutar Playwright, builds, dev servers o comandos git.
4. PROHIBIDO tocar código de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Exactamente 1 lectura de archivo, exactamente 1 edición, máximo 3 llamadas a herramientas.
6. Editar ÚNICAMENTE `apps/web/e2e/supplies-validations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin explicaciones redundantes.

---

## 📌 CAUSA TÉCNICA:
El locator `submitBtn` utiliza una expresión regular permisiva `/(guardar|crear)/i` que coincide con múltiples botones dentro o fuera del modal. Playwright se bloquea esperando unicidad en lugar de ejecutar la interacción.

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/supplies-validations.spec.js`:

### 1. Corregir la definición de `submitBtn` en `getFormLocators`:
Localizar la propiedad `submitBtn` y sustituirla por una búsqueda estricta con `.first()`:
```javascript
submitBtn: page.getByRole('button', { name: /guardar insumo/i }).first(),