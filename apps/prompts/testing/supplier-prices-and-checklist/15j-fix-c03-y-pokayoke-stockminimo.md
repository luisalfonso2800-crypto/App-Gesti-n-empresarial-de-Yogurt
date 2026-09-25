# TAREA CONTROLADA — FIX DE C03 (SELECTOR LAXO) Y POKA-YOKE REACTIVO EN STOCK MÍNIMO (T11-T14)

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO TÉCNICO:
1. Corregir el test C03 en `products-modal-calc.spec.js` (selector laxo que matchea el header "OPERADOR-01").
2. Implementar Poka-Yoke reactivo en el input `stockMinimo` para rechazar valores negativos (consistente con el Poka-Yoke severo del proyecto).
3. CERO modificaciones a backend ni schema Prisma.

FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- apps/web/e2e/products/products-modal-calc.spec.js (bloque C03)
- apps/web/src/app/catalog/products/components/modal-parts/ProductInventoryIdentityFields.jsx (input stockMinimo)
- apps/web/src/app/catalog/products/components/modal-parts/useProductFormState.js (handleChange)

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 3 EDICIONES):
- CERO modificaciones a backend ni schema Prisma.
- Cada spec ≤ 140 líneas.
- Cada componente ≤ 150 líneas.
- Prohibido estilos inline.
- Prohibido `window.confirm` / `window.alert`.

ACCIONES A EJECUTAR:

1. **FIX TEST — `products-modal-calc.spec.js` C03:**
   Reemplazar selector laxo que colisiona con "OPERADOR-01" por selector exacto de `div[class*="marginFeedback"]`.

2. **POKA-YOKE REACTIVO — `useProductFormState.js`:**
   Sanitizar `stockMinimo` en el handler reactivo para que cualquier valor negativo (< 0 o no numérico inválido) se convierta automáticamente a '0'.
