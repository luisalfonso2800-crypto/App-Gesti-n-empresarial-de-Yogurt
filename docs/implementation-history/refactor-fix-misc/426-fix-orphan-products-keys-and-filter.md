TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 1 TOOL CALL):
Corregir el banner de "productos sin receta formulada" en `apps/web/src/app/catalog/recipes/` para eliminar la colisión de claves (`d1bcf4ee-37bd-4e90-b2b6-d6a75222fd32`) y evitar que los inóculos/bases intermedias sintéticas se listen como productos huérfanos:

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez el archivo del componente de recetas que renderiza las tarjetas huérfanas (ej. `RecipesList.jsx`, `RecipeOrphanAlert.jsx` o `page.jsx`) y edita directamente.
- Modificar EXCLUSIVAMENTE el archivo correspondiente.

INSTRUCCIONES TÉCNICAS:

1. En el componente que renderiza las tarjetas del banner "producto(s) en catálogo sin receta técnica formulada":
   - Filtrar la lista de productos huérfanos para excluir variantes intermedias:
     ```javascript
     const cleanOrphans = (orphanProducts || []).filter(p => 
       !p.idItem && 
       p.tipoItem !== 'INOCULO_WIP' && 
       p.tipoItem !== 'BASE_GRANEL'
     );
     ```
   - Al renderizar cada tarjeta huérfana en el `.map()`, asegurar una key única:
     `key={`orphan-prod-${p.id}`}`
   - Con esto, solo aparecerá 1 tarjeta huérfana (la de "YOGURT BASE CON INICIADOR SEMIELABORADO INOCUO"), eliminando las tarjetas sintéticas de inóculo y la colisión de keys de React.
   - Respetar el límite de líneas SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/web/src/app/catalog/recipes/page.jsx` (o el componente editado)
2. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- El banner muestra únicamente "1 producto(s) en catálogo sin receta técnica formulada".
- Desaparece la advertencia de consola `Encountered two children with the same key`.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.