TAREA (PRESUPUESTO ULTRA-ESTRICTO: MÁXIMO 2 TOOL CALLS EN TOTAL):
Resolver el costeo automático del inóculo/base WIP en el diseñador de recetas y erradicar la alerta "Base WIP sin receta activa":
1. En `apps/api/src/products/products.repository.js` (o en la resolución de costos de `findIntermediates`):
   - Al emitir las variantes sintéticas de inóculo (`tipoItem: 'INOCULO_WIP'`) y base a granel (`tipoItem: 'BASE_GRANEL'`), calcular e inyectar el `costoUnitario` / `costoEstandar`:
     * Prioridad 1: Obtener el `costoUnitario` de la receta activa más reciente del producto padre (`producto.recetas.find(r => r.activo)?.costoUnitario`).
     * Prioridad 2: Si no hay receta activa calculada, tomar el `costoPromedio` o `costoEstandar` del último lote registrado en `Lote` (`tipoLote: 'SEMIELABORADO_WIP'`).
     * Prioridad 3: Fallback a `producto.costoEstandar`.
   - Para la variante inóculo (`g`), normalizar el costo por gramo: `costoPorGramo = costoPorLitro / 1000`.
2. En `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js` (o función de cálculo de balance de costos `calculateRecipeTotals`):
   - Al seleccionar un item clasificado como 'INOCULO_WIP' o 'Base WIP', extraer su `costoUnitario` / `costoEstandar`.
   - Multiplicar `costoUnitario * cantidadRequerida` para sumar al subtotal de `Bases intermedias (WIP)`.
   - Si el item cuenta con costo válido (> 0), desactivar la bandera `hasWipWithoutActiveRecipe` para que la advertencia amarilla no se muestre.

CLÁUSULA DE CONSUMO MÍNIMO (REGLA 07):
- LECTURA ÚNICA: Lee 1 sola vez cada archivo y edita directamente.
- Modificar EXCLUSIVAMENTE los 2 archivos indicados abajo.

ARCHIVOS A MODIFICAR:
1. `apps/api/src/products/products.repository.js`
2. `apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js` (o `RecipeStageBomTable.jsx` según corresponda al cálculo)

INSTRUCCIONES TÉCNICAS:

1. En `products.repository.js`:
   - Al consultar los productos en `findIntermediates()`, incluir sus recetas activas y/o lotes semielaborados:
     ```javascript
     include: {
       presentacion: true,
       recetas: { where: { activo: true }, take: 1 },
       lotes: { where: { tipoLote: 'SEMIELABORADO_WIP' }, orderBy: { createdAt: 'desc' }, take: 1 }
     }
     ```
   - Calcular:
     ```javascript
     const costoLitro = p.recetas?.[0]?.costoUnitario || p.lotes?.[0]?.costoUnitario || p.costoEstandar || 4390;
     const costoGramo = costoLitro / 1000;
     ```
   - Asignar `costoEstandar: costoGramo, costoUnitario: costoGramo` al item inóculo (`INOCULO_WIP`).
   - Asignar `costoEstandar: costoLitro, costoUnitario: costoLitro` al item base (`BASE_GRANEL`).

2. En frontend (`useRecipeForm.js` / cálculo de balance):
   - Garantizar que el costo del ingrediente inóculo se compute en el balance: `subtotalWip += (cantRequerida * item.costoUnitario)`.
   - Suprimir la alerta si `item.costoUnitario > 0`.
   - Mantener el cumplimiento de SRP (< 135 líneas).

VERIFICACIÓN:
1. `node --check apps/api/src/products/products.repository.js`
2. `node --check apps/web/src/app/catalog/recipes/hooks/useRecipeForm.js`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Al agregar 125 g de "INÓCULO / INICIADOR (YOGURT BASE)", el balance de costos calcula el valor proporcional (aprox. $548).
- La etiqueta "Base WIP sin receta activa" desaparece.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar sintaxis y verificar código 0 en el guardián, DETENTE inmediatamente.