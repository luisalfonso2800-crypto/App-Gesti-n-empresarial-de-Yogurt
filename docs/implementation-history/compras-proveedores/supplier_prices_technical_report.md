# REPORTE TÉCNICO: ANÁLISIS DE C02, SCHEMA PRISMA Y ENDPOINT POST

Fecha de emisión: 24 de septiembre de 2026

---

## Pregunta 1 — Confirmar por qué C02 pasa

### 1.1 Ejecución aislada de C02
Comando ejecutado:
```bash
pnpm --filter web exec playwright test supplier-prices/supplier-prices-modal-calc.spec.js -g "C02" --reporter=list
```

Salida de la consola:
```text
Running 1 test using 1 worker

  ✓  1 [chromium] › supplier-prices/supplier-prices-modal-calc.spec.js:18:7 › Precios Proveedores - Cálculos Matemáticos e IVA (C01-C08) › C02: BOLSA x 500 g x $8.000 sin IVA -> $16 / g (1.6s)

  1 passed (3.6s)
```

### 1.2 Por qué pasa en verde
1. **No ejecuta Submit (Guardar):**  
   El test `C02` (y toda la serie `C01-C08`) es un test puramente reactivo de interfaz. Llama a `fillSupplierPriceForm(page, { ... })` y luego inspecciona la tarjeta reactiva del frontend:
   ```javascript
   await expect(page.locator('div[class*="costCard"], span[class*="costValue"]').first()).toContainText(/16/);
   ```
   En ningún momento hace click en `"Guardar Precio"` ni envía la petición HTTP a la API. Por lo tanto, no interactúa con el backend ni con Prisma.
2. **El cálculo matemático en el DOM coincide:**  
   Al ingresar $8.000 para 500 g de Cultivo Láctico (sin IVA), el hook `useSupplierPriceForm` calcula `costoUnitarioSinIva = 8000 / 500 = 16`, y la UI renderiza `$ 16,00 / g`. El matcher `/16/` encuentra el string inmediatamente.

---

## Pregunta 2 — Schema Prisma Real (`model PrecioProveedor`)

