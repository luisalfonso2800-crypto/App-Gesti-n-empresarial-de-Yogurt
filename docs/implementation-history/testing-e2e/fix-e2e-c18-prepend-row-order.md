# FIX E2E — COMPRAS: CORRECCIÓN DE C18 Y PATRÓN PREPEND EN FILAS DE COMPRA

## ⚠️ REGLAS ESTRICTAS ANTI-QUEMA DE CUOTA (OBLIGATORIAS)
1. Modelo activo: Gemini Flash (Low).
2. PROHIBIDO lanzar subagentes.
3. NO ejecutar Playwright (la ejecución corresponde exclusivamente al operador humano).
4. NO modificar código de producción (`apps/web/src`, `apps/api/src`).
5. LÍMITES DUROS: Máximo 2 lecturas directas, exactamente 1 edición, máximo 4 llamadas a herramientas.
6. Editar ÚNICAMENTE `apps/web/e2e/purchases/purchases-calculations.spec.js`.
7. Al completar la edición, DETENERSE inmediatamente sin reportes redundantes.

---

## 📌 DIAGNÓSTICO Y CAUSA RAÍZ CONFIRMADA:
El test C18 falla calculando $40.000 en vez de $90.000 por un desajuste de orden LIFO (prepend) en Playwright:
- En `useFormPhaseData.js:141`, la acción `addRow` inserta la nueva fila al inicio del arreglo: `setDetalles(prev => [newRow, ...prev])`.
- En `purchases-calculations.spec.js:158-159`, el test llena `nth(0)` ($50.000), luego llama a `addRow(page)` y llena `nth(1)` ($30.000).
- Al insertarse al inicio, la nueva fila queda en `nth(0)` vacía ($0), mientras que `nth(1)` apunta a la fila inicial, sobreescribiéndola de $50.000 a $30.000.
- El cálculo resultante es: Fila 1 ($30.000) + Fila 2 ($0) + Flete ($10.000) = $40.000.

---

## 🛠️ TAREA ÚNICA:

Modificar `apps/web/e2e/purchases/purchases-calculations.spec.js`:

### 1. Documentar el Contrato LIFO al Inicio del Archivo:
Añadir comentario técnico tras los imports:
```javascript
// IMPORTANTE (ARQUITECTURA DE UI):
// La UI inserta nuevas filas al INICIO del formulario (prepend / LIFO: [newRow, ...prev]).
// Tras invocar addRow(page), la fila recién creada pasa a ser nth(0) y las filas
// previas se desplazan automáticamente a los índices subsiguientes (nth(1), nth(2)...).