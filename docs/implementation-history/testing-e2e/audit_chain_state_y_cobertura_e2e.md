# AUDITORÍA FORENSE DEL CHAIN-STATE Y COBERTURA E2E EXISTENTE

**Fecha de Auditoría:** 24 de Septiembre de 2026  
**Entorno:** E2E Playwright (`apps/web/e2e/`)  
**Estado General:** COMPLETADO  

---

## 1. Chain-State Actual (`apps/web/e2e/.test-data/*.json`)

Auditoría directa sobre el sistema de archivos de persistencia compartida:

| Archivo | Claves Principales (Keys) | Valores Actuales (IDs / Nombres) | Escrito Por (Spec Origen) |
| :--- | :--- | :--- | :--- |
| `presentations.json` | `presentacionesCreadas.MASTER_BOTELLA_250`, `timestamp` | `id: "16f1bc3e-3503-4644-b2db-1a40e78a0dba"`, `nombre: "E2E_CHAIN_PRES_BOTELLA_250_1790272295331"` | `apps/web/e2e/presentations/presentations-basics.spec.js` |
| `suppliers.json` | `proveedoresCreados.MASTER_PROVEEDOR_LACTEOS`, `timestamp` | `id: "cee0a3ec-7864-4727-93df-1f00be246bcd"`, `nombre: "E2E_CHAIN_SUPPLIER_LACTEOS_1790272919035"`, `nit: "9009190358"` | `apps/web/e2e/suppliers/suppliers-chain.spec.js` |
| `supplies.json` | `insumosCreados.MASTER_LECHE_LITROS`, `timestamp` | `id: "a984a36c-629c-4b7c-97aa-acf7cb1be387"`, `nombre: "E2E_CHAIN_SUPPLY_LECHE_ENTERA_1790273070328"`, `unidadBase: "l"` | `apps/web/e2e/supplies/supplies-chain.spec.js` |
| `purchases.json` | `comprasCreadas.MASTER_COMPRA_LECHE`, `timestamp` | `id: "4cf0b038-db63-4e2e-86eb-f7ac38e75b14"`, `cantidadEmpaques: 5`, `total: 16000` | `apps/web/e2e/purchases/purchases-chain.spec.js` |

---

## 2. Contrato de `apps/web/e2e/helpers/chain-state.js`

El helper implementa el almacenamiento síncrono en disco basado en Node.js `fs` y `path`:

- **Formato:** Archivos `.json` legibles con indentación de 2 espacios (`JSON.stringify(data, null, 2)`).
- **Directorio de datos:** `apps/web/e2e/.test-data/`
- **Funciones exportadas (`module.exports`):**
  1. `saveChainState(moduleName, data)`: Crea el directorio si no existe y serializa el estado a `<moduleName>.json`.
  2. `loadChainState(moduleName)`: Retorna el objeto deserializado o `null` si el archivo no existe.
  3. `clearChainState(moduleName)`: Elimina el archivo `<moduleName>.json` físicamente.
  4. `cleanupByPrefix(request, resource, prefix = 'E2E_')`: Limpia entidades residuales en la API antes o después de la ejecución.

---

## 3. Inventario Completo de Specs E2E

Total de specs auditados: **32 archivos**.

