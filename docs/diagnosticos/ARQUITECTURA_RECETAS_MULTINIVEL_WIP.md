# ARQUITECTURA TÉCNICA: RECETAS MULTINIVEL Y PRODUCTOS INTERMEDIOS (WIP A GRANEL)

**Proyecto:** Yogurt ERP / Yogurt Management System  
**Fecha:** 2026-09-13  
**Estado:** AUDITORÍA TÉCNICA Y DISEÑO ARQUITECTÓNICO FINALIZADO  
**Modo:** Solo lectura (Diagnóstico y Especificación de Diseño)  
**Documento de Referencia:** `apps/prompts/implememtacion/frontend/07-revision-final/224-task-audit-multilevel-recipes-and-wip.md`  

---

## 1. DIAGNÓSTICO DE BLOQUEOS DEL ESQUEMA ACTUAL

Tras la inspección minuciosa de `apps/api/prisma/schema.prisma`, `apps/api/src/production/production.repository.js`, `apps/web/src/app/catalog/recipes/` y los flujos de inventario, se identificaron los siguientes cuellos de botella y restricciones duras que actualmente impiden la producción y consumo de productos semielaborados / Work-in-Progress (ej. Base Blanca de Yogurt, Almíbar base, Jarabe):

1. **Restricción Foránea Dura en `DetalleReceta.idInsumo`:**
   * En `DetalleReceta`:
     ```prisma
     idInsumo String @map("ID_Insumo")
     insumo   Insumo @relation(fields: [idInsumo], references: [id])
     ```
   * Es una columna `NOT NULL` con Foreign Key estricta a la tabla `Insumos`.
   * **Bloqueo:** Una receta secundaria (ej. *Yogurt Fresa 150ml*) no puede incluir en su lista de materiales (BOM) otro producto fabricado (como *Base Blanca de Yogurt*) a menos que dicho producto exista forzosamente en la tabla `Insumos` o que el esquema se flexibilice.

2. **Acoplamiento Obligatorio de Presentación en `Producto.idPresentacion`:**
   * En `Producto`:
     ```prisma
     idPresentacion String       @map("ID_Presentacion")
     presentacion   Presentacion @relation(fields: [idPresentacion], references: [id])
     @@unique([nombre, idPresentacion])
     ```
   * **Bloqueo:** Todo producto en el catálogo exige pertenecer a una presentación física comercial (ej. Vaso 150g, Botella 1000ml con su empaque, tapilla, etc.). Un producto intermedio en tanque o marmita (ej. 500 Litros de Base Blanca) no tiene presentación comercial para venta ni empaque individual.

3. **Bifurcación de Inventarios (`Inventario` vs. `InventarioProducto`):**
   * El sistema mantiene dos mundos separados:
     * `Inventario` (mapeado a `Insumos`): Gestiona materias primas compradas a proveedores con `costoPromedio` alimentado por compras (`DetalleCompra`).
     * `Inventario_Productos` (mapeado a `Productos`): Gestiona productos terminados con `costoPromedio` alimentado por cierre de órdenes de producción (`completeProduction`).
   * En `production.repository.js`:
     * `getRecipeBom()` y `startProduction()` consultan exclusivamente `prisma.inventario.findUnique({ where: { idInsumo } })` y `prisma.precioProveedor`.
     * `completeProduction()` descuenta materias primas solo de `prisma.inventario` e ingresa el producto final en `prisma.inventarioProducto`.
   * **Bloqueo:** Si una receta secundaria intenta consumir un producto intermedio, el motor de producción buscaría stock en `Inventario` (insumos), fallando o dando stock 0 si el producto semielaborado fue ingresado a `Inventario_Productos`.

4. **Ausencia de Linaje y Genealogía de Lotes (`LotePadre`):**
   * El modelo `Lote` cuenta con:
     ```prisma
     idProduccion String
     idProducto   String?
     idInsumo     String?
     ```
   * **Bloqueo:** No existe un campo `idLotePadre` ni tabla intermedia `LoteConsumo`. Cuando se completa una producción secundaria, no se registra cuál lote específico de Base Blanca fue vertido, rompiendo la trazabilidad sanitaria exigida por normativas BPM / INVIMA.

