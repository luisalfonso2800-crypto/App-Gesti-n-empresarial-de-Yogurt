# TAREA CONTROLADA — FASE 3A: ACTUALIZAR HOOK DE ESTADO DEL MODAL PRODUCTO CON LAS 10 MEJORAS

Modelo: Gemini 3.8 Flash
Effort: low

## OBJETIVO TÉCNICO:
1. Actualizar `useProductFormState.js` para soportar los 4 campos nuevos (codigo, costoEstimado, unidadVenta, stockMinimo).
2. Implementar cálculo reactivo de margen real (M3) y precio sugerido (M4).
3. Flexibilizar Poka-Yoke (M6): solo Nombre + Presentación obligatorios para guardar.
4. Aplicar UPPERCASE en observaciones (M9).
5. Generar `codigoCorto` derivado del nombre + presentación (M1).
6. Sanitizar el payload en `handleSubmit` con los campos nuevos.
7. CERO modificaciones a backend ni schema Prisma.

## FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 3 LECTURAS):
- `apps/web/src/app/catalog/products/components/modal-parts/useProductFormState.js`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `apps/web/src/app/catalog/products/components/modal-parts/ProductPricingAndMarginFields.jsx` (para ver el contrato de props)

## REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 3 LECTURAS, MÁXIMO 2 EDICIONES):
- CERO modificaciones a backend (`apps/api/**`).
- CERO modificaciones a schema Prisma.
- CERO modificaciones a tests E2E.
- Hook ≤ 250 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Prohibido estilos inline.
- Respetar el patrón de hooks ya existente en el proyecto.

## ACCIONES A EJECUTAR:

1. **Extender `INITIAL_STATE` en `useProductFormState.js`:**
   Agregar los 4 campos nuevos al estado inicial:
   ```javascript
   const INITIAL_STATE = {
     // ... campos existentes ...
     codigo: '',
     costoEstimado: '',
     unidadVenta: 'UND',
     stockMinimo: '5'
   };
   ```
