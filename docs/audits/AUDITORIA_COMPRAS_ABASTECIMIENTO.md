# Auditoría Estructural del Módulo de Compras y Abastecimiento

> **Documento:** Auditoría técnica estática de ciclo de compras, órdenes ORD, checklist interactivo y recepción en bodega  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/api/src/purchases/` y `apps/web/src/app/operations/purchases/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Contrato de Endpoints Backend (`PurchasesController`)

### 1.1 Rutas Expuestas
El controlador NestJS responde en `/api/v1/purchases`:
- `GET /api/v1/purchases`: Lista histórica de compras registradas y consolidadas.
- `POST /api/v1/purchases`: Registra una compra física real con transacción en Kárdex.
- `GET /api/v1/purchases/:id`: Consulta detallada de una compra por su UUID.
- `GET /api/v1/purchases/orders/active`: Lista órdenes de compra activas (`PENDIENTE` / `EN_PROCESO`).
- `POST /api/v1/purchases/orders`: Crea una orden de compra preparatoria (admite ítems iniciales o vacíos). Requiere al menos `"nombre"`.
- `GET /api/v1/purchases/orders/:id`: Detalle de una orden específica con sus ítems.
- `POST /api/v1/purchases/orders/:id/items`: Añade un insumo/ítem a una orden existente.
- `PATCH /api/v1/purchases/orders/:id`: Actualiza nombre o estado de la orden.
- `PATCH /api/v1/purchases/orders/:id/items/:itemId`: Actualiza el estado individual de un ítem en la lista de compras.
- `DELETE /api/v1/purchases/orders/:id`: Elimina una orden y sus ítems asociados.
- `POST /api/v1/purchases/orders/merge`: Unifica múltiples órdenes de compra en una nueva lista.
- `POST /api/v1/purchases/simulate`: Simula cálculos de abastecimiento sin persistir.

### 1.2 Estructura del Payload (`POST /api/v1/purchases`)
Valida mediante Zod (`createPurchaseSchema.js`) y ejecuta en transacción Prisma:
```json
{
  "idProveedor": "<UUID_PROVEEDOR>",
  "fechaCompra": "2026-09-25T00:00:00.000Z",
  "numeroFactura": "FAC-COMPRA-001",
  "formaPago": "CONTADO",
  "fechaPago": "2026-09-25T00:00:00.000Z",
  "detalles": [
    {
      "idInsumo": "<UUID_INSUMO>",
      "idPresentacion": "<UUID_PRESENTACION>",
      "cantidad": 10,
      "precioUnitario": 4500,
      "iva": 0
    }
  ]
}
```

* **Validaciones Poka-Yoke de Entrada:**
  - `idProveedor`: UUID obligatorio de un proveedor activo.
  - `detalles`: Array con al menos 1 ítem. Cada ítem debe tener `cantidad > 0` y `precioUnitario >= 0`.
  - Rechaza con `400 Bad Request` si faltan campos obligatorios o valores numéricos inválidos.

### 1.3 Movimiento de Kárdex e Impacto en Inventario
Al invocar `POST /api/v1/purchases`, dentro de `prisma.$transaction`:
1. Crea el registro maestro en la tabla `Compra` y las líneas en `DetalleCompra`.
2. Actualiza o incrementa el stock en `InventarioInsumo` sumando la `cantidad` ingresada.
3. Genera el registro de auditoría en `MovimientoInventario` con tipo `ENTRADA_COMPRA` y el costo unitario correspondiente.

---

## 2. Componentes y Selectores en Frontend (`/operations/purchases`)

### 2.1 Tablero Principal (`/operations/purchases/page.jsx`)
- **Cabecera y Botones de Acción:**
  - `button:has-text("Crear / Gestionar Lista")`: Enruta a `/catalog/supplier-prices`.
  - `button:has-text("Nueva Compra Directa")`: Enruta a `/operations/purchases/new?mode=direct`.
- **Sección de Órdenes Activas (`PurchasesActiveOrdersSection.jsx`):**
  - Muestra tarjetas de listas/órdenes de compra en ruta (`ORD-2026-XXXX`).
  - Botones de acción: Unificar órdenes (`button:has-text("Unificar")`), editar nombre y eliminar.
- **Historial Consolidado (`PurchasesHistoryTable.jsx`):**
  - Tabla con compras cerradas, mostrando proveedor, factura, fecha y total en COP.

### 2.2 Flujo de Compra y Checklist (`/operations/purchases/new/page.jsx`)
- **Fase 1: Checklist Interactivo (`ChecklistPhase.jsx`):**
  - Permite marcar ítems comprados durante el recorrido de compras en plaza/mercado.
  - Botón para avanzar a la fase de recepción: `button:has-text("Proceder a Facturación"), button:has-text("Continuar")`.
- **Fase 2: Formulario de Recepción y Costos (`FormPhase.jsx`):**
  - Selectores de proveedor (`select[name="idProveedor"]`).
  - Campo de número de factura (`input[name="numeroFactura"]`).
  - Entradas de insumos, cantidades recibidas y precio pactado.
  - Botón de confirmación y entrada a bodega:
    `button:has-text("Finalizar Compra"), button:has-text("Confirmar Compra")`.

---

## 3. Casos Clave para Pruebas (API + E2E)

### 3.1 Suite de Integración API (`purchases-api-integration.spec.js`)
1. **PUR-API-01: Listado de Compras e Historial (`GET /api/v1/purchases`)**
   - Retorna código 200 OK y un array de compras históricas.
2. **PUR-API-02: Consulta de Órdenes Activas (`GET /api/v1/purchases/orders/active`)**
   - Retorna 200 OK y las órdenes en estado `PENDIENTE` o `EN_PROCESO`.
3. **PUR-API-03: Poka-Yoke ante Compra Vacía o Inválida (`POST /api/v1/purchases`)**
   - Payload sin proveedor o con cantidad <= 0 rechaza con 400 Bad Request.
4. **PUR-API-04: Creación de Orden de Compra (`POST /api/v1/purchases/orders`)**
   - Crea una orden `ORD-TEST` retornando 201 Created con UUID y código generado.
5. **PUR-API-05: Consulta Unitaria de Orden (`GET /api/v1/purchases/orders/:id`)**
   - Recupera la orden confirmando consistencia del nombre y estado.

### 3.2 Suite E2E Visual (`purchases-flow.spec.js`)
1. **PUR-E2E-01: Navegación y Carga:**
   - Carga `/operations/purchases` y verifica banner de contexto y botón `"Nueva Compra Directa"`.
2. **PUR-E2E-02: Renderizado de Órdenes o Historial:**
   - Verifica visibilidad de la sección de órdenes activas o historial de compras.
3. **PUR-E2E-03: Navegación a Flujo de Nueva Compra:**
   - Clic en `"Nueva Compra Directa"` y navegación exitosa a `/operations/purchases/new?mode=direct`.
4. **PUR-E2E-04: Renderizado de Controles de Compra Directa:**
   - Validación del formulario de compra directa (select de proveedor, factura o campos de ítems).
