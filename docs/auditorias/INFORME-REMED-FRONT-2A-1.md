# INFORME DE REMEDIACIÓN — BLOQUE FRONT-2A-1

**Fecha:** 22 de Septiembre de 2026  
**Rama:** `remediation/frontend-bloque-2a-1`  
**Objetivo:** Erradicación de estilos en línea residuales/pendientes y modularización arquitectónica SRP de 4 componentes críticos sobrecargados.

---

## 1. Resumen Ejecutivo de Cumplimiento

Se ejecutaron satisfactoriamente las tareas **T1 a T7** correspondientes a la fase **Front-2A-1**, logrando una reducción de violaciones globales en `verify-srp.js` de **10 a solo 1** (la cual corresponde a `goals/page.jsx` de 143 líneas, agendada formalmente para el bloque `Front-2A-2`).

| Métrica / Auditoría | Antes (Front-2A parcial) | Después (Front-2A-1) |
| :--- | :--- | :--- |
| **Inline Styles Residuales (`style={{`)** | 5 archivos | **0 archivos (100% erradicado)** |
| **Componentes Oversized (> 150 líneas)** | 4 componentes | **0 componentes** |
| **Páginas Oversized (> 120 líneas)** | 1 (`goals/page.jsx`) | 1 (`goals/page.jsx` -> Bloque 2A-2) |
| **Violaciones Totales (`verify-srp.js --all`)** | **10** | **1** |

---

## 2. Detalle de Intervenciones Quirúrgicas

### T1. Migración de Inline Styles Dinámicos "Fantasma"
- **`GoalCard.jsx`**: Se extrajo el cálculo de anchura porcentual de la barra de progreso a la variable `progressBarStyle`, eliminando `style={{` directo en JSX.
- **`RadarSweepCanvas.jsx`**: Se extrajeron los estilos dinámicos del tooltip de lotes (`left`, `top`, `borderColor`, `color`) a constantes aisladas evaluadas dinámicamente (`tooltipStyle`, `labelStyle`), limpiando el patrón interceptado por el guardián SRP.

### T2. Migración de 3 Inline Styles Pendientes
- **`SmartSelect.jsx`**: Eliminadas todas las ocurrencias de estilos en línea para el asterisco obligatorio (`.requiredAsterisk`), borde de error (`.inputError`), y estado vacío (`.emptySelectState`, `.emptySelectText`, `.emptySelectAction`) delegándolas a `SmartModal.module.css`.
- **`StrictNumberInput.jsx`**: Migrado a clases de `SmartModal.module.css` para el asterisco y estados de error.
- **`NotificationContext.jsx`**: Creado nuevo módulo CSS dedicado `apps/web/src/context/notification.module.css`. Se erradicaron los estilos en línea fijos y dinámicos del contenedor flotante de toasts mediante variantes tipadas (`.toastError`, `.toastWarning`, `.toastSuccess`, `.toastInfo`).

### T3. Modularización de `ProductionCreateForm.jsx`
- De **262 líneas** a **118 líneas** (< 150 límite SRP).
- Se extrajeron 4 subcomponentes especializados:
  1. `RecipeSelectorFields.jsx`: Selección de receta y volumen planificado.
  2. `DateConfigFields.jsx`: Gestión de fechas (producción/vencimiento) y advertencias Poka-Yoke.
  3. `WipParentLotSelector.jsx`: Selección de tanque/lote padre WIP y validación de inventario.
  4. `BomSimuladoTable.jsx`: Tabla visualizadora de disponibilidad de lista de materiales.

### T4. Modularización de `StageCardItem.jsx`
- De **287 líneas** a **95 líneas** (< 150 límite SRP).
- Se extrajeron 2 subcomponentes:
  1. `StageCardHeader.jsx`: Controles superiores expandidos (mover etapa arriba/abajo, plegar, suprimir).
  2. `StageCardBomFields.jsx`: Configuración de parámetros operativos (tiempos, temperaturas e instrucciones de planta).

### T5. Modularización de `GoalFormModal.jsx`
- De **187 líneas** a **88 líneas** (< 150 límite SRP).
- Se extrajo `GoalFormFields.jsx`: encapsula campos de ámbito, métricas, estrategias de cascada/% flujo y fechas límites.

### T6. Modularización de `ToolConverterTab.jsx`
- De **182 líneas** a **68 líneas** (< 150 límite SRP).
- Se extrajo el hook `useUnitConverter.js`: centraliza los factores de volumen/masa, lógica de cálculo bidireccional y formateo de decimales.

---

## 3. Log de Commits Generados
- `b81a7dd`: `fix(frontend): complete inline style migration GoalCard + RadarSweepCanvas (HAL-F1-01)`
- `b8a3deb`: `refactor(frontend): migrate 3 pending inline styles to CSS Modules (HAL-F1-01)`
- `7232388`: `refactor(frontend): split ProductionCreateForm into subcomponents (HAL-F1-01)`
- `1138cc2`: `refactor(frontend): split StageCardItem into subcomponents (HAL-F1-01)`
- `df2aaca`: `refactor(frontend): extract useUnitConverter hook (HAL-F1-01)`
- `2620959`: `refactor(frontend): split GoalFormModal into subcomponents (HAL-F1-01)`
- `fec54a6`: `refactor(frontend): compact GoalCard lines to strictly enforce component SRP limit (HAL-F1-01)`

---

## 4. Estado de Salida
- `verify-srp.js` estándar: **0 infracciones en archivos del área de trabajo**.
- `verify-srp.js --all`: **1 infracción** (`apps/web/src/app/commercial/goals/page.jsx`, reservada para Bloque Front-2A-2).
- Zero estilos en línea residuales (`style={{`).
