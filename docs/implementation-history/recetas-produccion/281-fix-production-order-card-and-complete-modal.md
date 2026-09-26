TAREA:
Transformar la tarjeta de orden en proceso (`ProductionOrderCard.jsx`) y homologar al Design System MANNÁ el modal de liquidación (`ProductionOrderCompleteModal.jsx`), erradicando IDs técnicos y botones genéricos.

OBJETIVO:
1. En `ProductionOrderCard.jsx` (Tarjeta de Orden en Proceso):
   - **Erradicar IDs crudos:** Reemplazar el UUID/hash de cabecera por el **Nombre del Producto / Receta** (ej. "YOGURT BASE") y el código de lote legible.
   - **Información Humana y Telemetría:**
     * Mostrar cantidad y unidad real (ej. "1 Litro en proceso" en vez de "1 und").
     * Mostrar badge de estado claro: `🟡 En Fermentación / Proceso`.
     * Mostrar fecha/hora de inicio y tiempo estimado de finalización según la receta.
   - **Botón de Acción Claro:** Renombrar "Cerrar Orden" por `✔ Finalizar y Liquidar Lote` (estilo corporativo MANNÁ `#182622`).
2. En `ProductionOrderCompleteModal.jsx` (Modal de Liquidación y Cierre):
   - **Homologación Design System MANNÁ:** Integrar `SmartModal` (`#FAF8F5`, tipografía `#182622`, cancelar neutral, botón primario `#182622`).
   - **Erradicar Violación Regla 13:** En la tabla de consumo real, mostrar el **Nombre real del Insumo** (`LECHE ENTERA`, `YOGUR GRIEGO`) y su unidad técnica (`ml`, `g`). PROHIBIDO mostrar `ID: 09324067`.
   - **Cálculo de Mermas y Costo Real:**
     * Mostrar comparativa visual: `Consumo Teórico` vs `Real Utilizado`.
     * Si el real es mayor, mostrar la merma en porcentaje o volumen.
     * Explicar con texto Poka-Yoke: *"Al liquidar, se descontarán los insumos de bodega y se ingresará el producto final a cava/tanque."*
3. CSS Modules puro. Cero `style={{}}`. Componentes < 150 líneas.
4. Salida con código 0 en `node .agents/scripts/verify-srp.js`.

FUENTES DE VERDAD:
- `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
- `.agents/rules/03-frontend-architecture.md`
- `.agents/rules/05-forms-and-modals.md` (Regla 13: UI Humana, Regla 38: SmartModal)
- `.agents/scripts/verify-srp.js`

REGLA DE CONSULTA:
Inspecciona exclusivamente los componentes de producción en `apps/web/src/app/operations/production/components/`. Prohibido tocar backend (`apps/api/`).

ALCANCE:

LEER Y MODIFICAR:
- `apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
- `apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
- `apps/web/src/app/operations/production/components/production-modal.module.css` (o CSS module co-locado)

NO MODIFICAR:
- ningún archivo de backend en `apps/api/`.

INSTRUCCIONES:

1. EN `ProductionOrderCard.jsx`:
   - Mostrar cabecera con: `orden.receta?.nombre || orden.producto?.nombre` y pill `EN PLANTA`.
   - Reemplazar texto plano por grid informativo:
     * Cantidad: `${orden.cantidadProducir} ${orden.receta?.unidadMedida || 'L'}`
     * Fecha: Formateada legiblemente.
   - Botón: "Finalizar y Liquidar Lote".

2. EN `ProductionOrderCompleteModal.jsx`:
   - Mapear nombres de insumos reales desde la relación (`item.insumo?.nombre || 'Insumo'`).
   - Aplicar `SmartModal` de `@/components/ui/SmartModal`.
   - Cambiar botones a la paleta oficial (botón "Confirmar Liquidación y Entrada a Stock" en `#182622`).

VERIFICACIÓN:
1. `node --check apps/web/src/app/operations/production/components/ProductionOrderCard.jsx`
2. `node --check apps/web/src/app/operations/production/components/ProductionOrderCompleteModal.jsx`
3. `node .agents/scripts/verify-srp.js`

CRITERIO DE FINALIZACIÓN:
- Cero IDs crudos en pantalla.
- Modal homologado con nombres de insumos legibles y estilo MANNÁ.
- `verify-srp.js` retorna código 0.

DETENCIÓN:
Al validar las comprobaciones y obtener código 0, DETENTE.

SALIDA:
- Componentes corregidos:
- Eliminación de IDs crudos comprobada:
- Resultado de verify-srp.js:
- Estado: