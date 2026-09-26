# Auditoría Técnica Forense: Módulo 3 - Inventario y Trazabilidad

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Inventario` (`Inventario`): Existencias globales y costo promedio ponderado de insumos/materias primas.
  - `Inventario_Productos` (`InventarioProducto`): Stock consolidado y costo unitario en cava de productos terminados.
  - `Movimientos_Inventario` (`MovimientoInventario`): Kardex inmutable con auditoría de saldo anterior y saldo posterior.
  - `Lotes` (`Lote`): Trazabilidad granular, linaje genealógico de transformación (semielaborado WIP -> producto envasado) y control de vida útil.
- **Campos clave y llaves foráneas:**
  - `Inventario.idInsumo`: `@unique` (relación 1:1 con `Insumo`).
  - `InventarioProducto.idProducto`: `@unique` (relación 1:1 con `Producto`).
  - `MovimientoInventario`: Llaves foráneas opcionales `idInsumo`, `idProducto`, `idLote`. Permite registrar tanto movimientos de materias primas como de producto final y descartes de lotes.
  - `Lotes.idLotePadre` -> `Lotes.id` (Relación autorreferencial `@relation("GenealogiaLotes")` para árbol de ascendencia/descendencia).
  - `Lotes.idProduccion` -> `Produccion.id`.
- **Índices y Restricciones:**
  - `idInsumo` e `idProducto` poseen restricciones de unicidad `@unique` en sus respectivas tablas de inventario consolidado.
  - La tabla `Lotes` no tiene índice único compuesto sobre `[idProduccion, idProducto]`, admitiendo múltiples particiones de lotes si la producción genera varios empaques o calidades.
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Existencias: `cantidadActual`, `cantidad`, `stockAnterior`, `stockNuevo`, `cantidadInicial`, `cantidadDisponible` definidos estrictamente en `Decimal`.
  - Costos: `costoPromedio`, `costoUnitario` definidos como `@db.Decimal(12, 2)`.

---

## 2. Matriz de Endpoints

### 2.1 Inventario (`/inventory`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/inventory` | Ninguno (retorna existencias de insumos con lista de precios) | `200 OK` | `500 Internal Error` |
| `GET` | `/inventory/finished-products` | Ninguno (stock de cava, desglose de lotes activos y presentaciones) | `200 OK` | `500 Internal Error` |
| `GET` | `/inventory/wip` | Ninguno (lotes en proceso/bases semielaboradas) | `200 OK` | `500 Internal Error` |
| `GET` | `/inventory/:idInsumo` | Param: `idInsumo` | `200 OK` | `404 Not Found` |
| `GET` | `/inventory/:idInsumo/movements`| Param: `idInsumo` (Kardex histórico) | `200 OK` | `500 Internal Error` |
| `POST` | `/inventory/adjustments` | Body: `{ idInsumo?, idProducto?, tipoAjuste, cantidad, motivo }` | `201 Created` | `400 Bad Request` |

### 2.2 Lotes (`/lots`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/lots` | Query: `productoId`, `idProducto`, `estado`, `disponible` | `200 OK` | `500 Internal Error` |
| `GET` | `/lots/:id` | Param: `id` (incluye árbol genealógico completo) | `200 OK` | `404 Not Found` |
| `POST` | `/lots/:id/discard` | Param: `id`, Body: `{ cantidad, motivo, observaciones }` | `201 Created` | `400 Bad Request`, `404 Not Found` |

---

## 3. Validaciones y DTOs
- **Validaciones en Ajustes de Inventario:**
  - Se comprueba la existencia de la entidad afectada (`Insumo` o `Producto`).
  - Validación de signos: Un ajuste de salida (`AJUSTE_NEGATIVO` o `MERMA`) valida que la cantidad a sustraer no resulte en saldos negativos salvo autorización expresa de inventario bajo demanda.
- **Linaje de Lotes:**
  - El repositorio valida recursivamente la jerarquía `lotePadre` hasta 4 niveles de profundidad para reconstruir el árbol de inoculaciones y mezclas de leche cruda/pasteurizada en planta.

---

## 4. Lógica de Negocio y Transaccionalidad
- **Doble Registro Kardex + Balance Consolidado:**
  - Todo cambio físico de stock ejecuta atómicamente:
    1. Lectura del stock actual (`stockAnterior`).
    2. Cálculo aritmético del nuevo balance (`stockNuevo = stockAnterior ± delta`).
    3. Actualización de `Inventario` o `Inventario_Productos`.
    4. Creación de un registro en `Movimientos_Inventario` detallando `tipoMovimiento`, `stockAnterior`, `stockNuevo` y `operacionOrigen`.
- **Descarte Transaccional de Lote (`discardLot`):**
  - Cuando se descarta una cantidad de un lote por caducidad o defecto organoléptico:
    - Se reduce `cantidadDisponible` en `Lote`. Si llega a 0, su estado conmuta a `AGOTADO` o `DESCARTADO`.
    - Se descuenta simultáneamente de `InventarioProducto` mediante `prisma.$transaction`.
    - Se asienta el `MovimientoInventario` con motivo `DESCARTE_LOTE`.

---

## 5. Manejo de Errores
- Excepciones capturadas mediante `NotFoundException` en caso de que el lote o insumo no exista.
- La integridad de saldos numéricos se preserva encapsulada en los bloques transaccionales de Prisma, garantizando que un fallo en la escritura del kardex cancele la mutación del stock acumulado.

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Profundidad de Recursión Estática en Lote Padre:**
   - En `lots.repository.js` líneas 35-47, la genealogía del lote padre está anidada manualmente con Prisma hasta 4 niveles (`lotePadre.lotePadre.lotePadre.lotePadre`). Si un proceso productivo de cultivo madre o masa madre excede 4 ciclos, los ancestros superiores se truncan.
2. **Ausencia de Validación Formateada con DTO en `/inventory/adjustments`:**
   - El controlador `inventory.controller.js` inyecta directamente `@Bind(Body()) adjustInventory(body)` sin tipar contra una clase DTO (`AdjustInventoryDto`), debilitando las restricciones de `whitelist` del `globalValidationPipe`.
3. **Cálculo de Costo Promedio Ponderado en Ajustes Manuales:**
   - Al realizar ajustes positivos manuales de stock, el sistema no exige obligatoriamente un nuevo costo unitario de entrada, lo que puede diluir o desfasar la valoración contable del inventario.
