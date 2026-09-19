TAREA CONTROLADA — DRAFT LOCALSTORE, PANEL AUXILIAR DE STOCK Y POKA-YOKE DE ÍTEMS PENDIENTES EN COMPRA DIRECTA

OBJETIVO TÉCNICO:
1. Implementar persistencia automática en `localStorage` del borrador de Compra Directa para no perder los ítems al navegar a otros módulos.
2. Incorporar un botón y panel lateral (Drawer) "Consultar Stock" dentro de Compra Directa para revisar existencias y agregar insumos al formulario sin abandonar la pantalla.
3. Marcar visualmente en color ámbar/advertencia los ítems agregados desde el visor de stock hasta que el usuario complete proveedor, cantidad y precio.

FUENTES DE VERDAD:
- apps/web/src/app/operations/purchases/new/page.jsx
- apps/web/src/app/operations/purchases/new/components/FormPhase.jsx
- apps/web/src/app/operations/purchases/new/components/parts/FormPhaseRowItem.jsx
- apps/web/src/app/operations/purchases/new/new-purchase.module.css
- .agents/rules/07-token-efficiency-and-tool-budget.md

REGLAS DE CUOTA ESTRICTA Y TOOL BUDGET (NIVEL 1):
- PROHIBIDO ejecutar `Find`, `Search` o búsquedas ciegas.
- Leer únicamente los archivos de Compra Directa indicados.
- Límite máximo de lecturas: 1 lectura por archivo.
- Cero estilos en línea (`style={{}}`), utilizar exclusivamente CSS Modules.
- Respetar SRP (< 145 líneas por componente JSX; extraer el Drawer a `apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`).
- No alterar TypeScript: JavaScript puro (.jsx, .js).

ACCIONES A EJECUTAR:

1. PERSISTENCIA LOCAL (Draft Store en localStorage):
   - En `FormPhase.jsx` (o hook asociado):
     * Al iniciar, si existe `localStorage.getItem('manna_direct_purchase_draft')`, cargar los ítems y flete guardados.
     * Mediante un `useEffect` con debounce o sincronización en cada cambio de `items`, serializar el estado en `manna_direct_purchase_draft`.
     * Al ejecutar `handleConfirmar` exitoso, ejecutar `localStorage.removeItem('manna_direct_purchase_draft')`.
     * Incluir junto al botón "Volver a Compras" una acción discreta "Limpiar Borrador" que vacíe el storage y limpie el formulario tras confirmación del usuario.

2. PANEL LATERAL / DRAWER AUXILIAR DE INVENTARIO (StockLookupDrawer.jsx):
   - Crear el componente modal/drawer `StockLookupDrawer.jsx` co-locado en `components/parts/`:
     * Botón disparador en la barra superior de acciones: `[📦 Consultar Stock]`.
     * Cargar el listado de insumos (`/api/v1/supplies` o `/api/v1/inventory`).
     * Buscador por nombre de insumo o marca.
     * Lista tipo tarjeta compacta con: Nombre, Marca, Stock Actual (con unidad), Stock Mínimo y semáforo visual (Agotado / Bajo / Óptimo).
     * Botón de acción rápida: `+ Añadir a Compra`. Al presionarlo, inserta el insumo al inicio del arreglo de compra con `isUnconfigured: true` y notifica visualmente con un toast o badge ("Añadido").

3. ESTADO POKA-YOKE PARA ÍTEMS AGREGADOS DESDE EL VISOR:
   - En `FormPhaseRowItem.jsx`:
     * Si el ítem tiene `isUnconfigured: true` o carece de cantidad/precio/proveedor:
       - Aplicar clase de borde lateral de advertencia (amarillo/ámbar cálido: `#D97706`).
       - Mostrar una pastilla/badge sobre la tarjeta: `⚠️ Insumo añadido desde stock — Complete proveedor, empaque y precio`.
     * Tan pronto el operario seleccione el proveedor e ingrese cantidad mayor a 0 y precio mayor a 0, remover automáticamente `isUnconfigured`.
   - Bloquear el botón "Guardar y Registrar Compra" si alguna fila mantiene la bandera `isUnconfigured: true`.

4. VERIFICACIONES DE CALIDAD:
   - `node --check apps/web/src/app/operations/purchases/new/components/parts/StockLookupDrawer.jsx`
   - `node .agents/scripts/verify-srp.js`

CRITERIO DE TERMINACIÓN Y DETENCIÓN:
- Navegar fuera de compras y volver conserva intactos los productos cargados.
- Se puede consultar el stock de insumos en un drawer sin recargar la página y añadir filas directo a la compra.
- Las filas sin configurar muestran la alerta visual y bloquean el envío accidental.
- 0 infracciones en `verify-srp.js`.
- DETENTE inmediatamente tras reportar.

REPORTE FINAL OBLIGATORIO:
Entregar ÚNICAMENTE:
- Estado: [COMPLETADA / BLOQUEADA]
- Componentes creados/modificados:
- Persistencia local implementada en:
- Resultado verify-srp.js: