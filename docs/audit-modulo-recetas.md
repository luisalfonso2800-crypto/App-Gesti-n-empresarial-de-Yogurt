# Auditoría Forense: Módulo Recetas Técnicas (`/catalog/recipes`)

**Fecha de ejecución:** 2026-09-24  
**Alcance:** Frontend (`apps/web/src/app/catalog/recipes`), Backend API (`apps/api/src/recipes`), Base de Datos Prisma (`apps/api/prisma/schema.prisma`)  
**Metodología:** Análisis estático de código sin mutaciones (0 ediciones de producción).

---

## 1. Mapa de Rutas y Páginas

El módulo de recetas está diseñado como una Single Page Application (SPA) con vistas modales y paneles plegables en una única ruta base de Next.js App Router:

| URL | Archivo Físico | Componentes Principales Importados |
| :--- | :--- | :--- |
| `/catalog/recipes` | `apps/web/src/app/catalog/recipes/page.jsx` | `RecipesHeader`, `RecipesList`, `RecipeModal`, `OrphanProductsBanner`, `ConfirmDeleteRecipeModal` |
| Modo Creación/Edición | Se activa condicionalmente en `page.jsx` (`isEditing === true`) | Renderiza `RecipeModal.jsx` a pantalla completa sobre la misma URL |

*Nota:* No existen subcarpetas de rutas estáticas (`/new`, `/[id]/edit`). Todo el flujo de creación, edición e inspección técnica se orquesta dinámicamente mediante el hook `useRecipesPageManager.js` y el estado `isEditing`.

---

## 2. Inventario de Componentes

| Componente | Ruta Relativa | Líneas | Propósito Inferido |
| :--- | :--- | :---: | :--- |
| **`page.jsx`** | `recipes/page.jsx` | 114 | Orquestador principal de la vista de recetas (SRP < 120). |
| **`RecipesHeader.jsx`** | `recipes/components/RecipesHeader.jsx` | 38 | Barra superior con título y botón principal `+ Nueva Receta`. |
| **`RecipesList.jsx`** | `recipes/components/RecipesList.jsx` | 89 | Tabla de recetas existentes con estado de carga, errores y acciones CRUD. |
| **`OrphanProductsBanner.jsx`** | `recipes/components/OrphanProductsBanner.jsx` | 68 | Retícula visual de productos en catálogo que carecen de receta técnica. |
| **`RecipeModal.jsx`** | `recipes/components/RecipeModal.jsx` | 149 | Orquestador del formulario técnico, costeo, etapas y validaciones Poka-Yoke. |
| **`ConfirmDeleteRecipeModal.jsx`** | `recipes/components/ConfirmDeleteRecipeModal.jsx` | 42 | Modal de confirmación para eliminación segura de recetas. |
| **`RecipeHeaderFields.jsx`** | `recipes/components/modal-parts/RecipeHeaderFields.jsx` | 130 | Split Header con producto, nombre técnico, cantidad base, unidad y avatar. |
| **`RecipeHeaderWarnings.jsx`** | `recipes/components/modal-parts/RecipeHeaderWarnings.jsx` | 46 | Alertas reactivas por falta de base WIP o empaques comerciales. |
| **`RecipeStagesList.jsx`** | `recipes/components/modal-parts/RecipeStagesList.jsx` | 118 | Contenedor de la lista de etapas del proceso (BOM y tiempos). |
| **`StageCardItem.jsx`** | `recipes/components/modal-parts/StageCardItem.jsx` | 145 | Tarjeta interactiva de etapa: tiempos, temperaturas, tabla BOM e instrucciones. |
| **`StageCardBomFields.jsx`** | `recipes/components/modal-parts/StageCardBomFields.jsx` | 136 | Fila de ingredientes (BOM): selector dual (Insumo / WIP), cantidad, merma, opcional. |
| **`RecipeBalanceFooter.jsx`** | `recipes/components/modal-parts/RecipeBalanceFooter.jsx` | 112 | Barra inferior horizontal de resumen de costos, márgenes y botón `Finalizar y Resumir`. |
| **`RecipeOperationalSummaryModal.jsx`** | `recipes/components/modal-parts/RecipeOperationalSummaryModal.jsx` | 145 | Hoja de ruta final de planta y confirmación de publicación de la receta. |
| **`PackagingWizardModal.jsx`** | `recipes/components/modal-parts/PackagingWizardModal.jsx` | 138 | Asistente guiado de empaque comercial y cereal porcionado. |

---

## 3. Formulario de Nueva Receta — Estructura Completa

El formulario implementa una compuerta estricta por fases (**Gated Cascade**):

### Fase 1: Información Básica (Header Técnico)
- **Campos renderizados:**
  - `PRODUCTO A FABRICAR *` (Dropdown: `select[name="idProducto"]`). Obligatorio.
  - `NOMBRE TÉCNICO DE LA RECETA *` (Input: `input[name="nombre"]`). Obligatorio. Sugerido reactivamente como `"Fórmula - [Nombre Producto]"`.
  - `CANTIDAD BASE *` (Input: `input[name="rendimientoBase"]`). Obligatorio. Numérico $> 0$.
  - `UNIDAD *` (Dropdown: `select[name="unidadRendimiento"]`). Obligatorio (`Litros`, `Kilogramos`, `Gramos`, `Unidades`). Sugerida según la presentación del producto.
  - `OBSERVACIONES TÉCNICAS` (Input colapsable: `input[name="observaciones"]`). Opcional.
- **Validación Poka-Yoke:** Mientras falte alguno de los 4 campos obligatorios, el resto del formulario permanece bloqueado con un placeholder visual:
  `🔒 Paso 1: Completa la información básica`.

### Fase 2: Etapas de Proceso y Hoja de Ruta
- Una vez completado el Header, se habilita la adición de etapas:
  - Botones de plantilla rápida: `+ Plantilla Base en Tanque`, `+ Plantilla Envasado Comercial`, `+ Plantilla Dulce/Jalea`.
  - Botón manual: `+ Agregar Etapa`.
- **Campos por cada etapa:**
  - Nombre de la etapa, Orden secuencial.
  - Tiempos de proceso (Mínimo, Estándar, Máximo en minutos). Conversión automática en vivo a formato reloj `00:00 h`.
  - Temperaturas (°C Mínima y Máxima). Conversión en vivo a °F.
  - Instrucciones de planta (Texto libre).

### Fase 3: Composición de Materiales (BOM) por Etapa
- En cada etapa se agregan detalles de materiales:
  - **Selector Dual:** Permite seleccionar tanto **Insumos de Bodega** (`idInsumo`) como **Bases Intermedias / WIP** (`idProductoIntermedio`).
  - **Cantidad Requerida:** Numérico $> 0$.
  - **Unidad de Medida:** `kg`, `g`, `l`, `ml`, `und`.
  - **Merma (%):** Porcentaje de desperdicio técnico (ej. $2\%$).
  - **Tipo de Insumo:** Clasificación automática (`BASE`, `COMPLEMENTO`, `EMPAQUE_BASE`, `INTERMEDIO_WIP`).

### Fase 4: Verificación de Costos y Balance
- `RecipeBalanceFooter.jsx` calcula en vivo el Cost Roll-up.
- El botón **`Finalizar y Resumir`** solo se habilita si no hay inconsistencias físicas ni financieras.
- Abre `RecipeOperationalSummaryModal.jsx` mostrando la narrativa de planta antes de ejecutar el guardado final.

---

## 4. Cálculos Matemáticos — Crítico

