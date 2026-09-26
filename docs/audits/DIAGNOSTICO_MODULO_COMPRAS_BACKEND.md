# DIAGNÓSTICO DEL MÓDULO DE COMPRAS (BACKEND & FRONTEND)

## 1. MAPA DE MODELOS DE BASE DE DATOS Y RELACIONES (Prisma)

A continuación, se detalla la estructura y relaciones de los modelos involucrados en el flujo de compras extraídos directamente de `apps/api/prisma/schema.prisma`:

### Modelos Principales
- **`Proveedor`** (`Proveedores`):
  - Campos: `id` (PK, UUID), `nombre`, `nitCedula`, `nombreContacto`, `telefono`, `email`, `direccion`, `activo`, `observaciones`.
  - Relaciones: Uno-a-Muchos con `Compra` y `PrecioProveedor`.

- **`Insumo`** (`Insumos`):
  - Campos: `id` (PK, UUID), `nombre`, `categoria`, `subcategoria`, `marca`, `unidadBase`, `stockMinimo`, `activo`, `observaciones`.
  - Relaciones: Uno-a-Muchos con `PrecioProveedor`, `DetalleCompra`, `Inventario` (Uno-a-Uno), `MovimientoInventario`.

- **`PrecioProveedor`** (`Precios_Proveedores`):
  - Campos: `id` (PK), `idInsumo` (FK), `idProveedor` (FK), `presentacionCompra`, `cantidadPresentacion`, `unidadPresentacion`, `cantidadEquivalenteBase`, `precioCompra`, `costoUnidadBase`, `fechaRegistro`, `fechaUltimaCompra`, `activo`, `observaciones`.
  - Propósito: Sirve como la tabla pivote que establece qué proveedor vende qué insumo, en qué presentación y a qué precio, y registra la equivalencia a la unidad base de inventario (`cantidadEquivalenteBase`).

- **`Compra`** (`Compras`):
  - Campos: `id` (PK), `idProveedor` (FK), `fechaCompra`, `estado`, `total`, `observaciones`.
  - Relaciones: Uno-a-Muchos con `DetalleCompra`.

- **`DetalleCompra`** (`Detalle_Compras`):
  - Campos: `id` (PK), `idCompra` (FK), `idInsumo` (FK), `cantidad`, `precioUnitario`, `subtotal`.

- **`Inventario`** (`Inventario`):
  - Campos: `id` (PK), `idInsumo` (FK, Unique), `cantidadActual`, `fechaActualizacion`.

- **`MovimientoInventario`** (`Movimientos_Inventario`):
  - Campos: `id` (PK), `idInsumo` (FK), `tipoMovimiento` (`ENTRADA` / `SALIDA`), `cantidad`, `fechaMovimiento`, `motivo`, `operacionOrigen`.

### Ubicación de Campos Críticos (Conversión)
- **Presentación comercial:** `PrecioProveedor.presentacionCompra` (ej. "Cantina").
- **Factor de conversión numérico:** `PrecioProveedor.cantidadEquivalenteBase` (el valor real con el que entra a bodega).
- **Unidad base:** `Insumo.unidadBase` (ej. "L", "kg").
- **Marca:** `Insumo.marca`.


## 2. DIAGNÓSTICO DEL CASO CRÍTICO "CANTINA 40L"

**Problema reportado:** En pantalla se observó `contenidoBase: 1` o `1 Litros` en lugar de `40 Litros`.

**Causa Raíz:**
El error ocurre durante la transferencia de datos en el frontend, específicamente en el archivo `apps/web/src/app/catalog/supplier-prices/page.jsx`. Al mapear el registro para guardarlo en el `sessionStorage` (carrito de compras), el código asigna:
```javascript
contenidoBase: item.cantidadPresentacion || 1,
```
El campo `cantidadPresentacion` suele ser simplemente "1" (indicando "1 Cantina"), descartando el verdadero factor de conversión que es `cantidadEquivalenteBase` (donde reside el valor "40").
En consecuencia, la base de datos sí guarda la equivalencia correcta, pero el frontend la descarta antes de llegar a la página de nueva compra, usando `1` para los cálculos de ingreso físico a bodega.


## 3. AUDITORÍA DE SERVICIOS Y CONTROLADORES EN LA API

### Endpoints (Controller `PurchasesController`)
- **Ruta Base:** `/api/v1/purchases`
- **GET `/`**: Obtiene todas las compras (`findAll`), incluyendo los detalles vinculados.
- **GET `/:id`**: Obtiene una compra específica por ID (`findOne`), incluyendo los detalles.
- **POST `/`**: Crea una nueva compra (`create`). Recibe un payload JSON complejo que incluye los datos del proveedor, totales y el arreglo de `detalles`.

