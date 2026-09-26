import os
import re

banners = {
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
}

for filepath, description in banners.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add import if not exists
    if "ContextBanner" not in content:
        import_stmt = "import { ContextBanner } from '../../../components/ui/ContextBanner';\n"
        # Find the last import
        imports_end = [m for m in re.finditer(r'^import .*?;$', content, re.MULTILINE)]
        if imports_end:
            last_import = imports_end[-1]
            pos = last_import.end() + 1
            content = content[:pos] + import_stmt + content[pos:]
        else:
            # just put it after 'use client';
            content = content.replace("'use client';", "'use client';\n" + import_stmt)

    start_idx = content.find("<div className={styles.header}>")
    if start_idx != -1:
        count = 0
        end_idx = -1
        i = start_idx
        while i < len(content):
            if content[i:i+4] == "<div":
                count += 1
            elif content[i:i+6] == "</div>":
                count -= 1
                if count == 0:
                    end_idx = i + 6
                    break
            i += 1
        
        if end_idx != -1:
            banner_jsx = f'\n      <ContextBanner title="Concepto Técnico" description="{description}" />\n'
            if "Concepto Técnico" not in content:
                content = content[:end_idx] + banner_jsx + content[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Patched {filepath}")
