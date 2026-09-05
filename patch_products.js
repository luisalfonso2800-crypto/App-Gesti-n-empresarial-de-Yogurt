const fs = require('fs');
const filepath = "apps/web/src/app/catalog/products/page.jsx";
let content = fs.readFileSync(filepath, 'utf8');

const importStmt = "import { ContextBanner } from '../../../components/ui/ContextBanner';\n";
content = content.replace("'use client';", "'use client';\n" + importStmt);

const bannerJsx = `\n      <ContextBanner title="Concepto Técnico" description='Artículo comercial vendible (SKU) con adición de la columna visual de "Presentación Asociada".' />\n`;

content = content.replace("</div>\n        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>\n      </div>", "</div>\n        <Button onClick={() => handleOpenModal()}>Nuevo Registro</Button>\n      </div>" + bannerJsx);

content = content.replace(
    "<TH>Nombre</TH>\n              <TH>Categoría</TH>",
    "<TH>Nombre</TH>\n              <TH>Presentación Asociada</TH>\n              <TH>Categoría</TH>"
);

content = content.replace(
    "<TD>{item.nombre}</TD>\n                <TD>{item.categoria}</TD>",
    "<TD>{item.nombre}</TD>\n                <TD>{item.presentacion?.nombre || item.idPresentacion || '-'}</TD>\n                <TD>{item.categoria}</TD>"
);

fs.writeFileSync(filepath, content, 'utf8');
console.log('Done');