### Lógica de Cálculo e Inventario (`purchases.repository.js`)
Actualmente, el backend **no recalcula matemáticamente los subtotales ni el costo base**. Confía ciegamente en lo que envía el frontend:
- Inserta los detalles de compra usando `d.subtotal`, `d.cantidad` y `d.precioUnitario` provistos en el request.
- **Actualización de Inventario Físico:** Suma a la bodega calculando `cantidadNetaBase = detalle.cantidadBaseTotal || (detalle.cantidad * (detalle.contenidoBase || 1))`. 
- Nuevamente, se apoya en los valores enviados por el cliente (`contenidoBase` u `cantidadBaseTotal`), propagando el error detectado en el Caso Crítico (40L).
- **Upsert en PrecioProveedor:** Actualiza el histórico de precios (`costoUnidadBase`) confiando en `detalle.costoBase` enviado desde el cliente.


## 4. TRAZABILIDAD DEL FLUJO DE DATOS (CATÁLOGO -> CARRITO -> CHECKLIST -> FORMULARIO)

### Payload JSON de `sessionStorage.getItem('selectedForPurchase')`
El objeto guardado por el catálogo tiene esta forma:
```json
{
  "id": "uuid-precio",
  "idInsumo": "uuid-insumo",
  "idProveedor": "uuid-prov",
  "insumoNombre": "Leche Entera",
  "proveedorNombre": "Lacteos S.A",
  "marca": "Colanta",
  "categoria": "Materia Prima",
  "presentacionCompra": "Cantina",
  "contenidoBase": 1, 
  "unidadMedida": "L",
  "stockMinimo": 100,
  "precioCompra": 120000,
  "costoUnidadBase": 3000
}
```

**Atributos perdidos:**
- El **factor de conversión real** (`cantidadEquivalenteBase`) se pierde por completo y es sustituido por `cantidadPresentacion`.
- Si bien la `marca` y `stockMinimo` se conservan en la sesión, al crear el formulario en la fase 2 de `page.jsx`, a menudo estos datos se ven sobreescritos o son irrelevantes si el endpoint requiere IDs limpios.

### Llamadas Fetch y Errores 404
En la inicialización del componente `NewPurchasePage`, se realizan llamadas fetch:
```javascript
apiClient.get('/suppliers')
apiClient.get('/supplies')
apiClient.get('/supplier-prices')
```
La URL base correcta del proyecto está unificada a `http://localhost:3001/api/v1`. Los endpoints actuales del backend funcionan correctamente sobre esta URL. Si han ocurrido errores 404, suelen derivar de configuraciones locales incorrectas de `NEXT_PUBLIC_API_URL` que omiten el prefijo `/api/v1` al instanciar `apiClient`.


## 5. PROPUESTA ARQUITECTÓNICA: CENTRALIZACIÓN MATEMÁTICA EN BACKEND

Para eliminar discrepancias y vulnerabilidades lógicas, el frontend debe actuar exclusivamente como capa de recolección de entradas de usuario, delegando toda aritmética al backend.

### Nuevo Endpoint: `POST /api/v1/purchases/simulate`
**Propósito:** Retornar los cálculos al frontend en tiempo real (por ejemplo, al cambiar la cantidad).
**Contrato de Entrada (Request):**
```json
{
  "detalles": [
    {
      "idPrecioProveedor": "uuid-precio",
      "cantidadEmpaques": 2,
      "precioEmpaqueAjustado": 125000 
    }
  ]
}
```
**Contrato de Salida Oficial (Response):**
```json
{
  "subtotalGlobal": 250000,
  "detallesLiquidados": [
    {
      "idPrecioProveedor": "uuid-precio",
      "cantidadEmpaques": 2,
      "ingresoNetoBodega": 80, // (2 empaques * 40L extraído de BD)
      "subtotalLinea": 250000,
      "costoBaseUnitario": 3125 // (125000 / 40L extraído de BD)
    }
  ]
}
```

### Modificación del Endpoint `POST /api/v1/purchases`
El endpoint de guardado final debe ignorar los subtotales enviados por el frontend. Su única entrada confiable debe ser: `idPrecioProveedor`, `cantidadEmpaques` y `precioEmpaque` (si hubo renegociación). El backend, dentro de la transacción Prisma, consultará la tabla `PrecioProveedor` para extraer `cantidadEquivalenteBase` de forma segura, y ejecutará el recálculo y la inserción de inventario basándose en este valor inmutable.

### Manejo de Insumos "No Conseguidos"
El frontend debe excluir los artículos "No Conseguidos" del payload principal de liquidación contable (o enviarlos en un array separado `noConseguidos` si se requiere trazabilidad).
- Si se envían al backend, el `purchases.repository.js` no debe generar líneas en `DetalleCompra` ni en `MovimientoInventario` para ellos.
- En cambio, se recomienda crear una tabla `InsumosFaltantes` (auditoría) donde el backend registre el `idInsumo`, la fecha y el `motivo` (ej. "Agotado en punto de venta") para métricas de fiabilidad de proveedores.
