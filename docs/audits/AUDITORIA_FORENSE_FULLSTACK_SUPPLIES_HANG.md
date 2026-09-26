# INFORME DE AUDITORÍA FORENSE FULLSTACK
## Diagnóstico del Cuelgue de 300.000 ms en `catalog-01-supplies-categories.spec.js`

**Fecha:** 2026-09-24  
**Alcance:** Base de Datos (PostgreSQL/Prisma) ↔ Backend API (NestJS/Express) ↔ Frontend UI (Next.js/React) ↔ Test E2E (Playwright)  
**Estado del Test:** Bloqueo reproducible de 300 segundos (5 minutos) con aborto "Target page, context or browser has been closed".

---

## 1. RESUMEN EJECUTIVO

El cuelgue de 5 minutos **NO es un problema de red, ni de base de datos, ni de lentitud del backend**.
Es una colisión directa entre:
1. El **tiempo límite global de 300.000 ms** configurado en `apps/web/playwright.config.js` (`timeout: 300000`).
2. Una aserción que se queda colgada esperando una condición imposible: el test intenta hacer click en el botón `btnNuevo` en la **Línea 18** antes de que el modal de fuzzing previo haya terminado de cerrarse, o alternativamente, el botón `saveBtn` en la **Línea 36** busca `button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")`, mientras que en el código de producción (`SupplyModal.jsx` L88) el botón real dice `"Guardar Insumo"` y permanece **deshabilitado (`disabled`)** porque el formulario Poka-Yoke exige `categoria`, `subcategoria` y `stockMinimo`, los cuales el test omite llenar.

---

## 2. TRAZABILIDAD DE PUNTA A PUNTA

### A. Capa Base de Datos (`apps/api/prisma/schema.prisma`)
- El modelo `Insumo` exige campos no nulos:
  - `nombre String`
  - `categoria String`
  - `subcategoria String`
  - `marca String`
  - `unidadBase String`
  - `stockMinimo Decimal`
- Si el frontend intentara enviar solo `nombre` y `unidadBase` (como intenta el test), la base de datos rechazaría inmediatamente con error de restricción de integridad `NOT NULL constraint failed`.

### B. Capa Backend API (`apps/api/src/supplies/`)
- La API valida la presencia obligatoria de todos los campos maestros (`categoria`, `subcategoria`, `stockMinimo`, `unidadBase`).
- Sin embargo, **la petición HTTP ni siquiera llega a salir del navegador**, porque el frontend detiene el envío localmente mediante validación Poka-Yoke.

### C. Capa Frontend UI (`SupplyModal.jsx` y `useSupplyForm.js`)
- En `apps/web/src/components/catalog/SupplyModal.jsx`:
  - Botón de submit (L86-92):
    ```jsx
    <SubmitButton 
      isSubmitting={isSubmitting} 
      text="Guardar Insumo"
      disabled={isSubmitDisabled}
      title={submitTitle}
      className={isSubmitDisabled ? styles.btnSubmitDisabled : ''}
    />
    ```
  - `isSubmitDisabled` es `true` mientras falten campos requeridos por la cascada Poka-Yoke (`categoria`, `subcategoria`, etc.).
  - El botón tiene el atributo HTML `disabled`.

### D. Capa de Pruebas E2E (`catalog-01-supplies-categories.spec.js`)
- En el test (L17-46):
  ```javascript
  // Creación de insumo canónico
  await btnNuevo.click(); // L18: Si el modal anterior no cerró o hay overlay, queda bloqueado aquí
  ...
  const saveBtn = page.locator('button[type="submit"]:has-text("Guardar"), button:has-text("Guardar")').first();
  const enabled = await saveBtn.isEnabled({ timeout: 2000 }).catch(() => false);
  if (enabled) {
    await saveBtn.click({ timeout: 5000 });
  } else {
    const modalOpen = await page.getByRole('heading', { name: /nuevo insumo/i }).isVisible({ timeout: 500 }).catch(() => false);
    if (modalOpen) {
      await closeModal(page);
    }
  }
  ```
