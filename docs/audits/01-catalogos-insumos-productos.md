# Auditoría Técnica Forense: Módulo 1 - Catálogos y Unidades

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Insumos` (`Insumo`): Catálogo central de materias primas e insumos.
  - `Presentaciones` (`Presentacion`): Catálogo de recipientes/envases y medidas de despacho.
  - `Productos` (`Producto`): Catálogo de productos terminados e intermedios.
  - `Precios_Proveedores` (`PrecioProveedor`): Histórico y tarifas de insumos por proveedor.
- **Campos clave y llaves foráneas:**
  - `Productos.idPresentacion` -> `Presentaciones.id` (FK directa N:1).
  - `Precios_Proveedores.idInsumo` -> `Insumos.id` (FK directa N:1).
  - `Precios_Proveedores.idProveedor` -> `Proveedores.id` (FK directa N:1).
  - `Productos.recetasConsumo` / `detallesProduccionConsumo`: Permite a `Producto` fungir como producto intermedio consumible en recetas/producción.
- **Índices y Restricciones:**
  - `Productos`: Restricción compuesta `@unique([nombre, idPresentacion])`, impidiendo duplicados de un mismo producto en idéntico volumen o envase.
  - `Insumos`: `id` es UUID (`@id @default(uuid())`). No tiene restricción `@unique` en el nombre a nivel de esquema Prisma (se controla lógicamente o permite homónimos de diferentes marcas).
  - `Presentaciones`: `id` UUID. Sin restricción unique formal a nivel de BD sobre `nombre`.
  - `Precios_Proveedores`: Llave primaria UUID. Índices implícitos en FKs.
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Costos y montos monetarios: Declarados como `@db.Decimal(12, 2)` (`precioVenta`, `costoBase`, `precioCompra`, `costoUnidadBase`, `precioMayorista`).
  - Factores e impuestos: Declarados como `@db.Decimal(5, 2)` (`margenObjetivo`, `porcentajeIva`, `tarifaIva`).
  - Factor de precisión alta: `costoBaseSinIva` utiliza `@db.Decimal(12, 4)` en `Precios_Proveedores`, garantizando precisión ante divisiones y desgloses de impuestos.
  - Cantidades: `stockMinimo`, `cantidadPresentacion`, `cantidadEquivalenteBase`, `cantidadMinimaMayorista` se gestionan en `Decimal`. En `Presentaciones`, `cantidadOz` y `cantidadMl` son `Decimal?`.

---

## 2. Matriz de Endpoints

### 2.1 Insumos (`/supplies`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/supplies` | Body: `CreateSupplyDto` (`nombre`, `categoria`, `subcategoria`, `marca`, `unidadBase`, `stockMinimo`, etc.) | `201 Created` | `400 Bad Request` |
| `GET` | `/supplies` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/supplies/active` | Ninguno (filtra `activo: true`) | `200 OK` | `500 Internal Error` |
| `GET` | `/supplies/brands` | Ninguno (marcas distintas) | `200 OK` | `500 Internal Error` |
| `GET` | `/supplies/:id` | Param: `id` (UUID) | `200 OK` | `404 Not Found` |
| `PATCH` | `/supplies/:id` | Param: `id`, Body: `UpdateSupplyDto` | `200 OK` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/supplies/:id` | Param: `id` (UUID) | `200 OK` | `400 Bad Request`, `404 Not Found` |

### 2.2 Productos (`/products`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/products` | Body: `CreateProductDto` | `201 Created` | `400 Bad Request`, `409 Conflict` (P2002) |
| `GET` | `/products` | Query: Opcional filtros | `200 OK` | `500 Internal Error` |
| `GET` | `/products/active` | Ninguno (`activo: true`) | `200 OK` | `500 Internal Error` |
| `GET` | `/products/intermediates` | Ninguno (categoría BASE / intermedios) | `200 OK` | `500 Internal Error` |
| `GET` | `/products/selector` | Ninguno (optimizado para combos de venta/cava) | `200 OK` | `500 Internal Error` |
| `GET` | `/products/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `PATCH` | `/products/:id` | Param: `id`, Body: `UpdateProductDto` | `200 OK` | `400 / 404 / 409` |
| `DELETE` | `/products/:id` | Param: `id` | `200 OK` | `400 / 404` |

### 2.3 Presentaciones (`/presentations`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/presentations` | Body: `CreatePresentationDto` | `201 Created` | `400 Bad Request` |
| `GET` | `/presentations` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/presentations/active` | Ninguno (`activo: true`) | `200 OK` | `500 Internal Error` |
| `GET` | `/presentations/:id` | Param: `id` | `200 OK` | `400 (vacío/inválido)`, `404` |
| `PATCH` | `/presentations/:id` | Param: `id`, Body: `UpdatePresentationDto` | `200 OK` | `400`, `404` |
| `DELETE` | `/presentations/:id` | Param: `id` | `200 OK` | `400`, `404` |

### 2.4 Precios de Proveedores (`/supplier-prices`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/supplier-prices` | Body: `CreateSupplierPriceDto` | `201 Created` | `400 Bad Request` |
| `GET` | `/supplier-prices` | Query: Opcional `idInsumo`, `idProveedor` | `200 OK` | `500 Internal Error` |
| `GET` | `/supplier-prices/active` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/supplier-prices/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `PATCH` | `/supplier-prices/:id` | Param: `id`, Body: `UpdateSupplierPriceDto` | `200 OK` | `400 / 404` |
| `DELETE` | `/supplier-prices/:id` | Param: `id` | `200 OK` | `400 / 404` |

---

## 3. Validaciones y DTOs
- **Framework de Validación:** Se emplea `class-validator` y `class-transformer` junto a `globalValidationPipe` con configuración estricta:
  - `transform: true`
  - `whitelist: true` (elimina propiedades basura inyectadas en los payloads)
  - `forbidNonWhitelisted: true` (rechaza peticiones con atributos extraños)
- **Definición de DTOs:**
  - `CreateSupplyDto`: Valida tipos `@IsString()`, `@IsNumber()`, `@Min(0)`, `@IsOptional()`.
  - `CreateProductDto`: Requiere `nombre`, `idPresentacion`, `precioVenta`, `margenObjetivo` y valida rangos numéricos.
  - Sanitización: `PresentationsController` implementa guarda manual adicional para validar que el `id` no sea nulo, cadena vacía ni `'undefined'/'null'`.

---

## 4. Lógica de Negocio y Transaccionalidad
- **Normalización de Unidades:** `unitNormalizer.js` estandariza unidades (`ml`, `l`, `g`, `kg`, `unidad`) y factores de conversión de empaques comerciales a unidad base para evitar inconsistencias de inventario.
- **Consultas con Stock Integrado:** En `products.repository.js`, métodos como `findWithCavaStock` y `findForSaleSelector` efectúan joins con las tablas `Inventario_Productos` y `Presentaciones`, resolviendo en memoria o proyecciones Prisma la disponibilidad de stock real.
- **Transaccionalidad:**
  - La creación de Insumos y Precios de Proveedor en operaciones compuestas se ejecuta mediante `this.prisma.$transaction` cuando un insumo se inicializa junto a su inventario en cero o su lista inicial de precios.
  - Eliminación lógica vs física: Se verifica en los servicios si existen registros asociados en compras, producciones o recetas antes de ejecutar un `delete` físico, recurriendo a desactivación lógica (`activo: false`) para preservar integridad referencial.

---

## 5. Manejo de Errores
- **Filtro Global (`GlobalExceptionFilter`):**
  - Captura excepciones conocidas de Prisma (`PrismaClientKnownRequestError`):
    - `P2002` (Violación de unicidad): Traduce a HTTP 409 Conflict.
    - `P2025` (Registro no encontrado): Traduce a HTTP 404 Not Found.
    - `P2003` (Violación de Foreign Key): Traduce a HTTP 400 Bad Request con mensaje amigable de registro vinculado.
- **Controladores:** Algunos controladores implementan bloques locales `try/catch` envolviendo a `HttpException`, mientras que otros delegan directamente al flujo asíncrono gestionado por el filtro global de NestJS.

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Falta de Restricción `@unique` en Nombre de Insumos:**
   - En `schema.prisma`, la tabla `Insumos` no posee restricción única sobre `[nombre, marca]`, permitiendo potencialmente la duplicación accidental de insumos si no se intercepta en la capa de servicio.
2. **Hardcoding de Mensaje en Conflicto P2002:**
   - En `global-exception.filter.js` línea 37, el mensaje por defecto ante `P2002` menciona explícitamente: `"Ya existe un proveedor registrado con este..."`, aun cuando el conflicto provenga del catálogo de Productos (`[nombre, idPresentacion]`) o Clientes.
3. **Conversión Decimal a Número en Memoria:**
   - Los repositorios convierten campos `Decimal` de Prisma a `Number(...)` en JavaScript (`Number(p.inventario?.cantidadActual || 0)`), lo que podría inducir pequeñas pérdidas de precisión de punto flotante en cálculos contables de alta escala si no se utiliza una librería como `decimal.js` o `BigNumber`.
