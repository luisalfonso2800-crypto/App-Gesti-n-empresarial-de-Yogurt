TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir el error de referencia en tiempo de ejecución "ReferenceError: contNeto is not defined" en la tabla de productos de venta:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx` (y/o `SaleCavaCatalogDrawer.jsx` si contiene la referencia) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Subsanar la variable no declarada `contNeto`:
   - Buscar cualquier uso de `contNeto` en el archivo.
   - Declarar y extraer correctamente el valor desde el ítem iterado:
     ```javascript
     const contNeto = item.contenidoNeto || item.volumenPresentacion || item.presentacion?.volumen || item.volumen || '';
     ```
   - Si la presentación ya incluye el volumen (ej. "16 oz / 500 ml"), construir el texto sin romper variables no definidas:
     ```javascript
     const nombrePres = item.presentacionNombre || item.nombrePresentacion || item.presentacion?.nombre || '';
     const detalleVolumen = contNeto ? (contNeto.includes('/') ? contNeto.split('/')[1].trim() : contNeto) : '';
     const textoPresentacion = detalleVolumen ? `${nombrePres} • ${detalleVolumen}` : (nombrePres || 'Unidad Comercial');
     ```
   - Renderizar de forma segura:
     `<span className="text-xs text-slate-500 block font-normal">{textoPresentacion}</span>`

2. Validar que no existan variables huérfanas en el JSX o en el Drawer de catálogo.
3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`
2. `pnpm --filter web build`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La pantalla de venta carga de inmediato sin lanzar "ReferenceError: contNeto is not defined".
- Se muestra el nombre del contenedor junto con el volumen real (500 ml).
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.