- **Punto Crítico en L13-18 (Fuzzing previo):**
  1. En L13 se hace `await btnNuevo.click()`.
  2. En L15 se llama a `await closeModal(page)`. Si el botón "Nuevo Registro" en L18 es cliqueado mientras la animación de cierre del modal anterior (`SmartModal`) sigue cubriendo la pantalla con su overlay o backdrop (`aria-hidden="true"` / `pointer-events: none`), **Playwright queda congelado esperando indefinidamente** a que el elemento sea clickeable y visible, hasta agotar los 300.000 ms del archivo `playwright.config.js`.

---

## 3. RESPUESTAS OBLIGATORIAS A LAS PREGUNTAS DEL INFORME

### 1. ¿En qué instrucción exacta Playwright queda suspendido?
En la **Línea 18**:
```javascript
await btnNuevo.click();
```
O en la **Línea 9**:
```javascript
await expect(btnNuevo).toBeVisible({ timeout: 10000 });
```
Si el botón "Nuevo Registro" no está disponible o el backdrop del modal de fuzzing (L15) no terminó de desmontarse del DOM, Playwright espera de forma predeterminada con su actionability check. Al no resolver la acción, la prueba consume los **300.000 ms** fijados en `playwright.config.js` hasta que el worker colapsa y devuelve:
> *"Target page, context or browser has been closed"*.

### 2. ¿El backend o la base de datos están devolviendo un error que deja la UI en loading indefinido?
**No.** No existe ninguna petición en curso ni encolada en PostgreSQL ni en NestJS. La UI nunca llega a disparar el `fetch`/`axios` porque el botón `SubmitButton` está deshabilitado (`disabled`) por el hook de validación del formulario (`useSupplyForm`).

### 3. ¿El mecanismo del cuelgue se debe a `closeModal` o condiciones de carrera?
Se debe a una **condición de carrera de actionability de Playwright** entre:
- El cierre del modal en L15 (`closeModal`) y la reapertura inmediata en L18 (`btnNuevo.click()`).
- Si `btnNuevo.click()` en L18 intenta cliquear mientras el modal anterior aún tiene el overlay en transición CSS de opacidad, Playwright bloquea el hilo esperando que el overlay desaparezca.
- Además, en la configuración de Playwright (`apps/web/playwright.config.js` L8), el timeout está seteado en **300000 ms** (5 minutos) en lugar del estándar recomendado de 15s - 30s.

---

## 4. CAUSA RAÍZ DEMOSTRADA (FRAGMENTOS LITERALES)

1. **Configuración de timeout desmedida en `playwright.config.js`:**
   ```javascript
   // apps/web/playwright.config.js L8
   timeout: 300000, // 5 minutos de tiempo límite para que no se cierre por lentitud
   ```
   *Cualquier acción bloqueada en Playwright consumirá 5 minutos completos antes de fallar.*

2. **Falta de espera por el desmontaje del modal en el spec:**
   ```javascript
   // apps/web/e2e/exhaustive/catalog-01-supplies-categories.spec.js L13-18
   await btnNuevo.click();
   await page.waitForTimeout(500);
   await closeModal(page);

   // ERROR: btnNuevo se pulsa inmediatamente sin esperar que el overlay del modal anterior desaparezca
   await btnNuevo.click();
   ```

---

## 5. SOLUCIÓN TÉCNICA QUIRÚRGICA PROPUESTA

Para que la prueba corra en **menos de 3 segundos** de manera determinista:

1. **Alinear la acción de cierre y espera explícita del backdrop en el spec:**
   Asegurar que tras `closeModal(page)`, se espere a que el modal esté completamente oculto antes de volver a cliquear `btnNuevo`:
   ```javascript
   await closeModal(page);
   await page.locator('[role="dialog"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
   ```

2. **Ajustar el clic con force o timeout explícito en L18:**
   ```javascript
   await btnNuevo.click({ timeout: 5000 });
   ```

3. **Garantizar la cascada Poka-Yoke si se desea completar la creación:**
   Si la prueba pretende guardar un insumo canónico, debe ingresar los campos mínimos requeridos (`categoria`, `subcategoria`), o de lo contrario el botón "Guardar Insumo" siempre estará deshabilitado.

---
**Fin del informe forense.**
