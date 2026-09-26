# Respuestas Técnicas y Radiografía del Proyecto E2E / Arquitectura

Este documento recopila la información solicitada sobre la estructura de pruebas, convenciones, reglas, scripts, prompts y configuración del ERP MANNÁ.

---

## 1. Estructura Real de Carpetas de los Tests E2E

Las pruebas de extremo a extremo residen bajo `apps/web/e2e/`. Cada módulo cuenta con su carpeta temática con sub-suites modulares de menos de 140-150 líneas para evitar archivos gigantes y asegurar paralelismo seguro:

```text
apps/web/e2e/
├── .test-data/                                    # Estado compartido y persistencia entre tests
│   ├── presentations.json
│   ├── purchases.json
│   ├── suppliers.json
│   └── supplies.json
├── helpers/                                       # Utilitarios compartidos de automatización
│   ├── chain-state.js                             # Limpieza y propagación de estado
│   ├── check-e2e-limits.js                        # Linter de tamaño de tests (<140 líneas)
│   ├── exhaustive-helpers.js                      # Helpers para la suite transversal
│   ├── presentation-modal.js                      # Interacción con modales de presentaciones
│   ├── purchase-form.js                           # Acciones y localizadores del formulario compras
│   ├── purchase-helpers.js                        # Helpers de cálculos y totales
│   ├── safe-visible.js                            # Verificación no bloqueante con timeout
│   ├── supplier-form.js                           # Interacción con formulario proveedores
│   ├── supplier-modal.js                          # Manejador de modal proveedores
│   ├── supply-form.js                             # Formulario de insumos y cascada
│   └── supply-modal.js                            # Apertura y cierre de modal insumos
├── exhaustive/                                    # Suite transversal de punta a punta (7 specs)
│   ├── catalog-01-supplies-categories.spec.js
│   ├── catalog-02-presentations-flavors.spec.js
│   ├── catalog-03-suppliers-clients-prices.spec.js
│   ├── commercial-01-orders-shipments.spec.js
│   ├── commercial-02-invoicing-receivables.spec.js
│   ├── operations-01-purchases-production.spec.js
│   └── operations-02-packaging-waste-inventory.spec.js
├── presentations/                                 # Módulo Presentaciones
│   ├── presentations-basics.spec.js
│   └── presentations-advanced.spec.js
├── purchases/                                     # Módulo Compras (58 tests)
│   ├── purchases-basics.spec.js                   # T01-T08 (UI y navegación)
│   ├── purchases-validation.spec.js               # T09-T18 (Validaciones requeridas)
│   ├── purchases-totals.spec.js                   # T19-T24 (Totales e IVA)
│   ├── purchases-stock.spec.js                    # T25-T29 (Drawer de existencias)
│   ├── purchases-poka-yoke.spec.js                # T30-T33 (Persistencia y protecciones)
│   ├── purchases-chain.spec.js                    # T34 (Compra Maestra)
│   └── purchases-calculations.spec.js             # C01-C07 (Motor de empaques y conversiones)
├── suppliers/                                     # Módulo Proveedores
│   ├── suppliers-basics.spec.js
│   ├── suppliers-validation.spec.js
│   ├── suppliers-poka-yoke.spec.js
│   └── suppliers-chain.spec.js
├── supplies/                                      # Módulo Insumos
│   ├── supplies-basics.spec.js                    # T01-T14
│   ├── supplies-advanced.spec.js                  # T15-T25
│   ├── supplies-validations.spec.js               # T26-T36
│   ├── supplies-duplicates.spec.js                # T37-T43
│   ├── supplies-flow-and-density.spec.js          # Asistente de densidad
│   └── supplies-chain.spec.js                     # T44 (Insumo Maestro)
├── remediation-poka-yoke.spec.js                  # Suite de remediación
├── suppliers-complete.spec.js                     # Suite legacy consolidada
├── value-chain-complete.spec.js                   # Cadena de Valor Punta a Punta (Flujo completo)
└── playwright.config.js                           # Configuración global Playwright (puerto 3000, 30s timeout)
```

---

## 2. Convenciones de Nombrado de Tests