| Cálculo | Fórmula Exacta en Código | Ubicación | Ejemplo Numérico |
| :--- | :--- | :--- | :--- |
| **Requerimiento Total con Merma** | `totalReq = cantidadRequerida * (1 + (mermaPorcentaje / 100))` | `recipeHelpers.js:522` | $10\text{ L} \times (1 + 0.05) = 10.5\text{ L}$ |
| **Costo Insumo Directo** | `costoUnitarioBase = unitCostRaw / contenidoReferencial`<br>`costoInsumo = totalReq * factorConversion * costoUnitarioBase` | `recipeHelpers.js:585-588` | Azúcar: $1\text{ kg} \times 1 \times \$4.500 = \$4.500$ |
| **Factor de Conversión de Unidades** | `getUnitConversionFactor(unidadDetalle, unidadBase)` | `utils/unitNormalizer.js` | $500\text{ g}$ a $\text{kg} \to 0.5$ |
| **Costo Base Intermedia (WIP Roll-up)** | `costoWip = totalReq * factorConversion * costoUnitarioRecetaBase` | `recipeHelpers.js:546-575` | Base Láctea: $100\text{ L} \times \$2.800/\text{L} = \$280.000$ |
| **Costo Total de la Receta** | `totalCost = costRawSupplies + costWipBases` | `recipeHelpers.js:593` | $\$45.000 + \$280.000 = \$325.000$ |
| **Costo Unitario Proyectado** | `costPerUnit = rendimientoBase > 0 ? (totalCost / rendimientoBase) : 0` | `recipeHelpers.js:595` | $\$325.000 / 100\text{ unds} = \$3.250/\text{und}$ |
| **Costo Tope Permitido (Margen)** | `costoTope = precioVenta * (1 - (margenObjetivo / 100))` | `RecipeModal.jsx:58` | Precio $\$6.000$, Margen $30\% \to \$4.200$ máx. |
| **Límite Físico de Envase** | `maxLitrosPermitidos = (cantidadMl / 1000) * rendimientoBase * 1.05` | `recipeHelpers.js:625` | $100\text{ botellas de } 1\text{L} \to 105\text{ L}$ máx. |

---

## 5. Cascada Poka-Yoke entre Pasos

1. **Barrera 1 (Bloqueo Inicial de Etapas):** Si `idProducto`, `nombre`, `rendimientoBase` o `unidadRendimiento` están vacíos o `<= 0`, las etapas están completamente ocultas tras `headerGatePlaceholder`.
2. **Barrera 2 (Detección de Base WIP Faltante):** Si el producto a fabricar es comercial y no tiene una base en tanque en el catálogo, se levanta una advertencia crítica en `RecipeHeaderWarnings.jsx`.
3. **Barrera 3 (Falta de Empaque Comercial):** Si el producto es comercial y en ninguna etapa se incluyó envase, tapa o etiqueta (`tipoInsumo === 'EMPAQUE_BASE'`), `canSubmit` se evalúa como `false`.
4. **Barrera 4 (Desbordamiento de Capacidad Física):** Si los litros líquidos de yogurt superan la capacidad física volumétrica de las botellas registradas en la presentación más el $5\%$ de margen, el sistema bloquea el guardado por desborde físico.
5. **Barrera 5 (WIP sin Costo):** Si se utiliza una base intermedia cuya receta no existe o su costo es $\$0$, `rollup.hasWipFallback` bloquea la publicación con el mensaje: `WIP sin costo configurado`.

---

## 6. Relación con Otros Módulos

| Módulo | Cómo se relaciona | Endpoint Utilizado |
| :--- | :--- | :--- |
| **Productos (`/catalog/products`)** | El producto es el padre de la receta (`idProducto`). Además, otros productos intermedios WIP pueden consumirse como ingredientes dentro de los detalles (`idProductoIntermedio`). | `GET /api/v1/products` |
| **Insumos (`/catalog/supplies`)** | Materias primas y empaques agregados al BOM (`idInsumo`). | `GET /api/v1/supplies` |
| **Precios / Proveedores** | Rescata los costos pactados o referenciales para calcular el Cost Roll-up. | `GET /api/v1/supplies/prices` |
| **Producción (`/production`)** | La orden de producción se liquida consumiendo el BOM y las etapas de la receta activa del producto. | `GET /api/v1/recipes/:id/bom` |

---

## 7. Modelo Prisma

Extraído directamente de [`apps/api/prisma/schema.prisma`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma):