---

## 2. COMPARACIÓN TÉCNICA DETALLADA: ENFOQUE A vs. ENFOQUE B

Se evaluaron las dos alternativas arquitectónicas para modelar la producción multinivel:

| Criterio de Evaluación | Enfoque A: Base como `Insumo` Producido (Híbrido) | Enfoque B: Base como `Producto Intermedio / WIP` con enlace dual en `DetalleReceta` |
| :--- | :--- | :--- |
| **Concepto de Dominio** | La Base Blanca se registra en `Insumos` con una bandera de origen (`origen = 'PRODUCIDO' \| 'INTERNO'`). | La Base Blanca es un `Producto` con tipo/categoría `INTERMEDIO_GRANEL` o presentación virtual. |
| **Cambios en `schema.prisma`** | **Mínimos:**<br>1. Agregar `origen String @default("COMPRADO")` en `Insumo`.<br>2. Relación opcional `Receta.idInsumoProducido` o permitir `Produccion.idInsumo`.<br>3. `Lote.idLotePadre` autorreferencial. | **Moderados a Altos:**<br>1. Hacer opcional `DetalleReceta.idInsumo` y agregar `DetalleReceta.idProductoIntermedio`.<br>2. Modificar constraint `CHECK` o validación condicional.<br>3. Modificar `idPresentacion` en `Producto` a opcional o crear presentación virtual obligatoria. |
| **Impacto en el Motor de Producción (`production.repository.js`)** | **Bajo:**<br>El motor de producción actual (`getRecipeBom`, `startProduction`, `completeProduction`) **ya descuenta de `Inventario` de insumos**. Al estar la base en `Inventario`, el consumo de la receta secundaria no requiere bifurcar queries de stock. | **Alto:**<br>Requiere reescribir `getRecipeBom`, `startProduction` y `completeProduction` para ramificar cada query: "¿es insumo o es producto intermedio?". |
| **Costeo y Valorización** | El costo unitario real resultante de la producción de la base se escribe en `Inventario.costoPromedio` del insumo base. Al fabricar el yogurt final, el cálculo toma directamente dicho costo promedio. | El costo unitario se guarda en `InventarioProducto`, y la orden de producción final debe leer el costo desde `InventarioProducto` y crear un movimiento de salida de producto. |
| **Impacto en la UI (`IngredientsFormSection.jsx`)** | **Muy Bajo:**<br>El selector de insumos sigue leyendo `supplies`. La Base Blanca simplemente aparece listada como insumo disponible, con un badge visual `[Producido en Planta]`. | **Medio / Complejo:**<br>Requiere selector dual o tabs ("Insumo" vs "Producto Intermedio"), complicando la captura de datos y validaciones de tipos. |
| **Riesgo de Regresión** | Prácticamente nulo sobre las órdenes de compra existentes (basta filtrar `origen === 'COMPRADO'` en el módulo de compras). | Alto: Podría romper endpoints de catálogo, pedidos y reportes de ventas que asumen que todo `Producto` tiene presentación comercial. |

### Veredicto Arquitectónico

> **VEREDICTO: ENFOQUE B OPTIMIZADO (Híbrido de Mínima Invasión - Pureza Conceptual con Estabilidad Operativa)**
> 
> Si bien el Enfoque A parece tentador por menor cantidad de líneas en base de datos, en plantas de alimentos procesar una orden de producción cuyo resultado sea un "Insumo" desnaturaliza el ciclo de producción en ERPs industriales (ISA-95 / ERP standard).  
> 
> Sin embargo, la solución óptima y más limpia para Yogurt ERP sin introducir disrupciones mayores es:
> 1. **Presentación Estándar de Fábrica:** Crear en el seed/catálogo la Presentación fija `A GRANEL` (`tipoEnvase: 'TANQUE_GRANEL'`, `cantidadMl: 1000`, `cantidadOz: 33.81`). De este modo **no rompemos la restricción NOT NULL de `Producto.idPresentacion`**, preservando el 100% de la integridad de base de datos existente.
> 2. **Categoría de Producto:** `categoria: 'INTERMEDIO_WIP'` (no visible en catálogo de ventas para clientes).
> 3. **Flexibilización en `DetalleReceta`:** Permitir que un renglón de la receta consuma o bien un `Insumo` (leche cruda, azúcar, fruta, fermento) O un `Producto` intermedio (Base Blanca de Tanque).
> 4. **Trazabilidad Sanitaria:** Añadir `idLotePadre` en `Lote` para vincular el lote hijo al lote padre del producto intermedio.

