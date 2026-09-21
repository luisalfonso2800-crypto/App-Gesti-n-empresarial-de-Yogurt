# REPORTE DE AUDITORÍA ARQUITECTURAL: GASTOS & DASHBOARD/SCADA

> **Fecha:** 2026-09-21
> **ID Auditoría:** AUDIT-EXPENSES-DASHBOARD-SCADA
> **Objetivo:** Auditar el módulo financiero de Gastos (`/commercial/expenses`), API backend y la capa analítica/IoT de Dashboard y Alarmas SCADA (`/dashboard`).

---

## 1. RESUMEN EJECUTIVO

| Módulo | Ruta Web | Rutas API Backend | Estado Arquitectural | Observaciones Críticas |
| :--- | :--- | :--- | :--- | :--- |
| **Gastos (Financiero)** | `/commercial/expenses` | `/expenses` | **CONFORME (Excelente SRP)** | Modularización Poka-Yoke aplicada (subcomponentes < 110 líneas, hook desacoplado, `page.jsx` en 101 líneas). Backend implementa Controller-Service-Repository y tabla Prisma `Gasto` (`Gastos`). |
| **Dashboard / SCADA** | `/dashboard` | `/dashboard` | **CON OBSERVACIONES SRP / CSS** | La página orquesta telemetría y subcomponentes visuales con éxito (`AnalogGauge`, `OscilloscopeCanvas`, `LiquidSilosCanvas`, `RadarSweepCanvas`, `SeismographChart`, `SimulationDrawer`). Sin embargo, `DashboardOperationalView.jsx` (891 líneas) y `Dashboard.module.css` (1451 líneas) exceden los límites de SRP. |

---

## 2. AUDITORÍA DEL MÓDULO DE GASTOS

### 2.1 Backend y Base de Datos
* **Modelo Prisma:** [apps/api/prisma/schema.prisma](file:///apps/api/prisma/schema.prisma#L398-L409)
  ```prisma
  model Gasto {
    id            String   @id @default(uuid()) @map("ID_Gasto")
    fecha         DateTime @map("Fecha")
    categoria     String   @map("Categoria")
    descripcion   String   @map("Descripcion")
    valor         Decimal  @map("Valor") @db.Decimal(12, 2)
    tipoGasto     String   @map("Tipo_Gasto")
    periodo       String   @map("Periodo")
    observaciones String?  @map("Observaciones")

    @@map("Gastos")
  }
  ```
* **Capa API:** [apps/api/src/expenses/](file:///apps/api/src/expenses/)
  - `expenses.controller.js`: Rutas `POST /expenses`, `GET /expenses`, `GET /expenses/:id`.
  - `expenses.service.js` y `expenses.repository.js`: Estructura Controller-Service-Repository estricta con aislamiento Prisma.
  - Validación DTO en subcarpeta `dto/`.

### 2.2 Frontend (`/commercial/expenses`)
* **Ubicación:** [apps/web/src/app/commercial/expenses/](file:///apps/web/src/app/commercial/expenses/)
* **Cumplimiento de SRP y Límites de Líneas:**
  - `page.jsx`: **101 líneas** (Cumple regla SRP < 120 líneas).
  - `ExpenseFormModal.jsx`: **97 líneas** (Cumple regla SmartModal < 150 líneas).
  - Subcomponentes del modal:
    - `ExpensePeriodAndCategoryFields.jsx`: **105 líneas**.
    - `ExpenseValueAndDetailFields.jsx`: **85 líneas`.
  - Componentes de vista:
    - `ExpensesFilters.jsx`: **87 líneas**.
    - `ExpensesKpis.jsx`: **65 líneas**.
  - Custom Hooks:
    - `useExpensesFilter.js`: **68 líneas**.
    - `useExpensesPageData.js`: **150 líneas**.
  - Hoja de Estilos:
    - `expenses.module.css`: **287 líneas** (100% CSS Modules, cero estilos inline).

---

## 3. AUDITORÍA DEL MÓDULO DASHBOARD & ALARMAS SCADA

### 3.1 Backend y Servicios Analíticos
* **Ubicación:** [apps/api/src/dashboard/](file:///apps/api/src/dashboard/)
* **Controlador y Endpoints:**
  - `GET /dashboard/full-telemetry`: Retorna métricas de planta, volumen de tanques, temperaturas y estado general.
  - `GET /dashboard/alarms`: Telemetría de advertencias y criticidad operacional.
  - `GET /dashboard/production-recommendations`: Generado por `ProductionOptimizerService`.
  - `POST /dashboard/simulate-batch`: Motor de simulación en `SimulationEngineService`.
  - `POST /dashboard/decisions/log` y `GET /dashboard/decisions/history`: Motor de autoaprendizaje en `LearningEngineService`.
  - `GET /dashboard/kpis` y `GET /dashboard/rotation`: Métricas financieras y rotación de producto.
* **Modelo de Datos:** No requiere tabla Prisma persistente separada para SCADA directa; calcula telemetría operativa reactivamente a partir de `Lote`, `Produccion`, `Inventario`, `Venta` e insumos.

### 3.2 Frontend (`/dashboard`)
* **Ubicación:** [apps/web/src/app/dashboard/](file:///apps/web/src/app/dashboard/)
* **Estructura y Métricas de Líneas:**
  - `page.jsx`: **146 líneas** (Levemente por encima del target de 120 líneas; candidato a aligerar extracción de estados).
  - Componentes Gráficos SCADA/Canvas (Bien encapsulados):
    - `AnalogGauge.jsx`: 110 líneas.
    - `OscilloscopeCanvas.jsx`: 128 líneas.
    - `LiquidSilosCanvas.jsx`: 136 líneas.
    - `RadarSweepCanvas.jsx`: 182 líneas.
    - `SeismographChart.jsx`: 111 líneas.
    - `DashboardQuickAccessStrip.jsx`: 91 líneas.
    - `SimulationDrawer.jsx`: 196 líneas.
  - **Componente Monolítico Identificado:**
    - `DashboardOperationalView.jsx`: **891 líneas** ⚠️ *(Requiere refactorización futura dividiéndolo en tarjetas modulares por subsistema SCADA)*.
  - **Estilos:**
    - `Dashboard.module.css`: **1451 líneas** (Estructura visual masiva).

---

## 4. CONCLUSIONES Y PLAN DE ACCIÓN RECOMENDADO

1. **Gastos:**
   - Estado: **100% Aprobado**. No requiere intervenciones. Totalmente alineado con los principios de SRP, CSS Modules y Poka-Yoke.
2. **Dashboard / SCADA:**
   - Estado: **Operativo con Deuda Técnica SRP**.
   - **Próximas Tareas Recomendadas:**
     - Modularizar `DashboardOperationalView.jsx` (891 líneas) en submódulos especializados (`SiloTelemetrySection.jsx`, `AlarmsMonitorSection.jsx`, `KpiSummaryStrip.jsx`).
     - Aligerar `page.jsx` de `/dashboard` para bajar de 146 a < 120 líneas moviendo handlers a un hook custom `useDashboardData.js`.
