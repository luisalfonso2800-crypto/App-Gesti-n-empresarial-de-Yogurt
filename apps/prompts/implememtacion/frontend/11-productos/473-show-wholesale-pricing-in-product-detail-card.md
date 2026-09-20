TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Mostrar en la card lateral de detalle de producto los datos de la tarifa mayorista (precio mayorista, porcentaje de descuento y cantidad mínima requerida):

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el componente de la tarjeta lateral de detalle (`apps/web/src/app/catalog/products/components/ProductDetailCard.jsx` o equivalente) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

ARCHIVOS A MODIFICAR:
1. `apps/web/src/app/catalog/products/components/ProductDetailCard.jsx` (o componente de la card lateral)

INSTRUCCIONES TÉCNICAS:

1. Renderizar Bloque Mayorista en la Card:
   - Extraer del producto seleccionado:
     `precioMayorista`, `cantidadMinimaMayorista`, `descuentoMayoristaPorcentaje`, `precioVenta`, `unidadMedida` o `unidad`.
   - Si `producto.precioMayorista > 0`:
     * Calcular porcentaje si no viene explícito:
       `const pct = producto.descuentoMayoristaPorcentaje || Math.round((1 - producto.precioMayorista / producto.precioVenta) * 100);`
     * Resolver unidad (`und` para presentaciones, `L` para granel):
       `const unitText = producto.presentacionId || producto.categoria === 'LACTEOS' ? 'und' : 'L';`
     * Renderizar una caja estilizada (`bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 mt-2`):
       - Título: `<span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider flex items-center gap-1">🏷️ Tarifa Mayorista</span>`
       - Fila principal:
         `<div className="flex items-baseline justify-between mt-1">`
           `<span className="text-base font-bold text-slate-800 font-mono">${Number(producto.precioMayorista).toLocaleString()} <span className="text-xs font-normal text-slate-500">/{unitText}</span></span>`
           `<span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">-{pct}%</span>`
         `</div>`
       - Fila secundaria:
         `<span className="text-[11px] text-slate-600 block mt-0.5">Aplica a partir de <strong>{producto.cantidadMinimaMayorista || 12} {unitText}</strong></span>`
   - Si no tiene precio mayorista pero es canal comercial/mixto:
     * Mostrar un badge sutil gris: `Escala mayorista no configurada`.
   - Respetar el límite de líneas SRP (< 135 líneas) y estilos limpios sin inline styles desordenados.

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/products/components/ProductDetailCard.jsx`
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- La card lateral derecha refleja claramente el precio mayorista, el porcentaje de descuento y la cantidad mínima necesaria para que aplique.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.