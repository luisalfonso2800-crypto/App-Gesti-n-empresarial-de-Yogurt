# DIAGNÓSTICO Y CORRECCIÓN DEFINITIVA — E2E SUPPLIERS: RENDIMIENTO Y SINCRONIZACIÓN REAL

## ⚠️ REGLAS ANTI-QUEMA DE CUOTA Y AISLAMIENTO (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes o procesos en segundo plano.
3. PROHIBIDO tocar módulos o specs fuera del alcance de Suppliers (no alterar supplies, presentations, etc.).
4. PROHIBIDO aumentar los timeouts globales a 40s/60s, agregar waitForTimeout() o sleeps ciegos.
5. NO tocar backend a menos que la evidencia de respuesta demuestre un cuello de botella real.
6. LÍMITES ESTRICTOS: Máximo 5 lecturas de archivo. Máximo 4 ediciones.
7. Al concluir la verificación, DETENERSE de inmediato.

---

## 📌 CONTEXTO DE LA FALLA
La suite corre con:
`pnpm --filter web exec playwright test suppliers --reporter=list --timeout=20000`
- Tests T05, T30 y T33 fallaban por exceder los 20000ms. Al elevar a 30s pasaban, evidenciando retraso de interacción y sincronización errónea post-submit.
- Medición en T05: `fillBaseFields` tardaba ~17.8s con `pressSequentially()`. Al usar `fill()` secuencial bajó a ~7.7s (~1.5s por campo).
- Al usar `Promise.all` paralelo, el formulario se llenó en ~1.76s, pero T05 falló porque el assert `expect(modalClosed || itemVisible)` evaluó antes de que la persistencia o la UI se reflejaran.

---

## 🛠️ FASE 1: INSPECCIÓN QUIRÚRGICA (MÁXIMO 3 LECTURAS)
Leer exclusivamente:
1. `apps/web/src/components/catalog/SupplierModal.jsx` (y su hook asociado si existe en `modal-parts/` o `parts/`).
   - Identificar por qué cada input toma ~1.5s (validación síncrona pesada, debounce, re-renders completos o llamadas de red en onChange/onInput).
2. `apps/web/e2e/helpers/supplier-form.js`.
3. `apps/web/e2e/suppliers/suppliers-basics.spec.js`.

---

## 🛠️ FASE 2: RESOLUCIÓN Y SINCRONIZACIÓN REAL

### Problema A: Optimización del Helper de Llenado (`apps/web/e2e/helpers/supplier-form.js`)
- En el helper genérico `fillBaseFields()`:
  * Sustituir `pressSequentially()` por `.fill()` directo para los campos en pruebas de flujo regular (happy path).
  * Si la aplicación requiere eventos específicos para disparar el estado de React y habilitar el botón de submit, despachar los eventos semánticos correspondientes o garantizar que el valor quede fijado sin latencia artificial.
  * PRESERVAR `pressSequentially()` ÚNICAMENTE en `suppliers-poka-yoke.spec.js` donde se evalúan explícitamente máscaras en vivo (teléfono, uppercase al vuelo).

### Problema B: Sincronización Real del Submit y Criterio de Registro Exitoso
- En `apps/web/e2e/suppliers/suppliers-basics.spec.js` (T05) y helpers correspondientes:
  * Eliminar `page.waitForTimeout(1000)` tras el submit.
  * Sincronizar con el evento real de red: esperar la respuesta de la API que confirma la persistencia:
    `const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/v1/suppliers') && resp.request().method() === 'POST');`
    `await loc.submitBtn.click();`
    `const response = await responsePromise;`
    `expect(response.status()).toBe(201);`
  * Confirmar el cierre del modal esperando su desaparición real:
    `await expect(page.getByRole('heading', { name: /nuevo proveedor/i })).not.toBeVisible();`
  * Esperar la presencia del proveedor en la vista o tabla mediante assertions automáticos de Playwright con reintentos nativos (`await expect(...).toBeVisible()`), eliminando condiciones booleanas ambiguas de `modalClosed || itemVisible`.

### Problema C: Limpieza de Código Temporal
- Remover cualquier `console.log([T05] ...)`, cronómetros o `Date.now()` instrumentados durante las pruebas diagnósticas.

---

## 🧪 VALIDACIÓN LOCAL OBLIGATORIA
Ejecutar paso a paso en terminal:
1. Validar T05 y básicos:
   `pnpm --filter web exec playwright test e2e/suppliers/suppliers-basics.spec.js --reporter=list --timeout=20000`
2. Validar suite completa de suppliers:
   `pnpm --filter web exec playwright test e2e/suppliers/ --reporter=list --timeout=20000`

---

## 🛑 CRITERIO DE DETENCIÓN
- Suite de `suppliers` pasa al 100% bajo el timeout estándar de 20 segundos.
- T01 a T12, T25 a T32, T30 y T33 quedan en verde sin dependencias de `waitForTimeout()` ciegos.
- DETENERSE inmediatamente sin ejecutar commits ni tocar otros módulos.

---

## 📋 INFORME FINAL (BREVE Y CONCISO)
Reportar únicamente:
1. **Causa Raíz:** Motivo exacto del costo en `fill()` / `pressSequentially()` y fallo de sincronización post-submit.
2. **Archivos Modificados:** Lista de archivos y cambios aplicados.
3. **Métricas:** Tiempo total de ejecución de T05 y resultado consolidado (Passed / Failed) con timeout de 20s.
4. **Comando de Verificación Humana:** Comando Playwright exacto para re-ejecución.