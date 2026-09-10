TAREA CONTROLADA — COMPARADOR DE TARIFAS Y CONEXIÓN CON COMPRAS

OBJETIVO
Convertir la vista de Precios de Proveedores (`apps/web/src/app/catalog/supplier-prices/`) en una herramienta de decisión para abastecimiento:
1. Comparar proveedores para un mismo insumo estandarizando al Costo Unidad Base.
2. Identificar visualmente la mejor oferta del mercado.
3. Facilitar la toma de decisiones para la lista y órdenes de compras.

FUENTES DE VERDAD
- docs/antigravity/AI_PROJECT_OPERATING_MANUAL.md
- apps/web/src/app/catalog/supplier-prices/
- apps/web/src/app/operations/purchases/ (si aplica para enlaces)

REGLAS TÉCNICAS
1. Exclusivamente JavaScript/React nativo (.jsx, .js). PROHIBIDO TypeScript.
2. CSS Modules exclusivo. PROHIBIDO Tailwind.
3. Cálculos de comparación en memoria del cliente.

ALCANCE PUNTUAL

1. Distintivo "Mejor Tarifa" (Badge visual):
   - Al filtrar o agrupar por un insumo, identificar automáticamente la tarifa activa con el menor `Costo Unidad Base`.
   - Mostrar una insignia destacada: "★ Más Económico" junto al valor unitario.

2. Tarjeta Resumen de Aprovisionamiento (Al filtrar por un Insumo):
   - Proveedor con la mejor tarifa y su costo unitario base.
   - Proveedor con tarifa más alta y porcentaje de sobrecosto/ahorro.
   - Cantidad total de alternativas de suministro disponibles.

3. Botón de Acción Rápida para Abastecimiento:
   - En cada fila de cotización activa (especialmente la más económica), agregar un botón o enlace secundario "Comprar" o "Generar Pedido" que permita transferir los datos (proveedor, insumo, precio) hacia el flujo de Compras (`/operations/purchases/new`).

4. Ordenamiento Inteligente:
   - Permitir ordenar por "Costo Unidad Base" de menor a mayor para ver en los primeros lugares a los proveedores más convenientes.

VALIDACIÓN
- Comprobar que `pnpm --filter web build` compile con código 0 sin errores.

FORMATO DE CIERRE
Entregar exclusivamente el reporte estándar indicando estado, componentes ajustados y confirmación de build limpio.