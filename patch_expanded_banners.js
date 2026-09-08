const fs = require('fs');

const newDescriptions = {
    "apps/web/src/app/catalog/presentations/page.jsx": "Aquí se define la estructura y tamaño físico del producto (como el envase y volumen), sin incluir precio o sabor. Es el 'molde' base para envasar el producto terminado.",
    "apps/web/src/app/catalog/supplies/page.jsx": "Aquí se registran los materiales que compras (ingredientes y empaques). Todo se maneja en unidades de medida estándar para facilitar el control en la fábrica.",
    "apps/web/src/app/catalog/suppliers/page.jsx": "Directorio de todas las personas y empresas que nos venden los insumos necesarios para operar. Funciona como un directorio centralizado de compras.",
    "apps/web/src/app/catalog/supplier-prices/page.jsx": "Permite comparar cuánto cuesta cada insumo dependiendo del proveedor. Ayuda a encontrar la mejor opción de compra mostrando el costo real por unidad mínima.",
    "apps/web/src/app/catalog/products/page.jsx": "Lista de artículos finales listos para la venta. Cada producto es la combinación de una receta, un sabor y un empaque (presentación). Es lo que el cliente compra.",
    "apps/web/src/app/catalog/recipes/page.jsx": "Instrucciones paso a paso para fabricar los productos. Incluye la lista de ingredientes, cantidades exactas y los tiempos o temperaturas requeridos en el proceso.",
    "apps/web/src/app/operations/purchases/page.jsx": "Aquí se documenta la llegada de nuevos insumos a la planta. Registra qué se recibió, cuánto costó y confirma que la cantidad física coincida con la comprada.",
    "apps/web/src/app/operations/inventory/page.jsx": "Muestra la cantidad real de materiales y productos almacenados en este momento, y calcula cuánto dinero representa ese inventario guardado en bodega.",
    "apps/web/src/app/operations/production/page.jsx": "Aquí se gestiona el trabajo de fábrica. Permite dar la orden de fabricar, descuenta los insumos usados automáticamente y registra los desperdicios o mermas.",
    "apps/web/src/app/operations/lots/page.jsx": "Permite hacer seguimiento de calidad. Asigna un código único a cada producción para controlar fechas de vencimiento y rastrear exactamente cuándo se fabricó."
};

for (const [filepath, newDesc] of Object.entries(newDescriptions)) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');

    content = content.replace(/<ContextBanner\s+title="Concepto Técnico"\s+description=(["']).*?\1\s*\/>/g, `<ContextBanner title="Concepto Técnico" description="${newDesc}" />`);
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
}
