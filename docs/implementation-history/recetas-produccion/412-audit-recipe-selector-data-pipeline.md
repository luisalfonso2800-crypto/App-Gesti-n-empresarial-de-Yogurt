TAREA (AUDITORÍA EXCLUSIVA - SIN EDITAR CÓDIGO - PRESUPUESTO ESTRICTO: MÁXIMO 3 TOOL CALLS):
Rastrear de punta a punta el flujo de datos que alimenta el <select> de ingredientes en el editor de recetas:
1. Inspeccionar qué endpoint llama exactamente el modal de recetas al abrirse:
   - Revisar `apps/web/src/app/catalog/recipes/page.jsx`, `useRecipesPageManager.js` y `RecipeModal.jsx`.
   - Verificar de dónde sale la lista `products` que finalmente llega a `RecipeStageBomTable.jsx`. ¿Viene de `useRecipesData` o de otro hook?
2. Probar la respuesta HTTP real del backend:
   - Ejecutar una consulta directa (curl o script node) a `GET /products/intermediates` y a `GET /inventory/wip` para comparar los payloads devueltos.
3. Determinar por qué `YOGURT PURO` sí se pinta en pantalla y `YOGURT BASE` no.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA Y PRUEBA EXCLUSIVA. PROHIBIDO EDITAR CÓDIGO FUENTE.
- Ejecutar lectura puntual en los archivos clave.

ARCHIVOS A INSPECCIONAR:
1. `apps/web/src/app/catalog/recipes/page.jsx`
2. `apps/web/src/app/catalog/recipes/components/RecipeModal.jsx`
3. `apps/web/src/app/catalog/recipes/hooks/useRecipesPageManager.js`
4. `apps/web/src/app/catalog/recipes/components/parts/RecipeStageBomTable.jsx`

PREGUNTAS DE AUDITORÍA A RESPONDER:
1. ¿Quién pasa la prop `products` o `intermediates` a `RecipeStageBomTable`? ¿Llega el array devuelto por `/products/intermediates` o solo el listado base de `/products`?
2. Al ejecutar un script contra la base de datos con la consulta de `findIntermediates()`, ¿qué registros exactos retorna?
3. ¿Por qué el modal muestra `YOGURT PURO`[cite: 22] pero omite `YOGURT BASE`[cite: 23]?

DETENCIÓN:
Entrega el dictamen técnico con la causa raíz exacta y DETENTE inmediatamente.