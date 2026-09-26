TAREA:
Incorporar formalmente la categoría 'TOPPING_CEREAL' en el catálogo de Productos (`productConstants.js` y componentes dependientes), garantizando su clasificación como semielaborado (WIP).

OBJETIVO:
1. En `apps/web/src/app/catalog/products/components/productConstants.js`:
   - En el arreglo `CATEGORIAS_WIP`, registrar el objeto:
     `{ id: 'TOPPING_CEREAL', label: 'Topping / Cereal Porcionado (WIP)' }`
   - En `HINTS_CATEGORIA_WIP`, añadir la tarjeta didáctica de ayuda técnica:
     ```javascript
     TOPPING_CEREAL: {
       icon: '🥣',
       text: 'Copitas, domos o recipientes dosificados de cereal, granola o aditamentos porcionados para ensamble comercial en planta.'
     }
     ```
2. En `apps/web/src/app/catalog/products/components/ProductModal.jsx` (y helpers de validación si aplica):
   - Asegurar que `'TOPPING_CEREAL'` sea reconocida como categoría WIP válida (precios sugeridos, consumo interno, sin forzar canal de venta comercial directo).
3. Restricciones Técnicas:
   - Respetar estrictamente el umbral de Circuit Breaker (< 135 líneas por archivo).
   - Utilizar CSS Modules puro (cero inline styles `style={{}}`).
   - Ejecutar `node .agents/scripts/verify-srp.js` asegurando código de salida 0.

FUENTES DE VERDAD:
- `apps/web/src/app/catalog/products/components/productConstants.js`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx`
- `.agents/rules/01-core-rules.md`
- `.agents/rules/06-circuit-breaker-and-anti-loop.md`
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA OBLIGATORIA:
Modificar únicamente archivos en `apps/web/src/app/catalog/products/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

MODIFICAR:
- `apps/web/src/app/catalog/products/components/productConstants.js`
- `apps/web/src/app/catalog/products/components/ProductModal.jsx` (o subcomponentes relacionados)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/productConstants.js`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Categoría `TOPPING_CEREAL` disponible en el selector de Nuevo Producto como WIP.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE.

SALIDA:
- Archivos modificados:
- Categoría y hint registrados:
- Resultado de verify-srp.js:
- Estado: