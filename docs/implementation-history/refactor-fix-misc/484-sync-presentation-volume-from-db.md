TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Hacer que el backend entregue el volumen real registrado en la base de datos de la Presentación (ej. '16 oz / 500 ml') y que la tabla de despacho lo muestre fielmente sin aproximaciones en frontend:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA de los archivos a intervenir.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js` (o `inventory.repository.js` / endpoint de Cava)
2. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Backend:
   - Al consultar los productos comerciales y su inventario en Cava:
     * Asegurar que la relación con `presentacion` traiga sus campos técnicos (`nombre`, `volumen`, `capacidad`, `volumenOzMl`, etc.).
     * Mapear en la respuesta de cada producto:
       `volumenPresentacion: producto.presentacion?.volumen || producto.presentacion?.volumenOzMl || producto.presentacion?.capacidad || ''`
       `nombrePresentacion: producto.presentacion?.nombre || ''`

2. Frontend (`SaleProductsTable.jsx`):
   - Eliminar fallbacks hardcodeados de mililitros.
   - Construir la etiqueta descriptiva usando los datos que vienen directamente de la BD:
     ```javascript
     const nombrePres = item.presentacionNombre || item.nombrePresentacion || item.presentacion?.nombre || '';
     const volPres = item.volumenPresentacion || item.presentacion?.volumen || item.presentacion?.volumenOzMl || '';
     
     // Si volPres ya dice '16 oz / 500 ml', extraer los '500 ml' o mostrar ambos claramente:
     const textoDetalle = volPres 
       ? `${nombrePres} • ${volPres.includes('/') ? volPres.split('/')[1].trim() : volPres}`
       : nombrePres;
     ```
   - Renderizar debajo del título del producto:
     `<span className="text-xs text-slate-500 block font-normal">{textoDetalle}</span>`
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/...`
2. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`
3. `pnpm --filter web build`
4. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla de despacho toma la capacidad directamente de la base de datos de Presentaciones y refleja "500 ml" (o "16 oz / 500 ml") en lugar de 473 ml.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.