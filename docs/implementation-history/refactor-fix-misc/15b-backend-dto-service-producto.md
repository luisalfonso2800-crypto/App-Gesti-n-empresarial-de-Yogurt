# TAREA CONTROLADA — FASE 2: ACTUALIZAR BACKEND PARA ACEPTAR NUEVOS CAMPOS DEL PRODUCTO

Modelo: Gemini 3.8 Flash
Effort: low

## OBJETIVO TÉCNICO:
1. Actualizar el DTO de creación de productos para aceptar `codigo`, `costoEstimado`, `unidadVenta` y `stockMinimo`.
2. Actualizar el `products.service.js` para:
   - Persistir `codigo`, `costoEstimado`, `unidadVenta` en `Producto`.
   - Hacer `upsert` en `InventarioProducto` con `stockMinimo` dentro de la misma transacción.
   - Manejar el error de código duplicado (`P2002`) devolviendo mensaje legible.
3. Actualizar el `products.repository.js` si es necesario para soportar transacciones.
4. CERO modificaciones al schema Prisma (ya migrado en Fase 1).
5. CERO modificaciones a frontend (`apps/web/**`).

## FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO 4 LECTURAS):
- `apps/api/src/products/products.service.js`
- `apps/api/src/products/products.repository.js`
- `apps/api/src/products/products.controller.js`
- `apps/api/src/products/dto/create-product.dto.js` (o equivalente)

## REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 4 LECTURAS, MÁXIMO 4 EDICIONES):
- CERO modificaciones al schema Prisma.
- CERO modificaciones a frontend (`apps/web/**`).
- CERO modificaciones a tests E2E (`apps/web/e2e/**`).
- Respetar SRP: service ≤ 250 líneas, DTO ≤ 100 líneas, repository ≤ 150 líneas.
- Código 100% JavaScript (.js), prohibido TypeScript.
- Prohibido `window.confirm` / `window.alert`.
- Los tests unitarios existentes del backend (`*.spec.js` en `apps/api/src/`) deben seguir pasando.

## ACCIONES A EJECUTAR:

1. **Actualizar DTO (`create-product.dto.js` o equivalente):**
   - Localizar el archivo DTO de creación de productos.
   - Agregar los 4 campos nuevos al schema de validación:
     ```javascript
     codigo: { 
       type: 'string', 
       maxLength: 50, 
       optional: true, 
       nullable: true,
       pattern: '^[A-Z0-9-]+$'  // Solo mayúsculas, números y guiones
     },
     costoEstimado: { 
       type: 'number', 
       min: 0, 
       optional: true, 
       nullable: true 
     },
     unidadVenta: { 
       type: 'string', 
       enum: ['UND', 'LIBRA', 'KILO', 'LITRO', 'DOCENA'], 
       default: 'UND' 
     },
     stockMinimo: { 
       type: 'number', 
       min: 0, 
       optional: true, 
       default: 0 
     }
     ```
