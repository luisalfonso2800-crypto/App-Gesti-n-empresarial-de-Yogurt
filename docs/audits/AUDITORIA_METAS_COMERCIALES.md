# Auditoría Estructural del Módulo de Metas Comerciales (Rumbo MANNÁ)

> **Documento:** Auditoría técnica estática de endpoints, modelo de persistencia y componentes de interfaz de Metas y Sueños  
> **Fecha:** 25 de Septiembre de 2026  
> **Alcance:** `apps/api/src/goals/` y `apps/web/src/app/commercial/goals/`  
> **Modo:** Inspección Estática (Solo Lectura)

---

## 1. Contrato de Endpoints Backend

### 1.1 Rutas Expuestas (`GoalsController`)
El controlador NestJS está montado bajo el prefijo `/goals` (`/api/v1/goals` en la API):
- `GET /api/v1/goals`: Consulta todas las metas activas con jerarquía (subMetas, metaPadre, aportes).
- `GET /api/v1/goals/available-funds`: Calcula los fondos disponibles para asignar (Utilidad Neta Operativa menos aportes reservados).
- `GET /api/v1/goals/:id`: Retorna una meta por su UUID.
- `POST /api/v1/goals`: Registra una nueva meta comercial o sueño personal/familiar.
- `PUT /api/v1/goals/:id` (o `POST /api/v1/goals/:id`): Actualiza una meta existente.
- `POST /api/v1/goals/:id/contribute`: Registra un aporte financiero a una meta.
- `DELETE /api/v1/goals/:id`: Eliminación lógica de una meta (`activo: false`).

### 1.2 Modelo Prisma y Payload (`POST /api/v1/goals`)
El modelo en base de datos es `MetaEmpresarial` (`@@map("Metas_Empresariales")`).
```json
{
  "titulo": "EXPANSIÓN PLANTA YOGURT",
  "descripcion": "Adquisición de nueva envasadora y tanques de fermentación",
  "ambito": "EMPRESARIAL",
  "categoriaSueno": "EXPANSION_PLANTA",
  "tipoMetrica": "VENTAS_TOTALES",
  "estrategiaAsignacion": "MANUAL",
  "porcentajeFlujo": 10,
  "ordenPrioridad": 1,
  "valorObjetivo": 25000000,
  "horizonte": "MEDIANO_PLAZO",
  "fechaInicio": "2026-09-01T00:00:00.000Z",
  "fechaFin": "2026-12-31T00:00:00.000Z",
  "observaciones": "Meta estratégica Q4"
}
```

* **Validaciones y Tipos de Datos:**
  - `titulo`: Cadena requerida (no vacía).
  - `ambito`: `'EMPRESARIAL'` o `'PERSONAL_FAMILIAR'`.
  - `categoriaSueno`: Categoría temática (`EXPANSION_PLANTA`, `BIENESTAR_FAMILIAR`, `EDUCACION`, `VIAJES`, `FONDO_EMERGENCIA`, `OTRO`).
  - `tipoMetrica`: `'VENTAS_TOTALES'`, `'LITROS_VENDIDOS'`, `'UTILIDAD_NETA'`, etc.
  - `valorObjetivo`: Monto numérico o Decimal positivo representativo del objetivo financiero.
  - `fechaInicio` / `fechaFin`: Fechas válidas en formato ISO o YYYY-MM-DD convertibles con `new Date()`.

---

## 2. Componentes y Selectores en Frontend (`/commercial/goals`)

### 2.1 Vista Principal (`GoalsPage`)
- **Cabecera y Disparador:**
  - Botón en cabecera: `button:has-text("Sembrar Nuevo Sueño")` (con icono `Plus`).
  - Botón en estado vacío: `button:has-text("Sembrar Primera Meta")`.
- **Banner de Fondos Disponibles:**
  - Muestra `Fondos Disponibles para Asignar`, `Utilidad Neta` y `Aportes Reservados`.
- **Sección de Propósito:**
  - Renderiza `PurposeDedicationSection`.
- **Listado de Tarjetas:**
  - Renderiza `GoalCard` para cada meta activa, permitiendo editar, abonar (`ContributeModal`) o eliminar.

### 2.2 Modal de Creación/Edición (`GoalFormModal.jsx`)
- **Contenedor y Accesibilidad:**
  - Renderiza `<div className={styles.modalBackdrop} role="dialog" aria-modal="true">`.
  - Título dinámico: `h2:has-text("Sembrar Nueva Meta o Sueño")` o `h2:has-text("Editar Meta o Sueño")`.
- **Selectores e Inputs (`GoalFormFields.jsx`):**
  - Título: `input[name="titulo"]`.
  - Ámbito: selectores/radios de ámbito (`EMPRESARIAL` vs `PERSONAL_FAMILIAR`).
  - Valor Objetivo: `input[name="valorObjetivo"]`.
  - Fecha Fin: `input[name="fechaFin"]`.
  - Descripción: `textarea[name="descripcion"]` o input.
- **Acciones y Cierre:**
  - Botón de guardado: `button:has-text("Sembrar Objetivo")` (o `button:has-text("Guardar Cambios")`).
  - Botón cancelar: `button:has-text("Cancelar")`.
  - Botón de cierre en cabecera: `button[aria-label="Cerrar"]` (icono `X`).

---

## 3. Casos Clave para Pruebas (API + E2E)

### 3.1 Suite de Integración API (`goals-api-integration.spec.js`)
1. **GOAL-API-01: Consulta de Metas (`GET /api/v1/goals`)**
   - Retorna código 200 y una lista (array) de metas activas.
2. **GOAL-API-02: Consulta de Fondos Disponibles (`GET /api/v1/goals/available-funds`)**
   - Retorna código 200 y objeto con `fondosDisponibles` y `utilidadNetaOperativa`.
3. **GOAL-API-03: Creación Exitosa (`POST /api/v1/goals`)**
   - Envía payload con `titulo`, `valorObjetivo`, `fechaInicio`, `fechaFin` y retorna 201 Created con el ID asignado.
4. **GOAL-API-04: Consulta Unitaria por ID (`GET /api/v1/goals/:id`)**
   - Recupera la meta creada confirmando consistencia en título y valor objetivo.

### 3.2 Suite E2E Visual (`goals-flow.spec.js`)
1. **GOAL-E2E-01: Navegación y Carga Inicial**
   - Accede a `/commercial/goals` y valida visibilidad del botón "Sembrar Nuevo Sueño" (o "Sembrar Primera Meta") y banner de propósito/fondos.
2. **GOAL-E2E-02: Apertura del Modal de Creación**
   - Clic en el botón disparador y validación del título `Sembrar Nueva Meta o Sueño`.
3. **GOAL-E2E-03: Validación de Inputs Clave**
   - Confirmar visibilidad de `input[name="titulo"]`, `input[name="valorObjetivo"]` y `input[name="fechaFin"]`.
4. **GOAL-E2E-04: Cierre Limpio**
   - Clic en "Cancelar" o en `button[aria-label="Cerrar"]` y verificar que el diálogo desaparece completamente (`toBeHidden()`).