Ubicación: [`apps/api/prisma/schema.prisma`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/apps/api/prisma/schema.prisma#L71-L93)

```prisma
model PrecioProveedor {
  id                      String    @id @default(uuid()) @map("ID_Precio")
  idInsumo                String    @map("ID_Insumo")
  insumo                  Insumo    @relation(fields: [idInsumo], references: [id])
  idProveedor             String    @map("ID_Proveedor")
  proveedor               Proveedor @relation(fields: [idProveedor], references: [id])
  presentacionCompra      String    @map("Presentacion_Compra")
  cantidadPresentacion    Decimal   @map("Cantidad_Presentacion")
  unidadPresentacion      String    @map("Unidad_Presentacion")
  cantidadEquivalenteBase Decimal   @map("Cantidad_Equivalente_Base")
  precioCompra            Decimal   @map("Precio_Compra") @db.Decimal(14, 4)
  costoUnidadBase         Decimal   @map("Costo_Unidad_Base") @db.Decimal(14, 4)
  tieneIva                Boolean   @default(true) @map("Tiene_Iva")
  porcentajeIva           Decimal   @default(19.0) @map("Porcentaje_Iva") @db.Decimal(5, 2)
  precioIncluyeIva        Boolean   @default(true) @map("Precio_Incluye_Iva")
  costoBaseSinIva         Decimal   @default(0) @map("Costo_Base_Sin_Iva") @db.Decimal(12, 4)
  fechaRegistro           DateTime  @default(now()) @map("Fecha_Registro")
  fechaUltimaCompra       DateTime? @map("Fecha_Ultima_Compra")
  activo                  Boolean   @default(true) @map("Activo")
  observaciones           String?   @map("Observaciones")

  @@map("Precios_Proveedores")
}
```

### Campos confirmados:
- **NO EXISTEN en el modelo:**
  - `montoIvaCalculado` (este campo es exclusivamente de proyección en el frontend).
  - `costoUnitarioSinIva` (en base de datos se almacena como `costoBaseSinIva` y `costoUnidadBase`).
  - `costoUnitarioConIva` (este campo es exclusivamente de proyección en el frontend).
- **Campos numéricos/financieros que SÍ persisten:**
  - `precioCompra`
  - `costoUnidadBase`
  - `tieneIva`
  - `porcentajeIva`
  - `precioIncluyeIva`
  - `costoBaseSinIva`
  - `cantidadPresentacion`
  - `cantidadEquivalenteBase`

---

## Pregunta 3 — Payload Correcto Esperado y Firma del Backend

### 3.1 Controller: `apps/api/src/supplier-prices/supplier-prices.controller.js`
```javascript
@Post()
@Bind(Body())
create(createDto) {
  return this.service.create(createDto);
}
```

### 3.2 Service: `apps/api/src/supplier-prices/supplier-prices.service.js`
El servicio recalcula y normaliza con precisión `Decimal.js`:
```javascript
_computePriceFields(dto) {
  const data = { ...dto };
  const tieneIva = data.tieneIva !== undefined ? Boolean(data.tieneIva) : true;
  const porcentajeIva = tieneIva ? toDecimal(data.porcentajeIva !== undefined ? data.porcentajeIva : 19.0) : toDecimal(0);
  const precioIncluyeIva = data.precioIncluyeIva !== undefined ? Boolean(data.precioIncluyeIva) : true;
  const precioCompra = toDecimal(data.precioCompra || 0);
  const cantidadEquivalenteBase = toDecimal(data.cantidadEquivalenteBase || 1);

  let costoBaseSinIva = toDecimal(0);
  let precioTotalConIva = precioCompra;

  if (tieneIva && porcentajeIva.gt(0)) {
    const factor = add(1, div(porcentajeIva, 100));
    if (precioIncluyeIva) {
      costoBaseSinIva = div(precioCompra, factor);
      precioTotalConIva = precioCompra;
    } else {
      costoBaseSinIva = precioCompra;
      precioTotalConIva = mul(precioCompra, factor);
    }
  } else {
    costoBaseSinIva = precioCompra;
    precioTotalConIva = precioCompra;
  }

  const costoUnidadBase = cantidadEquivalenteBase.gt(0) ? div(costoBaseSinIva, cantidadEquivalenteBase) : toDecimal(0);

  data.tieneIva = tieneIva;
  data.porcentajeIva = toNumber(porcentajeIva);
  data.precioIncluyeIva = precioIncluyeIva;
  data.costoBaseSinIva = toNumber(costoBaseSinIva.toDecimalPlaces(4));
  data.costoUnidadBase = toNumber(costoUnidadBase.toDecimalPlaces(4));

  return data;
}

async create(createDto) {
  const computedData = this._computePriceFields(createDto);
  return this.repository.create(computedData);
}
```

### 3.3 Repository: `apps/api/src/supplier-prices/supplier-prices.repository.js`
```javascript
async create(data) {
  return this.prisma.precioProveedor.create({
    data,
  });
}
```
Como el repositorio pasa directamente el objeto `data` a `prisma.precioProveedor.create({ data })`, **Prisma lanza error 500** si `data` contiene cualquier propiedad extra no definida en el modelo `PrecioProveedor` (como `montoIvaCalculado`, `costoUnitarioSinIva` o `costoUnitarioConIva`).

### 3.4 Payload Válido para el POST
Los únicos campos que deben enviarse o recibirse en el backend para la creación son:
```json
{
  "idInsumo": "uuid-del-insumo",
  "idProveedor": "uuid-del-proveedor",
  "presentacionCompra": "BULTO",
  "cantidadPresentacion": 50,
  "unidadPresentacion": "kg",
  "cantidadEquivalenteBase": 50,
  "precioCompra": 120000,
  "tieneIva": false,
  "porcentajeIva": 0,
  "precioIncluyeIva": true,
  "observaciones": ""
}
```
*(Cualquier propiedad adicional como `montoIvaCalculado`, `costoUnitarioSinIva` o `costoUnitarioConIva` debe ser omitida o desestructurada antes de enviar a la API).*