| Ruta Relativa | Líneas | test.describe | Rango T/C | Cobertura en Prompts |
| :--- | :---: | :--- | :---: | :--- |
| `e2e/supplier-prices/supplier-prices-tabla.spec.js` | 86 | Precios Proveedores - Tabla Principal | T01-T10 | Prompt 01-03 (Completo) |
| `e2e/supplier-prices/supplier-prices-modal-flow.spec.js` | 140 | Precios Proveedores - Cascada y Poka-Yoke | T01-T15 | Prompt 01-03 (Completo) |
| `e2e/supplier-prices/supplier-prices-modal-calc.spec.js` | 55 | Precios Proveedores - Cálculos Matemáticos e IVA | C01-C08 | Prompt 01-03 (Completo) |
| `e2e/supplies/supplies-basics.spec.js` | 117 | Catálogo Insumos - Creación Básica | T01-T05 | Suites previas |
| `e2e/supplies/supplies-chain.spec.js` | 83 | Insumos - Cadena de Valor (Escribe Chain) | T01-T03 | Base para Compras |
| `e2e/supplies/supplies-duplicates.spec.js` | 95 | Insumos - Detección de Duplicados | T01-T04 | Poka-yoke |
| `e2e/supplies/supplies-flow-and-density.spec.js` | 111 | Insumos - Flujo y Densidad | T01-T05 | Cálculos |
| `e2e/supplies/supplies-validations.spec.js` | 112 | Insumos - Validaciones de Formulario | T01-T06 | Validaciones |
| `e2e/supplies/supplies-advanced.spec.js` | 103 | Insumos - Operaciones Avanzadas | T01-T04 | Avanzados |
| `e2e/suppliers/suppliers-basics.spec.js` | 116 | Catálogo Proveedores - Operaciones Básicas | T01-T06 | Suites previas |
| `e2e/suppliers/suppliers-chain.spec.js` | 83 | Proveedores - Cadena de Valor (Escribe Chain) | T01-T03 | Base para Compras |
| `e2e/suppliers/suppliers-poka-yoke.spec.js` | 118 | Proveedores - Poka-Yoke | T01-T05 | Poka-yoke |
| `e2e/suppliers/suppliers-validation.spec.js` | 135 | Proveedores - Validaciones Estrictas | T01-T06 | Validaciones |
| `e2e/presentations/presentations-basics.spec.js` | 149 | Presentaciones - Básico (Escribe Chain) | T01-T06 | Base para Producción |
| `e2e/presentations/presentations-advanced.spec.js` | 122 | Presentaciones - Avanzado | T01-T05 | Avanzados |
| `e2e/purchases/purchases-chain.spec.js` | 125 | Compras - Cadena de Valor (Lee y Escribe Chain) | T01-T04 | Dependencia de Insumo/Prov |
| `e2e/purchases/purchases-basics.spec.js` | 70 | Compras - Básico | T01-T03 | Operaciones |
| `e2e/purchases/purchases-calculations.spec.js` | 199 | Compras - Cálculos de Impuestos y Costos | T01-T08 | Cálculos |
| `e2e/purchases/purchases-poka-yoke.spec.js` | 42 | Compras - Reglas Poka-Yoke | T01-T03 | Poka-yoke |
| `e2e/purchases/purchases-stock.spec.js` | 48 | Compras - Afectación de Stock | T01-T02 | Inventarios |
| `e2e/purchases/purchases-totals.spec.js` | 47 | Compras - Totales de Orden | T01-T02 | Cálculos |
| `e2e/purchases/purchases-validation.spec.js` | 103 | Compras - Validaciones | T01-T04 | Validaciones |
| `e2e/exhaustive/*.spec.js` (7 specs) | 30-70 | Smoke Tests Transversales Exhaustivos | E01-E05 | Exhaustivos (Smoke) |
| `e2e/remediation-poka-yoke.spec.js` | 131 | Remediación General Poka-Yoke | R01-R06 | Suite de contingencia |
| `e2e/suppliers-complete.spec.js` | 102 | Proveedores Completo | S01-S04 | Integración |
| `e2e/value-chain-complete.spec.js` | 39 | Cadena de Valor Completa | V01-V03 | Smoke |

---

## 4. Grafo de Dependencias (Chain-State)

```text
[supplies-chain.spec.js] ──────► Escribe: supplies.json
                                     │
[suppliers-chain.spec.js] ─────► Escribe: suppliers.json
                                     │
                                     ▼
                        [purchases-chain.spec.js] (Lee supplies y suppliers)
                                     │
                                     ▼
                              Escribe: purchases.json
                                     │
                                     ▼
                        [value-chain-complete.spec.js] (Lee purchases.json)
```

### Puntos de Quiebre Detectados:
- `purchases-chain.spec.js` depende críticamente de que existan `supplies.json` y `suppliers.json`. Si no se ejecutan previamente los specs de chain de insumos y proveedores, la suite de compras en cadena no puede enlazar IDs reales y lanza fallback a base de datos o falla.
- La suite recién completada de **`supplier-prices/` NO depende de `chain-state.js`**: opera de manera autónoma resolviendo los datos mediante los comboboxes y la base de datos viva, lo cual garantiza que sea 100% aislada e idempotente.

