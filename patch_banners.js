const fs = require('fs');
const path = require('path');

const banners = {
    "apps/web/src/app/catalog/presentations/page.jsx": "Concepto de Formato / Molde físico sin precio ni sabor.",
    "apps/web/src/app/catalog/supplies/page.jsx": "Concepto de Materia Prima y Empaque con unidades base estandarizadas.",
    "apps/web/src/app/catalog/suppliers/page.jsx": "Terceros comerciales y canales de aprovisionamiento.",
    "apps/web/src/app/catalog/supplier-prices/page.jsx": "Matriz de cotización comparativa y costo unitario base.",
    "apps/web/src/app/catalog/products/page.jsx": "Artículo comercial vendible (SKU) con adición de la columna visual de \"Presentación Asociada\".",
    "apps/web/src/app/catalog/recipes/page.jsx": "Fórmulas técnicas con ruta de etapas (BOM) y parámetros térmicos/temporales.",
    "apps/web/src/app/operations/purchases/page.jsx": "Registro y conciliación de insumos ingresados a planta.",
    "apps/web/src/app/operations/inventory/page.jsx": "Existencias físicas disponibles y valorización de bodega.",
    "apps/web/src/app/operations/production/page.jsx": "Órdenes de transformación, control de insumos y registro de mermas.",
    "apps/web/src/app/operations/lots/page.jsx": "Trazabilidad sanitaria y vencimientos por lote elaborado."
};

for (const [filepath, description] of Object.entries(banners)) {
    if (!fs.existsSync(filepath)) {
        console.log(`File not found: ${filepath}`);
        continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');

    if (!content.includes("ContextBanner")) {
        const importStmt = "import { ContextBanner } from '../../../components/ui/ContextBanner';\n";
        
        // Find last import
        let match;
        const regex = /^import .*?;$/gm;
        let lastMatch = null;
        while ((match = regex.exec(content)) !== null) {
            lastMatch = match;
        }
        
        if (lastMatch) {
            const pos = lastMatch.index + lastMatch[0].length;
            content = content.substring(0, pos) + '\n' + importStmt + content.substring(pos);
        } else {
            content = content.replace("'use client';", "'use client';\n" + importStmt);
        }
    }

    const startIdx = content.indexOf("<div className={styles.header}>");
    if (startIdx !== -1) {
        let count = 0;
        let endIdx = -1;
        for (let i = startIdx; i < content.length; i++) {
            if (content.substring(i, i + 4) === "<div") {
                count++;
            } else if (content.substring(i, i + 6) === "</div>") {
                count--;
                if (count === 0) {
                    endIdx = i + 6;
                    break;
                }
            }
        }
        
        if (endIdx !== -1) {
            const bannerJsx = `\n      <ContextBanner title="Concepto Técnico" description="${description}" />\n`;
            if (!content.includes("Concepto Técnico")) {
                content = content.substring(0, endIdx) + bannerJsx + content.substring(endIdx);
            }
        }
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Patched ${filepath}`);
}