Los nombres se estructuran con prefijos nemotécnicos numéricos para trazabilidad unívoca:
- **`T##` (Tests Funcionales / UI / Integración):**
  - Ejemplos: `T01 - Encabezado Compras visible en página principal`, `T30 - Campo Marca transforma texto a MAYÚSCULAS`.
  - Numeración consecutiva agrupada temáticamente (`T01-T08` UI básica, `T09-T18` validaciones de submit, `T25-T29` drawers, `T30-T33` Poka-Yoke).
- **`C##` (Cálculos y Conversiones de Planta):**
  - Pruebas matemáticas de conversión de unidades, factores de empaque y precisión de decimales.
  - Ejemplo: `C01 - Masa entera: BULTO x 50 kg x 2 -> Ingreso Neto: 100 kg`.
- **Estructura del `test.describe`:**
  - Se define con el formato formal de la suite:
    `test.describe.serial('Compras - Validaciones Básicas de UI (T01-T08)', () => { ... })`
    `test.describe.serial('Compras - Motor de Cálculos, Empaques, Conversiones e Impuestos', () => { ... })`

---

## 3. Formato y Ubicación de Prompts

Los prompts de control para Antigravity se guardan de forma centralizada en:
📁 **`.agents/prompts/`** (y alternativamente en la raíz para tareas inmediatas como `fix-....md`).

### Secciones fijas del formato de Prompt Estricto:
1. **OBJETIVO TÉCNICO:** Metas puntuales y medibles.
2. **FUENTES DE VERDAD A INSPECCIONAR (MÁXIMO N LECTURAS):** Lista exacta de archivos a revisar para no desbordar tokens.
3. **REGLAS DE CUOTA ESTRICTA:** Restricción de lecturas/ediciones, veto a código de producción (si es test) o veto a tests (si es UI), prohibición de búsquedas masivas.
4. **ACCIONES A EJECUTAR:** Pasos o código específico a sustituir.
5. **VERIFICACIÓN:** Comandos estáticos de validación (`node --check`, `verify-srp.js`).
6. **CRITERIO DE TERMINACIÓN Y DETENCIÓN:** Condiciones de aceptación y orden de paro inmediato.
7. **REPORTE FINAL REQUERIDO:** Plantilla del reporte de cierre.

---

## 4. Archivos de Reglas del Proyecto (`.agents/rules/`)

