# TAREA CONTROLADA — FASE 3B: ACTUALIZAR COMPONENTES VISUALES DEL MODAL PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

## OBJETIVO TÉCNICO:
1. Actualizar los componentes de campos del modal para exponer visualmente los 4 campos nuevos (codigo, costoEstimado, unidadVenta, stockMinimo).
2. Implementar la validación de imagen (M7): 2MB, PNG/JPG/WebP, preview, botón quitar.
3. Implementar plantilla de descripción (M10) como placeholder.
4. Exponer visualmente el margen real y precio sugerido (M3, M4) que ya se calculan en el hook.
5. CERO modificaciones al hook `useProductForm.js` ni `useProductFormState.js`.
6. CERO modificaciones a backend ni schema Prisma.

## FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- `apps/web/src/app/catalog/products/components/modal-parts/ProductBasicFields.jsx`
- `apps/web/src/app/catalog/products/components/modal-parts/ProductPricingAndMarginFields.jsx`
- `apps/web/src/app/catalog/products/components/modal-parts/ProductImageAndDescriptionFields.jsx`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`

## REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 4 LECTURAS, MÁXIMO 5 EDICIONES):
- CERO modificaciones al hook.
- CERO modificaciones a backend.
- CERO modificaciones a tests E2E.
- Cada componente ≤ 150 líneas.
- Código 100% JavaScript (.jsx), prohibido TypeScript.
- Prohibido estilos inline. Usar CSS Modules.
- Respetar paleta MANNÁ (`#166534` verde, `#92400e` warning, `#991b1b` error).
- Prohibido `window.confirm` / `window.alert`.

## ACCIONES A EJECUTAR:

1. **`ProductBasicFields.jsx` — Agregar 3 campos nuevos:**
   Después de los campos existentes (Nombre, Categoría, Canal), agregar bloque con Código Interno, Unidad de Venta y Stock Mínimo.

2. **`ProductPricingAndMarginFields.jsx` — Agregar Costo Estimado + Margen Real + Precio Sugerido:**
   Recibir como props desde `ProductModal.jsx`: `margenRealCalculado`, `precioSugeridoCalculado`.

3. **`ProductImageAndDescriptionFields.jsx` — Validación de imagen + plantilla:**
   Validar tamaño (2MB), formato (PNG/JPG/WebP), preview con botón "Quitar Imagen", y placeholder de plantilla estructurada.

4. **`ProductModal.jsx` — Pasar props nuevas a componentes:**
   Extraer del hook y propagar `codigoCortoGenerado`, `margenRealCalculado`, `precioSugeridoCalculado`.

5. **CSS Modules — Clases para feedback, precio sugerido y preview de imagen.**
