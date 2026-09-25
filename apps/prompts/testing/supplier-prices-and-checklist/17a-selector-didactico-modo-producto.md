# TAREA CONTROLADA — REDISEÑO DEL SELECTOR DE MODO EN EL MODAL PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

OBJETIVO:
1. Reemplazar el toggle pequeño (pastilla) por una **pantalla previa** con 2 tarjetas grandes y descriptivas para usuario no técnico.
2. La pantalla previa aparece al abrir el modal, ANTES del formulario.
3. El usuario elige modo → se cierra la pantalla previa → se abre el formulario correspondiente.
4. Mantener compatibilidad con el toggle existente para no romper tests E2E actuales.
5. CERO modificaciones a backend ni schema Prisma.

FUENTES DE VERDAD (MÁXIMO 3 LECTURAS):
- apps/web/src/app/catalog/products/components/ProductModal.jsx
- apps/web/src/app/catalog/products/components/product-modal.module.css
- apps/web/e2e/products/products-modal-flow.spec.js (para no romper selectores)

REGLAS DE CUOTA ESTRICTA (MÁXIMO 3 LECTURAS, MÁXIMO 3 EDICIONES):
- CERO modificaciones a backend.
- Componente ProductModal.jsx ≤ 150 líneas.
- Prohibido estilos inline. Usar CSS Modules.
- Prohibido `window.confirm` / `window.alert`.
- NO romper los tests E2E actuales (T01-T30 + C01-C05).

ACCIONES A EJECUTAR:

1. **Crear `ProductTypeSelector.jsx` (nuevo componente ≤ 100 líneas):**
   - Pantalla previa con 2 tarjetas grandes.
   - Cada tarjeta tiene: icono grande, título, descripción para usuario no técnico, botón "Elegir".
   - **Tarjeta 1 — Producto Comercial Envasado:**
     - Icono: 🥛
     - Descripción: "Yogur, jalea o postre envasado para vender al público. Tendrá precio de venta, IVA, margen y tarifa mayorista."
   - **Tarjeta 2 — Base Intermedia / Tanque (WIP):**
     - Icono: 🏭
     - Descripción: "Producto a granel para usar dentro de la planta (ej: base láctea, jarabe). No tiene precio al público. Se almacena por litros o kilos."
   - Al elegir una tarjeta → llama a `onSelect('COMERCIAL')` o `onSelect('WIP')`.

2. **Actualizar `ProductModal.jsx`:**
   - Agregar un estado `showTypeSelector` (default `true` al abrir, si no hay `editingItem`).
   - Si `showTypeSelector === true` → renderizar `<ProductTypeSelector onSelect={(tipo) => { setFormData(prev => ({...prev, tipoProducto: tipo})); setShowTypeSelector(false); }} />`.
   - Si `showTypeSelector === false` → renderizar el formulario actual (con el toggle existente como referencia secundaria, opcional).
   - **Mantener el toggle actual como fallback** para que los tests E2E existentes sigan encontrando `button:has-text("Base Intermedia / Tanque (WIP)")`.

3. **CSS `product-modal.module.css`:**
   - Agregar clases `.typeSelectorOverlay`, `.typeSelectorGrid`, `.typeSelectorCard`, `.typeSelectorCardSelected`, `.typeSelectorIcon`, `.typeSelectorTitle`, `.typeSelectorDescription`, `.typeSelectorBtn`.
   - Paleta MANNÁ: verde institucional `#166534` para Comercial, oro `#a16207` para WIP.
   - Efecto hover sutil y selección con borde dorado.

4. **NO tocar el hook `useProductForm`.** Solo el modal y un componente nuevo.

VERIFICACIÓN:
1. `node --check` de los archivos modificados.
2. `node .agents/scripts/verify-srp.js`
3. `pnpm --filter web exec playwright test products/ --reporter=list`

CRITERIO DE TERMINACIÓN:
- ProductTypeSelector.jsx creado ≤ 100 líneas.
- ProductModal.jsx modificado ≤ 150 líneas.
- Los 14 tests existentes siguen verdes.
- `verify:srp` retorna 0.