---

## 5. Huecos de Cobertura (Prompts 04 a 07)

| Flujo / Funcionalidad | Prompt | Estado Actual | Detalle del Diagnóstico |
| :--- | :---: | :---: | :--- |
| **Carrito Global (Header):** Dropdown multi-lista, badge reactivo en header, cambio de lista activa, advertencia de duplicados. | **Prompt 04** | **SIN COBERTURA** | Solo existe el helper base `cart-toggle.js`, pero ningún spec en `e2e/` lo invoca ni testea el dropdown del header. |
| **Checklist Operativo:** Marcar Conseguido / No Conseguido, motivo obligatorio en No Conseguido, botón Añadir Pendiente, Editar condiciones, Mover a otra Lista. | **Prompt 05** | **SIN COBERTURA** | Solo existe el helper base `checklist-item.js`. No existe archivo `checklist.spec.js`. |
| **Gestión de Listas y Fusión:** Botón Fusionar Listas, validación de $\ge 2$ listas seleccionadas, modal de confirmación, renombrado y eliminación. | **Prompt 06** | **SIN COBERTURA** | Solo existe el helper base `order-merge.js`. No existen specs para fusión ni CRUD de listas de compras. |
| **Flujo Completo E2E Integrado:** Cotización en Precios Proveedores $\rightarrow$ Envío al Carrito $\rightarrow$ Generación de Orden $\rightarrow$ Verificación en Checklist $\rightarrow$ Fusión de Listas. | **Prompt 07** | **SIN COBERTURA** | No existe el spec maestro end-to-end transversal que conecte todos los eslabones. |

---

## 6. Helpers Existentes y Reutilización

| Helper (`apps/web/e2e/helpers/`) | Exports Principales | Propósito | Reutilizable para Prompts 04-07 |
| :--- | :--- | :--- | :---: |
| `supplier-price-form.js` | `fillSupplierPriceForm` | Llenado Poka-Yoke y defensivo de cotizaciones | **SÍ (Prompt 07)** |
| `cart-toggle.js` | `toggleCartItem` | Añadir/quitar insumo del carrito desde tabla | **SÍ (Prompt 04 y 07)** |
| `checklist-item.js` | `markChecklistItemStatus` | Marcar estado conseguido/no conseguido y motivo | **SÍ (Prompt 05 y 07)** |
| `order-merge.js` | `executeOrderMerge` | Seleccionar órdenes y ejecutar merge modal | **SÍ (Prompt 06 y 07)** |
| `chain-state.js` | `saveChainState`, `loadChainState` | Persistencia entre fases del pipeline | **SÍ (Prompt 07)** |
| `safe-visible.js` | `safeIsVisible` | Verificación tolerante de visibilidad | **SÍ (04, 05, 06, 07)** |
| `purchase-helpers.js` | `fillRowItem` | Llenar items de compra tabular | **SÍ (Prompt 07)** |

### Helpers que faltan crear:
- `cart-header.js`: Helper para abrir el dropdown del carrito desde el Navbar, cambiar lista activa y leer el badge numérico.
- `list-management.js`: Helper para crear listas nombradas, renombrarlas y eliminarlas en la vista operativa.

---

## 7. Recomendación de Orden Estratégico

Dado el grafo de dependencias de la aplicación y la arquitectura de compra asistida, el orden natural y libre de fricción es:

1. **PROMPT 04 (Carrito Global):**  
   Permite testear la interacción atómica del carrito desde el catálogo de precios de proveedor antes de pasar a la pantalla de recepción/orden.
2. **PROMPT 05 (Checklist Operativo):**  
   Prueba la vista operativa y las transiciones de estado de los items una vez añadidos a la lista.
3. **PROMPT 06 (Listas y Fusión):**  
   Prueba la consolidación de múltiples listas y resolución de conflictos.
4. **PROMPT 07 (Flujo Completo Transversal):**  
   Integra toda la cadena aprovechando los 3 anteriores y el chain-state.

---

## 8. Estado de la Auditoría
**`[COMPLETADO]`** — Se ejecutaron 5 lecturas/consultas específicas sin ediciones (0 violaciones de cuota).
