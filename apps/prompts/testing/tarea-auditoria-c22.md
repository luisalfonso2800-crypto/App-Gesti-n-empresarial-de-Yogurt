# PROMPT DE TAREA: AUDITORÍA FORENSE — C22 (Contenido 0 en Compras)

## ⚠️ REGLAS
1. Modelo: Gemini Flash (Low).
2. PROHIBIDO subagentes.
3. NO ejecutar Playwright.
4. NO modificar código.
5. LÍMITES: 12 lecturas, 0 ediciones.
6. DETENERSE al terminar.

## Objetivo
Investigar por qué T22 de purchases-calculations.spec.js falla consistentemente con:
  Esperado: Ingreso Neto = "0"
  Recibido: "5 kg"

Llevamos 5+ iteraciones de fixes al helper sin éxito.
Necesitamos encontrar la CAUSA RAÍZ REAL.

## Contexto del test
```javascript
test('C22 - Contenido 0', async ({ page }) => {
  await fillRowItem(page, 0, { empaqueTipo: 'CAJA', contenidoNeto: '0', cantidad: 5, precio: 10000 });
  const row = page.locator('div[class*="formRowCard"]').first();
  await expect(row.locator('strong[class*="netIngresoVal"]')).toContainText(/0/);
});
```

## Verificación manual confirmada
- Usuario escribe CAJA + Contenido 0 manualmente → Ingreso Neto = 0 ✅
- Usuario escribe CAJA + Contenido 5 + Cantidad 1 → Ingreso Neto = 5 ✅

Entonces el sistema SÍ funciona. El test no pone el 0.

## Tareas

### T1 — Leer el helper actual
Leer apps/web/e2e/helpers/purchase-helpers.js.
Reportar el bloque de `contenidoNeto` con el código literal (con números de línea).

### T2 — Leer el componente de empaque
Leer apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowPackaging.jsx.
Buscar y reportar con cita literal + línea:
- El input de contenido (`netContentField`).
- Si tiene atributo `disabled={...}`.
- Bajo qué condición se deshabilita.
- Cómo se actualiza el valor del input (onChange, value, defaultValue).
- Es un input controlado (`value={state}`) o no controlado (`defaultValue`)?
- Qué pasa cuando cambia el Empaque (onChange del select).
- Se hace `setContenidoNeto(...)` al cambiar empaque?

### T3 — Leer el hook useFormPhaseData
Leer apps/web/src/app/operations/purchases/new/hooks/useFormPhaseData.js.
Buscar y reportar con cita literal + línea:
- La función que maneja el cambio de empaque (probablemente `updateDetalle` o `onEmpaqueChange`).
- Cómo se actualiza `detalle.contenidoNeto` al cambiar empaque.
- Si al cambiar empaque a CAJA, el código RESETEA el contenido a 5 o a otro valor.
- Si hay algún `useEffect` que sobreescriba el contenido.
- Buscar especialmente:
  * `setDetalles(prev => prev.map(...))`
  * `contenidoNeto: 5`
  * `contenidoNeto: 1`
  * `contenidoNeto: 0`

### T4 — Leer el componente economics
Leer apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowEconomics.jsx.
Buscar y reportar con cita literal + línea:
- Cómo se calcula el "Ingreso Neto".
- Cómo se lee `detalle.contenidoNeto`.
- Si hay un fallback tipo `contenidoNeto || 1`.
- Si hay `Number(...)` que convierta "0" a 0.

### T5 — Leer el componente del input de contenido
Buscar el archivo que define el input `netContentField`.
Probablemente vive en `FormPhaseRowPackaging.jsx` o en un subcomponente.
Reportar con cita literal + línea:
- La definición del `<input>` completo.
- Sus props (value, onChange, disabled, min, step, type).
- La lógica de onChange.
- La lógica de disabled.

### T6 — Análisis lógico
Con los 5 archivos leídos, formular hipótesis:
- **H1:** El input está disabled por diseño cuando empaque = CAJA.
- **H2:** El input es controlado por React y fill() no dispara el onChange que actualiza el state.
- **H3:** El componente RESETEA el contenido automáticamente cuando cambia el empaque.
- **H4:** El cálculo del Ingreso Neto usa `|| 1` o similar, y cuando el contenido es 0, usa 1 como fallback.
- **H5:** El `fillRowItem` ordena las operaciones mal. Pone contenidoNeto ANTES de empaqueTipo.
- **H6:** El input acepta 0 pero hay un `onBlur` o `onChange` que lo transforma a 5 (o a 1).
- **H7:** El state `contenidoNeto` se guarda como string "0", y en algún punto hay una conversión `parseFloat("0") || ...`.

### T7 — Causa raíz probable
Con las hipótesis evaluadas, indicar la causa raíz más probable con evidencia.

### T8 — Recomendación de fix (sin aplicar)
Proponer el fix más probable sin aplicarlo.

## Entrega
apps/prompts/testing/AUDITORIA-C22.md
