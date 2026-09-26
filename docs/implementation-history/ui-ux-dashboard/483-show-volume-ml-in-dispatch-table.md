TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Mostrar los mililitros (ml) o contenido neto exacto junto al nombre de la presentación en la tabla de productos a despachar:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx` y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`

INSTRUCCIONES TÉCNICAS:

1. Resolver el Contenido Neto / Mililitros:
   - Crear o ajustar una función auxiliar para formatear la presentación y su volumen:
     ```javascript
     const obtenerDetallePresentacion = (item) => {
       const nombrePres = item.presentacionNombre || item.presentacion?.nombre || item.presentacion || '';
       let ml = item.contenidoNeto || item.presentacion?.capacidad || item.volumenMl || '';
       
       // Fallback inteligente si solo viene el nombre de la onza:
       if (!ml && /16\s*oz/i.test(nombrePres)) ml = '473 ml';
       if (!ml && /32\s*oz/i.test(nombrePres)) ml = '946 ml';
       if (!ml && /litro|1000/i.test(nombrePres)) ml = '1.000 ml';

       if (nombrePres && ml) return `${nombrePres} • ${ml}`;
       return nombrePres || ml || 'Unidad Comercial';
     };
     ```

2. Renderizar en la Celda de Producto:
   - Mantener el nombre del producto en negrita (`font-semibold text-slate-800`).
   - Debajo, renderizar la etiqueta enriquecida:
     `<span className="text-xs text-slate-500 block">{obtenerDetallePresentacion(item)}</span>`

3. Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/commercial/sales/components/modal-parts/SaleProductsTable.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La tabla de despacho muestra claramente el contenedor acompañado de su capacidad en mililitros (ej. "CONTENEDOR DE 16 OZ • 473 ml").
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.