# Auditoría Estructural del Módulo de Gastos Operativos

> **Documento:** Auditoría técnica estática de endpoints, modelo de persistencia y componentes de interfaz de Gastos  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/api/src/expenses/` y `apps/web/src/app/commercial/expenses/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Contrato de Endpoints Backend

### 1.1 Rutas Expuestas (`ExpensesController`)
El controlador NestJS está montado bajo el prefijo `/expenses` (en el API gateway `/api/v1/expenses`):
- `POST /api/v1/expenses`: Registra un nuevo gasto operativo.
- `GET /api/v1/expenses`: Retorna la lista histórica de todos los gastos persistidos.
- `GET /api/v1/expenses/:id`: Retorna el detalle de un gasto específico por su UUID.

### 1.2 Estructura del Payload (`POST /api/v1/expenses`)
A nivel de persistencia en Prisma (`ExpensesRepository.create`), el objeto procesado contiene:
```json
{
  "fecha": "2026-09-25T00:00:00.000Z",
  "categoria": "SERVICIOS_PUBLICOS",
  "descripcion": "PAGO DE ENERGÍA PLANTA",
  "valor": 125000,
  "tipoGasto": "FIJO",
  "periodo": "2026-09",
  "observaciones": "PAGO MENSUAL"
}
```

* **Campos Requeridos y Tipos:**
  - `fecha`: Fecha válida convertible a `Date` (`new Date(data.fecha)`).
  - `categoria`: Categoría del gasto (ej: `SERVICIOS_PUBLICOS`, `NOMINA`, `MANTENIMIENTO`, `LOGISTICA`, `ARRIENDO`).
  - `descripcion`: Cadena de texto descriptiva del egreso.
  - `valor`: Número flotante o entero positivo correspondiente al importe total.
  - `tipoGasto`: Clasificación del egreso (`FIJO`, `VARIABLE`, `OPERATIVO`, etc.).
  - `periodo`: Identificador de período fiscal (formato `AAAA-MM`).
  - `observaciones`: Cadena de texto opcional con anotaciones complementarias.

---

## 2. Componentes y Selectores en Frontend (`/commercial/expenses`)

### 2.1 Vista Principal (`ExpensesPage`)
- **Cabecera y Botón Disparador:**
  - Botón principal de apertura:
    `button:has-text("Nuevo Gasto")`
  - Fallback en estado vacío asistido (`AssistedEmptyState`):
    `button:has-text("+ Nuevo Gasto")`
- **KPIs y Filtros:**
  - Tarjetas con métricas agregadas (`ExpensesKpis`).
  - Filtros rápidos por período, categoría y búsqueda textual (`ExpensesFilters`).
- **Tabla de Gastos:**
  - Renderiza `Table` con cabeceras `Fecha`, `Categoría`, `Descripción`, `Valor`, `Tipo`.
  - Muestra montos formateados mediante `formatCurrency` (COP).

### 2.2 Modal de Captura (`ExpenseFormModal.jsx`)
- **Contenedor:** Utiliza `SmartModal` con título `"Nuevo Gasto"`.
- **Selectores de Entrada:**
  - Período: `select[name="periodo"]` o input de fecha.
  - Categoría: `select[name="categoria"]`.
  - Tipo de gasto: `select[name="tipoGasto"]` o botones de opción.
  - Valor / Monto: `input[name="valor"]` (con máscara monetaria).
  - Descripción: `input[name="descripcion"]` o `textarea[name="descripcion"]`.
  - Observaciones: `input[name="observaciones"]` / `textarea`.
- **Compuertas Poka-Yoke:**
  - Deshabilita el botón de guardado si `valor <= 0` o faltan campos obligatorios (`isSubmitDisabled`).
  - Banner dinámico de resumen: Muestra previsualización del gasto antes de confirmar.
- **Acciones y Cierre:**
  - Botón de guardado: `button:has-text("Guardar Gasto")` (renderizado por `SubmitButton`).
  - Botón cancelar: `button:has-text("Cancelar")` (clase `modalStyles.btnCancel`).
  - Botón accesible de cabecera: `button[aria-label="Cerrar modal"]` o `button[title="Cerrar"]`.

---

## 3. Casos Clave para Pruebas (API + E2E)

### 3.1 Suite de Integración API (`expenses-api-integration.spec.js`)
1. **EXP-API-01: Listado de Gastos (`GET /api/v1/expenses`)**
   - Retorna código 200 y un array de registros de gastos.
2. **EXP-API-02: Creación Exitosa de Gasto (`POST /api/v1/expenses`)**
   - Envía payload válido y verifica respuesta 201 con ID generado y persistencia de `valor`, `categoria` y `tipoGasto`.
3. **EXP-API-03: Consulta Unitaria por ID (`GET /api/v1/expenses/:id`)**
   - Recupera el gasto recién creado y confirma consistencia de datos.

### 3.2 Suite E2E Visual (`expenses-flow.spec.js`)
1. **EXP-E2E-01: Navegación y Carga:**
   - Navega a `/commercial/expenses` y valida visibilidad de botón "Nuevo Gasto" y filtros.
2. **EXP-E2E-02: Apertura de Modal:**
   - Clic en "Nuevo Gasto" y validación del diálogo con título "Nuevo Gasto".
3. **EXP-E2E-03: Cierre Limpio:**
   - Clic en "Cancelar" o botón ✕ y comprobación de cierre sin recarga.
