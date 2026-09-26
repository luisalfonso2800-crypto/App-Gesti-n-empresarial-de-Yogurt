TAREA CONTROLADA — AUDITORÍA FORENSE FULLSTACK (5 FOCOS): PRECIOS, CARRITO GLOBAL, CHECKLIST, GESTIÓN DE LISTAS Y PERSISTENCIA

OBJETIVO TÉCNICO:
Levantar el mapa forense de selectores exactos, contratos de datos, ciclo de vida del carrito y reglas Poka-Yoke antes de redactar los tests E2E para los 5 focos interconectados:
- Foco A: Modal "Nuevo Precio de Proveedor" en `/catalog/supplier-prices` (comboboxes, reactividad de IVA, cascada).
- Foco B: Carrito de Compras Global (`CartContext.jsx`, Drawer del Header, badge numérico reactivo y persistencia en storage).
- Foco C: Checklist de Adquisición en Campo en `/operations/purchases/new` (`ChecklistPhase.jsx`, estados Conseguido/Descartar, simulación matemática).
- Foco D: Modal "Crear / Gestionar Lista", cambio de lista activa y selección múltiple de fusión en `/operations/purchases`.
- Foco E: Sincronización de Órdenes Activas (`ORD-2026-XXXX`), advertencias de duplicados cruzados y liquidación en base de datos.
CERO modificaciones de código: 100% lectura, análisis y reporte.

REGLAS DE CUOTA ESTRICTA (TOOL BUDGET: MÁXIMO 8 LECTURAS DIRIGIDAS, 0 EDICIONES DE CÓDIGO):
- PROHIBIDO modificar o crear archivos de código (.js, .jsx, .ts, .prisma, .css) — 0 ediciones.
- PROHIBIDO ejecutar Playwright, builds, dev servers o scripts temporales.
- CERO búsquedas recursivas ciegas (`Get-ChildItem -Recurse`, `find .`). Usa lecturas puntuales a los archivos listados.
- Si tras las lecturas dirigidas falta algún dato secundario, repórtalo en "Huecos detectados" y NO consumas más cuota.

FUENTES DE VERDAD A INSPECCIONAR (RUTAS EXACTAS DIRIGIDAS):
1. Foco A (Precios UI): `apps/web/src/app/catalog/supplier-prices/components/SupplierPriceModal.jsx` y `PricesComparisonTable.jsx`.
2. Foco B (Carrito Global): `apps/web/src/context/CartContext.jsx` y `apps/web/src/components/shell/Header.jsx` (o `HeaderCart.jsx`).
3. Foco C (Checklist UI): `apps/web/src/app/operations/purchases/new/components/ChecklistPhase.jsx` (o `ChecklistItemRow.jsx` / `page.jsx`).
4. Foco D y E (Listas y Compras): `apps/web/src/app/operations/purchases/page.jsx` y `apps/api/src/purchases/purchases.controller.js` (buscar `/orders/active`, `/items/move`, `/simulate`).
5. Base de Datos (Modelos): `apps/api/prisma/schema.prisma` (inspeccionar únicamente modelos: `PrecioProveedor`, `Compra`, `DetalleCompra`, `Insumo`, `Proveedor`, `OrdenCompra`, `OrdenCompraItem`).
6. Helpers E2E actuales: `apps/web/e2e/helpers/` (inventario de utilidades reutilizables).

ACCIONES ESPECÍFICAS DE INSPECCIÓN (POR FOCO):

1. MAPA DE SELECTORES REALES EN EL DOM:
   - Foco A: Selector del botón "Nuevo Registro", inputs/combos de Insumo y Proveedor, checkbox `Aplica IVA`, selector de modalidad fiscal, input de cantidad con pleca, botón submit.
   - Foco B (Carrito): Disparador del carrito en el Header, badge de conteo (`styles.cartBadge`), ítems en el drawer, botón "Preparar Orden de Compra", botón "Limpiar lista".
   - Foco C (Checklist): Tarjetas de insumo, botones gemelos [✓ Conseguido] / [✕ No Conseguido], dropdown de motivos al descartar, input de cantidad (min="1"), desglose oficial devuelto por `/purchases/simulate`.
   - Foco D (Gestión de Listas): Botón "Crear / Gestionar Lista", inputs del modal, botón "Fusionar Seleccionadas", checkboxes por orden activa `ORD-XXXX`.
   - Foco E (Sincronización): Toast flotante tras añadir ítem, botón "Cambiar de lista", banner de advertencia de ítem duplicado en otra orden activa.

2. CONTRATOS DE DATOS, PERSISTENCIA Y CICLO DE VIDA DEL CARRITO:
   - Contrato del Storage: Estructura JSON guardada en `sessionStorage.getItem('selectedForPurchase')`. ¿Se utiliza `cantidadEquivalenteBase` o `cantidadPresentacion`?
   - Reactividad del Carrito: ¿Cómo se propaga la mutación? ¿Evento `cartUpdated`, `storage` nativo o estado puro de React en `CartContext`?
   - API de Órdenes: Endpoints `GET /purchases/orders/active`, `POST /purchases/orders`, `PATCH /purchases/orders/:id` y `POST /purchases/items/move`.
   - Campos del modelo Prisma vs campos proyectados en la UI (identificar campos huérfanos no editables en la interfaz).

3. AUDITORÍA POKA-YOKE ("PRUEBA DE FALLOS"):
   - Foco A: ¿Qué inputs inician en `disabled`? ¿Qué validaciones impiden enviar precios <= 0 o tasas en blanco?
   - Foco B: ¿Qué ocurre si se pulsa "Comprar" en el catálogo sin tener ninguna lista creada? ¿Crea la lista por defecto automáticamente o arroja error?
   - Foco C: ¿El sistema impide marcar "Conseguido" con cantidad 0? ¿Qué opciones de motivo ofrece al descartar? ¿Cómo se retira del carrito al asentar?
   - Foco D: ¿Se bloquea crear lista sin nombre o sin ítems? ¿Cómo previene duplicados idénticos en la fusión? ¿Qué confirmación modal reemplaza a `window.confirm`?
   - Foco E: ¿El toast flotante de adición se mantiene al hacer hover (`onMouseEnter`) o se cierra automáticamente interrumpiendo el cambio de lista?

SALIDA REQUERIDA:
Generar el informe técnico consolidado exclusivamente en:
`apps/prompts/testing/INFORME-AUDITORIA-PRECIOS-CHECKLIST-LISTAS.md`

Estructura obligatoria del informe:
1. **Mapa de Rutas y Componentes:** Tabla `Foco | Ruta URL | Archivo Físico | Componente Clave`.
2. **Matriz de Selectores Estables para Playwright:** Tabla `Foco | Elemento | Selector Recomendado (role/label/name) | Estabilidad (Estable/Frágil)`.
3. **Contrato de Integración, Storage y Carrito:** Estructura JSON real de `selectedForPurchase`, eventos de sincronización y endpoints `/purchases/orders/*`.
4. **Matriz Poka-Yoke por Foco:** Validaciones existentes vs validaciones faltantes vs riesgos de rotura por usuario.
5. **Seeds e IDs Estables:** Lista de insumos, proveedores y órdenes utilizables para los tests.
6. **Huecos Detectados y Helpers a Crear:** Qué flujos carecen de tests E2E y qué helpers hacen falta para el carrito y compras.

DETENCIÓN:
Al guardar el informe Markdown, DETENTE inmediatamente sin modificar ningún archivo de código.