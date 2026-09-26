# Auditoría Técnica Forense: Módulo 6 - Finanzas y Metas Empresariales

## 1. Resumen de Base de Datos
- **Tablas involucradas:**
  - `Configuracion_Empresa` (`ConfiguracionEmpresa`): Identidad corporativa, datos fiscales (NIT, holding) y parámetros de rotulado/facturación.
  - `Gastos` (`Gasto`): Egresos operativos y administrativos categorizados por período.
  - `Metas_Empresariales` (`MetaEmpresarial`): Objetivos estratégicos, sueños patrimoniales y asignación de flujo de caja.
  - `Aportes_Metas` (`AporteMeta`): Registros de capital o amortización aplicados a cada meta.
- **Campos clave y llaves foráneas:**
  - `MetaEmpresarial.metaPadreId` -> `MetaEmpresarial.id` (Relación autorreferencial `@relation("JerarquiaMetas")` para desglose de macro-objetivos en submetas).
  - `AporteMeta.metaId` -> `MetaEmpresarial.id` con directiva `onDelete: Cascade`.
  - `ConfiguracionEmpresa`: Registro singleton con defaults precargados (MANNÁ / GUERRERO PRADO HOLDING COMPANY FAMILY S.A.S.).
- **Enums y Restricciones:**
  - Enums nativos en PostgreSQL:
    - `TipoAmbito` (`PERSONAL_FAMILIAR`, `EMPRESARIAL`)
    - `CategoriaSueno` (`CASA_CAMPESTRE`, `CAMIONETA_TRABAJO`, `BIENESTAR_FAMILIAR`, `EXPANSION_PLANTA`, `CAPITAL_TRABAJO`, `OTRO`)
- **Consistencia de tipos numéricos (`Decimal` vs `Int`):**
  - Valor objetivo de metas: `valorObjetivo` configurado en `@db.Decimal(14, 2)` (soporte de alta cifra para proyectos de expansión y adquisición de maquinaria).
  - Porcentaje de flujo: `porcentajeFlujo` como `@db.Decimal(5, 2)`.
  - Montos: `Gasto.valor` y `AporteMeta.monto` en `@db.Decimal(12, 2)`.
  - Prioridad: `ordenPrioridad` en `Int?`.

---

## 2. Matriz de Endpoints

### 2.1 Configuración de Empresa (`/company-config`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/company-config` | Ninguno (retorna datos institucionales y membretes) | `200 OK` | `500 Internal Error` |
| `PUT` | `/company-config` | Body: Parámetros a actualizar (NIT, lemas, redes, holding) | `200 OK` | `400 Bad Request` |

### 2.2 Gastos Operativos (`/expenses`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/expenses` | Body: `CreateExpenseDto` (`fecha`, `categoria`, `descripcion`, `valor`, `tipoGasto`, `periodo`) | `201 Created` | `400 Bad Request` |
| `GET` | `/expenses` | Ninguno | `200 OK` | `500 Internal Error` |
| `GET` | `/expenses/:id` | Param: `id` | `200 OK` | `404 Not Found` |

### 2.3 Metas y Fondos (`/goals`)
| Método | Ruta | Parámetros / Payload | Status Code Éxito | Códigos Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/goals` | Ninguno (árbol jerárquico de metas con sus aportes acumulados) | `200 OK` | `500 Internal Error` |
| `GET` | `/goals/available-funds` | Ninguno (cálculo de liquidez y fondos disponibles para asignación) | `200 OK` | `500 Internal Error` |
| `GET` | `/goals/:id` | Param: `id` | `200 OK` | `404 Not Found` |
| `POST` | `/goals` | Body: `CreateGoalDto` | `201 Created` | `400 Bad Request` |
| `POST` | `/goals/:id` | Param: `id`, Body: `UpdateGoalDto` (alias de actualización) | `200 OK` | `400 / 404` |
| `PUT` | `/goals/:id` | Param: `id`, Body: `UpdateGoalDto` | `200 OK` | `400 / 404` |
| `POST` | `/goals/:id/contribute` | Param: `id`, Body: `{ monto, fecha, nota }` | `201 Created` | `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/goals/:id` | Param: `id` (desactivación lógica / baja de meta) | `200 OK` | `400 / 404` |

---

## 3. Validaciones y DTOs
- **Validación de Jerarquía y Ámbitos:**
  - Valida coherencia entre `ambito` y `estrategiaAsignacion`: Si el ámbito es `PERSONAL_FAMILIAR`, la estrategia por defecto se fuerza a `MANUAL`.
  - `AporteMeta`: Valida que el `monto` aportado sea estrictamente mayor a 0 (`Min(0.01)`).
- **Control de Configuración Empresarial:**
  - Se asegura que siempre exista al menos un registro en la tabla `Configuracion_Empresa`, operando en modo *upsert* o recuperación de la primera fila existente.

---

## 4. Lógica de Negocio y Transaccionalidad
- **Disponibilidad de Fondos (`getAvailableFunds`):**
  - Realiza un balance consolidado entre el total de cobros efectivos registrados en `Pagos`, los egresos de `Compras` finalizadas y los gastos registrados en `Gastos`, restando los aportes ya comprometidos en metas para obtener la bolsa neta disponible de reinversión.
- **Aportes y Cascada Transaccional:**
  - El ingreso de aportes a metas mediante `contribute()` se registra con su timestamp y nota, recalculando el avance porcentual frente al `valorObjetivo`.
  - Si una meta padre se desactiva, las submetas subordinadas pueden quedar huérfanas en visualización si no se filtran explícitamente mediante el campo `activo: true`.

---

## 5. Manejo de Errores
- Respuestas uniformizadas mediante `GlobalExceptionFilter`.
- El controlador de metas captura posibles fallos de parseo de fechas (`new Date(data.fechaInicio)`) o conversiones de moneda evitando caídas del runtime.

---

## 6. Vulnerabilidades y Brechas Detectadas
1. **Rutas Duplicadas de Modificación en GoalsController:**
   - Coexisten simultáneamente `POST /goals/:id` y `PUT /goals/:id` ejecutando la misma lógica (`update`). Esto genera redundancia y ambigüedad en la semántica REST de la API.
2. **Ausencia de Endpoints de Actualización (`PATCH`/`PUT`) y Borrado en Gastos:**
   - `ExpensesController` únicamente expone `POST`, `GET` y `GET /:id`. Un operario no puede corregir un error tipográfico en un gasto sin recurrir a base de datos directa.
3. **Escalabilidad de Cálculo Financiero en Memoria:**
   - `getAvailableFunds()` realiza agregaciones leyendo múltiples tablas sin queries de agregación SQL nativas (`prisma.$queryRaw` o `groupBy`), lo cual impactará el tiempo de respuesta conforme aumenten los años de operación de la planta.
