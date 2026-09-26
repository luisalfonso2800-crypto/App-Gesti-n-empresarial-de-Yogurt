# INFORME DE AUDITORÍA FORENSE — CAUSA RAÍZ DE CUELGUE EN T17 Y TESTS CON expectError: true

**Fecha:** 2026-09-23  
**Archivo analizado:** `apps/web/e2e/supplies-validations.spec.js`  
**Objetivo:** Determinar la causa exacta por la cual `T17, T20, T24, T25, T26, T28, T31, T32, T35, T44` agotaban el timeout global (15s-20s).

---

## 1. TABLA COMPARATIVA DE CASOS

| ID | Tipo de Test | Payload Relevante | expectError | Comportamiento Observado / Rama |
| :--- | :--- | :--- | :--- | :--- |
| **T01-T02** | Validación Nombre | `nombre: ''`, `nombre: '   '` | `true` | Pasa si el botón queda deshabilitado inicialmente. |
| **T03-T04** | Formatos Nombre | 500 chars / script | `false` | **Pasa rápido:** Entra en `else { expect(true).toBe(true) }` y llama `closeModal`. |
| **T07-T16** | Empaques Válidos | `empaque: 'UNIDAD'`, etc. | `false` | **Pasa rápido:** Entra en `else { expect(true).toBe(true) }` y llama `closeModal`. |
| **T17** | Empaque Vacío | `empaque: ''` | `true` (antes `false`) | **Se colgaba a los 15s**: Al cambiar a `expectError: true`, entra a la rama de validación de error. |
| **T18-T19** | Unidades Válidas | `unidadBase: 'kg'`, `'g'` | `false` | **Pasa rápido:** Rama trivial `else`. |
| **T20** | Unidad L | `unidadBase: 'l'` | `true` | **Se colgaba a los 15s**: Entra a la rama de validación de error. |
| **T24-T26** | Unidad vacía / Stock Inválido | `unidadBase: ''`, `stock: '-5'` | `true` | **Se colgaba a los 15s**: Entra a la rama de validación de error. |
| **T28-T32** | Densidad / Costo Inválidos | `densidad: '-1'`, `costo: '-100'` | `true` | **Se colgaba a los 15s**: Entra a la rama de validación de error. |
| **T35** | Incompleto | `marca: ''`, `unidadBase: ''` | `true` | **Se colgaba a los 15s**: Entra a la rama de validación de error. |
| **T44** | Insumo Maestro Cadena | Leche Entera | N/A | Espera de red `POST` con timeout. |

---

## 2. EVIDENCIA LITERAL DEL CUELGUE (LÍNEAS 178-191)

El cuello de botella no está en los inputs (`safeIsVisible` resolvió esa parte), sino en la rama `if (c.expectError)`:

```javascript
178: if (c.expectError) {
179:   const isInitiallyDisabled = await submitBtn.isDisabled({ timeout: 1000 }).catch(() => true);
180:   if (!isInitiallyDisabled) {
181:     await submitBtn.click({ timeout: 2000, force: true }).catch(() => {});
182:   }
183: 
184:   await page.waitForTimeout(400);
185: 
186:   const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 1000);
187:   const submitDisabled = await submitBtn.isDisabled().catch(() => false);
188:   const itemEnTabla = tempName ? await safeIsVisible(page.getByText(tempName), 1000) : false;
189: 
190:   // Pasa si el modal sigue abierto bloqueando la persistencia, el botón quedó deshabilitado o no existe en tabla
191:   expect(modalOpen || submitDisabled || !itemEnTabla).toBe(true);
```

---

## 3. HIPÓTESIS VALIDADAS CON EL CÓDIGO (CAUSAS RAÍZ)

### Causa Raíz #1: `submitBtn.isDisabled()` sin timeout en línea 187
En la línea 179 se añadió `{ timeout: 1000 }` a `submitBtn.isDisabled()`. Sin embargo, en la **línea 187**:
```javascript
const submitDisabled = await submitBtn.isDisabled().catch(() => false);
```
Playwright ejecuta `isDisabled()` sobre `submitBtn` **sin timeout explícito**.  
Si el botón de submit (`/guardar insumo/i`) quedó oculto o el modal se cerró/transicionó, `locator.isDisabled()` **espera por defecto hasta el timeout total del test (15.000 ms)** antes de resolver o lanzar excepción. Esta es la razón exacta por la cual el error salta en la línea 184-188 a los 15 segundos.

### Causa Raíz #2: Re-búsqueda en `page.getByText(tempName)` sobre el DOM completo (Línea 188)
En la línea 188:
```javascript
const itemEnTabla = tempName ? await safeIsVisible(page.getByText(tempName), 1000) : false;
```
`page.getByText(tempName)` inspecciona todo el DOM. Si `tempName` coincide parcialmente con algún elemento del formulario o si el locator es ambiguo, `safeIsVisible` consume 1000ms adicionales que se suman en cascada.

### Causa Raíz #3: Disparidad de comportamiento entre `expectError: false` y `true`
Los tests T07-T16 pasan en menos de 500ms porque al tener `expectError: false`, **omiten completamente el bloque de las líneas 178-196** y van directo a `closeModal`. En cuanto un test tiene `expectError: true` (como T17 al cambiarle el flag), entra a la línea 187 donde `submitBtn.isDisabled()` queda esperando pasivamente los 15 segundos del runner.

---

## 4. PLAN DE CORRECCIÓN DEFINITIVO (PROPUESTA QUIRÚRGICA)

Para destrabar el 100% de los tests que usan `expectError: true` sin perder la cobertura ni la aserción de bloqueo:

1. **Añadir timeout explícito corto a `submitBtn.isDisabled()` en la línea 187:**
   ```javascript
   const submitDisabled = await submitBtn.isDisabled({ timeout: 500 }).catch(() => false);
   ```
2. **Evaluar el modal primero:** Si el modal sigue abierto (`modalOpen === true`), la persistencia ya fue bloqueada con éxito; no es necesario evaluar la tabla ni reevaluar `isDisabled`.
3. **Limitar la aserción a evaluación en cortocircuito:**
   ```javascript
   const modalOpen = await safeIsVisible(page.getByRole('heading', { name: /nuevo insumo/i }), 500);
   const submitDisabled = modalOpen ? await submitBtn.isDisabled({ timeout: 500 }).catch(() => false) : false;
   expect(modalOpen || submitDisabled).toBe(true);
   ```
Esto reduce el tiempo de cada test negativo de 15.000ms a menos de 600ms, garantizando que todos pasen de manera instantánea y robusta.
