TAREA:
Configurar Path Alias Oficial '@/*' y Corregir la Importación Rota de unitNormalizer en Recetas

OBJETIVO:
Solucionar el error crítico "Module not found: Can't resolve '../../../../../utils/unitNormalizer'" en Next.js garantizando que el alias `@/*` esté configurado en `jsconfig.json`/`tsconfig.json` de `apps/web`, y reemplazando las rutas relativas frágiles por `@/utils/unitNormalizer`.

ARCHIVOS A INSPECCIONAR / MODIFICAR (NO EJECUTAR BÚSQUEDAS RECURSIVAS):
1. `apps/web/jsconfig.json` (o `apps/web/tsconfig.json` si existe)
2. `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`
3. `apps/web/src/utils/unitNormalizer.js` (confirmar existencia física)

INSTRUCCIONES TÉCNICAS:

1. Configuración de Path Alias en `apps/web/jsconfig.json` (o `tsconfig.json`):
   - Verificar o agregar dentro de `compilerOptions`:
     ```json
     {
       "compilerOptions": {
         "baseUrl": ".",
         "paths": {
           "@/*": ["./src/*"]
         }
       }
     }
     ```

2. Confirmar Ubicación Física de `unitNormalizer.js`:
   - Verificar si el archivo reside en `apps/web/src/utils/unitNormalizer.js`.
   - Si fue creado por error en otra ubicación (como la raíz de `web/utils`), moverlo o asegurarlo en `apps/web/src/utils/unitNormalizer.js`.

3. Actualizar la Importación en `recipeHelpers.js`:
   - En `apps/web/src/app/catalog/recipes/components/recipeHelpers.js`, cambiar la línea rota:
     ```javascript
     // Eliminar la importación relativa frágil:
     // import { getUnitConversionFactor } from '../../../../../utils/unitNormalizer';

     // Usar el alias oficial:
     import { getUnitConversionFactor } from '@/utils/unitNormalizer';
     ```
   - Si algún otro archivo en `apps/web/src/app/catalog/recipes/` importa `unitNormalizer`, migrar su importación a `@/utils/unitNormalizer`.

REGLAS ESTRICTAS:
- NO usar búsquedas recursivas (`Get-ChildItem -Recurse`, `dir /s`).
- NO ejecutar compilación `pnpm --filter web build` desde la herramienta (se compilará manualmente).
- Validar SRP con `node .agents/scripts/verify-srp.js`.

DETENCIÓN:
Al actualizar el alias y corregir la importación con verificación SRP limpia, DETENTE inmediatamente.