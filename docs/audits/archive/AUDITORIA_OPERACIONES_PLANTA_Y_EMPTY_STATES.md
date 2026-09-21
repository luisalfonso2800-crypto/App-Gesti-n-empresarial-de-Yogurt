# Auditoría de Operaciones de Planta y Factibilidad de Empty States

**Fecha de Ejecución:** 13 de Septiembre de 2026  
**Tarea de Referencia:** `apps/prompts/implememtacion/frontend/07-revision-final/219-225-audit-plant-operations-and-empty-states.md`  
**Fuentes Inspeccionadas:**
- Backend: `apps/api/prisma/schema.prisma`, `apps/api/src/inventory/`, `apps/api/src/production/`
- Frontend: `apps/web/src/app/operations/inventory/page.jsx`, `apps/web/src/app/catalog/products/page.jsx`, `apps/web/src/app/catalog/recipes/page.jsx`

---

## Hallazgo 1: Soporte de Saldos Iniciales / Ajustes de Inventario

### 1.1 Backend (`apps/api`)
- **Endpoint Existente:** Existe el endpoint `POST /inventory/adjustments` en `apps/api/src/inventory/inventory.controller.js` (líneas 33-37).
- **Mecánica Transaccional:** En `apps/api/src/inventory/inventory.repository.js` (líneas 43-99), el método `adjustInventory` ejecuta un `$transaction` sobre Prisma que soporta tanto `idInsumo` como `idProducto`. Realiza un `upsert` sobre `Inventario` o `InventarioProducto` y crea el registro correspondiente en `MovimientoInventario`.
- **Comportamiento en Frío:**
  - Si un insumo no tiene registro previo en `Inventario`, el `upsert` lo inicializa con `cantidadActual: stockNuevo`.
  - **Limitación detectada:** El costo unitario promedio queda sin inicializar (`costoPromedio = null`) al crearse por ajuste manual directo, ya que la mutación no contempla el costo unitario de adquisición.

### 1.2 Frontend (`apps/web/src/app/operations/inventory/page.jsx`)
- **Ajustes Fila a Fila:** La vista posee un botón `"Ajustar"` dentro de cada fila de la tabla (líneas 201-203), el cual abre un modal para registrar `AJUSTE_POSITIVO`, `AJUSTE_NEGATIVO` o `MERMA_DESPERDICIO` (líneas 270-276).
- **Cuello de Botella Operativo:**
  - Solo permite ajustar insumos que **ya existan previamente en el inventario** (registros devueltos por `GET /inventory`).
  - **Falta un botón global `"Cargar Saldo Inicial / Ajuste Global"`** en la cabecera de la página para seleccionar cualquier insumo del catálogo general que aún tenga stock 0 o no figure en bodega. Actualmente, el sistema fuerza al usuario a registrar una Compra para que el insumo aparezca por primera vez.

---

## Hallazgo 2: Manejo de Unidades de Medida en Producción y BOM

### 2.1 Almacenamiento en Recetas
- En `apps/api/prisma/schema.prisma` (líneas 232-245), `DetalleReceta` guarda `cantidadRequerida: Decimal` y `unidad: String`.
- En el frontend (`IngredientsFormSection.jsx`, líneas 41-53), el selector presenta el insumo con su unidad base `(${s.nombre} (${s.unidadBase}))`, pero el detalle almacena la unidad como texto plano sin factor de conversión.

### 2.2 Descuento en Producción y Falta de Motor de Conversión
- En `apps/api/src/production/production.repository.js` (líneas 48-54):
  ```javascript
  let reqTeorico = Number(det.cantidadRequerida) * factorEscala;
  const merma = Number(det.mermaPorcentaje) || 0;
  reqTeorico = reqTeorico * (1 + (merma / 100));
  ```
- En el cierre de producción (`production.repository.js`, líneas 185-223), el descuento de inventario se ejecuta de forma lineal 1:1:
  ```javascript
  const stockNuevo = stockAnterior - qtyReal;
  ```
- **Conclusión:** **No existe un motor de conversión dimensional automático en el backend**. El sistema asume estrictamente que la receta siempre está expresada en la `unidadBase` del `Insumo` (ej: si el insumo está en gramos, la receta debe formularse en gramos; si se especificaran kilogramos, se descontaría numéricamente como gramos, distorsionando el inventario por un factor de 1000).