---

## 3. PROPUESTA DE MODIFICACIONES MÍNIMAS EN `schema.prisma`

Sin ejecutar migraciones aún (según el modo estricto de auditoría), los cambios exactos propuestos en el esquema son:

### A. Flexibilización de `DetalleReceta`
Permitir que un detalle apunte a un `Insumo` O a un `Producto` (semielaborado):

```prisma
model DetalleReceta {
  id                    String          @id @default(uuid()) @map("ID_Detalle_Receta")
  idEtapaReceta         String          @map("ID_Etapa_Receta")
  etapa                 EtapaReceta     @relation(fields: [idEtapaReceta], references: [id])
  
  // Insumo tradicional (opcional si es producto intermedio)
  idInsumo              String?         @map("ID_Insumo")
  insumo                Insumo?         @relation(fields: [idInsumo], references: [id])
  
  // Producto intermedio / WIP (opcional si es insumo comprado)
  idProductoIntermedio  String?         @map("ID_Producto_Intermedio")
  productoIntermedio    Producto?       @relation("ProductoConsumidoReceta", fields: [idProductoIntermedio], references: [id])

  cantidadRequerida     Decimal         @map("Cantidad_Requerida")
  unidad                String          @map("Unidad")
  mermaPorcentaje       Decimal         @map("Merma_Porcentaje")
  esOpcional            Boolean         @default(false) @map("Es_Opcional")
  grupoVariante         String?         @map("Grupo_Variante")
  tipoInsumo            String          @default("BASE") @map("Tipo_Insumo") // 'BASE', 'INTERMEDIO_WIP', 'COMPLEMENTO', etc.
  activo                Boolean         @default(true) @map("Activo")
  observaciones         String?         @map("Observaciones")

  @@index([idEtapaReceta])
  @@index([idInsumo])
  @@index([idProductoIntermedio])
  @@map("Detalle_Recetas")
}
```

### B. Relación Inversa en `Producto`
Agregar la relación de consumo en el modelo `Producto`:
```prisma
model Producto {
  // ... campos existentes ...
  recetasConsumo DetalleReceta[] @relation("ProductoConsumidoReceta")
}
```

### C. Flexibilización en `DetalleProduccion`
Para registrar el consumo real tanto de insumos como de productos intermedios en la orden de producción ejecutada:
```prisma
model DetalleProduccion {
  id                    String      @id @default(uuid()) @map("ID_Detalle_Produccion")
  idProduccion          String      @map("ID_Produccion")
  produccion            Produccion  @relation(fields: [idProduccion], references: [id])
  
  idInsumo              String?     @map("ID_Insumo")
  insumo                Insumo?     @relation(fields: [idInsumo], references: [id])

  idProductoIntermedio  String?     @map("ID_Producto_Intermedio")
  productoIntermedio    Producto?   @relation(fields: [idProductoIntermedio], references: [id])

  cantidadTeorica       Decimal     @map("Cantidad_Teorica")
  cantidadRealUtilizada Decimal?    @map("Cantidad_Real_Utilizada")
  diferencia            Decimal?    @map("Diferencia")
  unidad                String      @map("Unidad")
  costoTeorico          Decimal?    @map("Costo_Teorico") @db.Decimal(12, 2)
  costoReal             Decimal?    @map("Costo_Real") @db.Decimal(12, 2)
  observaciones         String?     @map("Observaciones")

  @@map("Detalle_Producciones")
}
```