```prisma
model Receta {
  id                String        @id @default(uuid()) @map("ID_Receta")
  idProducto        String        @map("ID_Producto")
  producto          Producto      @relation(fields: [idProducto], references: [id])
  nombre            String        @map("Nombre_Receta")
  rendimientoBase   Decimal       @map("Rendimiento_Base")
  unidadRendimiento String        @map("Unidad_Rendimiento")
  activo            Boolean       @default(true) @map("Activo")
  observaciones     String?       @map("Observaciones")
  etapas            EtapaReceta[]

  @@map("Recetas")
}

model EtapaReceta {
  id                String          @id @default(uuid()) @map("ID_Etapa_Receta")
  idReceta          String          @map("ID_Receta")
  receta            Receta          @relation(fields: [idReceta], references: [id])
  nombre            String          @map("Nombre_Etapa")
  orden             Int             @map("Orden")
  tiempoMinimoMin   Int?            @map("Tiempo_Minimo_Min")
  tiempoEstandarMin Int?            @map("Tiempo_Estandar_Min")
  tiempoMaximoMin   Int?            @map("Tiempo_Maximo_Min")
  tempMinimaGrados  Decimal?        @map("Temp_Minima_Grados")
  tempMaximaGrados  Decimal?        @map("Temp_Maxima_Grados")
  instrucciones     String?         @map("Instrucciones")
  detalles          DetalleReceta[]
  activo            Boolean         @default(true) @map("Activo")

  @@map("Etapas_Receta")
}

model DetalleReceta {
  id                   String       @id @default(uuid()) @map("ID_Detalle_Receta")
  idEtapaReceta        String       @map("ID_Etapa_Receta")
  etapa                EtapaReceta  @relation(fields: [idEtapaReceta], references: [id])
  idInsumo             String?      @map("ID_Insumo")
  insumo               Insumo?      @relation(fields: [idInsumo], references: [id])
  idProductoIntermedio String?      @map("ID_Producto_Intermedio")
  productoIntermedio   Producto?    @relation("ProductoConsumidoReceta", fields: [idProductoIntermedio], references: [id])
  cantidadRequerida    Decimal      @map("Cantidad_Requerida")
  unidad               String       @map("Unidad")
  mermaPorcentaje      Decimal      @map("Merma_Porcentaje")
  esOpcional           Boolean      @default(false) @map("Es_Opcional")
  grupoVariante        String?      @map("Grupo_Variante")
  tipoInsumo           String       @default("BASE") @map("Tipo_Insumo")
  activo               Boolean      @default(true) @map("Activo")
  observaciones        String?      @map("Observaciones")

  @@index([idEtapaReceta])
  @@index([idInsumo])
  @@index([idProductoIntermedio])
  @@map("Detalle_Recetas")
}
```

*Nota:* No existe restricción `@unique` en `idProducto`, permitiendo técnicamente múltiples recetas históricas por producto, aunque la lógica del frontend y servicio maneja una receta activa predominante.

---

## 8. Endpoints API

Ubicación: [`apps/api/src/recipes/recipes.controller.js`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/api/src/recipes/recipes.controller.js)