---

## Hallazgo 3: Cálculo de Vida Útil y Vencimiento en Lotes

### 3.1 Modelo Relacional (`schema.prisma`)
- Ni `Producto` (líneas 88-110) ni `Receta` (líneas 200-212) disponen de campos de vida útil (como `diasVidaUtil` o `diasCaducidad`).
- `Produccion` posee un campo opcional `fechaVencimiento DateTime?` (línea 261).
- `Lote` posee `fechaVencimiento DateTime?` (línea 297).

### 3.2 Implementación en Backend y Frontend
- En `apps/api/src/production/production.repository.js` (línea 247), la creación del lote aplica un **valor fijo hardcodeado de 15 días**:
  ```javascript
  fechaVencimiento: produccion.fechaVencimiento || new Date(Date.now() + 15 * 86400000)
  ```
- En el frontend (`apps/web/src/app/operations/production/hooks/useProductionForm.js`, líneas 93-108), el formulario de creación de orden ni solicita ni envía `fechaVencimiento`.
- **Conclusión:** Todos los lotes producidos quedan automáticamente asignados con una fecha de vencimiento fija a **15 días a partir de la fecha de producción**, sin importar la naturaleza o formulación del producto terminado.

---

## Hallazgo 4: Factibilidad de Empty States Poka-Yoke en Páginas de Catálogo

### 4.1 En `apps/web/src/app/catalog/products/page.jsx`
- **Estado Actual:** `ProductsPage` consume `useProductsData()` (que lista productos) y `useProductForm()`. El listado de `presentations` se consulta únicamente al abrir el modal (`loadPresentations()` en `useProductForm.js`, línea 34).
- **Factibilidad:**
  - **Alta y Limpia:** Requiere consultar `presentations` en la carga inicial de datos. Si `presentations.length === 0`, el botón `[Nuevo Registro]` de `ProductsHeader` debe deshabilitarse o mostrar un banner central Poka-Yoke:
    `"Para crear productos terminados debe registrar primero al menos una Presentación. [Crear Presentación]"`

### 4.2 En `apps/web/src/app/catalog/recipes/page.jsx`
- **Estado Actual:** `RecipesPage` **ya dispone en el scope de la página principal** de `products`, `supplies` y `prices` a través de `useRecipesData()` (líneas 19-22 y `useRecipesData.js` líneas 23-33).
- **Factibilidad:**
  - **Inmediata (100% viable sin cambios de arquitectura):** Al tener `products.length` y `supplies.length` ya cargados en memoria, es trivial condicionar `RecipesHeader`: si alguno de los dos arreglos está vacío, se deshabilita la acción `onNewRecipe` y se renderiza un `ContextBanner` central con redirección hacia `/catalog/products` o `/catalog/supplies`.

---

## 5. Recomendación de Implementación Paso a Paso

1. **Paso 1 (Empty States Poka-Yoke Inmediatos en Catálogo):**
   - En `catalog/recipes/page.jsx`: Usar `products.length === 0` o `supplies.length === 0` para activar el banner guiado y deshabilitar el botón antes de abrir el editor.
   - En `catalog/products/page.jsx`: Cargar `presentations` en el montaje inicial para bloquear la creación si no existen envases/formatos.
2. **Paso 2 (Botón de Ajuste Global de Saldo Inicial en Inventario):**
   - En `/operations/inventory/page.jsx`: Incorporar un botón en la cabecera `"Cargar Saldo Inicial / Ajuste Global"` con selector general de insumos para permitir el ingreso de stock en frío.
3. **Paso 3 (Parametrización de Vida Útil):**
   - Agregar el campo `diasVidaUtil Int @default(15)` en `Producto` o permitir editar la fecha de vencimiento al programar la orden de producción, eliminando el hardcodeo de `+ 15 días`.
4. **Paso 4 (Control Estricto de Unidades en BOM):**
   - Bloquear el input de unidad en `IngredientsFormSection` para que herede de forma fija la `unidadBase` del insumo seleccionado, evitando discrepancias dimensionales al descontar inventario.