### D. Trazabilidad Sanitaria y Genealogía de Lotes (`Lote`)
Vincular el lote padre (semielaborado) con el lote hijo (producto empacado):
```prisma
model Lote {
  id                 String         @id @default(uuid()) @map("ID_Lote")
  tipoLote           String         @map("Tipo_Lote") // 'PRODUCTO_TERMINADO', 'SEMIELABORADO_WIP'
  idProduccion       String         @map("ID_Produccion")
  produccion         Produccion     @relation(fields: [idProduccion], references: [id])
  idProducto         String?        @map("ID_Producto")
  producto           Producto?      @relation(fields: [idProducto], references: [id])
  idInsumo           String?        @map("ID_Insumo")
  insumo             Insumo?        @relation(fields: [idInsumo], references: [id])

  // Genealogía de Lotes:
  idLotePadre        String?        @map("ID_Lote_Padre")
  lotePadre          Lote?          @relation("GenealogiaLotes", fields: [idLotePadre], references: [id])
  lotesHijos         Lote[]         @relation("GenealogiaLotes")

  fechaProduccion    DateTime       @map("Fecha_Produccion")
  fechaVencimiento   DateTime?      @map("Fecha_Vencimiento")
  cantidadInicial    Decimal        @map("Cantidad_Inicial")
  cantidadDisponible Decimal        @map("Cantidad_Disponible")
  unidad             String         @map("Unidad")
  estado             String         @map("Estado")
  costoUnitario      Decimal?       @map("Costo_Unitario") @db.Decimal(12, 2)
  observaciones      String?        @map("Observaciones")
  detalleVentas      DetalleVenta[]

  @@map("Lotes")
}
```

---

## 4. MECÁNICA DE COSTEO DINÁMICO Y TRAZABILIDAD SANITARIA

### 4.1. Ecuación de Costeo Unitario de la Base Blanca (Nivel 1)
Al planificar y completar la orden de Base Blanca (ej. 500 Litros):

$$\text{Costo Total Lote Base} = \sum (\text{Cantidad Real Insumo}_i \times \text{Costo Promedio Insumo}_i)$$

$$\text{Costo Unitario Base Blanca (\$/L)} = \frac{\text{Costo Total Lote Base}}{\text{Cantidad Real Producida (L)}}$$

* Este costo unitario resultante se registra en `InventarioProducto.costoPromedio` para la Base Blanca.
* En `MovimientoInventario` se registra:
  * Entradas a cava/tanque: `tipoMovimiento: 'ENTRADA_PRODUCCION'`, `costoUnitario: Costo Unitario Base`.

### 4.2. Inyección de Costo en la Receta Secundaria (Nivel 2)
Cuando se formula la receta secundaria (ej. *Yogurt Fresa 150ml*):
* La Base Blanca figura como ingrediente con cantidad requerida (ej. `0.140 L` por porción de 150ml considerando densidad).
* **Costo Teórico en BOM:** Se toma de `InventarioProducto.costoPromedio` de la Base Blanca.
* **Costo Real en Producción:** Al completar la orden de Yogurt Fresa, el costo unitario de la base se multiplica por los litros reales trasegados del tanque, sumándose al costo del empaque (vaso, foil) y complementos (jalea de fresa).

### 4.3. Trazabilidad Sanitaria Lote Padre $\rightarrow$ Lote Hijo (BPM / INVIMA)
En la industria láctea, un tanque de Base Blanca (Lote `LOTE-BASE-2026-0913-01`) puede fraccionarse en múltiples producciones hijas:
* Producción A: 1.000 unidades de Yogurt Fresa 150g $\rightarrow$ Lote `LOTE-YOG-FRE-001` (Padre: `LOTE-BASE-2026-0913-01`).
* Producción B: 800 unidades de Yogurt Melocotón 150g $\rightarrow$ Lote `LOTE-YOG-MEL-002` (Padre: `LOTE-BASE-2026-0913-01`).

Al descontar el inventario del semielaborado:
1. Se deduce de la `cantidadDisponible` del lote padre.
2. El lote hijo almacena `idLotePadre: lotePadre.id`.
3. Ante cualquier inspección sanitaria o retiro de mercado (*recall*), una consulta simple sobre `Lote.findUnique({ where: { id } }).include({ lotePadre: true, lotesHijos: true })` permite auditar instantáneamente:
   * Todos los productos terminados derivados de una misma leche/base pasteurizada contaminada.
   * La leche cruda o lote de cultivo madre que originó el lote padre.

