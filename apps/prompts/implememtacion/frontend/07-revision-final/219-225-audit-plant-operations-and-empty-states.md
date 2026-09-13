TAREA:
Auditar soporte de inventario inicial, conversión de unidades, vida útil de lotes y viabilidad de Empty States en páginas

OBJETIVO:
Inspeccionar exclusivamente el backend y frontend para responder con evidencia de código a los 4 puntos ciegos operativos:
1. Inventario en Frío: ¿Existe en `apps/api/` o en `apps/web/src/app/operations/inventory/` un endpoint/formulario para ajuste manual de inventario o carga de saldos iniciales sin pasar por Compras?
2. Conversión de Unidades: ¿Cómo calcula `apps/api/src/production/` (o servicio de lotes/producción) el descuento de insumos en `DetalleProduccion`? ¿Exige el dato en la unidad técnica base del insumo o convierte automáticamente empaque/presentación?
3. Vida Útil: ¿Tiene el modelo `Producto` o `Receta` en `schema.prisma` algún campo `diasVidaUtil` o similar para autocalcular `fechaVencimiento = fechaProduccion + diasVidaUtil` en `Lotes`, o el frontend lo pide manual en un datepicker?
4. Viabilidad de Empty States: En `catalog/products/page.jsx` y `catalog/recipes/page.jsx`, verificar si ya reciben la lista de dependencias para poder condicionar directamente el botón `[+ Nuevo]` y renderizar el banner central sin necesidad de abrir modales.

FUENTE DE VERDAD:
- `apps/api/prisma/schema.prisma`
- `apps/api/src/inventory/` y `apps/api/src/production/`
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/operations/inventory/page.jsx`
- `AGENTS.md` (Reglas 10, 15, 18, 37)

REGLA DE CONSULTA:
Solo lectura. Prohibido escribir archivos, ejecutar builds o crear scripts temporales.

ALCANCE:

LEER:
- `apps/api/prisma/schema.prisma` (modelos Producto, Receta, Lote, MovimientoInventario, Inventario)
- `apps/api/src/inventory/` (rutas y servicios de ajuste)
- `apps/api/src/production/` (lógica de descuento de BOM y creación de lotes)
- `apps/web/src/app/catalog/products/page.jsx`
- `apps/web/src/app/catalog/recipes/page.jsx`
- `apps/web/src/app/operations/inventory/page.jsx`

CREAR:
- ningún archivo.

MODIFICAR:
- ningún archivo.

NO MODIFICAR:
- ningún archivo en el repositorio.

INSTRUCCIONES:

1. AUDITORÍA DE INVENTARIO INICIAL / AJUSTES:
   - Revisa `schema.prisma` en el enum o campo `tipoMovimiento` de `MovimientoInventario`.
   - Revisa si `apps/api/src/inventory/` expone endpoints como `POST /inventory/adjust` o `POST /inventory/initial`.
   - Verifica si la vista `/operations/inventory` tiene UI para realizar ajustes positivos de stock.

2. AUDITORÍA DE CONVERSIÓN DE UNIDADES EN PRODUCCIÓN:
   - Revisa cómo se almacena la cantidad en `DetalleReceta` y cómo se descuenta en `Inventario`.
   - Determina si el sistema asume que la receta siempre está expresada en la `unidadBase` del `Insumo` (ej. gramos o mililitros).

3. AUDITORÍA DE FECHA DE VENCIMIENTO EN LOTES:
   - Revisa en `schema.prisma` si `Producto`, `Receta` o `Lote` manejan vida útil en días.
   - En `/operations/production` o `/operations/lots`, examina cómo se define `fechaVencimiento`.

4. EVALUACIÓN DE EMPTY STATES EN PÁGINAS DE CATÁLOGO:
   - Examina `catalog/products/page.jsx`: ¿recibe ya `presentations` desde el hook o API?
   - Examina `catalog/recipes/page.jsx`: ¿recibe ya `products` e `supplies`?
   - Valida si es factible desactivar el botón `[+ Nuevo]` y renderizar el banner central guiado en el DOM principal de cada pantalla.

NO HACER:
- Prohibido modificar código.
- No ejecutar `git checkout`.
- No ejecutar scripts sueltos en la raíz.

CRITERIO DE FINALIZACIÓN:
La tarea termina cuando se responde con precisión técnica a los 4 puntos ciegos citando archivos y líneas de código exactas.

VERIFICACIÓN:
Verifica que el working tree permanezca limpio:
git status --short

DETENCIÓN:
Al emitir el informe comparativo, DETENTE.

SALIDA:
Entrega la respuesta estructurada estrictamente en:
1. Hallazgo 1: Soporte de Saldos Iniciales / Ajustes de Inventario (Código existente y faltantes).
2. Hallazgo 2: Manejo de Unidades de Medida en Producción y BOM (Mecánica de cálculo).
3. Hallazgo 3: Cálculo de Vida Útil y Vencimiento en Lotes (¿Manual o Automático?).
4. Hallazgo 4: Factibilidad de Empty States Poka-Yoke en Páginas de Catálogo.
5. Recomendación de Implementación Paso a Paso.