OBJETIVO: Auditar la viabilidad técnica y diseñar la arquitectura definitiva para soportar Recetas Multinivel y Productos Intermedios / Semielaborados (WIP a granel) en la planta láctea (ej. Base Blanca de Yogurt producida en tanque y consumida por recetas de Yogurt Niños, Yogurt Griego, etc.).

MODO: Estricto de solo lectura. Prohibido ejecutar migraciones, alterar código o crear archivos fuera de docs/.

FUENTES DE VERDAD A INSPECCIONAR:
- `apps/api/prisma/schema.prisma` (modelos Producto, Presentacion, Receta, DetalleReceta, Produccion, Lote, Inventario, InventarioProducto, MovimientoInventario).
- `apps/api/src/production/production.repository.js` y `production.service.js`.
- `apps/web/src/app/catalog/recipes/components/IngredientsFormSection.jsx`.
- `apps/web/src/app/catalog/recipes/hooks/useRecipesData.js`.

INSTRUCCIONES DE AUDITORÍA:

1. EVALUACIÓN DE ESQUEMA EN PRISMA:
   - Analizar las restricciones `NOT NULL` de `Producto.idPresentacion` y `DetalleReceta.idInsumo`.
   - Comparar el impacto relacional entre:
     * Enfoque A: Tratar la base como `Insumo` con origen producido.
     * Enfoque B: Tratar la base como `Producto` intermedio a granel (haciendo `idPresentacion` opcional o creando presentación virtual A GRANEL) y permitir que `DetalleReceta` consuma tanto insumos como productos intermedios.
   - Determinar cómo manejar los inventarios: ¿debe la base residir en `Inventario` (insumos) o en `Inventario_Productos` con flag de granel?

2. COSTEO DINÁMICO Y TRASPASO DE VALOR:
   - Mapear la fórmula de costeo: ¿cómo se calcula el costo por litro/kilo de la Base Blanca al completarse su producción (materia prima + mermas) y cómo se inyecta como costo unitario al consumirse en la receta secundaria?

3. TRAZABILIDAD SANITARIA DE LOTES (INVIMA / BPM):
   - Evaluar cómo registrar la relación de descendencia en la tabla `Lotes`: si el Lote del producto terminado (Yogurt Fresa 150ml) puede almacenar una referencia al Lote Padre (Lote Base Blanca).

4. DETECCIÓN DE RIESGOS POKA-YOKE EN UI:
   - Identificar cómo prevenir en `IngredientsFormSection.jsx` referencias circulares (que un producto base intente consumirse a sí mismo).

VERIFICACIÓN:
Confirmar estado limpio del repositorio con:
`git status --short`

SALIDA REQUERIDA (guardar informe en `docs/diagnosticos/ARQUITECTURA_RECETAS_MULTINIVEL_WIP.md`):
1. Diagnóstico de bloqueos del esquema actual para productos intermedios.
2. Comparación técnica detallada (Enfoque A vs. Enfoque B) con veredicto arquitectónico.
3. Propuesta de modificaciones mínimas en `schema.prisma`.
4. Mecánica de costeo unitario y trazabilidad Lote Padre -> Lote Hijo.
5. Plan de ejecución paso a paso (Backend -> Migración -> Frontend).
```[cite: 1, 2]