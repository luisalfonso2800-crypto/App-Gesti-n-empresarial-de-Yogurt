# Auditoría Técnica Forense: Módulo 2 - Recetas y Producción

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Recetas` (`Receta`): Cabecera de formulación técnica por producto.
  - `Etapas_Receta` (`EtapaReceta`): Fases secuenciales del proceso productivo (pasteurización, inoculación, envasado).
  - `Detalle_Recetas` (`DetalleReceta`): Explosión de insumos o productos intermedios por etapa.
  - `Producciones` (`Produccion`): Órdenes de fabricación ejecutadas o planificadas.
  - `Detalle_Producciones` (`DetalleProduccion`): Consumos teóricos vs reales y desviaciones de costos.
- **Campos clave y llaves foráneas:**
  - `Receta.idProducto` -> `Producto.id` (1:N, un producto puede tener versiones de receta).
  - `EtapaReceta.idReceta` -> `Receta.id` (1:N con campo `orden: Int`).
  - `DetalleReceta`: Soporta composición híbrida con `idInsumo` (FK opcional a `Insumo`) y `idProductoIntermedio` (FK opcional a `Producto` con relación `@relation("ProductoConsumidoReceta")`).
  - `Produccion.idProducto` -> `Producto.id`.
  - `DetalleProduccion`: Almacena snapshot de insumos y productos intermedios vinculados a `Produccion.id`.
- **Índices y Restricciones:**
  - `Detalle_Recetas`: Cuenta con índices explícitos `@@index([idEtapaReceta])`, `@@index([idInsumo])`, `@@index([idProductoIntermedio])`.
  - No existe `@unique` en `[idEtapaReceta, idInsumo]` a nivel de esquema de base de datos; la exclusividad de un insumo dentro de la misma etapa se garantiza mediante lógica de servicio en NestJS.
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Tiempos: `tiempoMinimoMin`, `tiempoEstandarMin`, `tiempoMaximoMin` definidos como `Int?`.
  - Temperaturas: `tempMinimaGrados`, `tempMaximaGrados` son `Decimal?`.
  - Cantidades: `rendimientoBase`, `cantidadRequerida`, `mermaPorcentaje`, `cantidadPlanificada`, `cantidadProducidaReal`, `cantidadTeorica`, `cantidadRealUtilizada` son `Decimal`.
  - Costos en producción: `costoTeorico` y `costoReal` están fijados en `@db.Decimal(12, 2)`.

---

## 2. Matriz de Endpoints

### 2.1 Recetas (`/recipes`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/recipes` | Body: `CreateRecipeDto` (etapas anidadas, detalles de insumos) | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `GET` | `/recipes` | Query: Opcional filtros | `200 OK` | `500 Internal Error` |
| `GET` | `/recipes/active` | Ninguno (`activo: true`) | `200 OK` | `500 Internal Error` |
| `GET` | `/recipes/:id/bom` | Param: `id` (Explosión BOM calculada) | `200 OK` | `404 Not Found` |
| `GET` | `/recipes/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `PATCH` | `/recipes/:id` | Param: `id`, Body: `UpdateRecipeDto` | `200 OK` | `400 / 404 / 409` |
| `DELETE` | `/recipes/:id` | Param: `id` | `200 OK` | `400 / 404` |

### 2.2 Producción (`/production`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/production/recipe-bom/:idReceta` | Param: `idReceta`, Query: `cantidad`, `variantes` | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `POST` | `/production` | Body: `CreateProductionDto` (`idProducto`, `cantidadPlanificada`, fecha, etc.) | `201 Created` | `400 Bad Request` |
| `POST` | `/production/:id/start` | Param: `id` (Transición a estado EN_PROCESO) | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `PATCH` | `/production/:id/complete` | Param: `id`, Body: `CompleteProductionDto` (consumos reales, lotes finales generados) | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `POST` | `/production/create-purchase-order-from-shortage` | Body: items en desabastecimiento detectados en BOM | `201 Created` | `400 Bad Request` |
| `GET` | `/production` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/production/:id` | Param: `id` | `200 OK` | `404 Not Found` |

---

## 3. Validaciones y DTOs
- **Validaciones Poka-Yoke de Manufactura en `recipes.service.js`:**
  - **Exclusividad de Insumo vs Producto Intermedio:** Cada renglón de detalle debe contener exactamente uno de los dos campos (`idInsumo` XOR `idProductoIntermedio`). Se rechaza la presencia simultánea o la ausencia total.
  - **Validación Dimensional de Unidades (`areUnitsCompatible`):** Verifica que la unidad de la receta sea dimensionalmente compatible con la unidad base del insumo registrado en catálogo (evitando formular litros con gramos o conteos discretos con unidades de masa).
  - **Empaque Primario Obligatorio:** Si el producto final requiere envase, se valida que en la etapa correspondiente exista la asignación del insumo o presentación de empaque.
- **Redondeo Discreto en Planta:**
  - En `production.repository.js`, las unidades pertenecientes al conjunto `UNIDADES_DISCRETAS` (`UNIDAD`, `VASO`, `TAPA`, `ETIQUETA`) fuerzan `Math.ceil()` al calcular explosión de materiales para no solicitar fracciones físicas irreales (ej. 14.2 tapas pasa a 15 tapas).

---

## 4. Lógica de Negocio y Transaccionalidad
- **Snapshot Inmutable de Receta:**
  - Al generar una orden en `/production`, el sistema no enlaza dinámicamente los insumos a futuro; clona las proporciones y costos vigentes en `Detalle_Producciones`. Si la receta original cambia con posterioridad, la orden de producción preserva su consistencia histórica.
- **Liquidación Atómica y Cierre de Producción:**
  - En el método `complete()` de `production.repository.js`:
    - Se envuelve todo en `this.prisma.$transaction(...)`.
    - Se descuenta el stock de insumos utilizados de `Inventario` y se registran los respectivos `Movimientos_Inventario` con motivo `CONSUMO_PRODUCCION`.
    - Se incrementa el inventario de producto terminado en `Inventario_Productos` o se crea el registro de cava.
    - Se da de alta el nuevo registro de `Lotes` con trazabilidad al `idProduccion` y genealogía de lote padre en caso de productos derivados.
    - Se calculan las desviaciones cuantitativas (`diferencia = real - teorico`) y de costos (`costoReal` vs `costoTeorico`).

---

## 5. Manejo de Errores
- Utilización de excepciones estándar de NestJS: `BadRequestException`, `NotFoundException`, `ConflictException`.
- Mensajes contextualizados en español para el personal de operaciones (ej. "La receta seleccionada no tiene etapas activas registradas", "No hay stock suficiente para iniciar la orden").
- Captura por `GlobalExceptionFilter` asegurando respuestas uniformes JSON.

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Transición Concurrente de Estados en Producción:**
   - No se implementa bloqueo optimista (`@version` o check condicional en SQL) en `production.controller.js` para `/start` o `/complete`. Dos operarios ejecutando `/complete` casi en simultáneo sobre la misma orden podrían duplicar el ingreso de producto terminado e incurrir en doble descuento de insumos.
2. **Volumen del Repositorio (`production.repository.js` > 1000 líneas):**
   - El archivo supera las 1000 líneas y centraliza cálculo de BOM, liquidación transaccional, generación de órdenes de compra por faltantes y genealogía de lotes, violando el principio SRP y dificultando el mantenimiento aislado.
3. **Manejo de Variantes en Query String sin Tipado Fuerte:**
   - El parámetro `Query('variantes')` en `recipe-bom` es recibido como cadena o JSON sin parseo explícito en un Pipe específico, dependiendo de validaciones ad-hoc en el servicio.