| Método | Ruta | Payload / Parámetros | Respuesta | Validaciones Principales |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/recipes` | Body: `CreateRecipeDto` (nombre, idProducto, rendimientoBase, etapas[]) | Receta creada con etapas y detalles | Valida presencia de producto, cantidad base $> 0$ e integridad de etapas. |
| `GET` | `/api/v1/recipes` | Ninguno | Array de recetas con producto y conteo de etapas | Filtros de estado activo/inactivo. |
| `GET` | `/api/v1/recipes/active` | Ninguno | Array de recetas con `activo: true` | Utilizado para órdenes de producción. |
| `GET` | `/api/v1/recipes/:id/bom` | Param: `id` | Receta completa con árbol anidado de etapas y detalles BOM | Carga profunda para edición y explosión de materiales. |
| `GET` | `/api/v1/recipes/:id` | Param: `id` | Cabecera y relaciones directas | Verificación de existencia. |
| `PATCH` | `/api/v1/recipes/:id` | Param: `id`, Body: `UpdateRecipeDto` | Receta actualizada | Sincronización transaccional de etapas y detalles. |
| `DELETE` | `/api/v1/recipes/:id` | Param: `id` | Confirmación de eliminación lógica/física | Bloquea si la receta tiene lotes producidos asociados. |

---

## 9. Listado de Huérfanos — Problema Visual Analizado

### Ubicación y Comportamiento
- **Archivo:** [`OrphanProductsBanner.jsx`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/web/src/app/catalog/recipes/components/OrphanProductsBanner.jsx)
- **Cálculo:** Se calcula en el cliente en `page.jsx:81`:
  ```javascript
  orphanProducts={products.filter(p => !items.some(r => String(r.idProducto) === String(p.id)))}
  ```
  No consume un endpoint `/orphans` independiente; cruza en memoria la lista de `/products` contra `/recipes`.

### Diagnóstico de truncamiento de texto
En `recipes.module.css`:
```css
.orphanGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}
.orphanCardTitle {
  font-size: 0.82rem;
  font-weight: 700;
  color: #182622;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* <-- CAUSA DIRECTA */
}
```
1. **Ancho insuficiente:** Las tarjetas tienen un ancho mínimo de apenas `240px`.
2. **Espacio comprimido:** En ese ancho conviven el avatar ($38\text{px}$), el botón `+ Crear Receta` ($85\text{px}$) y los márgenes ($30\text{px}$), dejando solo unos $85\text{px}$ para el texto.
3. **Truncamiento agresivo:** La clase `.orphanCardTitle` fuerza `white-space: nowrap` y `text-overflow: ellipsis`, provocando que cualquier nombre de más de 12 caracteres (ej: `"Crema de Fresas con Crema"`) se corte visualmente como `"Crema de Fr..."`.
4. **Falta de buscador y filtros:** No hay caja de búsqueda ni selector de categorías/canales en el banner de huérfanos; cuando hay 35 productos, se genera un bloque masivo y difícil de navegar.

---

## 10. Selectores Reales en el DOM

| Elemento / Campo | Selector Estable para Playwright |
| :--- | :--- |
| **Botón Nueva Receta** | `button:has-text("Nueva Receta"), button:has-text("+ Nueva Receta")` |
| **Tarjeta Huérfano** | `.orphanCard` o `button:has-text("+ Crear Receta")` |
| **Producto a Fabricar** | `select[name="idProducto"]` |
| **Nombre Técnico** | `input[name="nombre"]` |
| **Cantidad Base** | `input[name="rendimientoBase"]` |
| **Unidad de Rendimiento** | `select[name="unidadRendimiento"]` |
| **Observaciones Técnicas** | `input[name="observaciones"]` |
| **Plegar/Desplegar Header** | `button:has-text("Modificar Cabecera"), button:has-text("Plegar")` |
| **Botón Agregar Etapa** | `button:has-text("+ Agregar Etapa")` |
| **Botón Plantilla Base Tanque** | `button:has-text("Plantilla Base en Tanque")` |
| **Selector de Insumo/WIP (Fila BOM)** | `select[name="itemSelect"]` o `select >> option:has-text("...")` |
| **Cantidad Requerida (Fila BOM)** | `input[name="cantidadRequerida"]` |
| **Merma % (Fila BOM)** | `input[name="mermaPorcentaje"]` |
| **Botón Finalizar y Resumir** | `button:has-text("Finalizar y Resumir")` |
| **Botón Publicar / Confirmar Receta** | `button:has-text("Publicar Receta Técnica"), button:has-text("Guardar Receta")` |

---

## 11. Tests E2E Existentes

Al auditar `apps/web/e2e/recipes/`:
- **Resultado:** No existen archivos de prueba E2E para recetas en `apps/web/e2e/recipes/` (directorio inexistente o vacío).
- **Cobertura actual:** **0%**.
- **Oportunidad:** Toda la suite de formulación, validación de huérfanos, plantillas de etapas y costeo matemático debe construirse desde cero con la garantía de idempotencia que ofrecen las suites de siembra previas.

---

## 12. Huecos Detectados y Mejoras Priorizadas

| Hueco / Problema Detectado | Impacto | Severidad | Prioridad |
| :--- | :--- | :---: | :---: |
| **Truncamiento de Nombres en Huérfanos** | Los operarios no pueden leer nombres largos de productos en las tarjetas de huérfanos. | Visual / UX | **ALTA** |
| **Falta de Buscador en Huérfanos** | Con 35 productos huérfanos, la retícula satura la pantalla verticalmente. | Usabilidad | **MEDIA** |
| **Ausencia de Tests E2E para Recetas** | No hay pruebas que verifiquen el cálculo del Cost Roll-up ni la compuerta Poka-Yoke. | Calidad / CI | **ALTA** |
| **Relación 1:1 Producto-Receta en Frontend** | Aunque Prisma admite $N$ recetas, el selector de huérfanos asume exclusividad total. | Arquitectura | **BAJA** |

---

### Estado
**[COMPLETADO]**