El índice maestro reside en [`AGENTS.md`](file:///C:/Proyects/App-Gesti-n-empresarial-de-Yogurt/AGENTS.md) y se divide en 7 módulos especializados bajo `.agents/rules/`:

| Archivo | Ámbito de Aplicación |
| :--- | :--- |
| **`01-core-execution.md`** | Principio fundamental, entorno pnpm, criterio de finalización y gobernanza. |
| **`02-backend-database.md`** | Prisma, PostgreSQL, NestJS/Express, Controller-Service-Repository, seeds. |
| **`03-frontend-architecture.md`** | Arquitectura 3 capas, SRP (<120 líneas en page, <150 en modales), JSDoc, CSS Modules, no inline styles. |
| **`04-design-system-manna.md`** | Paleta MANNÁ (`#182622`, Pergamino, Oro), Veto Anti-Blue en botones de negocio, ergonomía de planta, AssistedEmptyState. |
| **`05-forms-and-modals.md`** | Poka-Yoke, UPPERCASE en códigos/marcas, máscaras COP/NIT/Tel, SmartModal, números a letras. |
| **`06-circuit-breaker-and-anti-loop.md`** | Tope 2 reintentos, umbral de líneas, aislamiento hermético frontend/backend, bloqueo anti-bucle. |
| **`07-token-efficiency-and-tool-budget.md`** | Máximo 1 lectura por archivo, presupuesto 4-6 lecturas, ejecución quirúrgica y cierre inmediato. |

---

## 5. Scripts de Verificación Disponibles

Ubicados en `.agents/scripts/` y scripts del `package.json`:

1. **`node .agents/scripts/verify-srp.js`** *(o `pnpm run verify:srp`)*:
   - Audita líneas por archivo (<120 en páginas, <150 en modales).
   - Valida la ausencia de estilos inline (`style={{}}`).
   - Verifica la existencia y pureza de los archivos `.module.css`.
2. **`node apps/web/e2e/helpers/check-e2e-limits.js`** *(o `pnpm --filter web run test:e2e:lint`)*:
   - Verifica que los archivos E2E `.spec.js` no superen el límite arquitectural de líneas (<140-150 líneas) y no contengan bucles ciegos.
3. **`node .agents/scripts/run-e2e-selector.js`** *(o `pnpm run test:e2e:select`)*:
   - Menú interactivo por consola en Node.js para ejecutar suites E2E completas con una tecla.
4. **`node --check <archivo.js>`**:
   - Validación sintáctica nativa de Node.js para scripts y archivos de tests `.spec.js`.

---

## 6. Modelo y Effort por Defecto

- **Configuración estándar:**
  - **Modelo:** `Gemini 3.8 Flash`
  - **Effort:** `Low` (baja latencia y máxima rapidez de respuesta).
- **Criterio de uso:**
  - Se utiliza `Flash (Low)` para el 90% de tareas: fixes de tests, alineaciones visuales de CSS, refactors SRP y diagnósticos dirigidos.
  - Solo se eleva a modelo superior o `Effort: Medium/High` cuando se realizan rediseños profundos de bases de datos relacionales o algoritmos de planificación multi-etapa.

---

## 7. Formato de Respuesta Estándar de Antigravity

El formato oficial de cierre es conciso y sin redundancia:

```markdown
### REPORTE FINAL REQUERIDO
1. **Archivos modificados y líneas resultantes:** Lista con hipervínculos markdown y recuento de líneas.
2. **Cambio técnico aplicado:** Resumen en 2-3 viñetas del código alterado.
3. **Resultado de validaciones:** Salida de `verify-srp.js` o `check-e2e-limits.js`.
4. **Comando de prueba:** Comando exacto de una línea para el operador humano.
5. **Estado:** [COMPLETADO / BLOQUEADO].
```

---

## 8. Nomenclatura Oficial de Módulos del ERP MANNÁ

Estructura formal del Sidebar y la barra de navegación:

1. **GENERAL:**
   - `Dashboard` (`/dashboard`)
   - `Alarmas SCADA` (`/dashboard?channel=ALARMS`)
2. **CATÁLOGOS:**
   - `Presentaciones` (`/catalog/presentations`)
   - `Insumos` (`/catalog/supplies`)
   - `Proveedores` (`/catalog/suppliers`)
   - `Precios de Prov.` (`/catalog/supplier-prices`)
   - `Productos` (`/catalog/products`)
   - `Recetas` (`/catalog/recipes`)
3. **OPERACIONES:**
   - `Compras` (`/operations/purchases`)
   - `Inventario` (`/operations/inventory`)
   - `Producción` (`/operations/production`)
   - `Lotes` (`/operations/lots`)
4. **COMERCIAL:**
   - `Clientes` (`/commercial/clients`)
   - `Ventas` (`/commercial/sales`)
   - `Pagos/Cobros` (`/commercial/payments`)
   - `Gastos` (`/commercial/expenses`)
   - `Rumbo MANNÁ` (`/commercial/goals`)

---

## 9. Comandos E2E Habituales

- **Suite completa de un módulo:**
  ```bash
  pnpm --filter web exec playwright test purchases/ --reporter=list
  pnpm --filter web exec playwright test supplies/ --reporter=list
  ```
- **Con interfaz gráfica visible (Headed):**
  ```bash
  pnpm --filter web exec playwright test purchases/ --headed
  ```
- **Filtro puntual por nombre del test (`-g`):**
  ```bash
  pnpm --filter web exec playwright test purchases/ -g "T01" --reporter=list
  ```
- **Modo Debug con inspector paso a paso:**
  ```bash
  pnpm --filter web exec playwright test purchases/purchases-chain.spec.js --debug
  ```
- **Ver reporte visual interactivo generado:**
  ```bash
  pnpm --filter web exec playwright show-report apps/web/playwright-report
  ```

---

## 10. Estado y Convenciones de Git

- **Rama activa actual:** `test/e2e-by-module`
- **Convención de commits:** Conventional Commits en minúsculas y modo imperativo:
  - `feat(<módulo>): descripción` (ej. `feat(purchases): 58/58 E2E passing...`)
  - `fix(<módulo>): descripción`
  - `refactor(<módulo>): descripción`
  - `chore(<módulo>): descripción`
- **Estado de trabajo:**
  - Compras y Header estabilizados.
  - Insumos y suites exhaustivas en proceso de alineación en rama local.