---

## 5. DETECCIÓN DE RIESGOS POKA-YOKE EN UI

Para garantizar una experiencia a prueba de fallos humanos (Poka-Yoke) en `apps/web/src/app/catalog/recipes/`:

1. **Prevención de Referencias Circulares (Auto-consumo):**
   * **Riesgo:** Que el usuario cree una receta para "Base Blanca" y agregue dentro de sus ingredientes a la misma "Base Blanca", provocando recursión infinita en el cálculo de costos y BOM explosivo.
   * **Solución UI en `IngredientsFormSection.jsx`:**
     * Filtrar las opciones del selector:
       ```javascript
       const availableWipProducts = products.filter(p => 
         p.categoria === 'INTERMEDIO_WIP' && p.id !== currentRecipeProductId
       );
       ```
     * Si la receta actual es del Producto $X$, el Producto $X$ **queda excluido** automáticamente de la lista seleccionable.

2. **Detección de Ciclos Indirectos ($A \rightarrow B \rightarrow A$):**
   * Antes de guardar (`handleSubmit` en `useRecipeForm.js`), el cliente o la API debe validar que el producto seleccionado no dependa en niveles inferiores del producto actual.

3. **Selector Unificado con Grupos Ópticos (`<optgroup>`):**
   * En lugar de dos campos confusos, el selector de ingredientes en `IngredientsFormSection.jsx` agrupa ordenadamente:
     ```jsx
     <select value={det.idRecurso} onChange={...}>
       <optgroup label="Materias Primas & Empaques (Insumos)">
         {supplies.map(s => <option key={s.id} value={`INSUMO:${s.id}`}>{s.nombre} ({s.unidadBase})</option>)}
       </optgroup>
       <optgroup label="Bases & Semielaborados en Planta (WIP)">
         {wipProducts.map(p => <option key={p.id} value={`PRODUCTO:${p.id}`}>{p.nombre} (Granel)</option>)}
       </optgroup>
     </select>
     ```

---

## 6. PLAN DE EJECUCIÓN PASO A PASO (ROADMAP)

Una vez aprobada esta auditoría de diseño, la implementación técnica se estructurará en 3 etapas sin interrupciones:

### Fase 1: Backend & Base de Datos
1. Ajustar `schema.prisma` con `idProductoIntermedio` en `DetalleReceta` y `DetalleProduccion`, y `idLotePadre` en `Lote`.
2. Crear la presentación del sistema `A GRANEL` en las semillas o migraciones iniciales.
3. Ejecutar sincronización con:
   ```bash
   pnpm --filter api exec prisma db push
   pnpm --filter api exec prisma generate
   ```
4. Actualizar `production.repository.js`:
   * Enriquecer `getRecipeBom` para resolver insumos tanto desde `Inventario` como desde `InventarioProducto` (si es `idProductoIntermedio`).
   * Enriquecer `completeProduction` para registrar el descuento de `InventarioProducto` y enlazar `idLotePadre`.

### Fase 2: Servicios API & DTOs
1. Actualizar `create-recipe.dto.js` y `update-recipe.dto.js` para admitir `idProductoIntermedio`.
2. Exponer endpoint `/products/wip` o parámetro `?categoria=INTERMEDIO_WIP` para alimentar los catálogos de recetas.

### Fase 3: Frontend & Experiencia de Usuario
1. Actualizar `useRecipesData.js` para cargar productos candidatos a intermedios (`wipProducts`).
2. Actualizar `IngredientsFormSection.jsx` con el selector clasificado por `<optgroup>` y regla Poka-Yoke anti-circular.
3. Actualizar el cálculo de costo en tiempo real en `useRecipeForm.js` para sumar el costo unitario de productos semielaborados.
4. En el módulo de Producción (`ProductionModal.jsx`), agregar selector del Lote Padre de Base Blanca cuando la orden consuma un producto intermedio.

---
**Fin del Documento de Auditoría.**
